import React, { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Heart, Users, BarChart3, Brain } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PASTEL_COLORS = {
  pink: '#FFB6D9',
  lavender: '#D4BAFF',
  peach: '#FFDAB9',
  mint: '#B5EAD7',
  blue: '#C7CEEA',
  rose: '#FFD1DC',
  purple: '#E6D5FF',
  teal: '#B0E0E6'
};

const EMOTION_COLORS = {
  joy: PASTEL_COLORS.mint,
  love: PASTEL_COLORS.pink,
  surprise: PASTEL_COLORS.peach,
  sadness: PASTEL_COLORS.blue,
  anger: PASTEL_COLORS.rose,
  fear: PASTEL_COLORS.lavender
};

// Mock data for demonstration
const mockClusteringData = {
  models_compared: ['kmeans', 'gmm', 'hierarchical', 'dbscan'],
  results: {
    kmeans: {
      name: 'K-Means (Current)',
      metrics: {
        silhouette_score: 0.742,
        davies_bouldin_score: 0.523,
        calinski_harabasz_score: 487.3
      }
    },
    gmm: {
      name: 'Gaussian Mixture Model',
      metrics: {
        silhouette_score: 0.768,
        davies_bouldin_score: 0.491,
        calinski_harabasz_score: 512.1
      }
    },
    hierarchical: {
      name: 'Hierarchical Clustering',
      metrics: {
        silhouette_score: 0.701,
        davies_bouldin_score: 0.587,
        calinski_harabasz_score: 445.7
      }
    },
    dbscan: {
      name: 'DBSCAN (Density-Based)',
      metrics: {
        silhouette_score: 0.612,
        davies_bouldin_score: null,
        calinski_harabasz_score: 398.2
      }
    }
  },
  best_model: {
    best_model: 'gmm',
    best_silhouette_score: 0.768
  }
};

const mockChurnData = {
  risk_segments: {
    high_risk: {
      count: 45,
      percentage: '15.0%',
      listeners: [
        { listener_id: 'L001', churn_risk_score: 0.89, days_since_last_stream: 45 },
        { listener_id: 'L002', churn_risk_score: 0.82, days_since_last_stream: 38 }
      ]
    },
    medium_risk: {
      count: 98,
      percentage: '32.7%'
    },
    low_risk: {
      count: 157,
      percentage: '52.3%'
    }
  },
  recommendations: [
    {
      priority: 'urgent',
      target: 'High-risk listeners',
      action: 'Immediate re-engagement campaign for 45 listeners',
      tactics: [
        'Send personalized "We miss you" message',
        'Offer exclusive preview of upcoming release',
        'Create custom playlist based on their history'
      ]
    },
    {
      priority: 'high',
      target: 'Medium-risk listeners',
      action: 'Preventive engagement for 98 listeners',
      tactics: [
        'Invite to live sessions or Q&A',
        'Share behind-the-scenes content'
      ]
    }
  ]
};

const mockEmotionData = {
  emotion_distribution: {
    joy: { average_intensity: 0.82, count: 450, percentage: '45.0%' },
    love: { average_intensity: 0.76, count: 250, percentage: '25.0%' },
    surprise: { average_intensity: 0.54, count: 120, percentage: '12.0%' },
    sadness: { average_intensity: 0.42, count: 80, percentage: '8.0%' },
    anger: { average_intensity: 0.38, count: 50, percentage: '5.0%' },
    fear: { average_intensity: 0.31, count: 50, percentage: '5.0%' }
  },
  dominant_emotion: {
    emotion: 'joy',
    percentage: '45.0%',
    intensity: 0.82
  },
  insights: [
    {
      type: 'positive_connection',
      message: 'Strong emotional connection: 70% express joy or love',
      action: 'Leverage this emotional bond in fan engagement campaigns'
    },
    {
      type: 'viral_potential',
      message: '12% express surprise - indicates unexpected impact',
      action: 'Content is generating buzz - amplify reach now'
    }
  ]
};

const ClusteringComparison = ({ data = mockClusteringData }) => {
  const chartData = Object.entries(data.results).map(([key, value]) => ({
    name: value.name.split(' ')[0],
    fullName: value.name,
    silhouette: value.metrics.silhouette_score || 0,
    davies_bouldin: value.metrics.davies_bouldin_score || 0,
    calinski: value.metrics.calinski_harabasz_score || 0
  }));

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-3 rounded-xl">
          <BarChart3 className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Clustering Algorithm Comparison
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Validating K-Means against alternative approaches
          </p>
        </div>
      </div>

      {/* Metrics Bar Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="silhouette" fill={PASTEL_COLORS.mint} name="Silhouette Score ↑" radius={[8, 8, 0, 0]} />
            <Bar dataKey="calinski" fill={PASTEL_COLORS.lavender} name="Calinski-Harabasz ↑" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b-2 border-purple-200">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Algorithm</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Silhouette ↑</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Davies-Bouldin ↓</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.results).map(([key, value]) => {
              const isBest = key === data.best_model.best_model;
              const isCurrent = key === 'kmeans';
              
              return (
                <tr key={key} className={`border-b border-gray-100 ${isBest ? 'bg-gradient-to-r from-mint-50 to-emerald-50' : 'hover:bg-purple-50'}`}>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {value.name}
                    {isCurrent && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                        Primary
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {value.metrics.silhouette_score?.toFixed(3) || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {value.metrics.davies_bouldin_score?.toFixed(3) || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {isBest && (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        ⭐ Highest Score
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Insight Box */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <p className="text-sm text-gray-700">
          <strong className="text-purple-700">Thesis Insight:</strong> While {data.best_model.best_model.toUpperCase()} 
          achieved the highest silhouette score ({data.best_model.best_silhouette_score.toFixed(3)}), 
          K-Means remains the primary algorithm due to its interpretability and computational efficiency (score: {data.results.kmeans.metrics.silhouette_score.toFixed(3)}).
        </p>
      </div>
    </div>
  );
};

