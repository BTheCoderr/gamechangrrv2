'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getMessages, 
  generateAIResponse, 
  generateVoiceAudio 
} from '@/lib/services/aiService';
import { AIMessage } from '@/types';

// Sample scripts for quick access
const QUICK_SCRIPTS = [
  "Help me with a follow-up message for a lead",
  "What should I say to overcome objections?",
  "Give me a script for my first visit",
  "How do I explain the utility research program?",
];

export default function Assistant() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setMessages(getMessages());
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    
    setLoading(true);
    
    try {
      const response = await generateAIResponse(input);
      setMessages([...getMessages()]);
      setInput('');
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVoice = async (text: string) => {
    setIsPlaying(true);
    
    try {
      const audioUrl = await generateVoiceAudio(text);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.play();
    } catch (error) {
      console.error('Error playing voice:', error);
      setIsPlaying(false);
    }
  };

  const handleQuickScript = (script: string) => {
    setInput(script);
  };

  return (
    <main className="max-w-lg mx-auto h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex items-center">
        <Link href="/dashboard" className="mr-2 text-white">
          ← Back
        </Link>
        <h1 className="text-xl font-bold">AI Assistant</h1>
      </header>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Welcome to your AI Assistant!</p>
              <p className="text-sm">Ask me anything about utility research or for help with leads.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white shadow'
                }`}>
                  <p>{message.content}</p>
                  
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => handlePlayVoice(message.content)}
                      disabled={isPlaying}
                      className="mt-2 text-sm text-blue-500 flex items-center"
                    >
                      🔊 {isPlaying ? 'Playing...' : 'Play voice'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="p-2 bg-gray-100 overflow-x-auto">
        <div className="flex space-x-2">
          {QUICK_SCRIPTS.map((script, index) => (
            <button
              key={index}
              onClick={() => handleQuickScript(script)}
              className="whitespace-nowrap px-3 py-1 bg-white rounded-full text-sm border"
            >
              {script}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-lg p-3"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className={`p-3 rounded-r-lg ${
              loading || !input.trim() 
                ? 'bg-gray-300 text-gray-500' 
                : 'bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </main>
  );
} 