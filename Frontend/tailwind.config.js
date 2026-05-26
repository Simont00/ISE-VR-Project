/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        vr: {
          bg:       '#0D0B1E',  // deep space black-purple
          panel:    '#13102B',  // card background
          border:   '#2A2456',  // subtle borders
          purple:   '#7B5EA7',  // primary accent
          indigo:   '#5B4FCF',  // secondary accent
          glow:     '#9B72CF',  // glow / highlight
          teal:     '#2EC4B6',  // emotion-happy
          amber:    '#FF9F1C',  // emotion-neutral
          coral:    '#E84855',  // emotion-stressed
          text:     '#E8E6F0',  // primary text
          muted:    '#8B87A8',  // secondary text
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'vr-gradient': 'radial-gradient(ellipse at 20% 50%, #1a1040 0%, #0D0B1E 60%)',
        'card-gradient': 'linear-gradient(135deg, #181535 0%, #13102B 100%)',
        'purple-glow': 'radial-gradient(circle at center, rgba(123,94,167,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'glow': '0 0 24px rgba(123,94,167,0.3)',
        'glow-sm': '0 0 12px rgba(123,94,167,0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    }
  },
  plugins: []
}
