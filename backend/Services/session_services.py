from backend.Models.session_model import (
    create_session,
    get_sessions_by_user,
    get_session_by_id,
    delete_session
)

# Create session
def create_session_service(data):
    return create_session(
        data["user_id"],
        data["emotion_id"],
        data["scenario_id"],
        data["duration"]
    )

# Get sessions of user
def get_sessions_service(user_id):
    return get_sessions_by_user(user_id)

# Get single session
def get_single_session_service(session_id):
    return get_session_by_id(session_id)

# Delete session
def delete_session_service(session_id):
    return delete_session(session_id)