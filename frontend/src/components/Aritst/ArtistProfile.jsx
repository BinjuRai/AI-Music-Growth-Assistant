import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ProfileHeader from './ProfileHeader';
import GoalsProgressCard from './GoalsProgressCard';
import GrowthTrendChart from './GrowthTrendChart';
import MetricsGrid from './MetricsGrid';
import ActiveRecommendations from './ActiveRecommendations';
import ProgressTimeline from './ProgressTimeline';
import MentorComparison from './MentorComparison';
import UpdateGoalsModal from './UpdateGoalsModal';
import ProgressUpdateModal from './ProgressUpdateModal';

export default function ArtistProfile() {
  const { artistId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [growthHistory, setGrowthHistory] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [artistId]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [profile, history, timelineData] = await Promise.all([
        api.get(`/artists/${artistId}/profile`),
        api.get(`/artists/${artistId}/growth-history`),
        api.get(`/artists/${artistId}/timeline`)
      ]);
      
      setProfileData(profile.data);
      setGrowthHistory(history.data);
      setTimeline(timelineData.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-700 text-lg">Artist not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <ProfileHeader 
        artist={profileData.artist} 
        daysSinceOnboarding={profileData.days_since_onboarding}
        status={profileData.status}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        
        {/* Goals & Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals Progress */}
          <div className="lg:col-span-1">
            <GoalsProgressCard 
              artist={profileData.artist}
              currentMetrics={profileData.current_metrics}
              daysToGoal={profileData.days_to_goal}
              growthRate={profileData.growth_rate}
              onUpdateGoals={() => setShowGoalsModal(true)}
            />
          </div>

          {/* Metrics Grid */}
          <div className="lg:col-span-2">
            <MetricsGrid 
              currentMetrics={profileData.current_metrics}
              growthRate={profileData.growth_rate}
            />
          </div>
        </div>

        {/* Growth Trend Chart */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">📈 Your Growth Journey</h3>
            <button
              onClick={() => setShowProgressModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-semibold text-sm"
            >
              📝 Update Progress
            </button>
          </div>
          <GrowthTrendChart history={growthHistory?.history} milestones={growthHistory?.milestones} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Recommendations */}
          <ActiveRecommendations artistId={artistId} onUpdate={fetchAllData} />

          {/* Mentor Comparison */}
          {profileData.mentor_comparison && (
            <MentorComparison mentor={profileData.mentor_comparison} />
          )}
        </div>

        {/* Progress Timeline */}
        <ProgressTimeline events={timeline?.events} />
      </div>

      {/* Modals */}
      {showGoalsModal && (
        <UpdateGoalsModal
          artistId={artistId}
          currentGoals={profileData.artist.goals}
          onClose={() => setShowGoalsModal(false)}
          onUpdate={fetchAllData}
        />
      )}

      {showProgressModal && (
        <ProgressUpdateModal
          artistId={artistId}
          onClose={() => setShowProgressModal(false)}
          onUpdate={fetchAllData}
        />
      )}
    </div>
  );
}