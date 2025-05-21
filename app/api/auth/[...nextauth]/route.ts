import { NextResponse } from 'next/server';

// Mock user database for demo
const USERS = [
  {
    id: 'user-1',
    name: 'Demo Admin',
    email: 'admin@example.com',
    password: 'password123', // In a real app, this would be hashed
    role: 'admin',
  },
  {
    id: 'user-2',
    name: 'Field Rep',
    email: 'rep@example.com',
    password: 'password123', // In a real app, this would be hashed
    role: 'rep',
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = USERS.find(user => user.email === email);
    
    // Check if user exists and password matches
    if (user && user.password === password) {
      // Return user without password for security
      const { password: _, ...userWithoutPassword } = user;
      
      return NextResponse.json({ 
        success: true, 
        user: userWithoutPassword 
      });
    }
    
    // Authentication failed
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 