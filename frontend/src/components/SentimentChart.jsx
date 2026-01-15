import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SentimentChart = ({ sentimentAnalysis }) => {
  if (!sentimentAnalysis) return null;

  const data = [
    { name: "Positive", value: sentimentAnalysis.positive || 0 },
    { name: "Neutral", value: sentimentAnalysis.neutral || 0 },
    { name: "Negative", value: sentimentAnalysis.negative || 0 },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">Audience Sentiment</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;
