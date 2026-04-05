from flask import Flask
from backend.config import Config
from backend.database.db import db   # keep if used elsewhere
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Routes
from backend.routes.auth_routes import auth
from backend.routes.emotion_routes import emotion_bp
from backend.routes.session_routes import session_bp
from backend.routes.scenerio_routes import scenerio_bp

# ✅ NEW SESSION TABLE FUNCTION (SQLite)
from backend.Models.session_model import create_session_table
from backend.Models.user_model import User

# ✅ FIXED: correct app initialization
app = Flask(__name__)
app.config.from_object(Config)

# Secret keys
app.config["SECRET_KEY"] = "supersecretkey"
app.config["JWT_SECRET_KEY"] = "jwt-super-secret-key"

# Init extensions
db.init_app(app)   # keep if your other modules use SQLAlchemy
jwt = JWTManager(app)
CORS(app)

# ✅ Register blueprints
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(emotion_bp)

# 🔥 IMPORTANT: session prefix fixed
app.register_blueprint(session_bp, url_prefix="/api")

app.register_blueprint(scenerio_bp, url_prefix="/scenerio")

# ✅ Debug route
@app.route("/")
def home():
    return {"message": "Backend running successfully 🚀"}

# ✅ TEST route
@app.route("/test-session")
def test_session():
    return {"message": "Session route working ✅"}

# ✅ CREATE SESSION TABLE (SQLite)
create_session_table()

# ✅ SQLAlchemy tables (for other modules)
with app.app_context():
    try:
        db.create_all()
        print("✅ Database tables created")
    except Exception as e:
        print("❌ DB ERROR:", str(e))

# ✅ Run server
if __name__ == "__main__":
    print("🚀 Starting Flask Server...")
    app.run(host="0.0.0.0", port=5000, debug=True)