import { NextRequest, NextResponse } from 'next/server';
import { getLeads, getLeadById, createLead, updateLead } from '@/src/lib/services/leadService';
import { Lead } from '@/src/types';

// GET handler - fetch all leads or a specific lead by ID
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');

  try {
    if (id) {
      // Get a specific lead by ID
      const lead = await getLeadById(id);
      
      if (!lead) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
      
      return NextResponse.json(lead);
    } else {
      // Get all leads
      const leads = await getLeads();
      return NextResponse.json(leads);
    }
  } catch (error) {
    console.error('Error fetching lead(s):', error);
    return NextResponse.json({ error: 'Failed to fetch lead data' }, { status: 500 });
  }
}

// POST handler - create a new lead
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newLead = await createLead(data);
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

// PUT handler - update an existing lead
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }
    
    const updatedLead = await updateLead(id, updateData as Partial<Lead>);
    
    if (!updatedLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
} 