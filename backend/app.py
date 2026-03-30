from flask import Flask
<<<<<<< HEAD
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
=======
from backend.models.scenario_model import db, Scenario
from backend.routes.scenario_routes import scenario_bp

app = Flask(__name__)

# Database config (SQLite example)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ise_vr.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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
>>>>>>> 6745c3de8b2d36830d69722f34be642c57d9fae8
