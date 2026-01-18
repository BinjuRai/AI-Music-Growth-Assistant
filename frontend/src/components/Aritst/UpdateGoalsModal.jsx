// import React, { useState } from 'react';
// import api from '../../api/axios';

// export default function UpdateGoalsModal({ artistId, currentGoals, onClose, onUpdate }) {
//   const [newGoals, setNewGoals] = useState({
//     target_followers: currentGoals.target_followers,
//     target_monthly_streams: currentGoals.target_monthly_streams,
//     timeline_months: currentGoals.timeline_months
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await api.put(`/artists/${artistId}/update-goals`, newGoals);
//       alert('🎉 Goals updated successfully!');
//       if (onUpdate) onUpdate();
//       onClose();
//     } catch (error) {
//       console.error('Failed to update goals:', error);
//       alert('Failed to update goals. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">🎯 Update Your Goals</h2>

//         <div className="space-y-4 mb-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Target Followers
//             </label>
//             <input
//               type="number"
//               value={newGoals.target_followers}
//               onChange={(e) => setNewGoals({...newGoals, target_followers: parseInt(e.target.value)})}
//               className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
//               placeholder="e.g., 10000"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Target Monthly Streams
//             </label>
//             <input
//               type="number"
//               value={newGoals.target_monthly_streams}
//               onChange={(e) => setNewGoals({...newGoals, target_monthly_streams: parseInt(e.target.value)})}
//               className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
//               placeholder="e.g., 50000"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Timeline (Months)
//             </label>
//             <select
//               value={newGoals.timeline_months}
//               onChange={(e) => setNewGoals({...newGoals, timeline_months: parseInt(e.target.value)})}
//               className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
//             >
//               <option value="6">6 months</option>
//               <option value="12">12 months (1 year)</option>
//               <option value="18">18 months</option>
//               <option value="24">24 months (2 years)</option>
//             </select>
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
//             className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-semibold disabled:opacity-50"
//           >
//             {loading ? 'Updating...' : '✨ Update Goals'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import api from "../../api/axios";

export default function UpdateGoalsModal({
  artistId,
  currentGoals,
  onClose,
  onUpdate,
  showToast,
}) {
  const [newGoals, setNewGoals] = useState({
    target_followers: currentGoals.target_followers,
    target_monthly_streams: currentGoals.target_monthly_streams,
    timeline_months: currentGoals.timeline_months,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.put(`/artists/${artistId}/update-goals`, newGoals);
      showToast(
        "Goals updated successfully! Keep pushing forward! 🎯",
        "success",
      );
      setTimeout(() => {
        if (onUpdate) onUpdate();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Failed to update goals:", error);
      showToast("Failed to update goals. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          🎯 Update Your Goals
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Followers
            </label>
            <input
              type="number"
              value={newGoals.target_followers}
              onChange={(e) =>
                setNewGoals({
                  ...newGoals,
                  target_followers: parseInt(e.target.value),
                })
              }
              className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="e.g., 10000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Monthly Streams
            </label>
            <input
              type="number"
              value={newGoals.target_monthly_streams}
              onChange={(e) =>
                setNewGoals({
                  ...newGoals,
                  target_monthly_streams: parseInt(e.target.value),
                })
              }
              className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="e.g., 50000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Timeline (Months)
            </label>
            <select
              value={newGoals.timeline_months}
              onChange={(e) =>
                setNewGoals({
                  ...newGoals,
                  timeline_months: parseInt(e.target.value),
                })
              }
              className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="6">6 months</option>
              <option value="12">12 months (1 year)</option>
              <option value="18">18 months</option>
              <option value="24">24 months (2 years)</option>
            </select>
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
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Updating..." : "✨ Update Goals"}
          </button>
        </div>
      </div>
    </div>
  );
}
