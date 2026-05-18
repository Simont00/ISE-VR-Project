import cv2
import requests
from deepface import DeepFace
import time

URL = "http://127.0.0.1:5000/api/update-mental-state"

def start_detection():
    cap = cv2.VideoCapture(0)
    print("🚀 ISE Detection System Active...")

    while True:
        ret, frame = cap.read()
        if not ret: break

        try:
            # Enforce_detection=False for smoother UI
            results = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            emotion = results[0]['dominant_emotion']
            score = results[0]['emotion'][emotion]

            payload = {"emotion": str(emotion), "score": float(score)}
            r = requests.post(URL, json=payload, timeout=2)
            
            if r.status_code == 200:
                print(f"✅ DASHBOARD UPDATED: {emotion}")

            # Display on camera screen
            cv2.putText(frame, f"Emotion: {emotion}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.imshow('ISE - AI Monitoring', frame)

        except Exception as e:
            print(f"⚠️ Tracking...")

        if cv2.waitKey(1) & 0xFF == ord('q'): break
        time.sleep(0.5) # Prevent CPU overload

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    start_detection()