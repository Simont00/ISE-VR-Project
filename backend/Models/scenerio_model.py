from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Scenario(db.Model):
    __tablename__ = 'scenarios'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty_level = db.Column(db.String(50), nullable=False)
    skills_targeted = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "difficulty_level": self.difficulty_level,
            "skills_targeted": self.skills_targeted,
            "created_at": self.created_at.isoformat()
        }