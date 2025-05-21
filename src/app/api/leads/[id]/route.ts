import { NextResponse } from 'next/server';
import { Lead } from '@/types';

// Reference to the same mockLeads from /api/leads/route.ts
// In a real app, this would be a database connection
// For demo purposes, we're simulating with an imported mock
// This is a simplified approach - in production you'd use a real database!
import { mockLeads } from '../mockData';

// Get a lead by ID
const getLeadById = (id: string): Lead | undefined => {
  return mockLeads.find(lead => lead.id === id);
};

// API handler for GET requests (get lead by ID)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const lead = getLeadById(id);
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(lead);
  } catch (error) {
    console.error(`Error fetching lead ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// API handler for PATCH requests (update lead)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const body = await request.json();
    const leadIndex = mockLeads.findIndex(lead => lead.id === id);
    
    if (leadIndex === -1) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Update lead with new fields
    const updatedLead = {
      ...mockLeads[leadIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    // Replace lead in array
    mockLeads[leadIndex] = updatedLead;
    
    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error(`Error updating lead ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// API handler for DELETE requests (delete lead)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const initialLength = mockLeads.length;
    const indexToRemove = mockLeads.findIndex(lead => lead.id === id);
    
    if (indexToRemove === -1) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Remove lead
    mockLeads.splice(indexToRemove, 1);
    
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error(`Error deleting lead ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
} 