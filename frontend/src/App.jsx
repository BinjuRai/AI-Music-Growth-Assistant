// import React, { useEffect, useState } from "react";
// import api from "./api/axios";
// import ArtistSelector from "./components/ArtistSelector";
// import SegmentChart from "./components/SegmentChart";
// import SentimentChart from "./components/SentimentChart";
// import RecommendationCard from "./components/RecommendationCard";
// import InsightsPanel from "./components/InsightsPanel";
// import ArtistOnboarding from './components/ArtistOnboarding';
// import GrowthDashboard from './components/GrowthDashboard';

// function App() {
//   const [artists, setArtists] = useState([]);
//   const [selectedArtist, setSelectedArtist] = useState("");
//   const [analysis, setAnalysis] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [view, setView] = useState('analytics'); // 'analytics' or 'onboarding' or 'growth'
//   const [currentNewArtist, setCurrentNewArtist] = useState(null);

//   useEffect(() => {
//     const fetchArtists = async () => {
//       try {
//         const res = await api.get("/artists");
//         setArtists(res.data);
//       } catch (err) {
//         console.error(err);
//         setError(
//           "Failed to load artists. Please ensure the backend is running."
//         );
//       }
//     };
//     fetchArtists();
//   }, []);

//   const handleAnalyze = async () => {
//     if (!selectedArtist) return;
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.post(`/analyze/${selectedArtist}`);
//       setAnalysis(res.data);
//     } catch (err) {
//       console.error(err);
//       const msg =
//         err?.response?.data?.error ||
//         "Analysis failed. Please try again or check the backend.";
//       setError(msg);
//       setAnalysis(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const segmentPercentagesLabeled = analysis?.segment_percentages
//     ? {
//         Superfans:
//           analysis.segment_percentages["Superfans"] ||
//           analysis.segment_percentages["superfans"] ||
//           0,
//         "Casual Listeners":
//           analysis.segment_percentages["Casual Listeners"] ||
//           analysis.segment_percentages["casual"] ||
//           0,
//         "One-time Listeners":
//           analysis.segment_percentages["One-time Listeners"] ||
//           analysis.segment_percentages["onetime"] ||
//           0,
//       }
//     : {};

//   const clusterStatsRows = analysis?.cluster_statistics
//     ? Object.entries(analysis.cluster_statistics.engagement_score || {}).map(
//         ([clusterKey]) => {
//           const engagement =
//             analysis.cluster_statistics.engagement_score[clusterKey];
//           const loyalty = analysis.cluster_statistics.loyalty_score[clusterKey];
//           const streams = analysis.cluster_statistics.total_streams[clusterKey];
//           const count = analysis.cluster_statistics.count[clusterKey];
//           return {
//             clusterKey,
//             engagement,
//             loyalty,
//             streams,
//             count,
//           };
//         }
//       )
//     : [];

//   const bestSegment =
//     clusterStatsRows.length > 0
//       ? clusterStatsRows.reduce((best, current) =>
//           current.engagement > best.engagement ? current : best
//         )
//       : null;

//   // return (
//   //   <div className="min-h-screen bg-gray-50">
//   //     <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-8 shadow">
//   //       <div className="max-w-6xl mx-auto px-4">
//   //         <h1 className="text-2xl md:text-3xl font-bold">
//   //           AI Music Growth Assistant for Emerging Female Artists
//   //         </h1>
//   //         <p className="text-sm md:text-base text-indigo-100 mt-2">
//   //           Kathmandu Valley, Nepal – Data-driven insights to support sustainable, ethical career
//   //           growth.
//   //         </p>
//   //       </div>
//   //     </header>

//   //     <main className="max-w-6xl mx-auto px-4 py-6">
//   //       <ArtistSelector
//   //         artists={artists}
//   //         selectedArtist={selectedArtist}
//   //         onChange={setSelectedArtist}
//   //         onAnalyze={handleAnalyze}
//   //         loading={loading}
//   //       />

//   //       {error && (
//   //         <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
//   //           {error}
//   //         </div>
//   //       )}

//   //       {analysis && (
//   //         <div className="space-y-6">
//   //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//   //             <SegmentChart
//   //               listenerSegments={analysis.listener_segments}
//   //               segmentPercentages={segmentPercentagesLabeled}
//   //             />
//   //             <SentimentChart sentimentAnalysis={analysis.sentiment_analysis} />
//   //           </div>

