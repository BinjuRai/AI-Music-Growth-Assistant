import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';

export default function GrowthTrendChart({ history, milestones }) {
  const [timeRange, setTimeRange] = useState('all'); // 'week', 'month', 'all'

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No growth data yet</p>
        <p className="text-sm">Update your progress to see your growth trend!</p>
      </div>
    );
  }

  // Filter data based on time range
  const filterData = () => {
    if (timeRange === 'all') return history;
    
    const now = new Date();
    const daysToShow = timeRange === 'week' ? 7 : 30;
    
    return history.filter(entry => {
      const entryDate = new Date(entry.date);
      const diffDays = (now - entryDate) / (1000 * 60 * 60 * 24);
      return diffDays <= daysToShow;
    });
  };

  const data = filterData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <p className="text-blue-600 text-sm">Followers: {payload[0].value.toLocaleString()}</p>
          <p className="text-pink-600 text-sm">Streams: {payload[1].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Time Range Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTimeRange('week')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            timeRange === 'week'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            timeRange === 'month'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Last 30 Days
        </button>
        <button
          onClick={() => setTimeRange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            timeRange === 'all'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Time
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left"
            stroke="#3b82f6"
            tick={{ fontSize: 12 }}
            label={{ value: 'Followers', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#ec4899"
            tick={{ fontSize: 12 }}
            label={{ value: 'Streams', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          
          {/* Follower Line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="followers"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Followers"
          />
          
          {/* Stream Line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="streams"
            stroke="#ec4899"
            strokeWidth={3}
            dot={{ fill: '#ec4899', r: 4 }}
            activeDot={{ r: 6 }}
            name="Streams"
          />

          {/* Milestone Markers */}
          {milestones && milestones.map((milestone, idx) => {
            const dataPoint = data.find(d => d.date === milestone.date);
            if (dataPoint) {
              return (
                <ReferenceDot
                  key={idx}
                  x={milestone.date}
                  y={dataPoint.followers}
                  yAxisId="left"
                  r={8}
                  fill="#fbbf24"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              );
            }
            return null;
          })}
        </LineChart>
      </ResponsiveContainer>

      {/* Milestones List */}
      {milestones && milestones.length > 0 && (
        <div className="mt-4 bg-yellow-50 rounded-lg p-4">
          <p className="font-semibold text-yellow-900 mb-2">🏆 Milestones Achieved</p>
          <div className="space-y-1">
            {milestones.map((m, idx) => (
              <p key={idx} className="text-sm text-yellow-800">
                {m.date}: {m.description}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}