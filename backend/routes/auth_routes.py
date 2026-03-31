from flask import Blueprint, request, jsonify
from backend.Models.user_model import create_user, login_user
from backend.Models.user_model import login_user
auth = Blueprint("auth", __name__)

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
    
@auth.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        user = login_user(email, password)

        if "error" in user:
            return jsonify(user), 401

        return jsonify({
            "message": "Login successful",
            "user": user
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    print("REGISTER API HIT")
    