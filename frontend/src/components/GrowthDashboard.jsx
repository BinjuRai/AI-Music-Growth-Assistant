import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function GrowthDashboard({ artistId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
   api.get(`/artists/${artistId}/growth-dashboard`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [artistId]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Growth Journey 🌱</h2>
        
        <div className="mb-4">
          <p className="text-gray-600">Followers Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${data.progress_to_goals.followers.percentage}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">
            {data.progress_to_goals.followers.current} / {data.progress_to_goals.followers.target}
          </p>
        </div>

        <div>
          <p className="text-gray-600">Streams Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="bg-green-600 h-4 rounded-full"
              style={{ width: `${data.progress_to_goals.streams.percentage}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">
            {data.progress_to_goals.streams.current} / {data.progress_to_goals.streams.target}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">📊 Your Personalized Action Plan</h3>
        {data.recommendations.map((rec, idx) => (
          <div key={idx} className="p-4 bg-blue-50 rounded-lg mb-4 border-l-4 border-blue-500">
            <h4 className="text-lg font-bold mb-2">{rec.title}</h4>
            <p className="text-gray-700 mb-3">{rec.description}</p>
            <div className="bg-white rounded p-3">
              <p className="font-semibold text-sm mb-2">Action Steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                {rec.action_steps.map((step, i) => (
                  <li key={i} className="text-sm">{step}</li>
                ))}
              </ol>
            </div>
            <p className="text-sm text-green-700 font-semibold mt-3">
              💡 {rec.expected_impact}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}