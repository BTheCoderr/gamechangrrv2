import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, setAIProvider } from '@/src/lib/services/aiService';
import { AIMessage } from '@/src/types';

// POST handler - Generate AI response to user input
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { prompt, provider } = data;
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    // Set AI provider if specified
    if (provider) {
      setAIProvider(provider);
    }
    
    // Generate AI response
    const response = await generateAIResponse(prompt);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
} 