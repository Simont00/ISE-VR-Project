from backend.database.db import get_db_connection

def create_session_table():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,

        start_time TEXT DEFAULT CURRENT_TIMESTAMP,
        end_time TEXT,

        duration TEXT,  -- store total session duration

        is_active INTEGER DEFAULT 1,

        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()