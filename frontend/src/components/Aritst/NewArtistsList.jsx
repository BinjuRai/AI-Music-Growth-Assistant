import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function NewArtistsList() {
  const [newArtists, setNewArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewArtists();
  }, []);

  const fetchNewArtists = async () => {
    try {
      // You'll need to create this endpoint in backend
      const res = await api.get('/artists/new-artists');
      setNewArtists(res.data);
    } catch (error) {
      console.error('Failed to load new artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      onboarding: { color: 'bg-yellow-100 text-yellow-800', text: '🌱 Getting Started' },
      growing: { color: 'bg-blue-100 text-blue-800', text: '📈 Growing' },
      goal_achieved: { color: 'bg-green-100 text-green-800', text: '🎯 Goal Achieved' },
      superstar: { color: 'bg-purple-100 text-purple-800', text: '⭐ Superstar' }
    };
    return config[status] || config.onboarding;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading artists...</p>
      </div>
    );
  }

  if (newArtists.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-600 text-lg mb-4">No new artists yet</p>
        <p className="text-gray-500 text-sm">New artists who join will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🎤 New Artists</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newArtists.map((artist) => {
          const badge = getStatusBadge(artist.status);
          
          return (
            <div
              key={artist._id}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-white hover:shadow-lg transition cursor-pointer group"
              onClick={() => navigate(`/artist-profile/${artist._id}`)}
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold mb-3 group-hover:scale-110 transition">
                {artist.artist_name.charAt(0)}
              </div>

              {/* Info */}
              <h3 className="font-bold text-lg text-gray-800 mb-1">{artist.artist_name}</h3>
              <p className="text-sm text-gray-600 mb-2">{artist.genre} • {artist.location}</p>
              
              {/* Status Badge */}
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                {badge.text}
              </span>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-purple-200">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Goal: {artist.goals.target_followers} followers</span>
                  <span className="font-semibold text-purple-600">View Profile →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}