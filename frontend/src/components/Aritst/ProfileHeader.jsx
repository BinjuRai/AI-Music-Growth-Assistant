import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileHeader({ artist, daysSinceOnboarding, status }) {
  const navigate = useNavigate();

  const statusConfig = {
    onboarding: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', text: '🌱 Getting Started', icon: '🎵' },
    growing: { color: 'bg-blue-100 text-blue-800 border-blue-300', text: '📈 Growing', icon: '🚀' },
    goal_achieved: { color: 'bg-green-100 text-green-800 border-green-300', text: '🎯 Goal Achieved!', icon: '🏆' },
    superstar: { color: 'bg-purple-100 text-purple-800 border-purple-300', text: '⭐ Superstar', icon: '👑' }
  };

  const currentStatus = statusConfig[status] || statusConfig.onboarding;

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={() => navigate('/')}
          className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm font-semibold backdrop-blur"
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-5xl border-4 border-white/30">
              {currentStatus.icon}
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-2">{artist.artist_name}</h1>
              <div className="flex items-center gap-4 text-white/90">
                <span className="text-lg">{artist.genre}</span>
                <span>•</span>
                <span className="text-lg">{artist.location}</span>
                <span>•</span>
                <span className="text-lg">{daysSinceOnboarding} days with us</span>
              </div>
              <p className="text-white/80 text-sm mt-2">
                ✉️ {artist.email}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-4 py-2 rounded-full border-2 ${currentStatus.color} font-semibold`}>
            {currentStatus.text}
          </div>
        </div>
      </div>
    </div>
  );
}