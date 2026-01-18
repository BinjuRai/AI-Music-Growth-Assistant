// import React, { useState } from 'react';
// import api from '../../api/axios';

// export default function ProgressUpdateModal({ artistId, onClose, onUpdate }) {
//   const [metrics, setMetrics] = useState({
//     followers: 0,
//     streams: 0,
//     engagement_rate: 0,
//     new_listeners: 0
//   });
//   const [notes, setNotes] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const response = await api.post(`/artists/${artistId}/track-progress`, {
//         metrics,
//         notes
//       });

//       // Show milestones if any
//       if (response.data.milestones_hit && response.data.milestones_hit.length > 0) {
//         const milestoneText = response.data.milestones_hit.map(m => m.description).join('\n');
//         alert(`🎉 Congratulations! You hit milestones:\n\n${milestoneText}`);
//       } else {
//         alert('✅ Progress updated successfully!');
//       }

//       if (onUpdate) onUpdate();
//       onClose();
//     } catch (error) {
//       console.error('Failed to update progress:', error);
//       alert('Failed to update progress. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">📊 Update Your Progress</h2>
//         <p className="text-sm text-gray-600 mb-6">
//           Track your latest metrics to see your growth and unlock insights!
//         </p>

//         <div className="space-y-4 mb-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Total Followers
//             </label>
//             <input
//               type="number"
//               value={metrics.followers}
//               onChange={(e) => setMetrics({...metrics, followers: parseInt(e.target.value) || 0})}
//               className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
//               placeholder="e.g., 1500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Monthly Streams
//             </label>
//             <input
//               type="number"
//               value={metrics.streams}
//               onChange={(e) => setMetrics({...metrics, streams: parseInt(e.target.value) || 0})}
//               className="w-full p-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none"
//               placeholder="e.g., 8000"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Engagement Rate (%)
//             </label>
//             <input
//               type="number"
//               step="0.1"
//               value={metrics.engagement_rate}
//               onChange={(e) => setMetrics({...metrics, engagement_rate: parseFloat(e.target.value) || 0})}
//               className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
//               placeholder="e.g., 12.5"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               (Likes + Comments + Shares) / Total Followers × 100
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               New Listeners (This Month)
//             </label>
//             <input
//               type="number"
//               value={metrics.new_listeners}
//               onChange={(e) => setMetrics({...metrics, new_listeners: parseInt(e.target.value) || 0})}
//               className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
//               placeholder="e.g., 250"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Notes (Optional)
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
//               rows="3"
//               placeholder="e.g., Released new single, performed at local cafe..."
//             ></textarea>
//           </div>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition font-semibold disabled:opacity-50"
//           >
//             {loading ? 'Saving...' : '✨ Save Progress'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import api from "../../api/axios";

export default function ProgressUpdateModal({
  artistId,
  onClose,
  onUpdate,
  showToast,
}) {
  const [metrics, setMetrics] = useState({
    followers: 0,
    streams: 0,
    engagement_rate: 0,
    new_listeners: 0,
  });
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (metrics.followers === 0 && metrics.streams === 0) {
      showToast("Please enter at least followers or streams data", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/artists/${artistId}/track-progress`, {
        metrics,
        notes,
      });

      // Show success message
      showToast("Progress saved successfully! 📊", "success");

      // Show milestones if any
      if (
        response.data.milestones_hit &&
        response.data.milestones_hit.length > 0
      ) {
        setTimeout(() => {
          response.data.milestones_hit.forEach((milestone) => {
            showToast(milestone.description, "milestone");
          });
        }, 1000);
      }

      setTimeout(() => {
        if (onUpdate) onUpdate();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to update progress:", error);
      showToast("Failed to update progress. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          📊 Update Your Progress
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Track your latest metrics to see your growth and unlock insights!
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Followers
            </label>
            <input
              type="number"
              value={metrics.followers}
              onChange={(e) =>
                setMetrics({
                  ...metrics,
                  followers: parseInt(e.target.value) || 0,
                })
              }
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="e.g., 1500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Monthly Streams
            </label>
            <input
              type="number"
              value={metrics.streams}
              onChange={(e) =>
                setMetrics({
                  ...metrics,
                  streams: parseInt(e.target.value) || 0,
                })
              }
              className="w-full p-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none"
              placeholder="e.g., 8000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Engagement Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={metrics.engagement_rate}
              onChange={(e) =>
                setMetrics({
                  ...metrics,
                  engagement_rate: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
              placeholder="e.g., 12.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              (Likes + Comments + Shares) / Total Followers × 100
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Listeners (This Month)
            </label>
            <input
              type="number"
              value={metrics.new_listeners}
              onChange={(e) =>
                setMetrics({
                  ...metrics,
                  new_listeners: parseInt(e.target.value) || 0,
                })
              }
              className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="e.g., 250"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
              rows="3"
              placeholder="e.g., Released new single, performed at local cafe..."
            ></textarea>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Saving..." : "✨ Save Progress"}
          </button>
        </div>
      </div>
    </div>
  );
}
