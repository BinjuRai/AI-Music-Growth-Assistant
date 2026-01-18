// import React, { useState } from "react";
// import api from "../api/axios";

// export default function ArtistOnboarding({ onComplete }) {
//   const [formData, setFormData] = useState({
//     artist_name: "",
//     email: "",
//     genre: "Pop",
//     location: "Kathmandu",
//     current_metrics: { total_followers: 0, monthly_streams: 0, platforms: [] },
//     goals: {
//       target_followers: 5000,
//       target_monthly_streams: 10000,
//       timeline_months: 12,
//     },
//   });

//   const handleSubmit = async () => {
//     try {
//       const response = await api.post("/artists/onboard", formData);
//       onComplete(response.data);
//     } catch (error) {
//       console.error("Onboarding failed:", error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
//       <h2 className="text-3xl font-bold mb-6">
//         Welcome! Let's Get You Started 🎵
//       </h2>

//       <div className="space-y-4">
//         <input
//           type="text"
//           placeholder="Your Artist Name"
//           value={formData.artist_name}
//           onChange={(e) =>
//             setFormData({ ...formData, artist_name: e.target.value })
//           }
//           className="w-full p-3 border rounded"
//         />

//         <input
//           type="email"
//           placeholder="Your Email"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           className="w-full p-3 border rounded"
//         />

//         <select
//           value={formData.genre}
//           onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
//           className="w-full p-3 border rounded"
//         >
//           <option>Pop</option>
//           <option>Folk</option>
//           <option>Rock</option>
//           <option>Hip-Hop</option>
//         </select>

//         <input
//           type="number"
//           placeholder="Current Total Followers"
//           value={formData.current_metrics.total_followers}
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               current_metrics: {
//                 ...formData.current_metrics,
//                 total_followers: parseInt(e.target.value),
//               },
//             })
//           }
//           className="w-full p-3 border rounded"
//         />

//         <input
//           type="number"
//           placeholder="Target Followers (Goal)"
//           value={formData.goals.target_followers}
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               goals: {
//                 ...formData.goals,
//                 target_followers: parseInt(e.target.value),
//               },
//             })
//           }
//           className="w-full p-3 border rounded"
//         />

//         <button
//           onClick={handleSubmit}
//           className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 font-semibold"
//         >
//           Start My Journey! 🚀
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import api from "../api/axios";

export default function ArtistOnboarding({ onComplete, showToast }) {
  const [formData, setFormData] = useState({
    artist_name: "",
    email: "",
    genre: "Pop",
    location: "Kathmandu",
    current_metrics: { total_followers: 0, monthly_streams: 0, platforms: [] },
    goals: {
      target_followers: 5000,
      target_monthly_streams: 10000,
      timeline_months: 12,
    },
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!formData.artist_name || !formData.email) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/artists/onboard", formData);
      showToast(`Welcome ${formData.artist_name}! Your journey begins now! 🎵`, "success");
      setTimeout(() => {
        onComplete(response.data);
      }, 1000);
    } catch (error) {
      console.error("Onboarding failed:", error);
      showToast("Onboarding failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6">
        Welcome! Let's Get You Started 🎵
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Artist Name *"
          value={formData.artist_name}
          onChange={(e) =>
            setFormData({ ...formData, artist_name: e.target.value })
          }
          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
          required
        />

        <input
          type="email"
          placeholder="Your Email *"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
          required
        />

        <select
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
        >
          <option>Pop</option>
          <option>Folk</option>
          <option>Rock</option>
          <option>Hip-Hop</option>
        </select>

        <input
          type="number"
          placeholder="Current Total Followers"
          value={formData.current_metrics.total_followers}
          onChange={(e) =>
            setFormData({
              ...formData,
              current_metrics: {
                ...formData.current_metrics,
                total_followers: parseInt(e.target.value) || 0,
              },
            })
          }
          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
        />

        <input
          type="number"
          placeholder="Target Followers (Goal)"
          value={formData.goals.target_followers}
          onChange={(e) =>
            setFormData({
              ...formData,
              goals: {
                ...formData.goals,
                target_followers: parseInt(e.target.value) || 5000,
              },
            })
          }
          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-lg hover:from-green-600 hover:to-emerald-600 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating your profile..." : "Start My Journey! 🚀"}
        </button>
      </div>
    </div>
  );
}