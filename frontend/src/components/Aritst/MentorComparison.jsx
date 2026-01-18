import React from 'react';

export default function MentorComparison({ mentor }) {
  if (!mentor) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 backdrop-blur rounded-2xl shadow-lg p-6 border-2 border-white">
      <h3 className="text-xl font-bold mb-4 text-gray-800">🌟 Learn from Success</h3>
      
      <div className="bg-white rounded-xl p-5 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white text-2xl font-bold">
            {mentor.mentor_name?.charAt(0) || '?'}
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-800">{mentor.mentor_name}</h4>
            <p className="text-sm text-gray-600">{mentor.mentor_genre} Artist</p>
            <p className="text-xs text-purple-600 font-semibold mt-1">
              Your Matched Mentor
            </p>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-purple-900 font-semibold mb-2">📊 Current Stats:</p>
          <p className="text-2xl font-bold text-purple-700">
            {mentor.mentor_current_followers?.toLocaleString()} followers
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-4">
          <p className="text-sm font-semibold text-indigo-900 mb-2">💡 Insight:</p>
          <p className="text-sm text-indigo-800">{mentor.comparison}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-600 mb-3">Compare Your Progress:</p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">You</span>
              <span className="font-semibold text-blue-600">{mentor.your_followers?.toLocaleString()} followers</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                style={{ width: `${Math.min((mentor.your_followers / mentor.mentor_current_followers) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{mentor.mentor_name}</span>
              <span className="font-semibold text-purple-600">{mentor.mentor_current_followers?.toLocaleString()} followers</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-full"></div>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Keep following the recommendations to reach their level! 🚀
        </p>
      </div>
    </div>
  );
}