//   //           <div className="bg-white rounded-xl shadow p-6">
//   //             <h3 className="text-lg font-semibold mb-4">Segment Performance Metrics</h3>
//   //             <div className="overflow-x-auto">
//   //               <table className="min-w-full text-sm">
//   //                 <thead>
//   //                   <tr className="border-b">
//   //                     <th className="text-left py-2 px-2 font-semibold text-gray-600">Cluster</th>
//   //                     <th className="text-left py-2 px-2 font-semibold text-gray-600">
//   //                       Avg Streams
//   //                     </th>
//   //                     <th className="text-left py-2 px-2 font-semibold text-gray-600">
//   //                       Avg Engagement
//   //                     </th>
//   //                     <th className="text-left py-2 px-2 font-semibold text-gray-600">
//   //                       Avg Loyalty
//   //                     </th>
//   //                     <th className="text-left py-2 px-2 font-semibold text-gray-600">Count</th>
//   //                   </tr>
//   //                 </thead>
//   //                 <tbody>
//   //                   {clusterStatsRows.map((row) => {
//   //                     const isBest = bestSegment && row.clusterKey === bestSegment.clusterKey;
//   //                     return (
//   //                       <tr
//   //                         key={row.clusterKey}
//   //                         className={`border-b last:border-0 ${
//   //                           isBest ? "bg-green-50" : "bg-white"
//   //                         }`}
//   //                       >
//   //                         <td className="py-2 px-2">
//   //                           Cluster {row.clusterKey}
//   //                           {isBest && (
//   //                             <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
//   //                               Best Segment
//   //                             </span>
//   //                           )}
//   //                         </td>
//   //                         <td className="py-2 px-2">{row.streams}</td>
//   //                         <td className="py-2 px-2">{row.engagement}</td>
//   //                         <td className="py-2 px-2">{row.loyalty}</td>
//   //                         <td className="py-2 px-2">{row.count}</td>
//   //                       </tr>
//   //                     );
//   //                   })}
//   //                 </tbody>
//   //               </table>
//   //             </div>
//   //           </div>

//   //           <RecommendationCard recommendations={analysis.recommendations} />
//   //           <InsightsPanel
//   //             insights={analysis.key_insights}
//   //             silhouetteScore={analysis.silhouette_score}
//   //           />
//   //         </div>
//   //       )}

//   //       {!analysis && !loading && (
//   //         <div className="mt-6 text-sm text-gray-600 bg-white rounded-xl shadow p-4">
//   //           Select an artist and run the analysis to see AI-powered listener segmentation, sentiment
//   //           trends, and growth recommendations tailored to emerging female artists in Kathmandu
//   //           Valley.
//   //         </div>
//   //       )}
//   //     </main>
//   //   </div>
//   // );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#fdfbff] via-[#f8f5ff] to-[#fff0f7] text-gray-800">
//       {/* Header */}
//       <header className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-pink-500/30 to-purple-500/30 blur-3xl" />
//         <div className="relative max-w-6xl mx-auto px-6 py-14">
//           <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
//             AI Music Growth Assistant
//           </h1>
//           <p className="mt-3 max-w-2xl text-sm md:text-base text-gray-600">
//             Empowering emerging female artists with ethical, data-driven growth
//             insights.
//           </p>
//           <p className="mt-1 text-xs text-gray-500">Kathmandu Valley, Nepal</p>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-6xl mx-auto px-6 pb-16 space-y-8">
//         {/* Artist Selector */}
//         <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white">
//           <ArtistSelector
//             artists={artists}
//             selectedArtist={selectedArtist}
//             onChange={setSelectedArtist}
//             onAnalyze={handleAnalyze}
//             loading={loading}
//           />
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">
//             {error}
//           </div>
//         )}

//         {/* Analysis Section */}
//         {analysis && (
//           <div className="space-y-8">
//             {/* Charts */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                 <SegmentChart
//                   listenerSegments={analysis.listener_segments}
//                   segmentPercentages={segmentPercentagesLabeled}
//                 />
//               </div>

//               <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                 <SentimentChart
//                   sentimentAnalysis={analysis.sentiment_analysis}
//                 />
//               </div>
//             </div>

//             {/* Segment Metrics */}
//             <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//               <h3 className="text-lg font-semibold mb-4 text-gray-800">
//                 Listener Segment Performance
//               </h3>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                   <thead>
//                     <tr className="border-b text-gray-500">
//                       <th className="py-3 px-2 text-left">Cluster</th>
//                       <th className="py-3 px-2 text-left">Avg Streams</th>
//                       <th className="py-3 px-2 text-left">Engagement</th>
//                       <th className="py-3 px-2 text-left">Loyalty</th>
//                       <th className="py-3 px-2 text-left">Listeners</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {clusterStatsRows.map((row) => {
//                       const isBest =
//                         bestSegment &&
//                         row.clusterKey === bestSegment.clusterKey;

