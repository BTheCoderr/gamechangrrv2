'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { setAIProvider } from '@/src/lib/services/aiService';

// Available AI providers
const AI_PROVIDERS = [
  { id: 'mock', name: 'Demo Mode (Mock Responses)', description: 'Uses pre-configured responses for demonstration purposes' },
  { id: 'openai', name: 'OpenAI', description: 'Uses OpenAI GPT models for advanced AI responses' },
  { id: 'huggingface', name: 'Hugging Face', description: 'Uses open source models from Hugging Face' },
  { id: 'anthropic', name: 'Anthropic', description: 'Uses Anthropic Claude models for safe and helpful responses' },
  { id: 'localai', name: 'LocalAI', description: 'Run open-source AI models locally for privacy' },
];

export default function SettingsPage() {
  // Get the current provider from localStorage
  const [currentProvider, setCurrentProvider] = useState('mock');
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    huggingface: '',
    anthropic: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load saved settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get saved provider
      const savedProvider = localStorage.getItem('ai_provider') || 'mock';
      setCurrentProvider(savedProvider);
      
      // Get saved API keys
      const savedKeys = JSON.parse(localStorage.getItem('ai_api_keys') || '{}');
      setApiKeys({
        openai: savedKeys.openai || '',
        huggingface: savedKeys.huggingface || '',
        anthropic: savedKeys.anthropic || '',
      });
    }
  }, []);

  // Handle provider change
  const handleProviderChange = (providerId: string) => {
    setCurrentProvider(providerId);
  };

  // Handle API key change
  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys({
      ...apiKeys,
      [provider]: value,
    });
  };

  // Save settings
  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveMessage('');
    
    try {
      // Save provider to localStorage
      localStorage.setItem('ai_provider', currentProvider);
      
      // Save API keys to localStorage
      localStorage.setItem('ai_api_keys', JSON.stringify(apiKeys));
      
      // Update the provider in the AI service
      setAIProvider(currentProvider as any);
      
      setSaveMessage('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings');
    } finally {
      setSaving(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <Link href="/dashboard" className="text-blue-600 mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">AI Settings</h1>
        <p className="text-gray-500">Configure AI provider and settings</p>
      </header>

      <div className="bg-white rounded-lg shadow p-6">
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select AI Provider</h2>
          
          <div className="space-y-4">
            {AI_PROVIDERS.map(provider => (
              <div 
                key={provider.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  currentProvider === provider.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleProviderChange(provider.id)}
              >
                <div className="flex items-center">
                  <input 
                    type="radio"
                    id={`provider-${provider.id}`}
                    name="ai-provider"
                    checked={currentProvider === provider.id}
                    onChange={() => handleProviderChange(provider.id)}
                    className="mr-3"
                  />
                  <label htmlFor={`provider-${provider.id}`} className="font-medium">
                    {provider.name}
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-600 ml-6">{provider.description}</p>
              </div>
            ))}
          </div>
        </section>

        {currentProvider !== 'mock' && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">API Keys</h2>
            
            <div className="space-y-4">
              {currentProvider === 'openai' && (
                <div>
                  <label htmlFor="openai-key" className="block text-sm font-medium text-gray-700 mb-1">
                    OpenAI API Key
                  </label>
                  <input
                    id="openai-key"
                    type="password"
                    value={apiKeys.openai}
                    onChange={(e) => handleApiKeyChange('openai', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="sk-..."
                  />
                </div>
              )}
              
              {currentProvider === 'huggingface' && (
                <div>
                  <label htmlFor="hf-key" className="block text-sm font-medium text-gray-700 mb-1">
                    Hugging Face API Key
                  </label>
                  <input
                    id="hf-key"
                    type="password"
                    value={apiKeys.huggingface}
                    onChange={(e) => handleApiKeyChange('huggingface', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="hf_..."
                  />
                </div>
              )}
              
              {currentProvider === 'anthropic' && (
                <div>
                  <label htmlFor="anthropic-key" className="block text-sm font-medium text-gray-700 mb-1">
                    Anthropic API Key
                  </label>
                  <input
                    id="anthropic-key"
                    type="password"
                    value={apiKeys.anthropic}
                    onChange={(e) => handleApiKeyChange('anthropic', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="sk-ant-..."
                  />
                </div>
              )}
            </div>
          </section>
        )}

        <div className="flex items-center">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className={`px-4 py-2 rounded ${
              saving ? 'bg-gray-400' : 'bg-blue-600 text-white'
            }`}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          
          {saveMessage && (
            <span className="ml-4 text-green-600">{saveMessage}</span>
          )}
        </div>
      </div>
    </main>
  );
} 