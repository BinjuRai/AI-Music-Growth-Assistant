import React from "react";

const InsightsPanel = ({ insights, silhouetteScore }) => {
  if (!insights) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-3">💡 Key Insights</h3>
      <ul className="list-disc list-inside text-sm text-gray-800 space-y-1 mb-3">
        {insights.map((insight, idx) => (
          <li key={idx}>{insight}</li>
        ))}
      </ul>
      <div className="text-xs text-gray-500 mt-2">
        Model Quality Score (Silhouette):{" "}
        <span className="font-semibold">
          {typeof silhouetteScore === "number" ? silhouetteScore.toFixed(3) : "N/A"}
        </span>
      </div>
    </div>
  );
};

export default InsightsPanel;

