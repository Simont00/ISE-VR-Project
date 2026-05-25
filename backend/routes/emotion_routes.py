import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.database.db import db, Progress  # SQLAlchemy implementation
from backend.Services.emotion_services import fetch_user_emotions, fetch_latest_emotion, process_emotion

emotion_bp = Blueprint("emotion", __name__)

# ================= ⚡ LIVE CAMERA STREAM SYNC ENDPOINT =================

@emotion_bp.route('/api/update-mental-state', methods=['POST'])
def update_mental_state():
    """
    This endpoint is continuously fired by the camera/telemetry script.
    It returns a fast success response to keep the camera thread unblocked,
    while app.py's @app.after_request interceptor logs the data live.
    """
    try:
        data = request.get_json(silent=True) or {}
        emotion = str(data.get("emotion", "neutral")).lower()
        patient_name = str(data.get("patient_name", "Unknown Guest"))
        
        return jsonify({
            "status": "success",
            "message": "Telemetry stream received",
            "emotion": emotion,
            "patient_name": patient_name
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ================= =================================== =================
# ================= SQLALCHEMY ADAPTED CORE (JWT ENDPOINTS) =================
# ================= =================================== =================

# 🔹 Add emotion (OLD BACKWARD COMPATIBLE)
@emotion_bp.route("/emotion", methods=["POST"])
def add_emotion():
    data = request.get_json() or {}
    user_id = data.get("user_id")
    emotion = data.get("emotion", "neutral")
    confidence = data.get("confidence", 1.0)

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


# 🔥 Add emotion with session (NEW - Migrated to SQLAlchemy to avoid raw sqlite3 lock conflicts)
@emotion_bp.route("/emotion/add", methods=["POST"])
@jwt_required()
def add_emotion_with_session():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    emotion = data.get("emotion")
    confidence = data.get("confidence", 1.0)
    current_env = data.get("environment", "Classroom")

    if not emotion:
        return jsonify({"error": "emotion is required"}), 400

    try:
        # SQLAlchemy abstraction to fetch latest distinct session data safely
        from datetime import datetime
        session_id = datetime.now().strftime("%Y%m%d_%H%M%S") # Fallback to live ticking clock ID
        
        # Log session mapping safely inside progress core matrix
        new_log = Progress(
            session_id=str(session_id),
            patient_name=str(user_id), # Bind identity token safely
            emotion_label=str(emotion).lower(),
            intervention="Monitoring",
            environment=current_env
        )
        db.session.add(new_log)
        db.session.commit()

        return jsonify({
            "message": "Emotion added with session inside integrated clinical model",
            "session_id": session_id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database transaction failed: {str(e)}"}), 500


# 🔥 Get my emotions (JWT based)
@emotion_bp.route("/emotion/me", methods=["GET"])
@jwt_required()
def get_my_emotions():
    user_id = get_jwt_identity()
    try:
        # Query logs specific to this student identity using SQLAlchemy
        records = Progress.query.filter(Progress.patient_name == str(user_id)).all()
        emotions_list = []
        for r in records:
            emotions_list.append({
                "id": r.id,
                "session_id": r.session_id,
                "user_id": r.patient_name,
                "emotion": r.emotion_label,
                "intervention": r.intervention,
                "environment": r.environment,
                "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M:%S") if r.timestamp else None
            })
        return jsonify({"emotions": emotions_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔥 Get emotions by session
@emotion_bp.route("/emotion/session/<string:session_id>", methods=["GET"])
@jwt_required()
def get_emotions_by_session(session_id):
    try:
        # Fetch clean metrics tied to targeted operational windows
        records = Progress.query.filter(Progress.session_id == str(session_id)).all()
        emotions_list = []
        for r in records:
            emotions_list.append({
                "id": r.id,
                "session_id": r.session_id,
                "user_id": r.patient_name,
                "emotion": r.emotion_label,
                "intervention": r.intervention,
                "environment": r.environment,
                "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M:%S") if r.timestamp else None
            })
        return jsonify({"emotions": emotions_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500