//                       return (
//                         <tr
//                           key={row.clusterKey}
//                           className={`border-b last:border-0 transition ${
//                             isBest
//                               ? "bg-gradient-to-r from-green-50 to-emerald-50"
//                               : "hover:bg-gray-50"
//                           }`}
//                         >
//                           <td className="py-3 px-2 font-medium">
//                             Cluster {row.clusterKey}
//                             {isBest && (
//                               <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
//                                 Top Performing
//                               </span>
//                             )}
//                           </td>
//                           <td className="py-3 px-2">{row.streams}</td>
//                           <td className="py-3 px-2">{row.engagement}</td>
//                           <td className="py-3 px-2">{row.loyalty}</td>
//                           <td className="py-3 px-2">{row.count}</td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Recommendations & Insights */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                 <RecommendationCard
//                   recommendations={analysis.recommendations}
//                 />
//               </div>

//               <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                 <InsightsPanel
//                   insights={analysis.key_insights}
//                   silhouetteScore={analysis.silhouette_score}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Empty State */}
//         {!analysis && !loading && (
//           <div className="rounded-2xl bg-white/70 backdrop-blur shadow-md p-6 border border-white text-center text-sm text-gray-600">
//             🎵 Select an artist and run the analysis to explore listener
//             segments, emotional sentiment, and AI-powered growth strategies
//             crafted for emerging female musicians.
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;

// import React, { useEffect, useState } from "react";
// import api from "./api/axios";
// import ArtistSelector from "./components/ArtistSelector";
// import SegmentChart from "./components/SegmentChart";
// import SentimentChart from "./components/SentimentChart";
// import RecommendationCard from "./components/RecommendationCard";
// import InsightsPanel from "./components/InsightsPanel";
// import ArtistOnboarding from './components/ArtistOnboarding';
// import GrowthDashboard from './components/GrowthDashboard';

// function App() {
//   const [artists, setArtists] = useState([]);
//   const [selectedArtist, setSelectedArtist] = useState("");
//   const [analysis, setAnalysis] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [view, setView] = useState('analytics'); // 'analytics' or 'onboarding' or 'growth'
//   const [currentNewArtist, setCurrentNewArtist] = useState(null);

//   useEffect(() => {
//     const fetchArtists = async () => {
//       try {
//         const res = await api.get("/artists");
//         setArtists(res.data);
//       } catch (err) {
//         console.error(err);
//         setError(
//           "Failed to load artists. Please ensure the backend is running."
//         );
//       }
//     };
//     fetchArtists();
//   }, []);

//   const handleAnalyze = async () => {
//     if (!selectedArtist) return;
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.post(`/analyze/${selectedArtist}`);
//       setAnalysis(res.data);
//     } catch (err) {
//       console.error(err);
//       const msg =
//         err?.response?.data?.error ||
//         "Analysis failed. Please try again or check the backend.";
//       setError(msg);
//       setAnalysis(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const segmentPercentagesLabeled = analysis?.segment_percentages
//     ? {
//         Superfans:
//           analysis.segment_percentages["Superfans"] ||
//           analysis.segment_percentages["superfans"] ||
//           0,
//         "Casual Listeners":
//           analysis.segment_percentages["Casual Listeners"] ||
//           analysis.segment_percentages["casual"] ||
//           0,
//         "One-time Listeners":
//           analysis.segment_percentages["One-time Listeners"] ||
//           analysis.segment_percentages["onetime"] ||
//           0,
//       }
//     : {};

//   const clusterStatsRows = analysis?.cluster_statistics
//     ? Object.entries(analysis.cluster_statistics.engagement_score || {}).map(
//         ([clusterKey]) => {
//           const engagement =
//             analysis.cluster_statistics.engagement_score[clusterKey];
//           const loyalty = analysis.cluster_statistics.loyalty_score[clusterKey];
//           const streams = analysis.cluster_statistics.total_streams[clusterKey];
//           const count = analysis.cluster_statistics.count[clusterKey];
//           return {
//             clusterKey,
//             engagement,
//             loyalty,
//             streams,
//             count,
//           };
//         }
//       )
//     : [];

