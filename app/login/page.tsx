'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // For demo purposes, we'll just redirect to dashboard with mock authentication
    if ((email === 'admin@example.com' || email === 'rep@example.com') && password === 'password123') {
      // Mock user data
      const userData = {
        id: email === 'admin@example.com' ? 'user-1' : 'user-2',
        name: email === 'admin@example.com' ? 'Demo Admin' : 'Field Rep',
        email,
        role: email === 'admin@example.com' ? 'admin' : 'rep',
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Navigate to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } else {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative area */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-blue-800 to-blue-600">
        <div className="flex flex-col items-center justify-center h-full text-white p-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">GameChanger 2.0</h1>
            <p className="text-xl mb-8">The ultimate platform for solar sales professionals</p>
            
            <div className="space-y-6 max-w-md mx-auto text-left">
              <div className="flex items-start">
                <span className="flex-shrink-0 p-1 bg-blue-500 rounded-full mr-3">✓</span>
                <p>Intelligent lead management with AI-powered insights</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 p-1 bg-blue-500 rounded-full mr-3">✓</span>
                <p>Automated calling and follow-up with voice agents</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 p-1 bg-blue-500 rounded-full mr-3">✓</span>
                <p>Geospatial mapping to optimize sales territories</p>
              </div>
            </div>
          </div>
          
          <div className="mt-auto">
            <p className="text-blue-200 text-sm">
              © 2025 GameChanger Technologies, Inc.
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10 lg:hidden">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">GameChanger 2.0</h1>
            <p className="text-gray-600">The ultimate platform for solar sales professionals</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign in to your account</h2>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </form>
            
            <div className="mt-8">
              <div className="text-center">
                <p className="text-sm text-gray-600">Demo Accounts:</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="font-medium text-gray-900">Admin:</span> admin@example.com / password123</p>
                  <p><span className="font-medium text-gray-900">Rep:</span> rep@example.com / password123</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account? <a href="#" className="font-medium text-blue-600 hover:text-blue-800">Contact sales</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 