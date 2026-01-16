import React, { useState } from "react";
import api from "../api/axios";

export default function ProgressTracker({ artistId, onComplete }) {
  const [metrics, setMetrics] = useState({
    followers: 0,
    streams: 0,
    engagement_rate: 0,
    new_listeners: 0,
  });

  const handleSubmit = async () => {
    try {
      await api.post(`/artists/${artistId}/track-progress`, { metrics });
      alert("Progress saved!");
      onComplete();
    } catch (error) {
      console.error("Failed to track progress:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Update Your Progress 📊</h2>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Current Total Followers"
          value={metrics.followers}
          onChange={(e) =>
            setMetrics({ ...metrics, followers: parseInt(e.target.value) })
          }
          className="w-full p-3 border rounded"
        />

        <input
          type="number"
          placeholder="Monthly Streams"
          value={metrics.streams}
          onChange={(e) =>
            setMetrics({ ...metrics, streams: parseInt(e.target.value) })
          }
          className="w-full p-3 border rounded"
        />

        <input
          type="number"
          placeholder="New Listeners This Month"
          value={metrics.new_listeners}
          onChange={(e) =>
            setMetrics({ ...metrics, new_listeners: parseInt(e.target.value) })
          }
          className="w-full p-3 border rounded"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-semibold"
        >
          Save Progress
        </button>
      </div>
    </div>
  );
}
