import { Lead } from '@/types';

// For demo purposes, we'll use local storage to simulate a database
const LEADS_STORAGE_KEY = 'gamechanger_leads';

// Mock data for initial leads
const generateMockLeads = (): Lead[] => {
  return [
    {
      id: 'lead-1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '555-1234',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      utilityCompany: 'PG&E',
      status: 'new',
      notes: 'Interested in solar panels.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'form',
      location: {
        lat: 34.052235,
        lng: -118.243683,
      }
    },
    {
      id: 'lead-2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '555-5678',
      address: '456 Oak Ave',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      utilityCompany: 'SDGE',
      status: 'contacted',
      lastContactedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'manual',
      location: {
        lat: 32.715736,
        lng: -117.161087,
      }
    },
    {
      id: 'lead-3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      phone: '555-9012',
      address: '789 Pine Blvd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      utilityCompany: 'PG&E',
      status: 'booked',
      appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
      lastContactedAt: new Date().toISOString(),
      source: 'form',
      location: {
        lat: 37.774929,
        lng: -122.419418,
      }
    }
  ];
};

// Initialize leads in localStorage if they don't exist
const initializeLeads = () => {
  if (typeof window !== 'undefined') {
    const existingLeads = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!existingLeads) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(generateMockLeads()));
    }
  }
};

// Get all leads
export const getLeads = async (): Promise<Lead[]> => {
  initializeLeads();
  
  if (typeof window !== 'undefined') {
    const leadsJson = localStorage.getItem(LEADS_STORAGE_KEY) || '[]';
    return JSON.parse(leadsJson);
  }
  
  return [];
};

// Get a single lead by ID
export const getLeadById = async (id: string): Promise<Lead | null> => {
  const leads = await getLeads();
  return leads.find(lead => lead.id === id) || null;
};

// Create a new lead
export const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
  const leads = await getLeads();
  
  const newLead: Lead = {
    ...leadData,
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedLeads = [...leads, newLead];
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
  }
  
  return newLead;
};

// Update an existing lead
export const updateLead = async (id: string, leadData: Partial<Lead>): Promise<Lead | null> => {
  const leads = await getLeads();
  
  const leadIndex = leads.findIndex(lead => lead.id === id);
  
  if (leadIndex === -1) {
    return null;
  }
  
  const updatedLead: Lead = {
    ...leads[leadIndex],
    ...leadData,
    updatedAt: new Date().toISOString(),
  };
  
  leads[leadIndex] = updatedLead;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  }
  
  return updatedLead;
}; 