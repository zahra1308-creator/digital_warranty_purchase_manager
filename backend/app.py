# pyrefly: ignore [missing-import]
import os
# pyrefly: ignore [missing-import]
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from database import create_tables

# Import Blueprints
from routes.auth import auth_bp
from routes.products import products_bp

app = Flask(__name__)
app.secret_key = 'super-secret-key-for-development' # Static key so sessions survive restarts

# Configure CORS to allow credentials (cookies)
CORS(app, supports_credentials=True)

create_tables()

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(products_bp)

@app.route('/api/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory('uploads', filename)

@app.route("/")
def home():
    return "Digital Warranty & Purchase Manager API is running"

if __name__ == "__main__":
    app.run(debug=True)