import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    milestone: '🎉'
  };

  const colors = {
    success: 'from-green-500 to-emerald-500',
    error: 'from-red-500 to-pink-500',
    warning: 'from-yellow-500 to-orange-500',
    info: 'from-blue-500 to-indigo-500',
    milestone: 'from-purple-500 to-pink-500'
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
    milestone: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColors[type]} border-2 rounded-xl shadow-2xl p-4 max-w-sm backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors[type]} flex items-center justify-center text-white text-xl flex-shrink-0`}>
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className="text-gray-800 font-semibold text-sm leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}