//   const bestSegment =
//     clusterStatsRows.length > 0
//       ? clusterStatsRows.reduce((best, current) =>
//           current.engagement > best.engagement ? current : best
//         )
//       : null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#fdfbff] via-[#f8f5ff] to-[#fff0f7] text-gray-800">
//       {/* Header */}
//       <header className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-pink-500/30 to-purple-500/30 blur-3xl" />
//         <div className="relative max-w-6xl mx-auto px-6 py-14">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
//                 AI Music Growth Assistant
//               </h1>
//               <p className="mt-3 max-w-2xl text-sm md:text-base text-gray-600">
//                 Empowering emerging female artists with ethical, data-driven growth
//                 insights.
//               </p>
//               <p className="mt-1 text-xs text-gray-500">Kathmandu Valley, Nepal</p>
//             </div>

//             {/* Navigation Buttons */}
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setView('analytics')}
//                 className={`px-4 py-2 rounded-lg font-semibold transition ${
//                   view === 'analytics'
//                     ? 'bg-indigo-600 text-white'
//                     : 'bg-white/70 text-gray-700 hover:bg-white'
//                 }`}
//               >
//                 Analytics
//               </button>
//               <button
//                 onClick={() => setView('onboarding')}
//                 className={`px-4 py-2 rounded-lg font-semibold transition ${
//                   view === 'onboarding'
//                     ? 'bg-green-600 text-white'
//                     : 'bg-white/70 text-gray-700 hover:bg-white'
//                 }`}
//               >
//                 + New Artist
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-6xl mx-auto px-6 pb-16 space-y-8">

//         {/* ANALYTICS VIEW */}
//         {view === 'analytics' && (
//           <>
//             {/* Artist Selector */}
//             <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white">
//               <ArtistSelector
//                 artists={artists}
//                 selectedArtist={selectedArtist}
//                 onChange={setSelectedArtist}
//                 onAnalyze={handleAnalyze}
//                 loading={loading}
//               />
//             </div>

//             {/* Error */}
//             {error && (
//               <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">
//                 {error}
//               </div>
//             )}

//             {/* Analysis Section */}
//             {analysis && (
//               <div className="space-y-8">
//                 {/* Charts */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                     <SegmentChart
//                       listenerSegments={analysis.listener_segments}
//                       segmentPercentages={segmentPercentagesLabeled}
//                     />
//                   </div>

//                   <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                     <SentimentChart
//                       sentimentAnalysis={analysis.sentiment_analysis}
//                     />
//                   </div>
//                 </div>

//                 {/* Segment Metrics */}
//                 <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                   <h3 className="text-lg font-semibold mb-4 text-gray-800">
//                     Listener Segment Performance
//                   </h3>
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full text-sm">
//                       <thead>
//                         <tr className="border-b text-gray-500">
//                           <th className="py-3 px-2 text-left">Cluster</th>
//                           <th className="py-3 px-2 text-left">Avg Streams</th>
//                           <th className="py-3 px-2 text-left">Engagement</th>
//                           <th className="py-3 px-2 text-left">Loyalty</th>
//                           <th className="py-3 px-2 text-left">Listeners</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {clusterStatsRows.map((row) => {
//                           const isBest =
//                             bestSegment &&
//                             row.clusterKey === bestSegment.clusterKey;

//                           return (
//                             <tr
//                               key={row.clusterKey}
//                               className={`border-b last:border-0 transition ${
//                                 isBest
//                                   ? "bg-gradient-to-r from-green-50 to-emerald-50"
//                                   : "hover:bg-gray-50"
//                               }`}
//                             >
//                               <td className="py-3 px-2 font-medium">
//                                 Cluster {row.clusterKey}
//                                 {isBest && (
//                                   <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
//                                     Top Performing
//                                   </span>
//                                 )}
//                               </td>
//                               <td className="py-3 px-2">{row.streams}</td>
//                               <td className="py-3 px-2">{row.engagement}</td>
//                               <td className="py-3 px-2">{row.loyalty}</td>
//                               <td className="py-3 px-2">{row.count}</td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Recommendations & Insights */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                     <RecommendationCard
//                       recommendations={analysis.recommendations}
//                     />
//                   </div>

//                   <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                     <InsightsPanel
//                       insights={analysis.key_insights}
//                       silhouetteScore={analysis.silhouette_score}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Empty State */}
//             {!analysis && !loading && (
//               <div className="rounded-2xl bg-white/70 backdrop-blur shadow-md p-6 border border-white text-center text-sm text-gray-600">
//                 🎵 Select an artist and run the analysis to explore listener
//                 segments, emotional sentiment, and AI-powered growth strategies
//                 crafted for emerging female musicians.
//               </div>
//             )}
//           </>
//         )}

