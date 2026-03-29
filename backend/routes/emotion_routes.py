from flask import Blueprint, request, jsonify
from backend.Services.emotion_services import (
    process_emotion,
    fetch_user_emotions,
    fetch_latest_emotion
)

emotion_bp = Blueprint("emotion", __name__)


# 🔹 Add emotion
@emotion_bp.route("/emotion", methods=["POST"])
def add_emotion():
    data = request.get_json()

    user_id = data.get("user_id")
    emotion = data.get("emotion")
    confidence = data.get("confidence")

    result = process_emotion(user_id, emotion, confidence)

    return jsonify({"message": result})


# 🔹 Get all emotions
@emotion_bp.route("/emotion/<int:user_id>", methods=["GET"])
def get_emotions(user_id):
    data = fetch_user_emotions(user_id)
    return jsonify(data)


# 🔹 Get latest emotion
@emotion_bp.route("/emotion/latest/<int:user_id>", methods=["GET"])
def get_latest(user_id):
    data = fetch_latest_emotion(user_id)
    return jsonify(data)