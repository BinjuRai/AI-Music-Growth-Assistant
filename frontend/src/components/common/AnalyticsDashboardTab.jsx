import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Music, TrendingUp, Heart, Users, MessageCircle, Award } from 'lucide-react';

// Mock data - replace with your actual analysis data
const mockAnalysis = {
  segment_percentages: {
    Superfans: 0.35,
    "Casual Listeners": 0.45,
    "One-time Listeners": 0.20
  },
  listener_segments: {
    superfans: 350,
    casual: 450,
    onetime: 200
  },
  sentiment_analysis: {
    positive: 650,
    neutral: 250,
    negative: 100
  },
  cluster_statistics: {
    engagement_score: { "0": 8.5, "1": 6.2, "2": 3.1 },
    loyalty_score: { "0": 9.1, "1": 5.8, "2": 2.4 },
    total_streams: { "0": 15420, "1": 8930, "2": 3200 },
    count: { "0": 350, "1": 450, "2": 200 }
  },
  recommendations: [
    { type: "Engagement", priority: "high", text: "Focus on superfans with exclusive content and early releases" },
    { type: "Growth", priority: "medium", text: "Convert casual listeners through personalized playlists" },
    { type: "Retention", priority: "high", text: "Create weekly content to maintain listener engagement" }
  ],
  key_insights: [
    "35% of your audience are superfans - nurture this segment",
    "Positive sentiment is strong at 65% - capitalize on this momentum",
    "Cluster 0 shows highest engagement - focus marketing here"
  ],
  silhouette_score: 0.742
};

const PASTEL_COLORS = {
  pink: '#FFB6D9',
  lavender: '#D4BAFF',
  peach: '#FFDAB9',
  mint: '#B5EAD7',
  blue: '#C7CEEA',
  rose: '#FFD1DC'
};

