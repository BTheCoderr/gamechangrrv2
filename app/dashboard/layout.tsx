'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// Dashboard navigation items
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Leads', href: '/dashboard/leads', icon: '👥' },
  { name: 'Voice Agent', href: '/dashboard/voice-agent', icon: '🎤' },
  { name: 'Map View', href: '/dashboard/map', icon: '🗺️' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Get user info from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserName(user.name || 'User');
          setUserRole(user.role || 'Rep');
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`bg-gray-900 text-white w-64 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 fixed inset-y-0 z-50 shadow-lg`}
      >
        <div className="px-4 py-6 border-b border-gray-800 bg-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-400">GameChanger 2.0</h1>
            <button onClick={toggleSidebar} className="md:hidden text-2xl text-gray-400 hover:text-white">
              ×
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400">Welcome back,</p>
            <p className="font-medium text-white">{userName}</p>
            <p className="text-xs text-blue-300">{userRole}</p>
          </div>
        </div>
        
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800 bg-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white"
          >
            <span className="mr-3">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              onClick={toggleSidebar} 
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              ☰
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="pl-10 pr-4 py-2 w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  );
} 