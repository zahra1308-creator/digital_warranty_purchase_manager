import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
raw_db_path = os.environ.get('DATABASE_PATH', os.path.join("database", "warranty_manager.db"))
DATABASE = raw_db_path if os.path.isabs(raw_db_path) else os.path.normpath(os.path.join(BASE_DIR, raw_db_path))

def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection

def create_tables():
    os.makedirs(os.path.dirname(DATABASE), exist_ok=True)
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_name TEXT NOT NULL,
            brand TEXT,
            category TEXT,
            purchase_date TEXT,
            purchase_price REAL,
            warranty_months INTEGER,
            warranty_expiry TEXT,
            serial_number TEXT,
            model_number TEXT,
            store_name TEXT,
            bill_path TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    connection.commit()
    connection.close()