//         {/* ONBOARDING VIEW */}
//         {view === 'onboarding' && (
//           <ArtistOnboarding
//             onComplete={(data) => {
//               setCurrentNewArtist(data);
//               setView('growth');
//             }}
//           />
//         )}

//         {/* GROWTH DASHBOARD VIEW */}
//         {view === 'growth' && currentNewArtist && (
//           <GrowthDashboard artistId={currentNewArtist.artist_id} />
//         )}
//       </main>
//     </div>
//   );
// }

// // export default App;

// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useNavigate,
// } from "react-router-dom";
// import api from "./api/axios";
// import ArtistSelector from "./components/ArtistSelector";
// import SegmentChart from "./components/SegmentChart";
// import SentimentChart from "./components/SentimentChart";
// import RecommendationCard from "./components/RecommendationCard";
// import InsightsPanel from "./components/InsightsPanel";
// import ArtistOnboarding from "./components/ArtistOnboarding";
// import NewArtistsList from "./components/Aritst/NewArtistsList";
// import ArtistProfile from "./components/Aritst/ArtistProfile";
// import { useToast } from "./hooks/useToast";
// import Toast from "./components/common/Toast";
// import AnalyticsDashboard from "./components/common/AnalyticsDashboardTab";

// function MainDashboard() {
//   const [artists, setArtists] = useState([]);
//   const [selectedArtist, setSelectedArtist] = useState("");
//   const [analysis, setAnalysis] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [view, setView] = useState("analytics"); // 'analytics' or 'onboarding' or 'new-artists'
//   const navigate = useNavigate();
//   const { toasts, showToast, removeToast } = useToast();
//   useEffect(() => {
//     const fetchArtists = async () => {
//       try {
//         const res = await api.get("/artists");
//         setArtists(res.data);
//       } catch (err) {
//         console.error(err);
//         setError(
//           "Failed to load artists. Please ensure the backend is running.",
//         );
//       }
//     };
//     fetchArtists();
//   }, []);

//   const handleAnalyze = async () => {
//     if (!selectedArtist) return;
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.post(`/analyze/${selectedArtist}`);
//       setAnalysis(res.data);
//     } catch (err) {
//       console.error(err);
//       const msg =
//         err?.response?.data?.error ||
//         "Analysis failed. Please try again or check the backend.";
//       setError(msg);
//       setAnalysis(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const segmentPercentagesLabeled = analysis?.segment_percentages
//     ? {
//         Superfans:
//           analysis.segment_percentages["Superfans"] ||
//           analysis.segment_percentages["superfans"] ||
//           0,
//         "Casual Listeners":
//           analysis.segment_percentages["Casual Listeners"] ||
//           analysis.segment_percentages["casual"] ||
//           0,
//         "One-time Listeners":
//           analysis.segment_percentages["One-time Listeners"] ||
//           analysis.segment_percentages["onetime"] ||
//           0,
//       }
//     : {};

//   const clusterStatsRows = analysis?.cluster_statistics
//     ? Object.entries(analysis.cluster_statistics.engagement_score || {}).map(
//         ([clusterKey]) => {
//           const engagement =
//             analysis.cluster_statistics.engagement_score[clusterKey];
//           const loyalty = analysis.cluster_statistics.loyalty_score[clusterKey];
//           const streams = analysis.cluster_statistics.total_streams[clusterKey];
//           const count = analysis.cluster_statistics.count[clusterKey];
//           return { clusterKey, engagement, loyalty, streams, count };
//         },
//       )
//     : [];

//   const bestSegment =
//     clusterStatsRows.length > 0
//       ? clusterStatsRows.reduce((best, current) =>
//           current.engagement > best.engagement ? current : best,
//         )
//       : null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#fdfbff] via-[#f8f5ff] to-[#fff0f7] text-gray-800">
//       <div className="fixed top-4 right-4 z-50 space-y-2">
//         {toasts.map((toast) => (
//           <Toast
//             key={toast.id}
//             message={toast.message}
//             type={toast.type}
//             onClose={() => removeToast(toast.id)}
//           />
//         ))}
//       </div>

//       {view === "onboarding" && (
//         <ArtistOnboarding
//           onComplete={(data) => {
//             navigate(`/artist-profile/${data.artist_id}`);
//           }}
//           showToast={showToast}
//         />
//       )}
//       {/* Header */}
//       <header className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-pink-500/30 to-purple-500/30 blur-3xl" />
//         <div className="relative max-w-6xl mx-auto px-6 py-14">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
//                 AI Music Growth Assistant
//               </h1>
//               <p className="mt-3 max-w-2xl text-sm md:text-base text-gray-600">
//                 Empowering emerging female artists with ethical, data-driven
//                 growth insights.
//               </p>
//               <p className="mt-1 text-xs text-gray-500">
//                 Kathmandu Valley, Nepal
//               </p>
//             </div>

