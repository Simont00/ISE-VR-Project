from flask import Blueprint, request, jsonify
from backend.database.db import db
from backend.Models.session_model import Session
from sqlalchemy import func
from datetime import datetime

# IMPORTANT: NO url_prefix here (app.py already handles /api)
session_bp = Blueprint("session_bp", __name__)

# =========================
# ▶ START SESSION
# =========================
@session_bp.route("/session/start", methods=["POST"])
def start_session():
    data = request.get_json() or {}
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id required"}), 400

    session = Session(user_id=user_id, is_active=1)
    db.session.add(session)
    db.session.commit()

    return jsonify({
        "id": session.id,
        "user_id": session.user_id,
        "is_active": session.is_active
    }), 201


# =========================
# ⏹ END SESSION
# =========================
@session_bp.route("/session/end/<int:session_id>", methods=["POST"])
def end_session(session_id):
    session = Session.query.get(session_id)

    if not session:
        return jsonify({"error": "Session not found"}), 404

    session.is_active = 0
    session.end_time = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": "Session ended",
        "id": session.id
    })


# =========================
# 📜 USER SESSION HISTORY
# =========================
@session_bp.route("/session/user/<int:user_id>", methods=["GET"])
def user_sessions(user_id):
    sessions = Session.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            "id": s.id,
            "user_id": s.user_id,
            "start_time": str(s.start_time),
            "end_time": str(s.end_time),
            "is_active": s.is_active
        }
        for s in sessions
    ])


# =========================
# 🟢 ACTIVE SESSION
# =========================
@session_bp.route("/session/active/<int:user_id>", methods=["GET"])
def active_session(user_id):
    session = Session.query.filter_by(
        user_id=user_id,
        is_active=1
    ).first()

    if not session:
        return jsonify(None), 200

    return jsonify({
        "id": session.id,
        "user_id": session.user_id,
        "start_time": str(session.start_time),
        "is_active": session.is_active
    })


# =========================
# 📊 OPTIONAL: SIMPLE STATS (safe helper)
# =========================
@session_bp.route("/session/stats/<int:user_id>", methods=["GET"])
def session_stats(user_id):
    total = Session.query.filter_by(user_id=user_id).count()
    active = Session.query.filter_by(user_id=user_id, is_active=1).count()
    ended = total - active

    return jsonify({
        "total_sessions": total,
        "active_sessions": active,
        "ended_sessions": ended
    })