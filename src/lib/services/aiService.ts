import { AIMessage } from '@/types';
import OpenAI from 'openai';

// Mock conversation storage
const MESSAGES_KEY = 'gamechanger_ai_messages';

// Available AI model providers
type AIProvider = 'openai' | 'huggingface' | 'localai' | 'anthropic' | 'mock';
let currentProvider: AIProvider = 'mock'; // Default to mock for demo

// Initialize OpenAI client (would be used in production)
let openaiClient: OpenAI | null = null;
try {
  if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // For client-side usage (use with caution)
    });
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

// Initialize messages
const initializeMessages = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem(MESSAGES_KEY)) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify([]));
  }
};

// Get AI chat history
export const getMessages = (): AIMessage[] => {
  initializeMessages();
  
  if (typeof window !== 'undefined') {
    const messagesJson = localStorage.getItem(MESSAGES_KEY) || '[]';
    return JSON.parse(messagesJson);
  }
  
  return [];
};

// Add a message to history
export const addMessage = (role: 'user' | 'assistant' | 'system', content: string): AIMessage => {
  const messages = getMessages();
  
  const newMessage: AIMessage = {
    id: `msg-${Date.now()}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  };
  
  const updatedMessages = [...messages, newMessage];
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
  }
  
  return newMessage;
};

// Mock function to simulate AI responses
const mockAIResponse = async (prompt: string, contextMessages: AIMessage[] = []): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check for system prompt/context
  const systemMessage = contextMessages.find(m => m.role === 'system')?.content || '';
  const isIntroduction = systemMessage.includes('first contact') || 
                       systemMessage.includes('introduction') || 
                       contextMessages.length <= 2;
  
  const isAppointmentBooking = systemMessage.includes('scheduling an appointment') || 
                              prompt.toLowerCase().includes('appointment') || 
                              prompt.toLowerCase().includes('schedule');
  
  const isObjectionHandling = systemMessage.includes('objections or concerns') || 
                             prompt.toLowerCase().includes('not interested') || 
                             prompt.toLowerCase().includes('expensive');
  
  const isFollowUp = systemMessage.includes('following up') || 
                    contextMessages.length > 6 || 
                    systemMessage.includes('previous interaction');
  
  // Mock responses based on conversation type
  if (isAppointmentBooking) {
    return "I'd be happy to help you schedule an appointment. We have availability this Thursday at 10am or 2pm, or Friday at 1pm. Which would work better for you? The appointment takes about 30 minutes, and our representative will analyze your current utility usage to identify potential savings.";
  } else if (isObjectionHandling) {
    if (prompt.toLowerCase().includes('not interested')) {
      return "I understand. Many homeowners initially feel the same way. Our program isn't about selling anything - it's about gathering data to help improve utility services in your area and potentially save you money. Would it help if I explained more about how the program works and the benefits it provides?";
    } else if (prompt.toLowerCase().includes('expensive') || prompt.toLowerCase().includes('cost')) {
      return "I appreciate your concern about costs. The good news is our utility research program is completely free for homeowners. There's no cost to participate in the research, and the recommendations we provide could actually help lower your monthly utility bills.";
    } else if (prompt.toLowerCase().includes('time') || prompt.toLowerCase().includes('busy')) {
      return "I completely understand you're busy. The initial appointment only takes about 30 minutes, and we're flexible with scheduling. Would it be better if I called back next week, or perhaps you'd prefer an evening appointment?";
    } else {
      return "I understand your concerns. Our program is designed to help homeowners like you save on utility costs while contributing to important research. There's no obligation, and many participants find they save significantly on their monthly bills. Would you like me to address any specific concerns you have?";
    }
  } else if (isFollowUp) {
    return "I'm following up regarding our conversation about the utility research program. I wanted to check if you've had a chance to consider participating. Many homeowners in your area have found it valuable, with average savings of $30-50 per month on their utility bills. Is this something you're still interested in exploring?";
  } else {
    // Default introduction
    return "Hi there! I'm calling from Utility Impact Research. We're conducting a research program in your area to help homeowners reduce their utility costs and improve energy efficiency. We're not selling anything - this is a research initiative that provides you with a free analysis of your current utility usage and personalized recommendations for potential savings. Would you be interested in learning more about how this program works?";
  }
};

// Generate response with OpenAI
const openaiResponse = async (prompt: string, contextMessages: AIMessage[] = []): Promise<string> => {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized');
  }
  
  // Use provided context messages or get from history
  const messages = contextMessages.length > 0 
    ? contextMessages 
    : getMessages();
  
  const conversationHistory = messages.map(m => ({
    role: m.role,
    content: m.content
  }));
  
  // Add system message if not present
  if (!conversationHistory.some(m => m.role === 'system')) {
    conversationHistory.unshift({
      role: 'system',
      content: 'You are an AI assistant for Utility Impact Research. Help representatives with lead follow-up, scheduling appointments, and answering questions about the utility research program.'
    });
  }
  
  // Add the new user prompt if not already there
  if (!conversationHistory.some(m => m.role === 'user' && m.content === prompt)) {
    conversationHistory.push({
      role: 'user',
      content: prompt
    });
  }
  
  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversationHistory as any,
      temperature: 0.7,
    });
    
    return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
  } catch (error) {
    console.error('Error generating OpenAI response:', error);
    throw error;
  }
};

// Generate response with Hugging Face
const huggingFaceResponse = async (prompt: string, contextMessages: AIMessage[] = []): Promise<string> => {
  // Implementation would use Hugging Face Inference API
  // This would allow using fine-tuned open source models
  try {
    const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";
    
    // In production, would implement actual API call:
    // const response = await fetch(API_URL, {
    //   method: "POST",
    //   headers: { 
    //     "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HF_API_TOKEN}`,
    //     "Content-Type": "application/json" 
    //   },
    //   body: JSON.stringify({ inputs: prompt }),
    // });
    // const result = await response.json();
    // return result[0].generated_text;
    
    // For now, return mock response
    return await mockAIResponse(prompt, contextMessages);
  } catch (error) {
    console.error('Error generating Hugging Face response:', error);
    throw error;
  }
};

