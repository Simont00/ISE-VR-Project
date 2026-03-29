from backend.Models.emotion_model import (
    save_emotion,
    get_emotions_by_user,
    get_latest_emotion
)

# ✅ Save emotion (main logic)
def process_emotion(user_id, emotion, confidence):
    return save_emotion(user_id, emotion, confidence)


# ✅ Get all emotions of user
def fetch_user_emotions(user_id):
    return get_emotions_by_user(user_id)


# ✅ Get latest emotion
def fetch_latest_emotion(user_id):
    return get_latest_emotion(user_id)