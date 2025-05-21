'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const router = useRouter();

  // Client-side redirect as a backup to middleware
  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">GameChanger 2.0</h1>
          </div>
          <div>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* Loading message */}
      <div className="flex-grow flex items-center justify-center">
        <p className="text-gray-500">Redirecting to login...</p>
      </div>
    </div>
  );
} 