// Set the AI provider to use
export const setAIProvider = (provider: AIProvider): void => {
  currentProvider = provider;
};

// Generate AI response based on current provider
export const generateAIResponse = async (
  prompt: string, 
  contextMessages: AIMessage[] = []
): Promise<AIMessage> => {
  // Add user message if not already in context
  if (!contextMessages.some(m => m.role === 'user' && m.content === prompt)) {
    addMessage('user', prompt);
  }
  
  let responseText = '';
  
  try {
    // Generate response based on selected provider
    switch (currentProvider) {
      case 'openai':
        responseText = await openaiResponse(prompt, contextMessages);
        break;
      case 'huggingface':
        responseText = await huggingFaceResponse(prompt, contextMessages);
        break;
      case 'localai':
      case 'anthropic':
        // Would implement in production
        responseText = await mockAIResponse(prompt, contextMessages);
        break;
      case 'mock':
      default:
        responseText = await mockAIResponse(prompt, contextMessages);
        break;
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    responseText = "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
  
  // Add AI response to history
  return addMessage('assistant', responseText);
};

// Mock function to simulate voice generation
const mockGenerateVoice = async (text: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a mock audio URL
  return `https://example.com/audio/${Date.now()}.mp3`;
};

// Voice generation with ElevenLabs
export const generateVoiceAudio = async (text: string): Promise<string> => {
  // Check if we're in demo mode or missing API key
  const elevenLabsApiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  
  if (!elevenLabsApiKey || typeof window === 'undefined') {
    console.warn('ElevenLabs API key not found or running server-side. Using mock voice.');
    return mockGenerateVoice(text);
  }
  
  try {
    // Voice options
    const voice_id = "21m00Tcm4TlvDq8ikWAM"; // Josh voice - professional male
    const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`;
    
    // Call ElevenLabs API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': elevenLabsApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error('Error generating voice with ElevenLabs:', error);
    // Fall back to mock implementation
    return mockGenerateVoice(text);
  }
};

// Initialize and make an AI call to a lead
export const initiateAICall = async (phoneNumber: string, script: string): Promise<{ callSid: string }> => {
  // Check if we're in demo mode or missing API keys
  const twilioAccountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER;
  
  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    console.warn('Twilio credentials not found. Using mock call.');
    
    // Simulate a call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { callSid: `DEMO_CALL_${Date.now()}` };
  }
  
  try {
    // Call Twilio API directly (in real world, this would be done server-side)
    const apiUrl = 'https://api.twilio.com/2010-04-01/Accounts/' + twilioAccountSid + '/Calls.json';
    
    // Base64 encode the auth credentials
    const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
    
    // Create a TwiML response to control the call
    const twimlResponse = `
      <Response>
        <Say voice="alice">${script}</Say>
        <Pause length="1"/>
        <Say voice="alice">Goodbye!</Say>
      </Response>
    `;
    
    // Create a URL for the TwiML response (in production, you'd host this on your server)
    // For demo, we use Twilio's TwiML Bin feature - you'd need to create this in your Twilio account
    const twimlBinUrl = process.env.NEXT_PUBLIC_TWILIO_TWIML_BIN_URL || 'https://handler.twilio.com/twiml/YOUR_TWIML_BIN_ID';
    
    // Form parameters
    const formData = new URLSearchParams();
    formData.append('To', phoneNumber);
    formData.append('From', twilioPhoneNumber);
    formData.append('Url', twimlBinUrl);
    
    // Make the API call
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    
    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.status}`);
    }
    
    const result = await response.json();
    return { callSid: result.sid };
  } catch (error) {
    console.error('Error initiating call with Twilio:', error);
    
    // Fall back to mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { callSid: `ERROR_MOCK_CALL_${Date.now()}` };
  }
};

// Get available voices from ElevenLabs
export const getAvailableVoices = async (): Promise<any[]> => {
  const elevenLabsApiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  
  if (!elevenLabsApiKey) {
    // Return mock voices if no API key
    return [
      { voice_id: "21m00Tcm4TlvDq8ikWAM", name: "Josh (Demo)" },
      { voice_id: "mock-2", name: "Rachel (Demo)" },
      { voice_id: "mock-3", name: "Michael (Demo)" }
    ];
  }
  
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': elevenLabsApiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error('Error fetching ElevenLabs voices:', error);
    return [];
  }
};

/**
 * Mock function to simulate AI response generation
 * This would be replaced with actual API calls to OpenAI, Anthropic, etc. in a production environment
 */
export async function generateAIResponse(
  message: string, 
  context: AIMessage[] = []
): Promise<AIMessage> {
  // In a real app, this would call an LLM API
  const response: AIMessage = {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    content: 'This is a mock AI response. In production, this would use a real AI model.',
    timestamp: new Date().toISOString()
  };
  
  return response;
}

/**
 * Mock function to simulate voice generation
 * This would be replaced with actual API calls to ElevenLabs, etc. in a production environment
 */
export async function generateVoiceAudio(text: string): Promise<string> {
  // In a real app, this would call a text-to-speech API
  // For now, return a static audio sample
  return 'https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3';
} 