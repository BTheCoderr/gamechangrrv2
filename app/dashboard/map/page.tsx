'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LeadsMap from '@/src/components/map/LeadsMap';
import { getLeads } from '@/src/lib/services/leadService';
import { Lead } from '@/src/types';

export default function MapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const leadId = searchParams.get('leadId');

  // Fetch all leads
  useEffect(() => {
    async function fetchLeads() {
      try {
        const leadsData = await getLeads();
        setLeads(leadsData);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  // Handle clicking on a lead marker
  const handleLeadClick = (lead: Lead) => {
    router.push(`/dashboard/leads/${lead.id}`);
  };

  return (
    <main className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex items-center">
        <Link href="/dashboard" className="mr-2 text-white">
          ← Back
        </Link>
        <h1 className="text-xl font-bold">Lead Map</h1>
        {leadId && (
          <span className="ml-4 text-sm bg-blue-800 px-2 py-1 rounded">
            Focusing on lead: {leadId}
          </span>
        )}
      </header>

      <div className="flex-1 p-4">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p>Loading map data...</p>
          </div>
        ) : (
          <div className="h-full">
            <LeadsMap 
              leads={leads} 
              highlightedLeadId={leadId || undefined}
              onLeadClick={handleLeadClick}
              className="h-full w-full rounded shadow-lg"
            />
            
            <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Map Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span>Lead locations</span>
                </div>
                {leadId && (
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                    <span>Selected lead</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 