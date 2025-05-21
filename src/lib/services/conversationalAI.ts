import { AIMessage } from '@/types';

// Define conversation types
export type ConversationType = 'general' | 'inquiry' | 'objection' | 'booking';

// Keywords that might indicate different conversation types
const conversationKeywords = {
  inquiry: [
    'what', 'how', 'who', 'when', 'where', 'why', 'information', 'details', 'learn',
    'tell me', 'explain', 'program', 'service', 'cost', 'price', 'free'
  ],
  
  objection: [
    'no', 'not interested', "don't want", 'spam', 'scam', 'busy', 'later',
    'expensive', 'waste', 'time', 'telemarketer', 'annoying', 'money',
    'hesitant', 'unsure', 'doubt', 'uncertain', 'concerned'
  ],
  
  booking: [
    'appointment', 'schedule', 'book', 'meet', 'meeting', 'time', 'date',
    'available', 'calendar', 'slot', 'visit', 'when', 'soon', 'next week',
    'tomorrow', 'morning', 'afternoon', 'evening'
  ]
};

/**
 * Detects the type of conversation based on message history
 * @param messages The history of AI messages in the conversation
 * @returns The detected conversation type
 */
export function detectConversationType(messages: AIMessage[]): ConversationType {
  // If no messages, default to general
  if (!messages || messages.length === 0) {
    return 'general';
  }
  
  // Only look at user messages for analysis
  const userMessages = messages.filter(msg => msg.role === 'user');
  
  if (userMessages.length === 0) {
    return 'general';
  }
  
  // Get the last few user messages, with more weight on recent ones
  const recentMessages = userMessages.slice(-3);
  const combinedText = recentMessages.map(msg => msg.content.toLowerCase()).join(' ');
  
  // Count keyword matches for each category
  const scores: Record<ConversationType, number> = {
    inquiry: 0,
    objection: 0,
    booking: 0,
    general: 0  // Base score
  };
  
  // Check for keywords in each category
  for (const category of Object.keys(conversationKeywords) as Array<keyof typeof conversationKeywords>) {
    for (const keyword of conversationKeywords[category]) {
      if (combinedText.includes(keyword.toLowerCase())) {
        scores[category as ConversationType] += 1;
      }
    }
  }
  
  // Find the category with the highest score
  let highestScore = 0;
  let detectedType: ConversationType = 'general';
  
  for (const [type, score] of Object.entries(scores) as [ConversationType, number][]) {
    if (score > highestScore) {
      highestScore = score;
      detectedType = type;
    }
  }
  
  return detectedType;
} 