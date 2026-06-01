import os
import sys
import pygame
import random
import threading
import io
from datetime import datetime

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from flask_jwt_extended import JWTManager
from sqlalchemy import func
from reportlab.pdfgen import canvas

from backend.config import Config
from backend.database.db import db, Progress
from backend.routes.auth_routes import auth
from backend.routes.emotion_routes import emotion_bp
from backend.routes.session_routes import session_bp
from backend.routes.scenerio_routes import scenerio_bp

# Models
from backend.Models.session_model import create_session_table
from backend.Models.user_model import User


# ================= INIT =================
app = Flask(__name__)
app.config.from_object(Config)

# Security keys (merged)
app.config["SECRET_KEY"] = "supersecretkey"
app.config["JWT_SECRET_KEY"] = "jwt-super-secret-key"

# Extensions
db.init_app(app)
jwt = JWTManager(app)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


# ================= PYGAME SAFE INIT =================
try:
    pygame.mixer.init()
    print("✅ Pygame Audio Initialized")
except pygame.error:
    print("⚠️ Headless mode - Audio disabled")


# ================= BLUEPRINTS =================
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(emotion_bp)
app.register_blueprint(session_bp, url_prefix="/api")
app.register_blueprint(scenerio_bp, url_prefix="/scenerio")


# ================= GLOBAL STATE =================
_live_state = {
    "current_emotion": "neutral",
    "engagement_score": 0,
    "total_interventions": 0,
    "intervention_active": False,
    "chart_data": {"happy": 0, "neutral": 1, "sad": 0, "fear": 0, "angry": 0}
}

_current_session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
_current_vr_env = "Classroom"


# ================= HOME =================
@app.route("/")
def home():
    return {"message": "ISE Backend Running 🚀"}


# ================= SCENARIO TRACKING =================
@app.before_request
def capture_active_scenario():
    global _current_vr_env
    if request.path == "/scenerio/set-active" and request.method == "POST":
        data = request.get_json(silent=True) or {}
        if "scenario" in data:
            _current_vr_env = data["scenario"]


# ================= LIVE UPDATE + SOCKET =================
@app.after_request
def live_sync(response):
    global _live_state, _current_session_id, _current_vr_env

    if request.path == "/api/update-mental-state" and request.method == "POST":
        try:
            data = request.get_json() or {}

            emotion = data.get("emotion", "neutral").lower()
            patient = data.get("patient_name", "Unknown")

            # Save DB log
            new_log = Progress(
                session_id=_current_session_id,
                patient_name=patient,
                emotion_label=emotion,
                intervention="Monitoring",
                environment=_current_vr_env
            )

            db.session.add(new_log)
            db.session.commit()

            # Stats
            stats = db.session.query(
                Progress.emotion_label,
                func.count(Progress.id)
            ).filter(
                Progress.session_id == _current_session_id
            ).group_by(Progress.emotion_label).all()

            chart_data = {str(k).lower(): v for k, v in stats}
            total = sum(chart_data.values()) or 1

            engagement = round(
                ((chart_data.get("happy", 0) + chart_data.get("neutral", 0)) / total) * 100
            )

            _live_state.update({
                "current_emotion": emotion,
                "engagement_score": engagement,
                "chart_data": chart_data,
                "total_interventions": 0,
                "intervention_active": False
            })

            payload = {
                "current_emotion": emotion,
                "engagement_score": engagement,
                "chart_data": chart_data,
                "environment_active": _current_vr_env,
                "advice": "Live system active"
            }

            socketio.emit("dashboard_metrics", payload)

        except Exception as e:
            print("Live sync error:", e)

    return response


# ================= API =================
@app.route("/api/dashboard-stats")
def dashboard_stats():
    return jsonify(_live_state)


@app.route("/api/history")
def history():
    logs = Progress.query.all()
    return jsonify([
        {
            "emotion": l.emotion_label,
            "patient": l.patient_name,
            "intervention": l.intervention,
            "env": l.environment
        }
        for l in logs
    ])


# ================= PDF REPORT =================
@app.route("/api/download-report", methods=["POST"])
def download_report():
    data = request.json or {}

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)

    p.drawString(100, 750, "ISE FINAL REPORT")
    p.drawString(100, 720, f"Patient: {data.get('patient_name')}")
    p.drawString(100, 700, f"Emotion: {data.get('dominant_emotion', 'Neutral')}")
    p.drawString(100, 680, f"Engagement: {data.get('engagement_score', '0%')}")

    p.save()
    buffer.seek(0)

    return send_file(buffer, as_attachment=True, download_name="report.pdf")


# ================= RUN =================
if __name__ == "__main__":
    with app.app_context():
        create_session_table()
        db.create_all()
        print("✅ DB + Session tables ready")

    socketio.run(app, host="0.0.0.0", port=5000, debug=True)