const ChurnPrediction = ({ data = mockChurnData }) => {
  const riskData = [
    { name: 'High Risk', value: parseInt(data.risk_segments.high_risk.count), fill: PASTEL_COLORS.rose },
    { name: 'Medium Risk', value: parseInt(data.risk_segments.medium_risk.count), fill: PASTEL_COLORS.peach },
    { name: 'Low Risk', value: parseInt(data.risk_segments.low_risk.count), fill: PASTEL_COLORS.mint }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-rose-400 to-pink-400 p-3 rounded-xl">
          <AlertTriangle className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Listener Churn Prediction
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Predictive model for listener retention
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Stats Cards */}
        <div className="space-y-4">
          {[
            { level: 'High Risk', data: data.risk_segments.high_risk, color: 'rose', icon: '🚨' },
            { level: 'Medium Risk', data: data.risk_segments.medium_risk, color: 'orange', icon: '⚠️' },
            { level: 'Low Risk', data: data.risk_segments.low_risk, color: 'green', icon: '✅' }
          ].map(({ level, data: segmentData, color, icon }) => (
            <div key={level} className={`p-4 rounded-xl bg-gradient-to-r from-${color}-50 to-${color}-100 border border-${color}-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">{icon} {level}</p>
                  <p className="text-2xl font-bold text-gray-800">{segmentData.count} listeners</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-700">{segmentData.percentage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">💡 Retention Strategies</h3>
        {data.recommendations.map((rec, idx) => (
          <div key={idx} className={`p-5 rounded-xl border-l-4 ${
            rec.priority === 'urgent' 
              ? 'bg-rose-50 border-rose-400' 
              : 'bg-orange-50 border-orange-400'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-800">{rec.target}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                rec.priority === 'urgent'
                  ? 'bg-rose-200 text-rose-800'
                  : 'bg-orange-200 text-orange-800'
              }`}>
                {rec.priority.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{rec.action}</p>
            <div className="space-y-1">
              {rec.tactics.map((tactic, i) => (
                <p key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  {tactic}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmotionAnalysis = ({ data = mockEmotionData }) => {
  const emotionChartData = Object.entries(data.emotion_distribution).map(([emotion, details]) => ({
    emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    intensity: details.average_intensity,
    count: details.count,
    percentage: parseFloat(details.percentage)
  }));

  const radarData = emotionChartData.map(item => ({
    emotion: item.emotion,
    score: item.intensity * 100
  }));

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-pink-400 to-rose-400 p-3 rounded-xl">
          <Heart className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Advanced Emotion Analysis
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            6-dimensional emotion detection beyond basic sentiment
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Radar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Emotion Intensity Map</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={PASTEL_COLORS.lavender} />
              <PolarAngleAxis dataKey="emotion" stroke="#6b7280" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
              <Radar name="Intensity" dataKey="score" stroke={PASTEL_COLORS.pink} fill={PASTEL_COLORS.pink} fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Emotion Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emotionChartData}>
              <XAxis dataKey="emotion" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {emotionChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.emotion.toLowerCase()]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dominant Emotion Card */}
      <div className="mb-6 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
        <div className="flex items-center gap-4">
          <div className="text-5xl">
            {data.dominant_emotion.emotion === 'joy' && '😊'}
            {data.dominant_emotion.emotion === 'love' && '❤️'}
            {data.dominant_emotion.emotion === 'surprise' && '😲'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Dominant Emotion</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent capitalize">
              {data.dominant_emotion.emotion}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {data.dominant_emotion.percentage} of audience • Intensity: {(data.dominant_emotion.intensity * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">🎯 Emotional Insights</h3>
        {data.insights.map((insight, idx) => (
          <div key={idx} className="p-4 bg-gradient-to-r from-lavender-50 to-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {insight.type === 'positive_connection' && <Sparkles size={20} className="text-purple-500" />}
                {insight.type === 'viral_potential' && <TrendingUp size={20} className="text-pink-500" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-1">{insight.message}</p>
                <p className="text-sm text-gray-600">💡 {insight.action}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdvancedAnalytics({ artistId }) {
  const [activeFeature, setActiveFeature] = useState('clustering');
  const [loading, setLoading] = useState(false);

  const features = [
    { id: 'clustering', label: 'Clustering Comparison', icon: BarChart3, component: ClusteringComparison },
    { id: 'churn', label: 'Churn Prediction', icon: AlertTriangle, component: ChurnPrediction },
    { id: 'emotions', label: 'Emotion Analysis', icon: Heart, component: EmotionAnalysis }
  ];

  const ActiveComponent = features.find(f => f.id === activeFeature)?.component;

  return (
    <div className="space-y-6">
      {/* Feature Tabs */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white p-2">
        <div className="flex gap-2 overflow-x-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  activeFeature === feature.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                <Icon size={18} />
                {feature.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Content */}
      {ActiveComponent && <ActiveComponent />}

      {/* Thesis Note */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-start gap-3">
          <Brain size={24} className="text-purple-500 mt-1" />
          <div>
            <h3 className="font-bold text-gray-800 mb-2">📚 For Your Thesis</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              These advanced ML techniques demonstrate methodological rigor: <strong>clustering comparison</strong> validates 
              your algorithm choice, <strong>churn prediction</strong> adds predictive capability beyond descriptive analytics, 
              and <strong>emotion analysis</strong> provides multi-dimensional sentiment understanding specifically relevant 
              for emerging female artists' emotional connection with their audience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}