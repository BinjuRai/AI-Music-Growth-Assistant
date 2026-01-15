import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#ef4444"];

const SegmentChart = ({ listenerSegments, segmentPercentages }) => {
  if (!listenerSegments) return null;

  const mapping = {
    Superfans: "superfans",
    "Casual Listeners": "casual",
    "One-time Listeners": "onetime"
  };

  const data = Object.entries(mapping).map(([label, key]) => ({
    name: label,
    value: listenerSegments[key] || 0,
    percentage: segmentPercentages[label] || 0
  }));

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const pct = (data[index].percentage || 0) * 100;

    return (
      <text
        x={x}
        y={y}
        fill="#111827"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {pct > 0 ? `${pct.toFixed(0)}%` : ""}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">Listener Segments Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={90}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} listeners`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SegmentChart;

