'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLeads } from '@/lib/services/leadService';
import { Lead } from '@/types';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  // Fetch leads
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

  // Filter leads based on status
  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === filter);

  // Get count by status
  const getCounts = () => {
    const counts = {
      all: leads.length,
      new: 0,
      contacted: 0,
      'follow-up': 0,
      booked: 0,
      'not-interested': 0,
      converted: 0
    };
    
    leads.forEach(lead => {
      if (lead.status && counts[lead.status as keyof typeof counts] !== undefined) {
        counts[lead.status as keyof typeof counts]++;
      }
    });
    
    return counts;
  };
  
  const counts = getCounts();

  // Calculate conversion stats
  const getConversionRate = () => {
    const converted = counts.converted || 0;
    const total = counts.all || 1; // Avoid division by zero
    return Math.round((converted / total) * 100);
  };

  const conversionRate = getConversionRate();

  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'follow-up': return 'bg-purple-500';
      case 'booked': return 'bg-green-500';
      case 'not-interested': return 'bg-red-500';
      case 'converted': return 'bg-teal-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Lead Dashboard</h1>
        
        <div>
          <Link
            href="/dashboard/leads/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="mr-2">+</span>
            Add New Lead
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold">{counts.all}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-800">👥</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Appointments Booked</p>
              <p className="text-2xl font-bold">{counts.booked}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-800">📅</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </div>
            <div className="p-3 rounded-full bg-teal-100 text-teal-800">📈</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Follow-up Required</p>
              <p className="text-2xl font-bold">{counts['follow-up']}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-800">🔔</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <Link
            href="/dashboard/voice-agent"
            className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100"
          >
            <div className="p-2 rounded-md bg-green-500 text-white mr-3">🎤</div>
            <div>
              <p className="font-medium">Voice Agent</p>
              <p className="text-xs text-gray-500">Make automated calls</p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/map"
            className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100"
          >
            <div className="p-2 rounded-md bg-purple-500 text-white mr-3">🗺️</div>
            <div>
              <p className="font-medium">Map View</p>
              <p className="text-xs text-gray-500">View leads by location</p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/settings"
            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <div className="p-2 rounded-md bg-gray-500 text-white mr-3">⚙️</div>
            <div>
              <p className="font-medium">Settings</p>
              <p className="text-xs text-gray-500">Configure your account</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Lead Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Lead Status</h2>
            
            <div className="flex space-x-2">
              {Object.entries(counts)
                .filter(([status]) => status !== 'all')
                .map(([status, count]) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status === filter ? 'all' : status)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      filter === status 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.replace('-', ' ').slice(1)}
                  </button>
                ))}
              
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="px-3 py-1 rounded-full text-xs bg-gray-800 text-white"
                >
                  Show All
                </button>
              )}
            </div>
          </div>
          
          {/* Leads Table */}
          <div className="overflow-x-auto">
            {filteredLeads.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No leads found</p>
                {filter !== 'all' && (
                  <p className="mt-2 text-sm text-gray-400">
                    Try selecting a different status
                  </p>
                )}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Contact
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.slice(0, 5).map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                            {lead.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.phone}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'follow-up' ? 'bg-purple-100 text-purple-800' :
                            lead.status === 'booked' ? 'bg-green-100 text-green-800' :
                            lead.status === 'not-interested' ? 'bg-red-100 text-red-800' :
                            lead.status === 'converted' ? 'bg-teal-100 text-teal-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {lead.status?.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.lastContactedAt 
                          ? new Date(lead.lastContactedAt).toLocaleDateString() 
                          : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <Link 
                            href={`/dashboard/leads/${lead.id}`} 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Details
                          </Link>
                          <Link 
                            href={`/dashboard/voice-agent?leadId=${lead.id}`} 
                            className="text-green-600 hover:text-green-900"
                          >
                            Call
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {filteredLeads.length > 5 && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                <Link href="/dashboard/leads" className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                  View all {filteredLeads.length} leads →
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Lead Distribution</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {Object.entries(counts)
                .filter(([status]) => status !== 'all' && counts[status as keyof typeof counts] > 0)
                .map(([status, count]) => (
                  <div key={status}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {status.charAt(0).toUpperCase() + status.replace('-', ' ').slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {count} ({Math.round((count / (counts.all || 1)) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${getStatusColorClass(status)}`}
                        style={{ width: `${(count / (counts.all || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              
              {Object.values(counts).filter(count => count > 0).length <= 1 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Not enough data to show distribution</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 