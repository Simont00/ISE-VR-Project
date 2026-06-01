
import os
import sys
import pygame
import random
import threading
import io
from datetime import datetime

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
<<<<<<< HEAD
from flask_socketio import SocketIO
=======
from flask_socketio import SocketIO, emit
from flask_jwt_extended import JWTManager
>>>>>>> origin/main
from sqlalchemy import func
from reportlab.pdfgen import canvas

from backend.config import Config
from backend.database.db import db, Progress
from backend.routes.auth_routes import auth
from backend.routes.emotion_routes import emotion_bp
from backend.routes.session_routes import session_bp
from backend.routes.scenerio_routes import scenerio_bp

<<<<<<< HEAD
=======
# Models and Table Initializations
from backend.Models.session_model import create_session_table
from backend.Models.user_model import User

# Intervention Settings (Safe Fallback for Headless Cloud Containers)
try:
    pygame.mixer.init()
    print("✅ Pygame Audio System Initialized Successfully!")
except pygame.error:
    print("⚠️ No audio device found (Running in headless/cloud environment). Audio features safely virtualized.")

STRESS_THRESHOLD = 3 
stress_streak = 0
BASE_DIR = os.path.dirname(__file__)
>>>>>>> origin/main

# ================= INIT =================
app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


# ================= ROUTES =================
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(emotion_bp)
app.register_blueprint(session_bp, url_prefix="/api")
app.register_blueprint(scenerio_bp, url_prefix="/scenerio")


# ================= HOME ROUTE (FIX ADDED) =================
@app.route("/")
def home():
    return {"message": "ISE Backend Running"}


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


