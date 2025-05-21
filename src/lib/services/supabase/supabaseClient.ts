import { createClient } from '@supabase/supabase-js';
import { Lead, AIMessage, User } from '@/types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback to demo mode if environment variables are not set
const isDemoMode = !supabaseUrl || !supabaseKey;

// Create Supabase client if credentials are available
const supabase = !isDemoMode
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

// Utility to check if we're using demo mode
export const isUsingDemo = (): boolean => {
  return isDemoMode;
};

// Database table names
export const TABLES = {
  LEADS: 'leads',
  MESSAGES: 'ai_messages',
  USERS: 'users',
};

// Get current client
export const getSupabaseClient = () => {
  if (!supabase) {
    console.warn('Supabase client not initialized. Using demo mode.');
  }
  return supabase;
};

// Initialize the database with demo data
export const initializeDatabase = async (): Promise<void> => {
  if (isDemoMode) {
    console.warn('Using demo mode with localStorage. Supabase connection not configured.');
    return;
  }

  const client = getSupabaseClient();

  if (!client) {
    return;
  }

  try {
    // Check if tables exist and create them if they don't
    const { error: leadsError } = await client
      .from(TABLES.LEADS)
      .select('id')
      .limit(1);

    if (leadsError) {
      // Create leads table
      await client.rpc('create_leads_table');
    }

    const { error: messagesError } = await client
      .from(TABLES.MESSAGES)
      .select('id')
      .limit(1);

    if (messagesError) {
      // Create messages table
      await client.rpc('create_messages_table');
    }

    const { error: usersError } = await client
      .from(TABLES.USERS)
      .select('id')
      .limit(1);

    if (usersError) {
      // Create users table
      await client.rpc('create_users_table');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default supabase; 