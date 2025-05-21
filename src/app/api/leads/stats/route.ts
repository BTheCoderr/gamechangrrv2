import { NextResponse } from 'next/server';
import { Lead } from '@/types';

// Mock database - in production this would use Prisma/MongoDB/etc.
const LEADS_KEY = 'gamechanger_leads';

// Helper to initialize leads in localStorage (only in browser)
const initializeLeads = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem(LEADS_KEY)) {
    localStorage.setItem(LEADS_KEY, JSON.stringify([]));
  }
};

// Get all leads
const getLeads = (): Lead[] => {
  if (typeof window !== 'undefined') {
    initializeLeads();
    const leadsJson = localStorage.getItem(LEADS_KEY) || '[]';
    return JSON.parse(leadsJson);
  }
  
  return [];
};

// Calculate various lead statistics
const calculateLeadStats = (leads: Lead[]) => {
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  // Current stats
  const totalLeads = leads.length;
  const newLeads = leads.filter(lead => lead.status === 'new').length;
  const contactedLeads = leads.filter(lead => lead.status === 'contacted' || lead.status === 'follow-up').length;
  const bookedAppointments = leads.filter(lead => lead.status === 'booked').length;
  const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
  const notInterested = leads.filter(lead => lead.status === 'not-interested').length;
  
  // Lead sources
  const leadsBySource = {
    form: leads.filter(lead => lead.source === 'form').length,
    manual: leads.filter(lead => lead.source === 'manual').length,
    import: leads.filter(lead => lead.source === 'import').length,
  };
  
  // Upcoming appointments
  const upcomingAppointments = leads.filter(lead => 
    lead.status === 'booked' && 
    lead.appointmentDate && 
    new Date(lead.appointmentDate) > now
  ).length;
  
  // Recent activity
  const recentLeads = leads.filter(lead => new Date(lead.createdAt) > oneWeekAgo).length;
  const recentBookings = leads.filter(lead => 
    lead.status === 'booked' && 
    lead.updatedAt && 
    new Date(lead.updatedAt) > oneWeekAgo
  ).length;
  
  // Conversion rates
  const contactedToBooked = contactedLeads > 0 
    ? (bookedAppointments / contactedLeads) * 100 
    : 0;
  
  const bookedToConverted = bookedAppointments > 0 
    ? (convertedLeads / bookedAppointments) * 100 
    : 0;
  
  const overallConversion = totalLeads > 0 
    ? (convertedLeads / totalLeads) * 100 
    : 0;
  
  return {
    counts: {
      total: totalLeads,
      new: newLeads,
      contacted: contactedLeads,
      booked: bookedAppointments,
      converted: convertedLeads,
      notInterested,
      upcomingAppointments,
      recentLeads,
      recentBookings
    },
    sources: leadsBySource,
    rates: {
      contactedToBooked: parseFloat(contactedToBooked.toFixed(2)),
      bookedToConverted: parseFloat(bookedToConverted.toFixed(2)),
      overallConversion: parseFloat(overallConversion.toFixed(2))
    }
  };
};

export async function GET() {
  try {
    const leads = getLeads();
    const stats = calculateLeadStats(leads);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error calculating lead stats:', error);
    return NextResponse.json(
      { error: 'Failed to calculate lead statistics' },
      { status: 500 }
    );
  }
} 