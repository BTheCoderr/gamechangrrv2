'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapLocation {
  lat: number;
  lng: number;
  name?: string;
  popup?: string;
}

interface LeafletMapProps {
  locations: MapLocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function LeafletMap({ 
  locations, 
  center = [39.8283, -98.5795], // Defaults to center of US
  zoom = 4,
  height = '500px' 
}: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Fix Leaflet icon issues
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  if (!isMounted) {
    return (
      <div 
        style={{ height, width: '100%' }}
        className="bg-gray-100 flex items-center justify-center"
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height, width: '100%' }}
      className="rounded-lg shadow-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location, index) => (
        <Marker 
          key={`marker-${index}`}
          position={[location.lat, location.lng]}
        >
          {(location.popup || location.name) && (
            <Popup>
              {location.popup || location.name}
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
} 