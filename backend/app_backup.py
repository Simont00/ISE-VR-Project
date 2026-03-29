from flask import Flask
from routes.auth_routes import auth
app = Flask(__name__)

# Register blueprint
app.register_blueprint(auth, url_prefix="/api/auth")
app.config["SECRET_KEY"] = "supersecretkey"
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)