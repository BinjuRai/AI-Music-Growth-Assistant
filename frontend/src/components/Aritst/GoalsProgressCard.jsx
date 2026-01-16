import React from 'react';

export default function GoalsProgressCard({ artist, currentMetrics, daysToGoal, growthRate, onUpdateGoals }) {
  const followerProgress = currentMetrics.followers || 0;
  const followerGoal = artist.goals.target_followers;
  const followerPercentage = Math.min((followerProgress / followerGoal) * 100, 100);

  const streamProgress = currentMetrics.streams || 0;
  const streamGoal = artist.goals.target_monthly_streams;
  const streamPercentage = Math.min((streamProgress / streamGoal) * 100, 100);

  const isGoalAchieved = followerPercentage >= 100 && streamPercentage >= 100;

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-white h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">🎯 Your Goals</h3>
        {isGoalAchieved && (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
            🎉 Achieved!
          </span>
        )}
      </div>

      {/* Followers Goal */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-gray-700">Followers</span>
          <span className="text-gray-600">{followerProgress.toLocaleString()} / {followerGoal.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${followerPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{followerPercentage.toFixed(1)}% complete</p>
      </div>

      {/* Streams Goal */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-gray-700">Monthly Streams</span>
          <span className="text-gray-600">{streamProgress.toLocaleString()} / {streamGoal.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${streamPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{streamPercentage.toFixed(1)}% complete</p>
      </div>

      {/* Growth Rate Info */}
      {growthRate && (
        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-purple-900 mb-2">📊 Your Growth Rate</p>
          <div className="space-y-1 text-sm text-purple-800">
            <p>+{growthRate.followers_per_week} followers/week</p>
            <p>+{growthRate.streams_per_week} streams/week</p>
          </div>
        </div>
      )}

      {/* Days to Goal */}
      {daysToGoal !== null && daysToGoal > 0 && !isGoalAchieved && (
        <div className="bg-indigo-50 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-indigo-900">⏱️ Estimated Time to Goal</p>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{daysToGoal} days</p>
          <p className="text-xs text-indigo-600 mt-1">Based on current growth rate</p>
        </div>
      )}

      {/* Update Goals Button */}
      <button
        onClick={onUpdateGoals}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isGoalAchieved
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        {isGoalAchieved ? '🎊 Set New Goals' : '✏️ Update Goals'}
      </button>
    </div>
  );
}