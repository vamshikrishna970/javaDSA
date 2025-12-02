import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './components/MapView';
import TrackingForm from './components/TrackingForm';
import LocationHistory from './components/LocationHistory';
import Header from './components/Header';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const startTracking = async (phone) => {
    try {
      setError('');
      setPhoneNumber(phone);
      
      const response = await axios.post(`${API_URL}/track`, { phoneNumber: phone });
      
      if (response.data.success) {
        setCurrentLocation(response.data.location);
        setLocationHistory([response.data.location]);
        setTracking(true);
        
        // Simulate real-time updates every 5 seconds
        const interval = setInterval(async () => {
          try {
            const updateResponse = await axios.get(`${API_URL}/location/${phone}`);
            if (updateResponse.data.success) {
              setCurrentLocation(updateResponse.data.location);
              setLocationHistory(prev => [...prev, updateResponse.data.location]);
            }
          } catch (err) {
            console.error('Error updating location:', err);
          }
        }, 5000);

        // Store interval ID for cleanup
        window.trackingInterval = interval;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start tracking. Please try again.');
      console.error('Tracking error:', err);
    }
  };

  const stopTracking = () => {
    if (window.trackingInterval) {
      clearInterval(window.trackingInterval);
      window.trackingInterval = null;
    }
    setTracking(false);
    setCurrentLocation(null);
    setLocationHistory([]);
    setPhoneNumber('');
    setError('');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Tracking Form and History */}
            <div className="lg:col-span-1 space-y-6">
              <TrackingForm 
                onStartTracking={startTracking}
                onStopTracking={stopTracking}
                tracking={tracking}
                phoneNumber={phoneNumber}
                error={error}
              />
              
              {tracking && locationHistory.length > 0 && (
                <LocationHistory 
                  history={locationHistory}
                  darkMode={darkMode}
                />
              )}
            </div>

            {/* Right Column - Map */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Live Location Map
                </h2>
                <div className="h-[600px] rounded-lg overflow-hidden">
                  <MapView 
                    location={currentLocation}
                    history={locationHistory}
                    darkMode={darkMode}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  <strong>Privacy Notice:</strong> This is a demonstration application using simulated GPS data. 
                  Real mobile tracking requires user consent, legal authorization, and carrier API integration. 
                  Always respect privacy laws and obtain proper permissions before tracking any device.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
