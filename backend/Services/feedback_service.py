class FeedbackService:
    @staticmethod
    def get_feedback(emotion, score):
        # Logic for ASD/ID children feedback
        emotion = emotion.lower()
        
        if emotion == "happy":
            if score > 0.8:
                return "Aapki muskurahat bahut pyaari hai! ⭐"
            return "Good job! Aap bahut accha feel kar rahe hain."
        
        elif emotion in ["sad", "angry", "fear"]:
            # Calming feedback for high stress
            return "Koi baat nahi, ek gehri saans lijiye. Hum saath khel rahe hain. 🌈"
        
        elif emotion == "neutral":
            return "Aapka focus bahut accha hai! Agla step try karein."
            
        else:
            return "Aap bahut accha kar rahe hain, aise hi jaari rakhein!"