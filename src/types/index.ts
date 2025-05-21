export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  utilityCompany?: string;
  status: 'new' | 'contacted' | 'follow-up' | 'booked' | 'not-interested' | 'converted';
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  source: 'form' | 'manual' | 'import';
  location?: {
    lat: number;
    lng: number;
  };
  appointmentDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'rep' | 'manager';
  phone?: string;
  avatar?: string;
}

export interface AIMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
} 