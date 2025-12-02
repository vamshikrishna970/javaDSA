import React from 'react';

function LocationHistory({ history, darkMode }) {
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(2);
  };

  const getTotalDistance = () => {
    if (history.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < history.length; i++) {
      const dist = calculateDistance(
        history[i-1].latitude,
        history[i-1].longitude,
        history[i].latitude,
        history[i].longitude
      );
      total += parseFloat(dist);
    }
    return total.toFixed(2);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Location History
        </h3>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-3 py-1 rounded-full">
          {history.length} points
        </span>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Distance</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {getTotalDistance()} km
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Updates</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {history.length}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.slice().reverse().map((location, index) => {
          const actualIndex = history.length - 1 - index;
          const isLatest = index === 0;
          
          return (
            <div 
              key={actualIndex}
              className={`relative pl-8 pb-4 ${
                index !== history.length - 1 ? 'border-l-2 border-gray-200 dark:border-gray-700' : ''
              }`}
            >
              <div className={`absolute left-0 top-0 w-4 h-4 rounded-full ${
                isLatest 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-blue-500'
              } border-4 border-white dark:border-gray-800 -ml-2`}></div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-semibold ${
                    isLatest 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {isLatest ? 'Current Location' : `Point ${actualIndex + 1}`}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(location.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="font-medium">Lat:</span> {location.latitude.toFixed(6)}
                  </p>
                  <p>
                    <span className="font-medium">Lng:</span> {location.longitude.toFixed(6)}
                  </p>
                  {location.address && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {location.address}
                    </p>
                  )}
                </div>

                {actualIndex > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Distance from previous: {calculateDistance(
                        history[actualIndex - 1].latitude,
                        history[actualIndex - 1].longitude,
                        location.latitude,
                        location.longitude
                      )} km
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LocationHistory;