//             {/* Navigation Buttons */}
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setView("analytics")}
//                 className={`px-4 py-2 rounded-lg font-semibold transition ${
//                   view === "analytics"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-white/70 text-gray-700 hover:bg-white"
//                 }`}
//               >
//                 📊 Analytics
//               </button>
//               <button
//                 onClick={() => setView("new-artists")}
//                 className={`px-4 py-2 rounded-lg font-semibold transition ${
//                   view === "new-artists"
//                     ? "bg-purple-600 text-white"
//                     : "bg-white/70 text-gray-700 hover:bg-white"
//                 }`}
//               >
//                 🎤 New Artists
//               </button>
//               <button
//                 onClick={() => setView("onboarding")}
//                 className={`px-4 py-2 rounded-lg font-semibold transition ${
//                   view === "onboarding"
//                     ? "bg-green-600 text-white"
//                     : "bg-white/70 text-gray-700 hover:bg-white"
//                 }`}
//               >
//                 + Add New Artist
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-6xl mx-auto px-6 pb-16 space-y-8">
//         {/* ANALYTICS VIEW */}
//         {view === "analytics" && (
//           <>
//             <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white">
//               <ArtistSelector
//                 artists={artists}
//                 selectedArtist={selectedArtist}
//                 onChange={setSelectedArtist}
//                 onAnalyze={handleAnalyze}
//                 loading={loading}
//               />
//             </div>

//             {error && (
//               <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">
//                 {error}
//               </div>
//             )}
//             {analysis && <AnalyticsDashboard analysis={analysis} />}
//             {analysis && (
//               <div className="space-y-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                     <SegmentChart
//                       listenerSegments={analysis.listener_segments}
//                       segmentPercentages={segmentPercentagesLabeled}
//                     />
//                   </div>
//                   <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                     <SentimentChart
//                       sentimentAnalysis={analysis.sentiment_analysis}
//                     />
//                   </div>
//                 </div>

//                 <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                   <h3 className="text-lg font-semibold mb-4 text-gray-800">
//                     Listener Segment Performance
//                   </h3>
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full text-sm">
//                       <thead>
//                         <tr className="border-b text-gray-500">
//                           <th className="py-3 px-2 text-left">Cluster</th>
//                           <th className="py-3 px-2 text-left">Avg Streams</th>
//                           <th className="py-3 px-2 text-left">Engagement</th>
//                           <th className="py-3 px-2 text-left">Loyalty</th>
//                           <th className="py-3 px-2 text-left">Listeners</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {clusterStatsRows.map((row) => {
//                           const isBest =
//                             bestSegment &&
//                             row.clusterKey === bestSegment.clusterKey;
//                           return (
//                             <tr
//                               key={row.clusterKey}
//                               className={`border-b last:border-0 transition ${isBest ? "bg-gradient-to-r from-green-50 to-emerald-50" : "hover:bg-gray-50"}`}
//                             >
//                               <td className="py-3 px-2 font-medium">
//                                 Cluster {row.clusterKey}
//                                 {isBest && (
//                                   <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
//                                     Top Performing
//                                   </span>
//                                 )}
//                               </td>
//                               <td className="py-3 px-2">{row.streams}</td>
//                               <td className="py-3 px-2">{row.engagement}</td>
//                               <td className="py-3 px-2">{row.loyalty}</td>
//                               <td className="py-3 px-2">{row.count}</td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                     <RecommendationCard
//                       recommendations={analysis.recommendations}
//                     />
//                   </div>
//                   <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 border border-white">
//                     <InsightsPanel
//                       insights={analysis.key_insights}
//                       silhouetteScore={analysis.silhouette_score}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {!analysis && !loading && (
//               <div className="rounded-2xl bg-white/70 backdrop-blur shadow-md p-6 border border-white text-center text-sm text-gray-600">
//                 🎵 Select an artist and run the analysis to explore listener
//                 segments, emotional sentiment, and AI-powered growth strategies
//                 crafted for emerging female musicians.
//               </div>
//             )}
//           </>
//         )}

//         {/* NEW ARTISTS LIST VIEW */}
//         {view === "new-artists" && <NewArtistsList />}

