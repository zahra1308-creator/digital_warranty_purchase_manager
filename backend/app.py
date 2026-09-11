# pyrefly: ignore [missing-import]
import os

# Try loading environment variables from .env if python-dotenv is available
try:
    from dotenv import load_dotenv
    load_dotenv()
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
except ImportError:
    pass

# pyrefly: ignore [missing-import]
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from database import create_tables

# Import Blueprints
from routes.auth import auth_bp
from routes.products import products_bp

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'super-secret-key-for-development')

# Configure CORS to allow credentials (cookies)
CORS(app, supports_credentials=True)

create_tables()

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(products_bp)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
raw_upload = os.environ.get('UPLOAD_FOLDER', 'uploads')
UPLOAD_FOLDER = raw_upload if os.path.isabs(raw_upload) else os.path.normpath(os.path.join(BASE_DIR, raw_upload))
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/")
def home():
    return "Digital Warranty & Purchase Manager API is running"

if __name__ == "__main__":
    port = int(os.environ.get('BACKEND_PORT', 5000))
    host = os.environ.get('BACKEND_HOST', '127.0.0.1')
    debug = os.environ.get('FLASK_DEBUG', '1') in ['1', 'True', 'true']
    app.run(host=host, port=port, debug=debug)