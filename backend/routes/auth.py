# pyrefly: ignore [missing-import]
from flask import Blueprint, request, jsonify, session
# pyrefly: ignore [missing-import]
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    hashed_password = generate_password_hash(password)
    
    connection = get_db_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name, email, hashed_password)
        )
        connection.commit()
        user_id = cursor.lastrowid
        
        # Log the user in after registration
        session['user_id'] = user_id
        session['user_name'] = name
        
        return jsonify({
            "message": "User registered successfully", 
            "user": {"id": user_id, "name": name, "email": email}
        }), 201
    except connection.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    connection = get_db_connection()
    try:
        user = connection.execute(
            "SELECT * FROM users WHERE email = ?", (email,)
        ).fetchone()

        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            return jsonify({
                "message": "Login successful",
                "user": {"id": user['id'], "name": user['name'], "email": user['email']}
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logout successful"}), 200

@auth_bp.route('/api/me', methods=['GET'])
def me():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    connection = get_db_connection()
    try:
        user = connection.execute(
            "SELECT id, name, email FROM users WHERE id = ?", (user_id,)
        ).fetchone()
        
        if user:
            return jsonify({"user": dict(user)}), 200
        else:
            session.clear()
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()
