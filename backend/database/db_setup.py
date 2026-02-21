import sqlite3

DATABASE_NAME = "database/database.db"

def create_connection():
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        conn.execute("PRAGMA foreign_keys = 1")  # Foreign key enable
        print(" Database connected successfully")
        return conn
    except Exception as e:
        print(" Error connecting to database:", e)


def create_tables(conn):
    cursor = conn.cursor()

    # 1️ USERS TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2️ EMOTIONS TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS emotions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        emotion_type TEXT NOT NULL,
        confidence REAL,
        detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );
    """)

    # 3️ SCENARIOS TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scenarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        difficulty_level TEXT
    );
    """)

    # 4️ SESSIONS TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        scenario_id INTEGER,
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP,
        score INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (scenario_id) REFERENCES scenarios (id)
    );
    """)

    # 5️ FEEDBACK TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER,
        comments TEXT,
        improvement_tips TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions (id)
    );
    """)

    conn.commit()
    print(" All tables created successfully")


def setup_database():
    conn = create_connection()
    if conn:
        create_tables(conn)
        conn.close()
        print(" Database setup completed")
    else:
        print(" Failed to setup database")


if __name__ == "__main__":
    setup_database()