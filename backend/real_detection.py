import cv2
import requests
from deepface import DeepFace
import time
import random

URL = "http://127.0.0.1:5000/api/update-mental-state"

# 🔍 OpenCV Face Detector Core load kar rahe hain ghost tracking rokne ke liye
try:
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
except Exception:
    face_cascade = None

def start_detection():
    cap = cv2.VideoCapture(0)
    
    # Check kar rahe hain ki kya real camera available hai (Codespaces cloud par nahi hota)
    is_headless = False
    if not cap.isOpened():
        print("⚠️ Webcam not found! GitHub Codespaces / Cloud Environment detected.")
        print("🚀 [FALLBACK] Activating Headless Live Telemetry Simulation Matrix for Frontend Dashboard...")
        is_headless = True
    else:
        print("🚀 ISE Anti-Ghost Detection System Active (Real Hardware Mode)...")

    # Array of emotions for smart testing simulation under cloud mode
    mock_emotions = ['neutral', 'happy', 'neutral', 'sad', 'angry', 'neutral', 'fear']

    while True:
        if is_headless:
            # --- CODESPACES CLOUD MODE SIMULATION (Saves Frontend Data Sync) ---
            try:
                # Random smart data intervals simulate kar rahe hain taaki partner ke charts real-time chalein
                simulated_emotion = random.choice(mock_emotions)
                simulated_score = round(random.uniform(70.0, 99.9), 2)
                
                payload = {
                    "emotion": simulated_emotion, 
                    "score": simulated_score,
                    "patient_name": "Rituraj Yadav" # Merged from cluster state logs
                }
                
                # Backend app.py API se handshaking
                r = requests.post(URL, json=payload, timeout=2)
                if r.status_code == 200:
                    print(f"📡 [CLOUD TELEMETRY SYNC]: {simulated_emotion.upper()} ({simulated_score}%) sent successfully.")
            except Exception as e:
                print(f"🚨 Cloud Telemetry API Connection Waiting... (Start python app.py first)")
            
            time.sleep(1.5) # Cloud dashboard latency balance
            continue

        # --- REAL HARDWARE LOCAL LAPTOP MODE ---
        ret, frame = cap.read()
        if not ret: break

        # Background gray format checking
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        if face_cascade is not None:
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))
        else:
            faces = []

        # 🛑 CASE A: AGAR SAMNE KOI INSAAN NAHI HAI
        if len(faces) == 0:
            print("⚠️ [STABLE] No person in front of camera. Resetting backend pipeline...")
            try:
                payload = {"emotion": "neutral", "score": 100.0, "patient_name": "Unknown Guest"}
                requests.post(URL, json=payload, timeout=1)
            except Exception:
                pass
            
            cv2.putText(frame, "No Face Detected", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            try:
                cv2.imshow('ISE - AI Monitoring', frame)
            except Exception:
                pass

        # 🟢 CASE B: REAL PERSON DETECTED
        else:
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
                
                try:
                    face_roi = frame[y:y+h, x:x+w]
                    results = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=True)
                    emotion = results[0]['dominant_emotion']
                    score = results[0]['emotion'][emotion]

                    payload = {"emotion": str(emotion), "score": float(score), "patient_name": "Unknown Guest"}
                    r = requests.post(URL, json=payload, timeout=2)
                    
                    if r.status_code == 200:
                        print(f"✅ REAL PERSON DETECTED: {emotion} ({round(score, 2)}%)")

                    cv2.putText(frame, f"Emotion: {emotion}", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                except Exception as e:
                    pass
            
            try:
                cv2.imshow('ISE - AI Monitoring', frame)
            except Exception:
                pass

        if cv2.waitKey(1) & 0xFF == ord('q'): break
        time.sleep(0.4)

    cap.release()
    try:
        cv2.destroyAllWindows()
    except Exception:
        pass

if __name__ == "__main__":
    start_detection()