//         {/* ONBOARDING VIEW */}
//         {view === "onboarding" && (
//           <ArtistOnboarding
//             onComplete={(data) => {
//               navigate(`/artist-profile/${data.artist_id}`);
//             }}
//           />
//         )}
//       </main>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<MainDashboard />} />
//         <Route path="/artist-profile/:artistId" element={<ArtistProfile />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useNavigate,
// } from "react-router-dom";
// import api from "./api/axios";
// import ArtistSelector from "./components/ArtistSelector";
// import ArtistOnboarding from "./components/ArtistOnboarding";
// import NewArtistsList from "./components/Aritst/NewArtistsList";
// import ArtistProfile from "./components/Aritst/ArtistProfile";
// import { useToast } from "./hooks/useToast";
// import Toast from "./components/common/Toast";
// import AnalyticsDashboard from "./components/common/AnalyticsDashboardTab";

// function MainDashboard() {
//   const [artists, setArtists] = useState([]);
//   const [selectedArtist, setSelectedArtist] = useState("");
//   const [analysis, setAnalysis] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [view, setView] = useState("analytics");
//   const navigate = useNavigate();
//   const { toasts, showToast, removeToast } = useToast();

//   useEffect(() => {
//     const fetchArtists = async () => {
//       try {
//         const res = await api.get("/artists");
//         setArtists(res.data);
//       } catch (err) {
//         console.error(err);
//         setError(
//           "Failed to load artists. Please ensure the backend is running.",
//         );
//       }
//     };
//     fetchArtists();
//   }, []);

//   const handleAnalyze = async () => {
//     if (!selectedArtist) return;
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.post(`/analyze/${selectedArtist}`);
//       setAnalysis(res.data);
//     } catch (err) {
//       console.error(err);
//       const msg =
//         err?.response?.data?.error ||
//         "Analysis failed. Please try again or check the backend.";
//       setError(msg);
//       setAnalysis(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#fdfbff] via-[#f8f5ff] to-[#fff0f7] text-gray-800">
//       {/* Toast Notifications */}
//       <div className="fixed top-4 right-4 z-50 space-y-2">
//         {toasts.map((toast) => (
//           <Toast
//             key={toast.id}
//             message={toast.message}
//             type={toast.type}
//             onClose={() => removeToast(toast.id)}
//           />
//         ))}
//       </div>

//       {/* Header */}
//       <header className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-rose-400/20 blur-3xl" />
//         <div className="relative max-w-6xl mx-auto px-6 py-14">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
//                 🎵 AI Music Growth Assistant
//               </h1>
//               <p className="mt-3 max-w-2xl text-sm md:text-base text-gray-600">
//                 Empowering emerging female artists with ethical, data-driven
//                 growth insights.
//               </p>
//               <p className="mt-1 text-xs text-purple-400 font-medium">
//                 ✨ Kathmandu Valley, Nepal
//               </p>
//             </div>

//             {/* Navigation Buttons */}
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setView("analytics")}
//                 className={`px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
//                   view === "analytics"
//                     ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-300/50"
//                     : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
//                 }`}
//               >
//                 📊 Analytics
//               </button>
//               <button
//                 onClick={() => setView("new-artists")}
//                 className={`px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
//                   view === "new-artists"
//                     ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-300/50"
//                     : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
//                 }`}
//               >
//                 🎤 New Artists
//               </button>
//               <button
//                 onClick={() => setView("onboarding")}
//                 className={`px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
//                   view === "onboarding"
//                     ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-300/50"
//                     : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
//                 }`}
//               >
//                 ✨ Add New Artist
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-6xl mx-auto px-6 pb-16 space-y-8">
//         {/* ANALYTICS VIEW */}
//         {view === "analytics" && (
//           <>
//             <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
//               <ArtistSelector
//                 artists={artists}
//                 selectedArtist={selectedArtist}
//                 onChange={setSelectedArtist}
//                 onAnalyze={handleAnalyze}
//                 loading={loading}
//               />
//             </div>

//             {error && (
//               <div className="rounded-xl border border-rose-200 bg-rose-50/80 backdrop-blur px-5 py-4 text-sm text-rose-700 shadow-sm">
//                 ⚠️ {error}
//               </div>
//             )}

//             {/* NEW: Analytics Dashboard with Tabs */}
//             {analysis && <AnalyticsDashboard analysis={analysis} />}

