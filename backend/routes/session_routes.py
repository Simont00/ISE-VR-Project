from flask import Blueprint, request, jsonify
from backend.database.db import get_db_connection
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

session_bp = Blueprint('session', __name__)

#start session
@session_bp.route('/session/start', methods=['POST'])
@jwt_required()
def start_session():

    user_id = get_jwt_identity()   # 🔥 comes from token

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check active session
    cursor.execute("""
        SELECT * FROM sessions WHERE user_id = ? AND is_active = 1
    """, (user_id,))
    
    active = cursor.fetchone()

    if active:
        return jsonify({"error": "User already has active session"}), 400

    # Create session
    cursor.execute("""
        INSERT INTO sessions (user_id)
        VALUES (?)
    """, (user_id,))

    conn.commit()
    session_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "message": "Session started",
        "session_id": session_id
    }), 201

    # Fetch created session
    cursor.execute("SELECT * FROM sessions WHERE id = ?", (session_id,))
    new_session = cursor.fetchone()

    conn.close()

    return jsonify({
        "message": "Session started",
        "session": dict(new_session)
    }), 201


# end session
@session_bp.route('/session/end/<int:session_id>', methods=['PUT'])
@jwt_required()
def end_session(session_id):

    user_id = get_jwt_identity()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM sessions 
        WHERE id = ? AND user_id = ?
    """, (session_id, user_id))

    session = cursor.fetchone()

    if not session:
        conn.close()
        return jsonify({"error": "Session not found"}), 404

    if session["is_active"] == 0:
        conn.close()
        return jsonify({"error": "Already ended"}), 400

    from datetime import datetime

    end_time = datetime.utcnow()
    start_time = datetime.strptime(session["start_time"], "%Y-%m-%d %H:%M:%S")
    duration = str(end_time - start_time)

    cursor.execute("""
        UPDATE sessions
        SET end_time = ?, is_active = 0, duration = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (end_time, duration, session_id))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Session ended",
        "duration": duration
    })
# get session
@session_bp.route('/session/me', methods=['GET'])
@jwt_required()
def get_my_sessions():

    user_id = get_jwt_identity()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM sessions WHERE user_id = ?
    """, (user_id,))

    sessions = cursor.fetchall()
    conn.close()

    return jsonify({
        "sessions": [dict(s) for s in sessions]
    })