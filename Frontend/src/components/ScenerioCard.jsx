import React from 'react';

const ScenerioCard = ({ title, description, onStart }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 hover:scale-105 transition transform">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        onClick={onStart}
      >
        Start Scenario
      </button>
    </div>
  );
};

export default ScenerioCard;