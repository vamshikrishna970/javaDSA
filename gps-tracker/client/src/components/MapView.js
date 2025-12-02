import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for current location
const currentLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map view when location changes
function MapUpdater({ location }) {
  const map = useMap();
  
  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 13);
    }
  }, [location, map]);
  
  return null;
}

function MapView({ location, history, darkMode }) {
  const defaultCenter = [40.7128, -74.0060]; // New York City default
  const center = location ? [location.latitude, location.longitude] : defaultCenter;
  
  // Create path from history
  const pathCoordinates = history.map(loc => [loc.latitude, loc.longitude]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={darkMode 
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      />
      
      {location && <MapUpdater location={location} />}
      
      {/* Show all historical locations */}
      {history.map((loc, index) => (
        <Marker 
          key={index} 
          position={[loc.latitude, loc.longitude]}
          icon={index === history.length - 1 ? currentLocationIcon : new L.Icon.Default()}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">
                {index === history.length - 1 ? 'Current Location' : `Location ${index + 1}`}
              </p>
              <p className="text-xs text-gray-600">
                Lat: {loc.latitude.toFixed(6)}
              </p>
              <p className="text-xs text-gray-600">
                Lng: {loc.longitude.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(loc.timestamp).toLocaleString()}
              </p>
              {loc.address && (
                <p className="text-xs text-gray-700 mt-1">
                  {loc.address}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Draw path if there are multiple locations */}
      {pathCoordinates.length > 1 && (
        <Polyline 
          positions={pathCoordinates} 
          color="blue" 
          weight={3}
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
}

export default MapView;
