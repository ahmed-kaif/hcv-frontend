'use client';

import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import Link from 'next/link';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`);
    const data = await response.json();
    
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error('No authorization URL received');
    }
  } catch (error) {
    console.error('Failed to initiate Google login:', error);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                register a new account
            </Link>
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </div>
        </form>
        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C34.3 2.7 29.4 0 24 0 14.7 0 6.9 5.3 3.4 13.1l7.9 6.1C13.5 13.7 18.2 9.5 24 9.5z"/>      
                <path fill="#4285F4" d="M46.1 24.3c0-1.5-.1-2.6-.4-3.8H24v7.2h12.4c-.5 2.6-2 4.8-4.3 6.3l6.9 5.4c4-3.7 6.3-9.1 6.3-15.1z"/> 
                <path fill="#FBBC05" d="M10.8 28.7c-.8-2.3-1.3-4.7-1.3-7.2s.5-4.9 1.3-7.2L2.9 13C1 17.1 0 21.4 0 24s1 6.9 2.9 11l7.9-6.3z"/>
                <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.7l-7.9-6.1c-2.2 1.5-5.1 2.4-8.1 2.4-5.8 0-10.5-4.2-11.9-9.8l-7.9 6.1C6.9 42.7 14.7 48 24 48z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
        );
}