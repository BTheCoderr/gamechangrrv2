import { NextResponse } from 'next/server';
import { AIMessage } from '@/types';

// Sample responses for different conversation types
const sampleResponses = {
  general: [
    "I'd be happy to help you schedule an appointment with one of our utility research specialists.",
    "Our program helps homeowners identify potential savings on their utility bills. When would be a good time for an appointment?",
    "We're currently offering free assessments in your area. Would you like to schedule a time for a specialist to visit?",
    "Based on your utility company, you might qualify for special programs. Can I set up an appointment for you to learn more?",
    "Thank you for your interest in our utility research program. Would you prefer a morning or afternoon appointment?"
  ],
  inquiry: [
    "Great question! Our utility research program helps identify inefficiencies in your home's energy usage and potential rebates from your utility company.",
    "Our specialists conduct a thorough assessment of your home's energy usage patterns and provide recommendations for improvements and savings.",
    "The appointment typically takes about 30-45 minutes, and our specialist will explain the various programs available to you.",
    "There's no cost for the initial assessment. It's a complimentary service we provide to help homeowners save on their utility bills.",
    "Many homeowners see savings of 10-30% on their utility bills after implementing our recommendations."
  ],
  objection: [
    "I understand your concerns. This isn't a sales call - we're conducting research on utility usage patterns and offering free information about available programs.",
    "That's completely understandable. Would it help if I explained more about what happens during the appointment?",
    "You're under no obligation to purchase anything. This is an informational appointment to help you understand potential savings.",
    "I appreciate your hesitation. Many homeowners initially feel the same way, but end up grateful for the information we provide.",
    "Would it be more convenient to schedule at a different time? We can work around your schedule."
  ],
  booking: [
    "Perfect! I can schedule you for an appointment next Tuesday at 2:00 PM. Does that work for you?",
    "Great! I have an opening this Thursday at 10:00 AM or Friday at 3:00 PM. Which would you prefer?",
    "I've scheduled your appointment for Monday at 1:00 PM. You'll receive a confirmation email shortly.",
    "Thank you for scheduling! Our specialist will bring all the information about available utility programs.",
    "Your appointment is confirmed. If you need to reschedule, just let us know and we'll find another time that works."
  ]
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, conversationType = 'general', context } = body;
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Select a random response from the appropriate category
    const responses = sampleResponses[conversationType as keyof typeof sampleResponses] || sampleResponses.general;
    const randomIndex = Math.floor(Math.random() * responses.length);
    const responseText = responses[randomIndex];
    
    // Personalize the response if lead info is provided
    let personalizedResponse = responseText;
    if (context?.leadName) {
      personalizedResponse = personalizedResponse.replace(
        /you/g, 
        `you, ${context.leadName},`
      ).replace(
        /\bYou\b/g, 
        `You, ${context.leadName},`
      );
    }
    
    // Create AI message
    const aiMessage: AIMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: personalizedResponse,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
} 