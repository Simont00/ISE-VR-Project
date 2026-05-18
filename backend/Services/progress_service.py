from backend.database.db import db
from datetime import datetime, timedelta

# Maan lete hain aapke paas ek Progress model hai, 
# agar nahi hai toh hum yahan save karne ka logic ensure karenge.

class ProgressService:
    @staticmethod
    def add_session_data(emotion, score, intervention_status="None"):
        """
        NIEPMD Requirement: Har session ka emotional data aur 
        ki gayi help (intervention) ko save karna.
        """
        try:
            # Yahan hum SQL query ya SQLAlchemy use kar rahe hain
            # Niche wala logic aapke database structure ke hisab se hai
            
            from sqlalchemy import text
            
            # Database mein data insert karne ki query
            # Hum 'intervention' column mein 'Active' ya 'None' save karenge
            sql = text("""
                INSERT INTO progress (emotion, score, intervention, timestamp) 
                VALUES (:emotion, :score, :intervention, :timestamp)
            """)
            
            db.session.execute(sql, {
                "emotion": emotion,
                "score": score,
                "intervention": intervention_status,
                "timestamp": datetime.now()
            })
            
            db.session.commit()
            print(f"✅ Progress Saved: {emotion} | Intervention: {intervention_status}")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error in ProgressService: {e}")
            raise e

    @staticmethod
    def get_weekly_stats():
        """
        Dashboard ke liye pichle 7 din ka data nikalna
        """
        try:
            from sqlalchemy import text
            seven_days_ago = datetime.now() - timedelta(days=7)
            
            sql = text("""
                SELECT emotion, COUNT(*) as count 
                FROM progress 
                WHERE timestamp > :time 
                GROUP BY emotion
            """)
            
            results = db.session.execute(sql, {"time": seven_days_ago}).fetchall()
            
            # Data ko format karna taaki frontend (Charts) samajh sake
            stats = {row[0]: row[1] for row in results}
            return stats
            
        except Exception as e:
            print(f"❌ Error fetching stats: {e}")
            return {}