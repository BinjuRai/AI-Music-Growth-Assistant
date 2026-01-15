import React from "react";

const ArtistSelector = ({ artists, selectedArtist, onChange, onAnalyze, loading }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-2">Select Artist</h2>
      <p className="text-sm text-gray-500 mb-4">
        Choose an emerging female artist from Kathmandu Valley and run the AI analysis.
      </p>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <select
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedArtist}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select an artist...</option>
          {artists.map((artist) => (
            <option key={artist._id} value={artist._id}>
              {artist.artist_name} ({artist.genre})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!selectedArtist || loading}
          className={`px-5 py-2 rounded-lg font-medium text-white transition ${
            !selectedArtist || loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze Artist"}
        </button>
      </div>
    </div>
  );
};

export default ArtistSelector;

