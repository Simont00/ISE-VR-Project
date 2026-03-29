from flask import Flask
from routes.auth_routes import auth
from backend.routes.emotion_routes import emotion_bp

app = Flask(__name__)

# Register blueprints
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(emotion_bp)

app.config["SECRET_KEY"] = "supersecretkey"

# default route
@app.route("/")
def home():
    return {"message": "Backend running successfully 🚀"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
from flask import Flask
from backend.routes.session_routes import session_bp

app = Flask(__name__)

# register blueprint
app.register_blueprint(session_bp, url_prefix="/sessions")


if __name__ == "__main__":
    app.run(debug=True)