'use client';

import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  PhoneIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface LeadStats {
  counts: {
    total: number;
    new: number;
    contacted: number;
    booked: number;
    converted: number;
    notInterested: number;
    upcomingAppointments: number;
    recentLeads: number;
    recentBookings: number;
  };
  sources: {
    form: number;
    manual: number;
    import: number;
  };
  rates: {
    contactedToBooked: number;
    bookedToConverted: number;
    overallConversion: number;
  };
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/leads/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError('Failed to load statistics');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('An error occurred while fetching statistics');
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-8">Analytics</h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-1"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-40 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-8">Analytics</h1>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error || 'Failed to load analytics data. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Leads', value: stats.counts.total, icon: UserIcon, color: 'bg-blue-500' },
    { name: 'Contacted', value: stats.counts.contacted, icon: PhoneIcon, color: 'bg-yellow-500' },
    { name: 'Appointments', value: stats.counts.booked, icon: CalendarIcon, color: 'bg-green-500' },
    { name: 'Converted', value: stats.counts.converted, icon: CheckCircleIcon, color: 'bg-purple-500' },
  ];

  const conversionRates = [
    { name: 'Contact → Booked', value: stats.rates.contactedToBooked },
    { name: 'Booked → Converted', value: stats.rates.bookedToConverted },
    { name: 'Overall Conversion', value: stats.rates.overallConversion },
  ];

  const leadSources = [
    { name: 'Web Form', value: stats.sources.form },
    { name: 'Manual Entry', value: stats.sources.manual },
    { name: 'Data Import', value: stats.sources.import },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8">Analytics</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Detailed stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Conversion Rates</h2>
          <div className="space-y-4">
            {conversionRates.map((rate) => (
              <div key={rate.name} className="flex justify-between items-center">
                <span className="text-gray-700">{rate.name}</span>
                <div className="flex items-center">
                  <div className="w-40 bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(rate.value, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-medium">{rate.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Lead Sources</h2>
          <div className="grid grid-cols-3 gap-4">
            {leadSources.map((source) => (
              <div key={source.name} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{source.value}</div>
                <div className="text-sm text-gray-600">{source.name}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-lg font-semibold text-green-600">{stats.counts.upcomingAppointments}</div>
                <div className="text-sm text-green-800">Upcoming Appointments</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-lg font-semibold text-yellow-600">{stats.counts.notInterested}</div>
                <div className="text-sm text-yellow-800">Not Interested</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-lg font-semibold text-blue-600">{stats.counts.recentLeads}</div>
                <div className="text-sm text-blue-800">New This Week</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-lg font-semibold text-purple-600">{stats.counts.recentBookings}</div>
                <div className="text-sm text-purple-800">Recent Bookings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 