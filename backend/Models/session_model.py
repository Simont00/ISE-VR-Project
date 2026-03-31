import sqlite3
from datetime import datetime

DATABASE_NAME = "backend/database/database.db"


# -----------------------------
# Database connection
# -----------------------------
def get_connection():
    return sqlite3.connect(DATABASE_NAME)


# -----------------------------
# Create Session
# -----------------------------
def create_session(user_id, emotion_id, scenario_id, duration):
    conn = get_connection()
    cursor = conn.cursor()

    created_at = datetime.now()

    cursor.execute("""
        INSERT INTO sessions (user_id, emotion_id, scenario_id, duration, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, emotion_id, scenario_id, duration, created_at))

    conn.commit()
    conn.close()

    return {"message": "Session created successfully"}


# -----------------------------
# Get all sessions of a user
# -----------------------------
def get_sessions_by_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM sessions WHERE user_id = ?
    """, (user_id,))

    sessions = cursor.fetchall()
    conn.close()

    return sessions


# -----------------------------
# Get single session
# -----------------------------
def get_session_by_id(session_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM sessions WHERE id = ?
    """, (session_id,))

    session = cursor.fetchone()
    conn.close()

    return session


# -----------------------------
# Delete session
# -----------------------------
def delete_session(session_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM sessions WHERE id = ?
    """, (session_id,))

    conn.commit()
    conn.close()

    return {"message": "Session deleted successfully"}