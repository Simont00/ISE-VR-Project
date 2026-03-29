from flask import Flask
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