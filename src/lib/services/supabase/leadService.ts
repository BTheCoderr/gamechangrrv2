import { Lead } from '@/types';
import { getSupabaseClient, isUsingDemo, TABLES } from './supabaseClient';
import { getLeads as getLocalLeads, getLeadById as getLocalLeadById, createLead as createLocalLead, updateLead as updateLocalLead } from '../leadService';

// Get all leads from Supabase or localStorage depending on mode
export const getLeads = async (): Promise<Lead[]> => {
  // If in demo mode, use local storage
  if (isUsingDemo()) {
    return getLocalLeads();
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return getLocalLeads();
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.LEADS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads from Supabase:', error);
      return getLocalLeads();
    }

    // Transform data to match the Lead interface
    return data.map((lead: any) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      city: lead.city,
      state: lead.state,
      zipCode: lead.zip_code,
      utilityCompany: lead.utility_company,
      status: lead.status,
      notes: lead.notes,
      assignedTo: lead.assigned_to,
      createdAt: lead.created_at,
      updatedAt: lead.updated_at,
      lastContactedAt: lead.last_contacted_at,
      source: lead.source,
      location: lead.location,
      appointmentDate: lead.appointment_date,
    }));
  } catch (error) {
    console.error('Error fetching leads:', error);
    return getLocalLeads();
  }
};

// Get a single lead by ID
export const getLeadById = async (id: string): Promise<Lead | null> => {
  // If in demo mode, use local storage
  if (isUsingDemo()) {
    return getLocalLeadById(id);
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return getLocalLeadById(id);
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.LEADS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching lead from Supabase:', error);
      return getLocalLeadById(id);
    }

    if (!data) {
      return null;
    }

    // Transform data to match the Lead interface
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
      utilityCompany: data.utility_company,
      status: data.status,
      notes: data.notes,
      assignedTo: data.assigned_to,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      lastContactedAt: data.last_contacted_at,
      source: data.source,
      location: data.location,
      appointmentDate: data.appointment_date,
    };
  } catch (error) {
    console.error('Error fetching lead:', error);
    return getLocalLeadById(id);
  }
};

// Create a new lead
export const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
  // If in demo mode, use local storage
  if (isUsingDemo()) {
    return createLocalLead(leadData);
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return createLocalLead(leadData);
  }

  // Transform lead data to match Supabase schema
  const supabaseLeadData = {
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    address: leadData.address,
    city: leadData.city,
    state: leadData.state,
    zip_code: leadData.zipCode,
    utility_company: leadData.utilityCompany,
    status: leadData.status,
    notes: leadData.notes,
    assigned_to: leadData.assignedTo,
    source: leadData.source,
    location: leadData.location,
    appointment_date: leadData.appointmentDate,
  };

  try {
    const { data, error } = await supabase
      .from(TABLES.LEADS)
      .insert(supabaseLeadData)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating lead in Supabase:', error);
      return createLocalLead(leadData);
    }

    // Transform response to match the Lead interface
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
      utilityCompany: data.utility_company,
      status: data.status,
      notes: data.notes,
      assignedTo: data.assigned_to,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      lastContactedAt: data.last_contacted_at,
      source: data.source,
      location: data.location,
      appointmentDate: data.appointment_date,
    };
  } catch (error) {
    console.error('Error creating lead:', error);
    return createLocalLead(leadData);
  }
};

// Update an existing lead
export const updateLead = async (id: string, leadData: Partial<Lead>): Promise<Lead | null> => {
  // If in demo mode, use local storage
  if (isUsingDemo()) {
    return updateLocalLead(id, leadData);
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return updateLocalLead(id, leadData);
  }

  // Transform lead data to match Supabase schema
  const supabaseLeadData: Record<string, any> = {};

  if (leadData.name !== undefined) supabaseLeadData.name = leadData.name;
  if (leadData.email !== undefined) supabaseLeadData.email = leadData.email;
  if (leadData.phone !== undefined) supabaseLeadData.phone = leadData.phone;
  if (leadData.address !== undefined) supabaseLeadData.address = leadData.address;
  if (leadData.city !== undefined) supabaseLeadData.city = leadData.city;
  if (leadData.state !== undefined) supabaseLeadData.state = leadData.state;
  if (leadData.zipCode !== undefined) supabaseLeadData.zip_code = leadData.zipCode;
  if (leadData.utilityCompany !== undefined) supabaseLeadData.utility_company = leadData.utilityCompany;
  if (leadData.status !== undefined) supabaseLeadData.status = leadData.status;
  if (leadData.notes !== undefined) supabaseLeadData.notes = leadData.notes;
  if (leadData.assignedTo !== undefined) supabaseLeadData.assigned_to = leadData.assignedTo;
  if (leadData.lastContactedAt !== undefined) supabaseLeadData.last_contacted_at = leadData.lastContactedAt;
  if (leadData.source !== undefined) supabaseLeadData.source = leadData.source;
  if (leadData.location !== undefined) supabaseLeadData.location = leadData.location;
  if (leadData.appointmentDate !== undefined) supabaseLeadData.appointment_date = leadData.appointmentDate;

  // Always update updated_at
  supabaseLeadData.updated_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from(TABLES.LEADS)
      .update(supabaseLeadData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating lead in Supabase:', error);
      return updateLocalLead(id, leadData);
    }

    if (!data) {
      return null;
    }

    // Transform response to match the Lead interface
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
      utilityCompany: data.utility_company,
      status: data.status,
      notes: data.notes,
      assignedTo: data.assigned_to,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      lastContactedAt: data.last_contacted_at,
      source: data.source,
      location: data.location,
      appointmentDate: data.appointment_date,
    };
  } catch (error) {
    console.error('Error updating lead:', error);
    return updateLocalLead(id, leadData);
  }
}; 