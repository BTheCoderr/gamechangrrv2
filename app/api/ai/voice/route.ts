import { NextRequest, NextResponse } from 'next/server';
import { generateVoiceAudio } from '@/src/lib/services/aiService';

// POST handler - Generate voice audio from text
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { text } = data;
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    
    // Generate voice audio
    const audioUrl = await generateVoiceAudio(text);
    
    return NextResponse.json({ url: audioUrl });
  } catch (error) {
    console.error('Error generating voice audio:', error);
    return NextResponse.json({ error: 'Failed to generate voice audio' }, { status: 500 });
  }
} 