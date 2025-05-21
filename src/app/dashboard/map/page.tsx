'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Lead } from '@/types';

// Dynamically import the LeafletMap component with no SSR
// This ensures Leaflet only loads on the client side
const LeafletMap = dynamic(
  () => import('@/components/map/LeafletMap'),
  { ssr: false }
);

export default function MapPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch('/api/leads');
        if (response.ok) {
          const data = await response.json();
          setLeads(data);
        } else {
          setError('Failed to load lead data');
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('An error occurred while loading lead data');
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, []);

  // Prepare locations for the map
  const locations = leads
    .filter(lead => lead.location?.lat && lead.location?.lng)
    .map(lead => ({
      lat: lead.location!.lat,
      lng: lead.location!.lng,
      name: lead.name,
      popup: `
        <strong>${lead.name}</strong><br>
        ${lead.address}, ${lead.city}, ${lead.state} ${lead.zipCode}<br>
        <a href="/dashboard/lead/${lead.id}">View Details</a>
      `
    }));

  // Default to showing USA if no leads with locations
  const defaultLocations = [
    { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
    { lat: 40.7128, lng: -74.0060, name: 'New York' },
    { lat: 41.8781, lng: -87.6298, name: 'Chicago' }
  ];

  // Calculate map center based on lead locations
  const getMapCenter = () => {
    if (locations.length === 0) return [39.8283, -98.5795] as [number, number]; // Center of USA
    
    // Calculate average lat/lng
    const totalLat = locations.reduce((sum, loc) => sum + loc.lat, 0);
    const totalLng = locations.reduce((sum, loc) => sum + loc.lng, 0);
    
    return [
      totalLat / locations.length,
      totalLng / locations.length
    ] as [number, number];
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-8">Lead Map</h1>
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8">Lead Map</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {error ? (
          <div className="text-red-500 text-center py-10">
            {error}
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-700">
              {locations.length > 0 
                ? `Showing ${locations.length} leads on the map`
                : 'No leads with location data found. Showing sample locations.'}
            </p>
            
            <LeafletMap 
              locations={locations.length > 0 ? locations : defaultLocations}
              center={getMapCenter()}
              zoom={locations.length > 0 ? 5 : 4}
              height="600px"
            />
          </>
        )}
      </div>
    </div>
  );
} 