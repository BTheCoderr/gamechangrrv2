'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lead } from '@/types';
import BookingCalendar from '@/components/BookingCalendar';
import StatusBadge from '@/components/StatusBadge';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, CalendarIcon, ChatBubbleLeftRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import ChatWidget from '@/components/ChatWidget';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const leadId = params?.id as string;
  
  useEffect(() => {
    async function fetchLead() {
      if (!leadId) {
        router.push('/dashboard/leads');
        return;
      }
      
      try {
        const response = await fetch(`/api/leads/${leadId}`);
        if (response.ok) {
          const data = await response.json();
          setLead(data);
        } else {
          setError('Failed to load lead data');
          setTimeout(() => router.push('/dashboard/leads'), 3000);
        }
      } catch (err) {
        console.error('Error fetching lead:', err);
        setError('An error occurred while loading lead data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLead();
  }, [leadId, router]);
  
  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-sm p-6 h-96">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-100 rounded w-2/3"></div>
                ))}
              </div>
            </div>
            <div className="col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 h-48"></div>
              <div className="bg-white rounded-lg shadow-sm p-6 h-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !lead) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Lead not found'}</p>
              <p className="text-sm text-red-700 mt-2">Redirecting to leads page...</p>
            </div>
          </div>
        </div>
        <Link href="/dashboard/leads" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Return to Leads
        </Link>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard/leads" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Leads
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lead Info Card */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{lead.name}</h1>
            <StatusBadge status={lead.status} />
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
              <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                {lead.phone}
              </a>
            </div>
            
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
              <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                {lead.email}
              </a>
            </div>
            
            {lead.address && (
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-1" />
                <div>
                  <p>{lead.address}</p>
                  <p>{lead.city}, {lead.state} {lead.zipCode}</p>
                </div>
              </div>
            )}
            
            {lead.appointmentDate && (
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <p>Appointment: {new Date(lead.appointmentDate).toLocaleString()}</p>
              </div>
            )}
            
            {lead.notes && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700">Notes</h3>
                <p className="mt-1 text-gray-600 whitespace-pre-line">{lead.notes}</p>
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Status History</h2>
            <div className="border rounded divide-y">
              {/* In production, would show actual status history */}
              <div className="p-3 flex justify-between">
                <div>
                  <p className="font-medium">Status changed to {lead.status}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(lead.updatedAt).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={lead.status} />
              </div>
              <div className="p-3 flex justify-between">
                <div>
                  <p className="font-medium">Lead created</p>
                  <p className="text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status="new" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking & AI Card */}
        <div className="col-span-1 space-y-6">
          {/* Booking Calendar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Schedule Appointment</h2>
            <BookingCalendar lead={lead} />
          </div>
          
          {/* AI Assistant */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">AI Assistant</h2>
            </div>
            <ChatWidget lead={lead} />
          </div>
        </div>
      </div>
    </div>
  );
} 