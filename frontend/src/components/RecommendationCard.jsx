import React from "react";

const priorityStyles = {
  high: "border-blue-500 bg-blue-50",
  medium: "border-yellow-500 bg-yellow-50",
  low: "border-gray-300 bg-gray-50"
};

const RecommendationCard = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">📊 Personalized Recommendations</h3>
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`border-l-4 rounded-lg px-4 py-3 ${priorityStyles[rec.priority] || priorityStyles.low}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                {rec.type}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                Priority: {rec.priority.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-800">{rec.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCard;

