from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import sqlite3

DATABASE = "database.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# --- NAYA PROJECT FEATURE ---
db = SQLAlchemy()

class Progress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    emotion_label = db.Column(db.String(50))
    # Dhyan se dekho: Iska naam 'emotion_score' hai
    emotion_score = db.Column(db.Float) 
    intervention = db.Column(db.String(100), default='None') 
    interactions = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<Progress {self.emotion_label}>'

def init_db(app):
    with app.app_context():
        db.create_all()
        print("✅ Database Tables Ready!")