<<<<<<< HEAD
# ================= SOCKET + LIVE UPDATE =================
@app.after_request
def live_sync(response):
    global _live_state, _current_session_id, _current_vr_env

    if request.path == "/api/update-mental-state" and request.method == "POST":
        data = request.get_json() or {}

        emotion = data.get("emotion", "neutral").lower()
        patient = data.get("patient_name", "Unknown")

        new_log = Progress(
            session_id=_current_session_id,
            patient_name=patient,
            emotion_label=emotion,
            intervention="Monitoring",
            environment=_current_vr_env
=======
    if stress_streak >= STRESS_THRESHOLD:
        is_active = True
        music_dir = os.path.join(BASE_DIR, "music_library")
        song = os.path.join(BASE_DIR, "calm_sound.mp3")
        if os.path.exists(music_dir):
            songs = [f for f in os.listdir(music_dir) if f.endswith('.mp3')]
            if songs: song = os.path.join(music_dir, random.choice(songs))
        
        if os.path.exists(song):
            t = threading.Thread(target=music_worker_thread, args=(song, "PLAY"))
            t.daemon = True
            t.start()
            
    return "Active" if is_active else "Monitoring"

# App Initialization (Merged Settings from Partner Core)
app = Flask(__name__, template_folder='templates')
app.config.from_object(Config)

# Partner's Explicit Authorization Key-Pairs
app.config["SECRET_KEY"] = "supersecretkey"
app.config["JWT_SECRET_KEY"] = "jwt-super-secret-key"

# Init backend extensions
db.init_app(app)
jwt = JWTManager(app)
CORS(app)

# Real-time WebSockets Instance Mapping
socketio = SocketIO(app, cors_allowed_origins="*")

# Register Architecture Blueprints (Synchronized Routing Prefixes)
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(emotion_bp)
app.register_blueprint(session_bp, url_prefix="/api")
app.register_blueprint(scenerio_bp, url_prefix="/scenerio")


# --- INTEGRATED ROUTING MATRIX ---

@app.route("/")
def home():
    return {"message": "Backend running successfully 🚀"}

@app.route("/test-session")
def test_session():
    return {"message": "Session route working ✅"}

@app.route("/dashboard")
def dashboard():
    global _current_session_id
    # Reset session token on fresh dashboard load to split logs cleanly
    _current_session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    return render_template("dashboard.html")

@app.route("/history")
def history_page():
    return render_template("history.html")


# Hook to catch active scenario shifts from the frontend button click
@app.before_request
def capture_active_scenario():
    global _current_vr_env
    if request.path == '/scenerio/set-active' and request.method == 'POST':
        try:
            req_data = request.get_json(silent=True) or {}
            if "scenario" in req_data:
                _current_vr_env = req_data["scenario"]
                print(f"🌍 Sync: Environment shifted to -> {_current_vr_env}")
        except Exception:
            pass

# LIVE SYNC MIDDLEWARE
@app.after_request
def check_live_intervention(response):
    global _live_state, _current_vr_env, _current_session_id
    if request.path == '/api/update-mental-state' and request.method == 'POST':
        try:
            incoming_data = request.get_json(silent=True) or {}
            current_emo = str(incoming_data.get("emotion", "neutral")).lower()
            patient_name = str(incoming_data.get("patient_name", "Unknown Guest"))
            
            status = handle_sensory_intervention(current_emo)
            iv_now = True if status == "Active" else False
            
            # Save telemetry telemetry environment configurations alongside distinct timestamp hashes
            new_log = Progress(
                session_id=_current_session_id,
                patient_name=patient_name,
                emotion_label=current_emo, 
                intervention="Active" if iv_now else "Monitoring",
                environment=_current_vr_env
            )
            db.session.add(new_log)
            db.session.commit()
            
            # Process analytical trends based on current logging instances
            total_iv = db.session.query(Progress).filter(
                Progress.session_id == _current_session_id, 
                Progress.intervention == 'Active'
            ).count()
            
            stats = db.session.query(Progress.emotion_label, func.count(Progress.id)).filter(
                Progress.session_id == _current_session_id
            ).group_by(Progress.emotion_label).all()
            
            chart_data = {str(l).lower(): int(c) for l, c in stats if l}
            
            total = sum(chart_data.values())
            happy_neutral = chart_data.get('happy', 0) + chart_data.get('neutral', 0)
            eng_score = round((happy_neutral / total * 100)) if total > 0 else 0
            
            _live_state["current_emotion"] = current_emo
            _live_state["engagement_score"] = eng_score
            _live_state["total_interventions"] = total_iv
            _live_state["chart_data"] = chart_data
            
            payload = {
                "status": "success",
                "total_interventions": int(total_iv),
                "chart_data": chart_data,
                "dominant_emotion": max(chart_data, key=chart_data.get) if chart_data else "neutral",
                "current_emotion": current_emo,
                "intervention_active": iv_now,
                "engagement_score": eng_score,
                "environment_active": _current_vr_env,
                "advice": f"ISE AI: Monitoring behaviors in {_current_vr_env}."
            }
            socketio.emit('dashboard_metrics', payload)
            
        except Exception as e:
            print("🚨 Live Route Stream Sync Error:", e)
    return response

# CLINICAL PDF REPORT GENERATION ENDPOINT
@app.route("/api/download-report", methods=["POST"])
def download_report():
    try:
        data = request.json or {}
        patient_name = data.get("patient_name", "Anonymous Student")
        engagement = data.get("engagement_score", "0%")
        total_interventions = data.get("total_interventions", "0")
        dominant_emotion = data.get("dominant_emotion", "Neutral")
        current_env = data.get("environment_active", "Classroom")
        
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        
        # Header Band
        p.setFillColorRGB(0.48, 0.36, 0.75)
        p.rect(0, 720, 612, 90, fill=True, stroke=False)
        
        p.setFillColorRGB(1, 1, 1)
        p.setFont("Helvetica-Bold", 22)
        p.drawString(40, 765, "ISE PLATFORM — CLINICAL REPORT")
        p.setFont("Helvetica", 10)
        p.drawString(40, 745, "NIEPMD Interactive Skills Enhancer · Session Analytics")
        
        # Meta Data Column
        p.setFillColorRGB(0.1, 0.1, 0.1)
        p.setFont("Helvetica-Bold", 13)
        p.drawString(40, 680, f"Patient/Student Name: {patient_name}")
        p.setFont("Helvetica", 10)
        p.setFillColorRGB(0.4, 0.4, 0.4)
        p.drawString(40, 662, f"Date generated: {datetime.now().strftime('%B %d, %Y — %I:%M %p')}")
        
        p.setStrokeColorRGB(0.85, 0.85, 0.85)
        p.setLineWidth(1)
        p.line(40, 645, 570, 645)
        
        # Metrics Sections (Real Insights)
        p.setFillColorRGB(0.1, 0.1, 0.1)
        p.setFont("Helvetica-Bold", 12)
        p.drawString(40, 615, "📊 Session Metrics Breakdown:")
        
        p.setFont("Helvetica", 11)
        p.drawString(55, 585, f"• Dominant Behavioral State: {dominant_emotion.upper()}")
        p.drawString(55, 560, f"• Final Engagement Index: {engagement}")
        p.drawString(55, 535, f"• Sensory Interventions Administered: {total_interventions} times")
        p.drawString(55, 510, f"• Last Active Environment Context: {current_env}")
        
        # Clinical Recommendations Block
        p.setStrokeColorRGB(0.48, 0.36, 0.75)
        p.setFillColorRGB(0.97, 0.96, 0.99)
        p.rect(40, 390, 530, 85, fill=True, stroke=True)
        
        p.setFillColorRGB(0.3, 0.2, 0.5)
        p.setFont("Helvetica-Bold", 11)
        p.drawString(55, 450, "💡 Therapist/Clinical Observation Notes:")
        p.setFont("Helvetica", 10)
        p.setFillColorRGB(0.2, 0.2, 0.2)
        
        if "angry" in dominant_emotion.lower() or "fear" in dominant_emotion.lower():
            note = f"The student exhibited sensory overload triggers within the '{current_env}' scene. Audio sensory interventions were applied. Recommend shorter exposure blocks next session."
        else:
            note = f"The student maintained optimal regulation and high engagement within the '{current_env}' setup. Progression to higher multi-task levels is recommended."
            
        p.drawString(55, 430, note)
        
        # Footer
        p.setFillColorRGB(0.5, 0.5, 0.5)
        p.setFont("Helvetica-Oblique", 9)
        p.drawString(40, 100, "* Documented under telemetry guidelines. Confirms to NIEPMD cognitive logging matrix.")
        
        p.showPage()
        p.save()
        
        buffer.seek(0)
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"ISE_Clinical_Report_{patient_name.replace(' ', '_')}.pdf",
            mimetype="application/pdf"
>>>>>>> origin/main
        )

        db.session.add(new_log)
        db.session.commit()

        stats = db.session.query(
            Progress.emotion_label, func.count(Progress.id)
        ).filter(
            Progress.session_id == _current_session_id
        ).group_by(Progress.emotion_label).all()

        chart_data = {str(k).lower(): v for k, v in stats}

        total = sum(chart_data.values()) or 1
        engagement = round(((chart_data.get("happy", 0) + chart_data.get("neutral", 0)) / total) * 100)

        payload = {
            "current_emotion": emotion,
            "engagement_score": engagement,
            "chart_data": chart_data,
            "total_interventions": 0,
            "intervention_active": False,
            "environment_active": _current_vr_env,
            "advice": "Live system active"
        }

<<<<<<< HEAD
        socketio.emit("dashboard_metrics", payload)

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


# ================= PDF =================
@app.route("/api/download-report", methods=["POST"])
def download_report():
    data = request.json

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)

    p.drawString(100, 750, "ISE FINAL REPORT")
    p.drawString(100, 720, f"Patient: {data.get('patient_name')}")
    p.save()

    buffer.seek(0)

    return send_file(buffer, as_attachment=True, download_name="report.pdf")


# ================= RUN =================
if __name__ == "__main__":
    with app.app_context():
        create_session_table()
        db.create_all()

=======
# SQLite Matrix Mapping Engine Setup
create_session_table()
with app.app_context(): 
    try:
        db.create_all()
        print("✅ Database configurations synced and operational.")
    except Exception as db_init_err:
        print("❌ DB Initialization Error:", str(db_init_err))

# Launch App Context Wrapper via SocketIO Layer (Debug Active for Hot-Reload Tracking)
if __name__ == "__main__":
<<<<<<< HEAD
    print("🚀 Starting Fully Merged Flask-SocketIO Engine...")
=======
>>>>>>> 341afdb (Fixed file deletion issue: Merged login system and scenarios permanently)
>>>>>>> origin/main
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)