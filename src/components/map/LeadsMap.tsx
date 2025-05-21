'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Lead } from '@/types';

// Dynamic import for Leaflet components to prevent SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

// Default center position (Los Angeles as default)
const DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 };
const DEFAULT_ZOOM = 10;

interface LeadsMapProps {
  leads: Lead[];
  highlightedLeadId?: string;
  onLeadClick?: (lead: Lead) => void;
  className?: string;
}

export default function LeadsMap({ 
  leads, 
  highlightedLeadId, 
  onLeadClick, 
  className = 'h-[500px] w-full' 
}: LeadsMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Find center position from highlighted lead or calculate from all leads
  const mapCenter = useMemo(() => {
    // If there's a highlighted lead, center on it
    if (highlightedLeadId) {
      const highlightedLead = leads.find(lead => lead.id === highlightedLeadId);
      if (highlightedLead?.location) {
        return highlightedLead.location;
      }
    }
    
    // If we have leads with locations, calculate the center
    const leadsWithLocation = leads.filter(lead => lead.location);
    if (leadsWithLocation.length > 0) {
      const sumLat = leadsWithLocation.reduce((sum, lead) => sum + (lead.location?.lat || 0), 0);
      const sumLng = leadsWithLocation.reduce((sum, lead) => sum + (lead.location?.lng || 0), 0);
      
      return {
        lat: sumLat / leadsWithLocation.length,
        lng: sumLng / leadsWithLocation.length
      };
    }
    
    // Default center if no leads with location
    return DEFAULT_CENTER;
  }, [leads, highlightedLeadId]);

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render map on server
  if (!isMounted) {
    return <div className={`${className} bg-gray-100 flex items-center justify-center`}>Loading map...</div>;
  }

  return (
    <div className={className}>
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {leads
          .filter(lead => lead.location)
          .map(lead => (
            <Marker
              key={lead.id}
              position={[lead.location!.lat, lead.location!.lng]}
              eventHandlers={{
                click: () => {
                  if (onLeadClick) {
                    onLeadClick(lead);
                  }
                },
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{lead.name}</h3>
                  <p>{lead.address}</p>
                  <p>{lead.city}, {lead.state} {lead.zipCode}</p>
                  <p>Status: {lead.status}</p>
                  {onLeadClick && (
                    <button
                      onClick={() => onLeadClick(lead)}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
} 