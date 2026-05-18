import os
import sys
import pygame
import random
from flask import Flask, request, jsonify, render_template, make_response
from flask_cors import CORS
from sqlalchemy import func

# Path Setup
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.config import Config
from backend.database.db import db, Progress
from backend.routes.auth_routes import auth
from backend.routes.emotion_routes import emotion_bp
from backend.routes.session_routes import session_bp
from backend.routes.scenerio_routes import scenerio_bp
from backend.Models.session_model import create_session_table

# Intervention Settings
pygame.mixer.init()
STRESS_THRESHOLD = 3 # Kam kar diya taaki jaldi test ho sake
stress_streak = 0
BASE_DIR = os.path.dirname(__file__)

def handle_sensory_intervention(emotion):
    global stress_streak
    is_active = False
    if emotion in ['sad', 'angry', 'fear']:
        stress_streak += 1
    else:
        stress_streak = 0
        if pygame.mixer.music.get_busy(): pygame.mixer.music.stop()

    if stress_streak >= STRESS_THRESHOLD:
        is_active = True
        if not pygame.mixer.music.get_busy():
            music_dir = os.path.join(BASE_DIR, "music_library")
            song = os.path.join(BASE_DIR, "calm_sound.mp3")
            if os.path.exists(music_dir):
                songs = [f for f in os.listdir(music_dir) if f.endswith('.mp3')]
                if songs: song = os.path.join(music_dir, random.choice(songs))
            if os.path.exists(song):
                pygame.mixer.music.load(song)
                pygame.mixer.music.play(-1)
    return "Active" if is_active else "Monitoring"

app = Flask(__name__, template_folder='templates')
app.config.from_object(Config)
db.init_app(app)
CORS(app)

# Blueprints
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(emotion_bp)
app.register_blueprint(session_bp, url_prefix="/api")
app.register_blueprint(scenerio_bp, url_prefix="/scenerio")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/api/dashboard-stats", methods=["GET"])
def get_dashboard_stats():
    try:
        db.session.expire_all() # Fresh data check
        
        # 1. Total Interventions (Live Count)
        total_iv = db.session.query(Progress).filter(Progress.intervention == 'Active').count()
        
        # 2. Chart Stats
        stats = db.session.query(Progress.emotion_label, func.count(Progress.id)).group_by(Progress.emotion_label).all()
        chart_data = {str(l): int(c) for l, c in stats if l}
        
        # 3. Latest Status
        latest = Progress.query.order_by(Progress.id.desc()).first()
        current = latest.emotion_label if latest else "None"
        iv_now = True if (latest and latest.intervention == 'Active') else False
        
        # 4. Engagement Calculation
        total = sum(chart_data.values())
        happy_neutral = chart_data.get('happy', 0) + chart_data.get('neutral', 0)
        eng_score = round((happy_neutral / total * 100)) if total > 0 else 0

        response = make_response(jsonify({
            "status": "success",
            "total_interventions": int(total_iv),
            "chart_data": chart_data,
            "dominant_emotion": max(chart_data, key=chart_data.get) if chart_data else "None",
            "current_emotion": current,
            "intervention_active": iv_now,
            "engagement_score": eng_score,
            "advice": "ISE AI: Providing real-time sensory support."
        }))
        
        # Browser cache disable karne ke liye
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        return response
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route("/api/update-mental-state", methods=["POST"])
def update_mental_state():
    data = request.json
    emotion, score = data.get("emotion"), data.get("score")
    iv_status = handle_sensory_intervention(emotion)
    try:
        new_entry = Progress(emotion_label=emotion, emotion_score=float(score), intervention=iv_status)
        db.session.add(new_entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
    return jsonify({"status": "success", "sensory_intervention": iv_status})

create_session_table()
with app.app_context(): db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False, threaded=True)