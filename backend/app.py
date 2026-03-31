from flask import Flask
from backend.config import Config
from backend.database.db import db

# Existing routes (unchanged)
from backend.routes.auth_routes import auth
from backend.routes.emotion_routes import emotion_bp
from backend.routes.session_routes import session_bp

# ✅ ONLY CHANGE HERE (scenerio fix)
from backend.routes.scenerio_routes import scenerio_bp


app = Flask(__name__)
app.config.from_object(Config)

# Secret key
app.config["SECRET_KEY"] = "supersecretkey"

# Initialize DB
db.init_app(app)

# Register routes
app.register_blueprint(scenario_bp, url_prefix='/scenarios')

@app.route('/')
def home():
    return "ISE VR Project Backend Running!"

# Function to insert dummy data if table is empty
def insert_dummy_data():
    if Scenario.query.count() == 0:
        dummy_scenarios = [
            Scenario(name="Greet a friend", description="Practice greeting someone politely."),
            Scenario(name="Order food", description="Learn how to order food in a restaurant."),
            Scenario(name="Ask for help", description="Learn to ask for help politely when needed.")
        ]
        db.session.bulk_save_objects(dummy_scenarios)
        db.session.commit()
        print("Dummy scenarios added to the database!")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()          # Create tables if they don't exist
        insert_dummy_data()      # Insert dummy scenarios
    app.run(debug=True, port=5001)  # Run on port 5001 to avoid conflict
=========
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
>>>>>>>>> Temporary merge branch 2
