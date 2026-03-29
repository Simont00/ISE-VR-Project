import sqlite3
import os

# 📌 Database path setup (dynamic, always correct)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
DB_PATH = os.path.join(PROJECT_ROOT, "database", "database.db")


# ✅ Create connection
def get_connection():
    return sqlite3.connect(DB_PATH)


# ✅ 1. SAVE EMOTION (MAIN FUNCTION)
def save_emotion(user_id, emotion_type, confidence):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO emotions (user_id, emotion_type, confidence)
        VALUES (?, ?, ?)
    """, (user_id, emotion_type, confidence))

    conn.commit()
    conn.close()

    return "Emotion saved successfully"


# ✅ 2. GET ALL EMOTIONS OF USER
def get_emotions_by_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM emotions WHERE user_id = ?
    """, (user_id,))

    emotions = cursor.fetchall()
    conn.close()

    return emotions


# ✅ 3. GET LATEST EMOTION
def get_latest_emotion(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM emotions
        WHERE user_id = ?
        ORDER BY detected_at DESC
        LIMIT 1
    """, (user_id,))

    emotion = cursor.fetchone()
    conn.close()

    return emotion


# 🧪 TESTING BLOCK (important)
if __name__ == "__main__":
    print("Saving emotion...")
    print(save_emotion(1, "happy", 0.95))

    print("\nAll emotions of user:")
    print(get_emotions_by_user(1))

    print("\nLatest emotion:")
    print(get_latest_emotion(1))