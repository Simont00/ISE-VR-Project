from backend.database.db import db
from sqlalchemy import func

class Session(db.Model):
    __tablename__ = 'sessions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    
    start_time = db.Column(db.DateTime, nullable=True)  # ✅ server_default hata diya
    end_time = db.Column(db.DateTime, nullable=True)
    duration = db.Column(db.String(50), nullable=True)
    
    is_active = db.Column(db.Integer, default=1)
    
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f'<Session id={self.id} user={self.user_id} active={self.is_active}>'


def create_session_table():
    print("🔄 Session Engine: Synced and migrated 'sessions' table to SQLAlchemy model successfully.")
    return True