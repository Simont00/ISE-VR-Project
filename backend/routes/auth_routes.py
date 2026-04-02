from flask import Blueprint, request, jsonify
from backend.Models.user_model import create_user, login_user, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from backend.database.db import db
auth = Blueprint("auth", __name__)

# ---------------- REGISTER ----------------
@auth.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        result = create_user(name, email, password)

        return jsonify(result), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- LOGIN ----------------
@auth.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        user = login_user(email, password)

        if not user or "error" in user:
            return jsonify(user), 401

        user_id = user.get("id")

        if not user_id:
            return jsonify({"error": "User ID missing in response"}), 500

        access_token = create_access_token(identity=str(user_id))
        return jsonify({
            "message": "Login successful",
            "token": access_token,
            "user": user
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- PROFILE ----------------
@auth.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    try:
        current_user_id = int(get_jwt_identity())

        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# ---------------- UPDATE PROFILE ----------------
@auth.route("/update", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        current_user_id = int(get_jwt_identity())

        data = request.get_json()

        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        # 🔥 UPDATE FIELDS
        if "name" in data:
            user.name = data["name"]

        if "email" in data:
            user.email = data["email"]

        db.session.commit()

        return jsonify({
            "message": "Profile updated successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# ---------------- CHANGE PASSWORD ----------------
    
@auth.route("/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    try:
        current_user_id = int(get_jwt_identity())

        data = request.get_json()

        old_password = data.get("old_password")
        new_password = data.get("new_password")

        if not old_password or not new_password:
            return jsonify({"error": "All fields are required"}), 400

        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        # 🔐 CHECK OLD PASSWORD
        from werkzeug.security import check_password_hash, generate_password_hash

        if not check_password_hash(user.password, old_password):
            return jsonify({"error": "Old password is incorrect"}), 401

        # 🔥 UPDATE PASSWORD
        user.password = generate_password_hash(new_password)

        db.session.commit()

        return jsonify({"message": "Password updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500