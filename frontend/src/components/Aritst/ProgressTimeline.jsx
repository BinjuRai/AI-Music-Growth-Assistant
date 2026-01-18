import React from 'react';

export default function ProgressTimeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-white">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📅 Your Journey Timeline</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Your journey timeline will appear here as you make progress!</p>
        </div>
      </div>
    );
  }

  const getEventColor = (type) => {
    const colors = {
      onboarded: 'bg-green-500',
      progress_update: 'bg-blue-500',
      milestone: 'bg-yellow-500',
      recommendation_completed: 'bg-purple-500',
      goal_achieved: 'bg-pink-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-white">
      <h3 className="text-xl font-bold mb-6 text-gray-800">📅 Your Journey Timeline</h3>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-pink-300"></div>
        
        {/* Events */}
        <div className="space-y-6">
          {events.map((event, idx) => (
            <div key={idx} className="relative pl-12">
              {/* Icon */}
              <div className={`absolute left-0 w-8 h-8 rounded-full ${getEventColor(event.type)} flex items-center justify-center text-white shadow-md`}>
                {event.icon}
              </div>
              
              {/* Content */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <p className="text-xs text-gray-500 mb-1">{event.date}</p>
                <p className="text-sm font-semibold text-gray-800">{event.description}</p>
                {event.type === 'milestone' && (
                  <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                    🏆 Milestone
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}