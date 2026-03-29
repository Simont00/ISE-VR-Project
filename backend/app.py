from flask import Flask
from backend.routes.emotion_routes import emotion_bp

app = Flask(__name__)

# register blueprint
app.register_blueprint(emotion_bp)


# default route
@app.route("/")
def home():
    return {"message": "Backend running successfully 🚀"}


if __name__ == "__main__":
    app.run(debug=True)