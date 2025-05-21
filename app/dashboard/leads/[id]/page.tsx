'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lead } from '@/types';
import { getLeadById, updateLead } from '@/lib/services/leadService';
import { initiateAICall } from '@/lib/services/aiService';
import VoiceAgent from '@/components/ai/VoiceAgent';

// Status options for lead
const STATUS_OPTIONS = [
  'new',
  'contacted',
  'follow-up',
  'booked',
  'not-interested',
  'converted'
];

export default function LeadDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [showVoiceAgent, setShowVoiceAgent] = useState(false);

  // Fetch lead data
  useEffect(() => {
    async function fetchLead() {
      try {
        const leadData = await getLeadById(params.id);
        setLead(leadData);
        setFormData(leadData || {});
      } catch (error) {
        console.error('Error fetching lead:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchLead();
    }
  }, [params.id]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Save lead changes
  const handleSave = async () => {
    if (!lead) return;
    
    setSaving(true);
    try {
      const updatedLead = await updateLead(lead.id, formData);
      setLead(updatedLead);
      alert('Lead updated successfully');
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  // Handle call completion from VoiceAgent
  const handleCallComplete = async (callSid: string) => {
    if (!lead) return;
    
    try {
      // Update lead with lastContactedAt
      const updatedLead = await updateLead(lead.id, {
        lastContactedAt: new Date().toISOString(),
        status: lead.status === 'new' ? 'contacted' : lead.status
      });
      
      setLead(updatedLead);
      setShowVoiceAgent(false);
      
      // Show confirmation
      alert(`Call initiated with SID: ${callSid}`);
    } catch (error) {
      console.error('Error updating lead after call:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading lead information...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">Lead not found</p>
        <Link href="/dashboard" className="mt-4 text-blue-600">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <Link href="/dashboard" className="text-blue-600 mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">{lead.name}</h1>
        <p className="text-gray-500">
          Lead ID: {lead.id} • Created: {new Date(lead.createdAt).toLocaleDateString()}
        </p>
      </header>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          {/* Address Information */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Address</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-600">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Lead Status & Details */}
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Status</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600">Utility Company</label>
              <input
                type="text"
                name="utilityCompany"
                value={formData.utilityCompany || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm text-gray-600">Notes</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded ${
              saving ? 'bg-gray-400' : 'bg-blue-600 text-white'
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button
            onClick={() => setShowVoiceAgent(true)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Make AI Call
          </button>
          
          <Link 
            href={`/dashboard/map?leadId=${lead.id}`}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            View on Map
          </Link>
        </div>
      </div>
      
      {/* Voice Agent Dialog */}
      {showVoiceAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full relative">
            <button
              onClick={() => setShowVoiceAgent(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <VoiceAgent 
              lead={lead} 
              onCallComplete={handleCallComplete}
              onClose={() => setShowVoiceAgent(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
} 