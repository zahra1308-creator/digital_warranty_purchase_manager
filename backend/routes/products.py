# pyrefly: ignore [missing-import]
import os
import uuid
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, session
from database import get_db_connection

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
raw_upload = os.environ.get('UPLOAD_FOLDER', 'uploads')
UPLOAD_FOLDER = raw_upload if os.path.isabs(raw_upload) else os.path.normpath(os.path.join(BASE_DIR, raw_upload))
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

products_bp = Blueprint('products', __name__)

@products_bp.route('/api/products', methods=['GET'])
def get_products():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    connection = get_db_connection()
    try:
        products = connection.execute(
            "SELECT * FROM products WHERE user_id = ?", (user_id,)
        ).fetchall()
        return jsonify([dict(product) for product in products]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@products_bp.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    connection = get_db_connection()
    try:
        product = connection.execute(
            "SELECT * FROM products WHERE id = ? AND user_id = ?", 
            (product_id, user_id)
        ).fetchone()

        if product is None:
            return jsonify({"error": "Product not found"}), 404

        return jsonify(dict(product)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@products_bp.route('/api/products', methods=['POST'])
def add_product():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    # Support both JSON (fallback) and Form Data
    data = request.form if request.form else request.json
    
    # Extract fields
    product_name = data.get('productName')
    brand = data.get('brand')
    category = data.get('category')
    purchase_date = data.get('purchaseDate')
    purchase_price = data.get('purchasePrice')
    warranty_months = data.get('warrantyMonths')
    serial_number = data.get('serialNumber')
    model_number = data.get('modelNumber')
    store_name = data.get('storeName')
    notes = data.get('notes')

    bill_path = None
    if 'billImage' in request.files:
        file = request.files['billImage']
        if file.filename != '':
            clean_name = secure_filename(file.filename)
            filename = f"{uuid.uuid4().hex}_{clean_name}"
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            bill_path = f"/api/uploads/{filename}"

    if not product_name or not purchase_date or not warranty_months:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        purchase_price_val = float(purchase_price) if purchase_price else None
    except (ValueError, TypeError):
        purchase_price_val = None

    try:
        warranty_months_val = int(warranty_months) if warranty_months else 0
    except (ValueError, TypeError):
        warranty_months_val = 0

    connection = get_db_connection()
    try:
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO products 
            (user_id, product_name, brand, category, purchase_date, purchase_price, 
            warranty_months, serial_number, model_number, store_name, notes, bill_path)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id, product_name, brand, category, purchase_date, purchase_price_val,
            warranty_months_val, serial_number, model_number, store_name, notes, bill_path
        ))
        connection.commit()
        product_id = cursor.lastrowid
        
        return jsonify({"message": "Product added successfully", "id": product_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@products_bp.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.form if request.form else (request.json or {})
    
    product_name = data.get('productName')
    brand = data.get('brand')
    category = data.get('category')
    purchase_date = data.get('purchaseDate')
    purchase_price = data.get('purchasePrice')
    warranty_months = data.get('warrantyMonths')
    serial_number = data.get('serialNumber')
    model_number = data.get('modelNumber')
    store_name = data.get('storeName')
    notes = data.get('notes')

    bill_path = None
    if 'billImage' in request.files:
        file = request.files['billImage']
        if file.filename != '':
            clean_name = secure_filename(file.filename)
            filename = f"{uuid.uuid4().hex}_{clean_name}"
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            bill_path = f"/api/uploads/{filename}"

    try:
        purchase_price_val = float(purchase_price) if purchase_price else None
    except (ValueError, TypeError):
        purchase_price_val = None

    try:
        warranty_months_val = int(warranty_months) if warranty_months else 0
    except (ValueError, TypeError):
        warranty_months_val = 0

    connection = get_db_connection()
    try:
        cursor = connection.cursor()
        
        # Verify ownership
        product = cursor.execute("SELECT id, bill_path FROM products WHERE id = ? AND user_id = ?", (product_id, user_id)).fetchone()
        if not product:
            return jsonify({"error": "Product not found or unauthorized"}), 404

        if bill_path:
            # Delete previous bill image if it existed
            if product['bill_path']:
                try:
                    old_filename = product['bill_path'].replace('/api/uploads/', '')
                    old_file_path = os.path.join(UPLOAD_FOLDER, old_filename)
                    if os.path.exists(old_file_path):
                        os.remove(old_file_path)
                except Exception:
                    pass

            cursor.execute("""
                UPDATE products SET
                    product_name = ?, brand = ?, category = ?, purchase_date = ?, 
                    purchase_price = ?, warranty_months = ?, serial_number = ?, 
                    model_number = ?, store_name = ?, notes = ?, bill_path = ?
                WHERE id = ? AND user_id = ?
            """, (
                product_name, brand, category, purchase_date, purchase_price_val,
                warranty_months_val, serial_number, model_number, store_name, notes, bill_path,
                product_id, user_id
            ))
        else:
            cursor.execute("""
                UPDATE products SET
                    product_name = ?, brand = ?, category = ?, purchase_date = ?, 
                    purchase_price = ?, warranty_months = ?, serial_number = ?, 
                    model_number = ?, store_name = ?, notes = ?
                WHERE id = ? AND user_id = ?
            """, (
                product_name, brand, category, purchase_date, purchase_price_val,
                warranty_months_val, serial_number, model_number, store_name, notes,
                product_id, user_id
            ))
        connection.commit()
        
        return jsonify({"message": "Product updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@products_bp.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    connection = get_db_connection()
    try:
        cursor = connection.cursor()
        
        # Verify ownership
        product = cursor.execute("SELECT id, bill_path FROM products WHERE id = ? AND user_id = ?", (product_id, user_id)).fetchone()
        if not product:
            return jsonify({"error": "Product not found or unauthorized"}), 404
            
        if product['bill_path']:
            try:
                rel_file = product['bill_path'].replace('/api/uploads/', '')
                file_path = os.path.join(UPLOAD_FOLDER, rel_file)
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception:
                pass

        cursor.execute("DELETE FROM products WHERE id = ? AND user_id = ?", (product_id, user_id))
        connection.commit()
        
        return jsonify({"message": "Product deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()
