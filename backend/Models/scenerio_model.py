from backend.database.db import db

class Scenerio(db.Model):
    __tablename__ = "scenarios"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(300))
    difficulty_level = db.Column(db.String(50))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "difficulty_level": self.difficulty_level
        }