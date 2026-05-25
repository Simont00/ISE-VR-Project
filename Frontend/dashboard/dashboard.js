async function startLiveMonitoring() {
    setInterval(async () => {
        try {
            const response = await fetch('/api/dashboard-stats');
            const data = await response.json();
            
            // 1. Emotion Text Update Karo
            const emotionElement = document.getElementById('emotion-display') || document.querySelector('.Detecting...');
            if (emotionElement) {
                emotionElement.textContent = data.emotion;
            }
            
            // 2. AI Analysis Box Update Karo
            const analysisBox = document.querySelector('.Waiting for detection...');
            if (analysisBox) {
                if (data.intervention_active) {
                    analysisBox.innerHTML = `<span style="color: red; font-weight: bold;">⚠️ Sensory Break Triggered! Playing Calm Sound...</span>`;
                    // Yahan apna calm_sound.mp3 play karwa sakti ho
                    let audio = new Audio('/static/calm_sound.mp3');
                    audio.play();
                } else {
                    analysisBox.textContent = `Tracking Active: Confidence ${(data.score * 100).toFixed(1)}%`;
                }
            }
        } catch (error) {
            console.log("Dashboard sync error:", error);
        }
    }, 2000); // Har 2 second mein update hoga
}

// Function ko call karo page load hote hi
document.addEventListener('DOMContentLoaded', startLiveMonitoring);