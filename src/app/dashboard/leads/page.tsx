'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserPlusIcon, MagnifyingGlassIcon, FunnelIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Lead } from '@/types';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'all'>('all');

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch('/api/leads');
        if (response.ok) {
          const data = await response.json();
          setLeads(data);
          setFilteredLeads(data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, []);

  useEffect(() => {
    // Filter leads based on search query and status filter
    let result = leads;

    if (statusFilter !== 'all') {
      result = result.filter(lead => lead.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        lead.address?.toLowerCase().includes(query) ||
        lead.city?.toLowerCase().includes(query)
      );
    }

    setFilteredLeads(result);
  }, [searchQuery, statusFilter, leads]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as Lead['status'] | 'all');
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-8">Leads</h1>
        <div className="animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="mt-4 md:mt-0">
          <Link
            href="/dashboard/leads/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add New Lead
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="md:flex md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-full md:w-48">
            <div className="flex items-center">
              <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="follow-up">Follow-up</option>
                <option value="booked">Booked</option>
                <option value="not-interested">Not Interested</option>
                <option value="converted">Converted</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <p className="text-gray-600 mb-4">
        Showing {filteredLeads.length} of {leads.length} leads
      </p>
      
      {/* Lead cards */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No leads found matching your criteria.</p>
          </div>
        ) : (
          filteredLeads.map(lead => (
            <div key={lead.id} className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{lead.name}</h3>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      lead.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'follow-up' ? 'bg-purple-100 text-purple-800' :
                      lead.status === 'booked' ? 'bg-green-100 text-green-800' :
                      lead.status === 'converted' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {lead.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {lead.address && (
                      <p>{lead.address}, {lead.city}, {lead.state} {lead.zipCode}</p>
                    )}
                    {lead.appointmentDate && (
                      <p className="font-medium text-green-700">
                        Appointment: {new Date(lead.appointmentDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <button
                    onClick={() => handleCall(lead.phone)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PhoneIcon className="h-4 w-4 text-green-600 mr-1" />
                    Call
                  </button>
                  <button
                    onClick={() => handleEmail(lead.email)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <EnvelopeIcon className="h-4 w-4 text-blue-600 mr-1" />
                    Email
                  </button>
                  <Link
                    href={`/dashboard/lead/${lead.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 