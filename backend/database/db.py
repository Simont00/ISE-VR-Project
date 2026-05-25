import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

db = SQLAlchemy()

class Progress(db.Model):
    # 🔥 Table ka naam badal kar progress_v2 kar diya, taaki lock ka jhanjhat hi khatam ho jaye
    __tablename__ = 'progress_v2'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    session_id = db.Column(db.String(50), nullable=True)        
    patient_name = db.Column(db.String(100), nullable=True)    
    emotion_label = db.Column(db.String(50), nullable=False)   
    intervention = db.Column(db.String(50), nullable=False)    
    environment = db.Column(db.String(50), default='Classroom') 
    timestamp = db.Column(db.DateTime, server_default=func.now()) 

    def __repr__(self):
        return f'<Progress {self.emotion_label}>'

def init_db(app):
    with app.app_context():
        # Bina kisi complex query ya alter ke fresh create karega
        db.create_all()
        print("✅ Database Structures Version 2 Synced Successfully!")