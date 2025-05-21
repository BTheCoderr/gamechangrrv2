'use client';

import { useState, useEffect } from 'react';
import { getAvailableVoices, generateVoiceAudio, initiateAICall } from '@/lib/services/aiService';
import { Lead } from '@/types';

interface VoiceAgentProps {
  lead?: Lead;
  onCallComplete?: (callSid: string) => void;
  onClose?: () => void;
}

export default function VoiceAgent({ lead, onCallComplete, onClose }: VoiceAgentProps) {
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("21m00Tcm4TlvDq8ikWAM"); // Default voice
  const [script, setScript] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'previewing' | 'calling'>('idle');
  const [callPhoneNumber, setCallPhoneNumber] = useState<string>(lead?.phone || '');
  const [callResult, setCallResult] = useState<{ success: boolean; message: string; callSid?: string } | null>(null);
  const [scriptTemplates, setScriptTemplates] = useState<{ name: string; text: string }[]>([
    {
      name: 'Introduction',
      text: `Hello, this is an automated call from Utility Impact Research. We're following up on the information you requested about our utility research program. Is this a good time to talk?`
    },
    {
      name: 'Appointment Reminder',
      text: `Hello, this is a reminder call from Utility Impact Research. You have an appointment scheduled for tomorrow at 2 PM. Please call us back at 555-123-4567 if you need to reschedule.`
    },
    {
      name: 'Follow Up',
      text: `Hi there, this is Utility Impact Research following up on our previous conversation. We'd like to schedule a brief visit to discuss how our program can help reduce your utility costs. Please call us back at 555-123-4567 to set up a time.`
    }
  ]);

  // Load available voices on component mount
  useEffect(() => {
    async function loadVoices() {
      const availableVoices = await getAvailableVoices();
      setVoices(availableVoices);
    }
    
    loadVoices();
    
    // Set initial script based on lead info if available
    if (lead) {
      setScript(`Hello ${lead.name}, this is an automated call from Utility Impact Research. We're following up on your recent interest in our utility research program. Is this a good time to talk?`);
    }
  }, [lead]);

  // Generate voice preview
  const handleGeneratePreview = async () => {
    if (!script.trim()) return;
    
    setStatus('generating');
    setPreviewUrl(null);
    
    try {
      const audioUrl = await generateVoiceAudio(script);
      setPreviewUrl(audioUrl);
      setStatus('previewing');
    } catch (error) {
      console.error('Error generating voice preview:', error);
      setStatus('idle');
    }
  };

  // Initiate call to lead
  const handleInitiateCall = async () => {
    if (!script.trim() || !callPhoneNumber.trim()) {
      setCallResult({
        success: false,
        message: 'Please provide both a script and phone number'
      });
      return;
    }
    
    setStatus('calling');
    setCallResult(null);
    
    try {
      const result = await initiateAICall(callPhoneNumber, script);
      
      setCallResult({
        success: true,
        message: 'Call initiated successfully',
        callSid: result.callSid
      });
      
      if (onCallComplete) {
        onCallComplete(result.callSid);
      }
      
      // Reset form after successful call
      setStatus('idle');
    } catch (error) {
      console.error('Error initiating call:', error);
      
      setCallResult({
        success: false,
        message: 'Error initiating call'
      });
      
      setStatus('idle');
    }
  };

  // Use a script template
  const handleUseTemplate = (templateText: string) => {
    setScript(templateText);
    setPreviewUrl(null);
    setStatus('idle');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">AI Voice Agent</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Call Phone Number
          </label>
          <input
            type="tel"
            value={callPhoneNumber}
            onChange={(e) => setCallPhoneNumber(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter phone number"
            disabled={status === 'calling'}
          />
        </div>
        
        {voices.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Voice
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={status === 'generating' || status === 'calling'}
            >
              {voices.map((voice) => (
                <option key={voice.voice_id} value={voice.voice_id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Script Templates
          </label>
          <div className="flex flex-wrap gap-2">
            {scriptTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => handleUseTemplate(template.text)}
                className="px-3 py-1 text-sm border rounded-full hover:bg-gray-100"
                disabled={status === 'generating' || status === 'calling'}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Call Script
          </label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={5}
            className="w-full p-2 border rounded"
            placeholder="Enter your script for the AI to read"
            disabled={status === 'generating' || status === 'calling'}
          />
        </div>
      </div>
      
      {/* Preview Section */}
      {previewUrl && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
          <audio 
            src={previewUrl} 
            controls 
            className="w-full"
          />
        </div>
      )}
      
      {/* Call Result */}
      {callResult && (
        <div className={`mb-6 p-4 rounded-lg ${callResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="font-medium">{callResult.message}</p>
          {callResult.callSid && (
            <p className="text-sm mt-1">Call SID: {callResult.callSid}</p>
          )}
        </div>
      )}
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGeneratePreview}
          disabled={!script.trim() || status === 'generating' || status === 'calling'}
          className={`px-4 py-2 rounded text-white ${
            !script.trim() || status === 'generating'
              ? 'bg-gray-400'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {status === 'generating' ? 'Generating...' : 'Preview Voice'}
        </button>
        
        <button
          onClick={handleInitiateCall}
          disabled={!script.trim() || !callPhoneNumber.trim() || status === 'calling'}
          className={`px-4 py-2 rounded text-white ${
            !script.trim() || !callPhoneNumber.trim() || status === 'calling'
              ? 'bg-gray-400'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {status === 'calling' ? 'Initiating Call...' : 'Make Call'}
        </button>
      </div>
    </div>
  );
} 