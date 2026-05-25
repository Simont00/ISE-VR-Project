import React from "react";
import { useNavigate } from "react-router-dom";

import teacher from "../assets/teacher.png";
import bgPattern from "../assets/bg-pattern.png";

const scenarios = [
  {
    title: "Greeting Practice",
    description: "Learn how to greet people politely and start conversations.",
    route: "/greeting",
    active: true,
    icon: "👋",
  },
  {
    title: "Emotion Recognition",
    description: "Identify emotions from facial expressions.",
    route: "/emotion",
    active: true,
    icon: "😊",
  },
  {
    title: "Social Situations",
    description: "Practice real-life interactions.",
    route: "/social",
    active: true,
    icon: "🤝",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleStart = (scenario) => {
    if (scenario.active) {
      navigate(scenario.route);
    } else {
      alert("Coming soon");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        position: "relative",
        background: "linear-gradient(135deg, #eef2ff, #e0f2fe, #fdf2f8)",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND PATTERN */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bgPattern})`,
          opacity: 0.15,
          backgroundRepeat: "repeat",
          zIndex: 0,
        }}
      />

      {/* HEADER CARD */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          padding: "20px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          marginBottom: "30px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <img
          src={teacher}
          alt="Teacher"
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "16px",
            objectFit: "cover",
          }}
        />

        <div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#111827",
              margin: 0,
            }}
          >
            Hi there 👋
          </h2>

          <p
            style={{
              color: "#6b7280",
              marginTop: "6px",
            }}
          >
            I’m your learning buddy! Let’s practice together
          </p>
        </div>
      </div>

      {/* TITLE */}
      <h1
        style={{
          textAlign: "center",
          fontSize: "42px",
          fontWeight: "800",
          marginBottom: "12px",
          color: "#111827",
          position: "relative",
          zIndex: 2,
        }}
      >
        Interactive Learning Scenarios
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#6b7280",
          marginBottom: "50px",
          fontSize: "18px",
          position: "relative",
          zIndex: 2,
        }}
      >
        Learn social & emotional skills through guided practice
      </p>

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {scenarios.map((sc, index) => (
          <div
            key={index}
            onClick={() => handleStart(sc)}
            style={{
              padding: "22px",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 20px 40px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.08)";
            }}
          >
            <div style={{ fontSize: "34px" }}>{sc.icon}</div>

            <h3
              style={{
                fontSize: "28px",
                fontWeight: "700",
                marginTop: "14px",
                color: "#111827",
              }}
            >
              {sc.title}
            </h3>

            <p
              style={{
                fontSize: "15px",
                color: "#6b7280",
                marginTop: "10px",
                lineHeight: "1.6",
              }}
            >
              {sc.description}
            </p>

            {/* BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStart(sc);
              }}
              style={{
                marginTop: "18px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "14px",
                border: "none",
                fontWeight: "700",
                fontSize: "16px",
                color: "white",
                cursor: "pointer",
                background: "linear-gradient(135deg, #3b82f6, #a855f7)",
                boxShadow: "0 10px 20px rgba(59,130,246,0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              Start Learning →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;