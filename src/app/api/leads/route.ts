import { NextResponse } from 'next/server';
import { Lead } from '@/types';
import { mockLeads } from './mockData';

// API handler for GET requests
export async function GET() {
  try {
    return NextResponse.json(mockLeads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// API handler for POST requests
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new lead with all fields from the type
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address || '',
      city: body.city || '',
      state: body.state || '',
      zipCode: body.zipCode || '',
      utilityCompany: body.utilityCompany,
      status: body.status || 'new',
      notes: body.notes || '',
      assignedTo: body.assignedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastContactedAt: body.lastContactedAt,
      source: body.source || 'manual',
      location: body.location,
      appointmentDate: body.appointmentDate
    };
    
    // Add new lead
    mockLeads.push(newLead);
    
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
} 