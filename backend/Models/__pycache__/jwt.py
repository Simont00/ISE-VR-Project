import jwt
import datetime

def generate_token(user):
    payload = {
        "user_id": user["id"],
        "email": user["email"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }

    token = jwt.encode(payload, "supersecretkey", algorithm="HS256")
    return token