//             {/* Empty State */}
//             {!analysis && !loading && (
//               <div className="rounded-2xl bg-gradient-to-br from-white/70 via-purple-50/30 to-pink-50/30 backdrop-blur shadow-lg p-8 border border-white/50 text-center">
//                 <div className="max-w-md mx-auto">
//                   <div className="text-6xl mb-4">🎵</div>
//                   <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//                     Ready to Analyze
//                   </h3>
//                   <p className="text-sm text-gray-600 leading-relaxed">
//                     Select an artist and run the analysis to explore listener
//                     segments, emotional sentiment, and AI-powered growth
//                     strategies crafted for emerging female musicians.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {/* NEW ARTISTS LIST VIEW */}
//         {view === "new-artists" && <NewArtistsList />}

//         {/* ONBOARDING VIEW */}
//         {view === "onboarding" && (
//           <ArtistOnboarding
//             onComplete={(data) => {
//               navigate(`/artist-profile/${data.artist_id}`);
//             }}
//             showToast={showToast}
//           />
//         )}
//       </main>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<MainDashboard />} />
//         <Route path="/artist-profile/:artistId" element={<ArtistProfile />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import api from "./api/axios";
import ArtistSelector from "./components/ArtistSelector";
import ArtistOnboarding from "./components/ArtistOnboarding";
import NewArtistsList from "./components/Aritst/NewArtistsList";
import ArtistProfile from "./components/Aritst/ArtistProfile";
import { useToast } from "./hooks/useToast";
import Toast from "./components/common/Toast";
import AnalyticsDashboard from "./components/common/AnalyticsDashboardTab";
import AdvancedAnalytics from "./components/Advanced/AdvancedAnalytics";

function MainDashboard() {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("analytics");
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await api.get("/artists");
        setArtists(res.data);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to load artists. Please ensure the backend is running.",
        );
      }
    };
    fetchArtists();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedArtist) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post(`/analyze/${selectedArtist}`);
      setAnalysis(res.data);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        "Analysis failed. Please try again or check the backend.";
      setError(msg);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbff] via-[#f8f5ff] to-[#fff0f7] text-gray-800">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-rose-400/20 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-6 py-14">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                🎵 AI Music Growth Assistant
              </h1>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-gray-600">
                Empowering emerging female artists with ethical, data-driven
                growth insights.
              </p>
              <p className="mt-1 text-xs text-purple-400 font-medium">
                ✨ Kathmandu Valley, Nepal
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setView("analytics")}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  view === "analytics"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-300/50"
                    : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
                }`}
              >
                📊 Analytics
              </button>
              <button
                onClick={() => setView("new-artists")}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  view === "new-artists"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-300/50"
                    : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
                }`}
              >
                🎤 New Artists
              </button>
              <button
                onClick={() => setView("onboarding")}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  view === "onboarding"
                    ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-300/50"
                    : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
                }`}
              >
                ✨ Add New Artist
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-16 space-y-8">
        {/* ANALYTICS VIEW */}
        {view === "analytics" && (
          <>
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
              <ArtistSelector
                artists={artists}
                selectedArtist={selectedArtist}
                onChange={setSelectedArtist}
                onAnalyze={handleAnalyze}
                loading={loading}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 backdrop-blur px-5 py-4 text-sm text-rose-700 shadow-sm">
                ⚠️ {error}
              </div>
            )}

            {/* NEW: Analytics Dashboard with Tabs */}
            {analysis && (
              <>
                <AnalyticsDashboard analysis={analysis} />

                {/* Advanced Analytics Section */}
                <div className="mt-8">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6 border border-purple-200">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      🚀 Advanced ML Analytics
                    </h2>
                    <p className="text-sm text-gray-600">
                      Explore deeper insights with clustering comparison, churn
                      prediction, and emotion analysis
                    </p>
                  </div>
                  <AdvancedAnalytics artistId={selectedArtist} />
                </div>
              </>
            )}

            {/* Empty State */}
            {!analysis && !loading && (
              <div className="rounded-2xl bg-gradient-to-br from-white/70 via-purple-50/30 to-pink-50/30 backdrop-blur shadow-lg p-8 border border-white/50 text-center">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Select an artist and run the analysis to explore listener
                    segments, emotional sentiment, and AI-powered growth
                    strategies crafted for emerging female musicians.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* NEW ARTISTS LIST VIEW */}
        {view === "new-artists" && <NewArtistsList />}

        {/* ONBOARDING VIEW */}
        {view === "onboarding" && (
          <ArtistOnboarding
            onComplete={(data) => {
              navigate(`/artist-profile/${data.artist_id}`);
            }}
            showToast={showToast}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/artist-profile/:artistId" element={<ArtistProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
