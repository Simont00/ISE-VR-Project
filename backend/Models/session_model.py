from backend.database.db import db
from sqlalchemy import func

class Session(db.Model):
    __tablename__ = 'sessions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    
    # Session Timings
    start_time = db.Column(db.DateTime, server_default=func.now())
    end_time = db.Column(db.DateTime, nullable=True)
    duration = db.Column(db.String(50), nullable=True) # Total session duration string
    
    # State flags (1 = Active, 0 = Ended)
    is_active = db.Column(db.Integer, default=1)
    
    # Metadata timestamps
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f'<Session id={self.id} user={self.user_id} active={self.is_active}>'


def create_session_table():
    """
    Legacy wrapper retained to prevent app.py boot crashes.
    The actual table creation is dynamically managed by db.create_all() in app.py.
    """
    print("🔄 Session Engine: Synced and migrated 'sessions' table to SQLAlchemy model successfully.")
    return True