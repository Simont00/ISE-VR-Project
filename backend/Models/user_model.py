import os
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

# 📂 DATABASE PATH SETUP (FIXED)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)   # backend folder
DB_FOLDER = os.path.join(PROJECT_ROOT, "database")

# Ensure database folder exists
if not os.path.exists(DB_FOLDER):
    os.makedirs(DB_FOLDER)

DATABASE_NAME = os.path.join(DB_FOLDER, "database.db")


# 🔗 GET CONNECTION
def get_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn


# ✅ REGISTER USER
def create_user(name, email, password):
    conn = get_connection()
    cursor = conn.cursor()

    hashed_password = generate_password_hash(password)

    try:
        cursor.execute("""
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        """, (name, email, hashed_password))

        conn.commit()
        return {"message": "User registered successfully"}

    except sqlite3.IntegrityError:
        return {"error": "Email already exists"}

    finally:
        conn.close()


# 🔍 GET USER BY EMAIL
def get_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    conn.close()
    return user


# 🔐 LOGIN USER
def login_user(email, password):
    user = get_user_by_email(email)

    if user is None:
        return {"error": "User not found"}

    if check_password_hash(user["password"], password):
        return {
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        }
    else:
        return {"error": "Invalid password"}


# 📊 GET ALL USERS (FOR TESTING)
def get_all_users():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, email FROM users")
    users = cursor.fetchall()

    conn.close()
    return [dict(user) for user in users]


# 🚀 TEST BLOCK
if __name__ == "__main__":
    print("Running user_model test...\n")

    print(create_user("Simon", "simon@test.com", "123456"))
    print(login_user("simon@test.com", "123456"))
    print(get_all_users())