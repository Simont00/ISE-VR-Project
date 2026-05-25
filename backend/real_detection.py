import cv2
import requests
from deepface import DeepFace
import time

URL = "http://127.0.0.1:5000/api/update-mental-state"

# 🔍 OpenCV Face Detector Core load kar rahe hain ghost tracking rokne ke liye
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def start_detection():
    cap = cv2.VideoCapture(0)
    print("🚀 ISE Anti-Ghost Detection System Active...")

    while True:
        ret, frame = cap.read()
        if not ret: break

        # Background gray format checking
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

        # 🛑 CASE A: AGAR SAMNE KOI INSAAN NAHI HAI
        if len(faces) == 0:
            print("⚠️ [STABLE] No person in front of camera. Resetting backend pipeline...")
            try:
                # Backend ko clean state bhej rahe hain taaki raita na phaile
                payload = {"emotion": "neutral", "score": 100.0}
                requests.post(URL, json=payload, timeout=1)
            except Exception:
                pass
            
            cv2.putText(frame, "No Face Detected", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            cv2.imshow('ISE - AI Monitoring', frame)

        # 🟢 CASE B: REAL PERSON DETECTED
        else:
            for (x, y, w, h) in faces:
                # Chehre ke charo taraf border box banao
                cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
                
                try:
                    # Sirf us cut square box image area ko scan karo pure background ke badle
                    face_roi = frame[y:y+h, x:x+w]
                    
                    results = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=True)
                    emotion = results[0]['dominant_emotion']
                    score = results[0]['emotion'][emotion]

                    payload = {"emotion": str(emotion), "score": float(score)}
                    r = requests.post(URL, json=payload, timeout=2)
                    
                    if r.status_code == 200:
                        print(f"✅ REAL PERSON DETECTED: {emotion} ({round(score, 2)}%)")

                    cv2.putText(frame, f"Emotion: {emotion}", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                except Exception as e:
                    # Agar DeepFace crash kare toh telemetry raw stream par fallback karegi
                    pass
            
            cv2.imshow('ISE - AI Monitoring', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'): break
        time.sleep(0.4) # Normal timing to maintain database execution speed

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    start_detection()