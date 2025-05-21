import { Lead } from '@/types';

// Mock database - this is just for the demo
// In a real app, you would use a real database
export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    utilityCompany: 'Pacific Power',
    status: 'new',
    notes: 'Interested in utility research programs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'manual',
    location: {
      lat: 37.7749,
      lng: -122.4194
    }
  },
  {
    id: 'lead-2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave',
    city: 'Springfield',
    state: 'IL',
    zipCode: '67890',
    utilityCompany: 'Central Electric',
    status: 'contacted',
    notes: 'Called on Tuesday, wants more information',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastContactedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'form',
    location: {
      lat: 39.7817,
      lng: -89.6501
    }
  },
  {
    id: 'lead-3',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    phone: '(555) 234-5678',
    address: '789 Pine St',
    city: 'Riverdale',
    state: 'NY',
    zipCode: '54321',
    utilityCompany: 'Northeast Utilities',
    status: 'booked',
    notes: 'Appointment scheduled for next week',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastContactedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'manual',
    location: {
      lat: 40.7128,
      lng: -74.0060
    }
  }
]; 