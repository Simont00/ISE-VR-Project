from flask import Blueprint, request, jsonify
from backend.Services.emotion_services import fetch_user_emotions, fetch_latest_emotion, process_emotion
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.database.db import get_db_connection

emotion_bp = Blueprint("emotion", __name__)

# ================= OLD APIs (UNCHANGED) =================

# 🔹 Add emotion (OLD)
@emotion_bp.route("/emotion", methods=["POST"])
def add_emotion():
    data = request.get_json()

    user_id = data.get("user_id")
    emotion = data.get("emotion")
    confidence = data.get("confidence")

    result = process_emotion(user_id, emotion, confidence)

    return jsonify({"message": result})


# 🔹 Get all emotions (OLD)
@emotion_bp.route("/emotion/<int:user_id>", methods=["GET"])
@jwt_required()
def get_emotions(user_id):
    data = fetch_user_emotions(user_id)
    return jsonify(data)


# 🔹 Get latest emotion (OLD)
@emotion_bp.route("/emotion/latest/<int:user_id>", methods=["GET"])
def get_latest(user_id):
    data = fetch_latest_emotion(user_id)
    return jsonify(data)


# ================= NEW APIs (JWT + SESSION BASED) =================

# 🔥 Add emotion with session (NEW)
@emotion_bp.route("/emotion/add", methods=["POST"])
@jwt_required()
def add_emotion_with_session():

    user_id = get_jwt_identity()
    data = request.get_json()

    emotion = data.get("emotion")
    confidence = data.get("confidence")

    if not emotion:
        return jsonify({"error": "emotion is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # ✅ Get active session
    cursor.execute("""
        SELECT * FROM sessions 
        WHERE user_id = ? AND is_active = 1
    """, (user_id,))

    session = cursor.fetchone()

    if not session:
        conn.close()
        return jsonify({"error": "No active session"}), 400

    session_id = session["id"]

    # ✅ Insert emotion with session_id
    cursor.execute("""
        INSERT INTO emotions (user_id, session_id, emotion, confidence)
        VALUES (?, ?, ?, ?)
    """, (user_id, session_id, emotion, confidence))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Emotion added with session",
        "session_id": session_id
    }), 201


# 🔥 Get my emotions (JWT based)
@emotion_bp.route("/emotion/me", methods=["GET"])
@jwt_required()
def get_my_emotions():

    user_id = get_jwt_identity()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM emotions WHERE user_id = ?
    """, (user_id,))

    emotions = cursor.fetchall()
    conn.close()

    return jsonify({
        "emotions": [dict(e) for e in emotions]
    })


# 🔥 Get emotions by session
@emotion_bp.route("/emotion/session/<int:session_id>", methods=["GET"])
@jwt_required()
def get_emotions_by_session(session_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM emotions WHERE session_id = ?
    """, (session_id,))

    emotions = cursor.fetchall()
    conn.close()

    return jsonify({
        "emotions": [dict(e) for e in emotions]
    })