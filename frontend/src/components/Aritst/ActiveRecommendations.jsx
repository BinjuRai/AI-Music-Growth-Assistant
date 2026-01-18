import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function ActiveRecommendations({ artistId, onUpdate }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [artistId]);

  const fetchRecommendations = async () => {
    try {
      const res = await api.get(`/artists/${artistId}/growth-dashboard`);
      setRecommendations(res.data.recommendations || []);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleStatusChange = async (recId, newStatus, effectiveness = null) => {
  //   try {
  //     await api.patch(`/recommendations/${recId}/update-status`, {
  //       status: newStatus,
  //       effectiveness_score: effectiveness
  //     });

  //     // Refresh
  //     await fetchRecommendations();
  //     if (onUpdate) onUpdate();
  //   } catch (error) {
  //     console.error('Failed to update status:', error);
  //   }
  // };

  const handleStatusChange = async (recId, newStatus, effectiveness = null) => {
    try {
      await api.patch(`/recommendations/${recId}/update-status`, {
        status: newStatus,
        effectiveness_score: effectiveness,
      });

      if (newStatus === "completed") {
        showToast("Recommendation completed! Great work! ✅", "success");
      } else if (newStatus === "in_progress") {
        showToast("Recommendation started! Keep it up! ⏳", "info");
      }

      await fetchRecommendations();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast("Failed to update recommendation status", "error");
    }
  };
  const getPriorityColor = (priority) => {
    const colors = {
      critical: "border-red-500 bg-red-50",
      high: "border-blue-500 bg-blue-50",
      medium: "border-yellow-500 bg-yellow-50",
      low: "border-gray-500 bg-gray-50",
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      critical: "bg-red-500 text-white",
      high: "bg-blue-500 text-white",
      medium: "bg-yellow-500 text-white",
      low: "bg-gray-500 text-white",
    };
    return badges[priority] || badges.medium;
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-white">
        <p className="text-center text-gray-500">Loading recommendations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-white">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        📋 Active Recommendations
      </h3>

      {recommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">🎉 All caught up!</p>
          <p className="text-sm">
            You've completed all recommendations. Keep up the great work!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec._id}
              className={`rounded-xl p-4 border-l-4 ${getPriorityColor(rec.priority)} transition hover:shadow-md`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800">{rec.title}</h4>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(rec.priority)}`}
                >
                  {rec.priority.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3">{rec.description}</p>

              <div className="bg-white rounded-lg p-3 mb-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  Action Steps:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-gray-700">
                  {rec.action_steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <p className="text-xs text-green-700 font-semibold mb-3">
                💡 {rec.expected_impact}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(rec._id, "in_progress")}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
                >
                  ⏳ Start
                </button>
                <button
                  onClick={() => handleStatusChange(rec._id, "completed", 8)}
                  className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-semibold"
                >
                  ✅ Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
