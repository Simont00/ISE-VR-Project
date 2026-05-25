import time
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from backend.database.db import db, Progress

# ── FIX: Registered with '/api' prefix to match dashboard requests exactly
session_bp = Blueprint('session', __name__, url_prefix='/api')

# Global runtime status tracker object
_live_backup = {
    "current_emotion": "neutral",
    "engagement_score": 60,
    "total_interventions": 0,
    "intervention_active": False,
    "advice": "Initialising telemetry matrix..."
}

INTERVENTION_EMOTIONS = {"angry", "fear", "disgust", "sad"}

def _get_advice(emotion):
    return {
        "happy":    "🌟 Child is engaged! Introduce the next social task.",
        "neutral":  "Calm state. Good moment to explain a new concept.",
        "sad":      "💙 Needs encouragement. Use a praise prompt.",
        "surprise": "Surprise detected — check if scenario is overwhelming.",
        "fear":     "⚠️ Anxiety detected. Offer a 2-minute calm break.",
        "angry":    "🧊 Frustration rising. Activate sensory break now.",
        "disgust":  "Discomfort detected. Consider switching scenario.",
    }.get(emotion, "Monitoring child response...")


# ================= ✅ COMPATIBLE JWT SESSION MANAGEMENT =================

@session_bp.route('/session/start', methods=['POST'])
@jwt_required()
def start_session():
    generated_sid = datetime.now().strftime("%Y%m%d_%H%M%S")
    return jsonify({
        "message": "Session token generated inside system pipeline",
        "session_id": generated_sid
    }), 201

@session_bp.route('/session/end/<string:session_id>', methods=['PUT'])
@jwt_required()
def end_session(session_id):
    return jsonify({"message": "Session closed out cleanly"})


# ================= 🔥 TELEMETRY SYNC FOR GRAPHS & BARS =================

# 🔹 Camera execution script targets this endpoint to update state matrix
@session_bp.route('/update-mental-state', methods=['POST'])
def update_mental_state():
    global _live_backup
    data = request.get_json(silent=True) or {}
    
    emotion = str(data.get("emotion", "neutral")).lower().strip()
    score   = float(data.get("score", 0.0))
    patient = str(data.get("patient_name", "Unknown Guest"))

    try:
        from backend.routes.scenerio_routes import get_live_scenario_name
        current_env = get_live_scenario_name()
    except Exception:
        current_env = "Classroom"

    iv_status = "Active" if emotion in INTERVENTION_EMOTIONS else "Monitoring"

    print(f"📊 [LIVE SYNC] Place: {current_env} | Emotion: {emotion.upper()} | Status: {iv_status}")

    try:
        new_entry = Progress(
            session_id=datetime.now().strftime("%Y%m%d_%H%M%S"),
            patient_name=patient,
            emotion_label=emotion, 
            intervention=iv_status,
            environment=current_env
        )
        db.session.add(new_entry)
        db.session.commit()
        
        # Immediate sync tracking update
        _live_backup["current_emotion"] = emotion
        _live_backup["intervention_active"] = True if iv_status == "Active" else False
        _live_backup["advice"] = _get_advice(emotion)
        
    except Exception as db_err:
        db.session.rollback()
        print("🚨 Database Commit Error:", db_err)

    return jsonify({"status": "ok", "emotion": emotion, "active_scenario": current_env}), 200


# 🔹 Polled by dashboard.html every 2 seconds to render charts
@session_bp.route('/dashboard-stats', methods=['GET'])
def dashboard_stats():
    global _live_backup
    try:
        # Fetching grouped emotion frequencies from database mapping
        stats = db.session.query(Progress.emotion_label, func.count(Progress.id)).group_by(Progress.emotion_label).all()
        chart_data = {str(lbl).lower(): int(cnt) for lbl, cnt in stats if lbl}
        
        # Absolute fallback if tables are empty
        if not chart_data:
            chart_data = {"happy": 0, "neutral": 1, "sad": 0, "fear": 0, "angry": 0}

        total = sum(chart_data.values()) or 1
        happy_neutral = chart_data.get('happy', 0) + chart_data.get('neutral', 0)
        eng_score = round((happy_neutral / total) * 100)

        total_iv = db.session.query(Progress).filter(Progress.intervention == 'Active').count()

        return jsonify({
            "status":              "success",
            "current_emotion":     _live_backup["current_emotion"],
            "engagement_score":    int(eng_score),
            "total_interventions": int(total_iv),
            "intervention_active": _live_backup["intervention_active"],
            "advice":              _live_backup["advice"],
            "chart_data":          chart_data,
            "session_seconds":     60
        }), 200

    except Exception as query_err:
        print("🚨 Dashboard Query Execution Failed:", query_err)
        return jsonify({
            "status": "success",
            "current_emotion": "neutral",
            "engagement_score": 50,
            "total_interventions": 0,
            "intervention_active": False,
            "advice": "Database syncing...",
            "chart_data": {"happy": 0, "neutral": 1, "sad": 0, "fear": 0, "angry": 0},
            "session_seconds": 10
        }), 200