import React from 'react';

export default function MetricsGrid({ currentMetrics, growthRate }) {
  const metrics = [
    {
      label: 'Total Followers',
      value: currentMetrics.followers?.toLocaleString() || '0',
      change: growthRate?.followers_per_week ? `+${growthRate.followers_per_week}/week` : 'No data',
      icon: '👥',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      label: 'Monthly Streams',
      value: currentMetrics.streams?.toLocaleString() || '0',
      change: growthRate?.streams_per_week ? `+${growthRate.streams_per_week}/week` : 'No data',
      icon: '🎵',
      color: 'from-pink-500 to-purple-500',
      bgColor: 'from-pink-50 to-purple-50'
    },
    {
      label: 'Engagement Rate',
      value: currentMetrics.engagement_rate 
        ? `${(currentMetrics.engagement_rate * 100).toFixed(1)}%` 
        : '0%',
      change: currentMetrics.engagement_rate > 0.1 ? 'Excellent!' : 'Keep growing',
      icon: '💬',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      label: 'New Listeners',
      value: currentMetrics.new_listeners?.toLocaleString() || '0',
      change: 'This month',
      icon: '✨',
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'from-orange-50 to-yellow-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-br ${metric.bgColor} rounded-2xl p-5 border-2 border-white shadow-md hover:shadow-lg transition`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-2xl shadow-md`}>
              {metric.icon}
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded-full">
              {metric.change}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
          <p className="text-3xl font-bold text-gray-800">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}
