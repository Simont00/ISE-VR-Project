from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Correct import
from backend.models.scenario_model import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ise.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/')
def home():
    return "ISE VR Project Backend is Running!"

if __name__ == '__main__':
    app.run(debug=True)