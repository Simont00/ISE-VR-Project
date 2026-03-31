from flask import Blueprint, request, jsonify
from backend.Services.session_services import (
    create_session_service,
    get_sessions_service,
    get_single_session_service,
    delete_session_service
)

session_bp = Blueprint("session", __name__)


# -----------------------------
# Create Session
# -----------------------------
@session_bp.route("/create", methods=["POST"])
def create_session_route():
    data = request.json
    result = create_session_service(data)
    return jsonify(result)


# -----------------------------
# Get sessions of a user
# -----------------------------
@session_bp.route("/user/<int:user_id>", methods=["GET"])
def get_sessions_route(user_id):
    result = get_sessions_service(user_id)
    return jsonify(result)


# -----------------------------
# Get single session
# -----------------------------
@session_bp.route("/<int:session_id>", methods=["GET"])
def get_single_session_route(session_id):
    result = get_single_session_service(session_id)
    return jsonify(result)


# -----------------------------
# Delete session
# -----------------------------
@session_bp.route("/delete/<int:session_id>", methods=["DELETE"])
def delete_session_route(session_id):
    result = delete_session_service(session_id)
    return jsonify(result)