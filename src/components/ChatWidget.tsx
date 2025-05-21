'use client';

import { useState, useEffect, useRef } from 'react';
import { Lead } from '@/types';
import { PaperAirplaneIcon, MicrophoneIcon, SpeakerWaveIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { AIMessage } from '@/types';
import { detectConversationType } from '@/lib/services/conversationalAI';

interface ChatWidgetProps {
  lead: Lead;
}

export default function ChatWidget({ lead }: ChatWidgetProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        // In production, fetch from API
        const response = await fetch(`/api/leads/${lead.id}/chat-history`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Start with a system message for context
        const initialMessage: AIMessage = {
          id: `system-${Date.now()}`,
          role: 'system',
          content: `You are an AI assistant for Utility Impact Research. You're speaking with ${lead.name} about scheduling an appointment to discuss utility research programs.`,
          timestamp: new Date().toISOString()
        };
        setMessages([initialMessage]);
      }
    };
    
    loadChatHistory();
  }, [lead.id, lead.name]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle audio player
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);
  
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Detect conversation type based on context
      const conversationType = detectConversationType(messages);
      
      // Generate AI response
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationType,
          context: {
            leadName: lead.name,
            leadPhone: lead.phone,
            leadEmail: lead.email,
            messages
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Add AI response to chat
        setMessages(prev => [...prev, data.message]);
        
        // Get voice audio if available
        if (data.message.content) {
          try {
            const voiceResponse = await fetch('/api/ai/voice', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: data.message.content })
            });
            
            if (voiceResponse.ok) {
              const voiceData = await voiceResponse.json();
              setAudioUrl(voiceData.audioUrl);
              
              // Auto-play voice
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.play().catch(err => console.error('Error playing audio:', err));
                }
              }, 500);
            }
          } catch (error) {
            console.error('Error getting voice audio:', error);
          }
        }
      } else {
        // Handle error
        const errorMessage: AIMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: AIMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      }
    }
  };
  
  // Only show user and assistant messages in the UI
  const visibleMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant');
  
  return (
    <div className="flex flex-col h-[400px]">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50 rounded-md mb-4">
        {visibleMessages.length === 0 ? (
          <div className="text-gray-400 text-center py-6">
            No messages yet. Start a conversation!
          </div>
        ) : (
          visibleMessages.map(message => (
            <div 
              key={message.id}
              className={`mb-3 ${message.role === 'user' ? 'text-right' : ''}`}
            >
              <div 
                className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${
                  message.role === 'user' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-white border text-gray-800'
                }`}
              >
                {message.content}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Audio player */}
      {audioUrl && (
        <div className="mb-4 p-2 bg-gray-100 rounded-md flex items-center">
          <button 
            onClick={toggleAudio}
            className="bg-blue-600 text-white p-2 rounded-full"
          >
            {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
          </button>
          <div className="ml-2 text-sm text-gray-600 flex-1">
            AI Voice Response
          </div>
          <audio ref={audioRef} src={audioUrl} className="hidden" />
        </div>
      )}
      
      {/* Input area */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className={`p-2 rounded-full ${
            isLoading || !input.trim() ? 'bg-gray-300' : 'bg-blue-600 text-white'
          }`}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 