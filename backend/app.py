from flask import Flask
from backend.config import Config
from backend.database.db import db
from flask_cors import CORS

# ✅ JWT IMPORT
from flask_jwt_extended import JWTManager

# Existing routes (unchanged)
from backend.routes.auth_routes import auth
from backend.routes.emotion_routes import emotion_bp
from backend.routes.session_routes import session_bp
from backend.routes.scenerio_routes import scenerio_bp


app = Flask(__name__)
app.config.from_object(Config)

# Secret keys
app.config["SECRET_KEY"] = "supersecretkey"

# ✅ JWT CONFIG (IMPORTANT)
app.config["JWT_SECRET_KEY"] = "jwt-super-secret-key"

# Initialize extensions
db.init_app(app)

# ✅ JWT INITIALIZE
jwt = JWTManager(app)

# Register all blueprints
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(emotion_bp)
app.register_blueprint(session_bp, url_prefix="/sessions")
app.register_blueprint(scenerio_bp, url_prefix="/scenerio")

# Default route
@app.route("/")
def home():
    return {"message": "Backend running successfully 🚀"}

# Create tables
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)