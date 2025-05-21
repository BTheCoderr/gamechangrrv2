import { NextResponse } from 'next/server';
import { AIMessage } from '@/types';
import { mockLeads } from '../../mockData';

// Mock chat histories for each lead
const chatHistories: Record<string, AIMessage[]> = {
  'lead-1': [
    {
      id: 'system-1',
      role: 'system',
      content: 'You are an AI assistant for Utility Impact Research. You\'re speaking with John Smith about scheduling an appointment to discuss utility research programs.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'assistant-1',
      role: 'assistant',
      content: 'Hello John, I\'m the virtual assistant for Utility Impact Research. How can I help you today?',
      timestamp: new Date(Date.now() - 29 * 60 * 1000).toISOString()
    },
    {
      id: 'user-1',
      role: 'user',
      content: 'I received a call about some utility research programs.',
      timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString()
    },
    {
      id: 'assistant-2',
      role: 'assistant',
      content: 'That\'s right! We\'re conducting research on utility usage and offering free assessments. Would you be interested in scheduling an appointment to learn more?',
      timestamp: new Date(Date.now() - 27 * 60 * 1000).toISOString()
    }
  ],
  'lead-2': [
    {
      id: 'system-1',
      role: 'system',
      content: 'You are an AI assistant for Utility Impact Research. You\'re speaking with Sarah Johnson about scheduling an appointment to discuss utility research programs.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'assistant-1',
      role: 'assistant',
      content: 'Hello Sarah, I\'m the virtual assistant for Utility Impact Research. Is this a good time to talk about potential savings on your utility bills?',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000).toISOString()
    }
  ],
  'lead-3': [
    {
      id: 'system-1',
      role: 'system',
      content: 'You are an AI assistant for Utility Impact Research. You\'re speaking with Michael Brown about scheduling an appointment to discuss utility research programs.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'assistant-1',
      role: 'assistant',
      content: 'Hello Michael, I\'m the virtual assistant for Utility Impact Research. I\'m following up on our conversation about utility research programs.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000).toISOString()
    },
    {
      id: 'user-1',
      role: 'user',
      content: 'Yes, I\'d like to schedule an appointment to learn more.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString()
    },
    {
      id: 'assistant-2',
      role: 'assistant',
      content: 'Great! I\'ve scheduled an appointment for next week. You\'ll receive a confirmation email shortly.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString()
    }
  ]
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    // Check if lead exists
    const lead = mockLeads.find(lead => lead.id === id);
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Get chat history or return empty array if none exists
    const messages = chatHistories[id] || [];
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error(`Error fetching chat history for lead ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const body = await request.json();
    
    // Check if lead exists
    const lead = mockLeads.find(lead => lead.id === id);
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Validate message
    if (!body.content || !body.role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new message
    const newMessage: AIMessage = {
      id: `${body.role}-${Date.now()}`,
      role: body.role,
      content: body.content,
      timestamp: new Date().toISOString()
    };
    
    // Initialize chat history if it doesn't exist
    if (!chatHistories[id]) {
      chatHistories[id] = [];
    }
    
    // Add message to chat history
    chatHistories[id].push(newMessage);
    
    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error(`Error adding message to chat history for lead ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to add message to chat history' },
      { status: 500 }
    );
  }
}

// API handler for DELETE requests (clear chat history)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const leadId = params.id;
  
  try {
    chatHistories[leadId] = [];
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error(`Error clearing chat history for lead ${leadId}:`, error);
    return NextResponse.json(
      { error: 'Failed to clear chat history' },
      { status: 500 }
    );
  }
} 