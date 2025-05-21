'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import VoiceAgent from '@/components/ai/VoiceAgent';
import { getLeadById } from '@/lib/services/leadService';
import { Lead } from '@/types';

export default function VoiceAgentPage() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('leadId');
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(leadId ? true : false);
  const [recentCalls, setRecentCalls] = useState<{ callSid: string; leadName?: string; timestamp: string }[]>([]);

  // Fetch lead information if leadId is provided
  useEffect(() => {
    async function fetchLead() {
      if (!leadId) return;
      
      try {
        const leadData = await getLeadById(leadId);
        setLead(leadData);
      } catch (error) {
        console.error('Error fetching lead:', error);
      } finally {
        setLoading(false);
      }
    }

    if (leadId) {
      fetchLead();
    }
    
    // Load recent calls from localStorage
    const storedCalls = localStorage.getItem('recent_voice_calls');
    if (storedCalls) {
      try {
        setRecentCalls(JSON.parse(storedCalls));
      } catch (e) {
        console.error('Error parsing stored calls:', e);
      }
    }
  }, [leadId]);

  // Handle call completion - save to recent calls
  const handleCallComplete = (callSid: string) => {
    const newCall = {
      callSid,
      leadName: lead?.name,
      timestamp: new Date().toISOString()
    };
    
    const updatedCalls = [newCall, ...recentCalls.slice(0, 9)]; // Keep last 10 calls
    setRecentCalls(updatedCalls);
    
    // Save to localStorage
    localStorage.setItem('recent_voice_calls', JSON.stringify(updatedCalls));
    
    // If this was a lead, update lead data (in a real app, you would update their status)
    if (lead && leadId) {
      // Code to update lead status/lastContactedAt would go here
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <Link href="/dashboard" className="text-blue-600 mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Voice Agent</h1>
        <p className="text-gray-500">
          {lead 
            ? `Making calls to ${lead.name} (${lead.phone})`
            : 'Make automated calls to leads'}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64">
              <p>Loading lead information...</p>
            </div>
          ) : (
            <VoiceAgent 
              lead={lead || undefined}
              onCallComplete={handleCallComplete}
            />
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Calls</h2>
          
          {recentCalls.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent calls</p>
          ) : (
            <ul className="space-y-4">
              {recentCalls.map((call) => (
                <li key={call.callSid} className="border-b pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {call.leadName || 'Manual Call'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(call.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                      {call.callSid.substring(0, 10)}...
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Tips</h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
              <li>Preview your script before making a call</li>
              <li>Keep your introduction short and clear</li>
              <li>Include your callback number in the script</li>
              <li>Follow up with a text message when appropriate</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 