const SEGMENT_COLORS = [PASTEL_COLORS.mint, PASTEL_COLORS.lavender, PASTEL_COLORS.pink];

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
        fill="#4a5568"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={13}
        fontWeight="600"
      >
        {pct > 0 ? `${pct.toFixed(0)}%` : ""}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={100}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} listeners`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

const SentimentChart = ({ sentimentAnalysis }) => {
  if (!sentimentAnalysis) return null;

  const data = [
    { name: "Positive", value: sentimentAnalysis.positive || 0, fill: PASTEL_COLORS.mint },
    { name: "Neutral", value: sentimentAnalysis.neutral || 0, fill: PASTEL_COLORS.peach },
    { name: "Negative", value: sentimentAnalysis.negative || 0, fill: PASTEL_COLORS.pink },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis allowDecimals={false} stroke="#6b7280" />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const RecommendationCard = ({ recommendations }) => {
  const priorityStyles = {
    high: `border-l-4 border-pink-400 bg-gradient-to-r from-pink-50 to-rose-50`,
    medium: `border-l-4 border-purple-400 bg-gradient-to-r from-purple-50 to-lavender-50`,
    low: `border-l-4 border-blue-300 bg-gradient-to-r from-blue-50 to-sky-50`
  };

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      {recommendations.map((rec, idx) => (
        <div
          key={idx}
          className={`rounded-xl px-5 py-4 shadow-sm ${priorityStyles[rec.priority] || priorityStyles.low}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
              <Music size={14} />
              {rec.type}
            </span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              rec.priority === 'high' ? 'bg-pink-200 text-pink-800' :
              rec.priority === 'medium' ? 'bg-purple-200 text-purple-800' :
              'bg-blue-200 text-blue-800'
            }`}>
              {rec.priority.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{rec.text}</p>
        </div>
      ))}
    </div>
  );
};

const InsightsPanel = ({ insights, silhouetteScore }) => {
  if (!insights) return null;

  return (
    <div className="space-y-4">
      {insights.map((insight, idx) => (
        <div key={idx} className="flex gap-3 items-start bg-gradient-to-r from-lavender-50 to-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="mt-0.5 bg-purple-200 rounded-full p-1.5">
            <Award size={16} className="text-purple-600" />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed flex-1">{insight}</p>
        </div>
      ))}
      <div className="mt-4 p-4 bg-gradient-to-r from-mint-50 to-emerald-50 rounded-xl border border-emerald-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Model Quality Score</span>
          <span className="text-lg font-bold text-emerald-600">
            {typeof silhouetteScore === "number" ? silhouetteScore.toFixed(3) : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

const SegmentPerformanceTable = ({ clusterStatsRows, bestSegment }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b-2 border-purple-200">
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Cluster</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Avg Streams</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Engagement</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Loyalty</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Listeners</th>
          </tr>
        </thead>
        <tbody>
          {clusterStatsRows.map((row) => {
            const isBest = bestSegment && row.clusterKey === bestSegment.clusterKey;
            return (
              <tr
                key={row.clusterKey}
                className={`border-b border-gray-100 transition ${
                  isBest
                    ? "bg-gradient-to-r from-mint-50 to-emerald-50"
                    : "hover:bg-purple-50"
                }`}
              >
                <td className="py-3 px-4 font-medium text-gray-800">
                  Cluster {row.clusterKey}
                  {isBest && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      ⭐ Top Performing
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-700">{row.streams.toLocaleString()}</td>
                <td className="py-3 px-4 text-gray-700">{row.engagement.toFixed(1)}</td>
                <td className="py-3 px-4 text-gray-700">{row.loyalty.toFixed(1)}</td>
                <td className="py-3 px-4 text-gray-700">{row.count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCard, setSelectedCard] = useState(null);
  
  // Use mock data - replace with props.analysis in your actual app
  const analysis = mockAnalysis;

  const segmentPercentagesLabeled = analysis?.segment_percentages || {};
  
  const clusterStatsRows = analysis?.cluster_statistics
    ? Object.entries(analysis.cluster_statistics.engagement_score || {}).map(
        ([clusterKey]) => {
          const engagement = analysis.cluster_statistics.engagement_score[clusterKey];
          const loyalty = analysis.cluster_statistics.loyalty_score[clusterKey];
          const streams = analysis.cluster_statistics.total_streams[clusterKey];
          const count = analysis.cluster_statistics.count[clusterKey];
          return { clusterKey, engagement, loyalty, streams, count };
        }
      )
    : [];

  const bestSegment = clusterStatsRows.length > 0
    ? clusterStatsRows.reduce((best, current) =>
        current.engagement > best.engagement ? current : best
      )
    : null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'segments', label: 'Listener Segments', icon: Users },
    { id: 'sentiment', label: 'Sentiment', icon: Heart },
    { id: 'recommendations', label: 'Recommendations', icon: MessageCircle },
  ];

  const cards = [
    { 
      id: 'segments', 
      title: 'Listener Segments', 
      icon: Users, 
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },
    { 
      id: 'sentiment', 
      title: 'Audience Sentiment', 
      icon: Heart, 
      color: 'from-pink-400 to-rose-400',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50'
    },
    { 
      id: 'performance', 
      title: 'Segment Performance', 
      icon: TrendingUp, 
      color: 'from-blue-400 to-purple-400',
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50'
    },
    { 
      id: 'recommendations', 
      title: 'Growth Strategy', 
      icon: MessageCircle, 
      color: 'from-emerald-400 to-teal-400',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab - Grid Cards */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card.id)}
                className={`${card.bgColor} rounded-2xl shadow-lg p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl border border-white`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`bg-gradient-to-br ${card.color} p-3 rounded-xl shadow-md`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{card.title}</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Click to explore detailed {card.title.toLowerCase()} analytics
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Segments Tab */}
      {activeTab === 'segments' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-3 rounded-xl">
              <Users className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Listener Segments Distribution
            </h2>
          </div>
          <SegmentChart 
            listenerSegments={analysis.listener_segments}
            segmentPercentages={segmentPercentagesLabeled}
          />
        </div>
      )}

      {/* Sentiment Tab */}
      {activeTab === 'sentiment' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-pink-400 to-rose-400 p-3 rounded-xl">
              <Heart className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Audience Sentiment Analysis
            </h2>
          </div>
          <SentimentChart sentimentAnalysis={analysis.sentiment_analysis} />
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-400 p-3 rounded-xl">
                <MessageCircle className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Growth Recommendations
              </h2>
            </div>
            <RecommendationCard recommendations={analysis.recommendations} />
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-400 to-blue-400 p-3 rounded-xl">
                <Award className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Key Insights
              </h2>
            </div>
            <InsightsPanel 
              insights={analysis.key_insights}
              silhouetteScore={analysis.silhouette_score}
            />
          </div>
        </div>
      )}

      {/* Selected Card Detail View */}
      {selectedCard && activeTab === 'overview' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {cards.find(c => c.id === selectedCard)?.title}
            </h2>
            <button
              onClick={() => setSelectedCard(null)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-700 transition"
            >
              Close
            </button>
          </div>

          {selectedCard === 'segments' && (
            <SegmentChart 
              listenerSegments={analysis.listener_segments}
              segmentPercentages={segmentPercentagesLabeled}
            />
          )}

          {selectedCard === 'sentiment' && (
            <SentimentChart sentimentAnalysis={analysis.sentiment_analysis} />
          )}

          {selectedCard === 'performance' && (
            <SegmentPerformanceTable 
              clusterStatsRows={clusterStatsRows}
              bestSegment={bestSegment}
            />
          )}

          {selectedCard === 'recommendations' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecommendationCard recommendations={analysis.recommendations} />
              <InsightsPanel 
                insights={analysis.key_insights}
                silhouetteScore={analysis.silhouette_score}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}