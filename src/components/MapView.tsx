'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Lead } from '@/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for the Leaflet default marker icon issue in Next.js
const fixLeafletIcon = () => {
  // Only fix in browser environment
  if (typeof window === 'undefined') return;

  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Custom marker icons based on lead status
const statusIcons = {
  new: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  contacted: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  'follow-up': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  booked: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  'not-interested': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  converted: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

interface MapViewProps {
  leads: Lead[];
}

export default function MapView({ leads }: MapViewProps) {
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    fixLeafletIcon();
    setIsMapReady(true);
  }, []);

  // Calculate center based on leads or default to Los Angeles
  const getMapCenter = (): [number, number] => {
    if (leads.length === 0) return [34.0522, -118.2437]; // Los Angeles default
    
    // Calculate average lat/lng for all leads with location
    const leadsWithLocation = leads.filter(lead => lead.location);
    if (leadsWithLocation.length === 0) return [34.0522, -118.2437];
    
    const totalLat = leadsWithLocation.reduce((sum, lead) => sum + (lead.location?.lat || 0), 0);
    const totalLng = leadsWithLocation.reduce((sum, lead) => sum + (lead.location?.lng || 0), 0);
    
    return [
      totalLat / leadsWithLocation.length,
      totalLng / leadsWithLocation.length
    ];
  };

  if (!isMapReady) {
    return <div className="flex justify-center items-center h-full">Initializing map...</div>;
  }

  return (
    <MapContainer 
      center={getMapCenter()} 
      zoom={10} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {leads.map(lead => {
        if (!lead.location) return null;
        
        return (
          <Marker 
            key={lead.id} 
            position={[lead.location.lat, lead.location.lng]}
            icon={statusIcons[lead.status]}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold">{lead.name}</h3>
                <p className="text-sm">{lead.address}</p>
                <p className="text-sm">{lead.city}, {lead.state} {lead.zipCode}</p>
                <p className="text-xs mt-1">
                  <span className={`inline-block px-2 py-0.5 rounded-full ${
                    lead.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                    lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'booked' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.status}
                  </span>
                </p>
                <div className="mt-2 text-xs">
                  <a 
                    href={`/dashboard/lead/${lead.id}`} 
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
} 