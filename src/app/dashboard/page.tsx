'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserPlusIcon, 
  PhoneIcon, 
  CalendarIcon, 
  MapPinIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { Lead } from '@/types';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch('/api/leads');
        if (response.ok) {
          const data = await response.json();
          setLeads(data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, []);

  // Calculate statistics
  const totalLeads = leads.length;
  const newLeads = leads.filter(lead => lead.status === 'new').length;
  const appointmentsBooked = leads.filter(lead => lead.status === 'booked').length;
  const upcomingAppointments = leads.filter(lead => 
    lead.status === 'booked' && 
    lead.appointmentDate && 
    new Date(lead.appointmentDate) > new Date()
  ).length;

  // Helper for stat change indicators
  const StatChangeIndicator = ({ change }: { change: number }) => {
    const isPositive = change >= 0;
    return (
      <span className={`inline-flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <ArrowUpIcon className="h-3 w-3 mr-0.5" />
        ) : (
          <ArrowDownIcon className="h-3 w-3 mr-0.5" />
        )}
        {Math.abs(change)}%
      </span>
    );
  };

  // Dashboard stat cards
  const stats = [
    { name: 'Total Leads', value: totalLeads, change: 12, icon: UserPlusIcon, color: 'bg-blue-500' },
    { name: 'New Leads', value: newLeads, change: 8, icon: PhoneIcon, color: 'bg-yellow-500' },
    { name: 'Appointments', value: appointmentsBooked, change: 24, icon: CalendarIcon, color: 'bg-green-500' },
    { name: 'Upcoming', value: upcomingAppointments, change: -4, icon: MapPinIcon, color: 'bg-purple-500' },
  ];

  // Recent leads
  const recentLeads = leads.slice(0, 5);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 h-32">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-6"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded mb-3"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="ml-2">
                    <StatChangeIndicator change={stat.change} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Recent Leads</h2>
          {recentLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          lead.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'booked' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/dashboard/lead/${lead.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No leads found.</p>
          )}
          <div className="mt-4">
            <Link href="/dashboard/leads" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All Leads &rarr;
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/dashboard/leads/new" className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add New Lead
            </Link>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <PhoneIcon className="h-5 w-5 mr-2 text-green-600" />
              Call Lead
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <CalendarIcon className="h-5 w-5 mr-2 text-purple-600" />
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 