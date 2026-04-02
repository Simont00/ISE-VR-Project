from werkzeug.security import generate_password_hash, check_password_hash
from backend.database.db import db

# ✅ USER MODEL (SQLAlchemy)
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)


# ✅ REGISTER USER
def create_user(name, email, password):
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return {"error": "Email already exists"}

    hashed_password = generate_password_hash(password)

    new_user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return {"message": "User registered successfully"}


# ✅ LOGIN USER (FIXED)
def login_user(email, password):
    user = User.query.filter_by(email=email).first()

    if not user:
        return {"error": "User not found"}

    if not check_password_hash(user.password, password):
        return {"error": "Invalid password"}

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
    }


# ✅ GET ALL USERS (OPTIONAL)
def get_all_users():
    users = User.query.all()
    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
        for user in users
    ]