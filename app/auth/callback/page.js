'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';

export default function Callback() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get the authorization code from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (!code) {
        throw new Error('No authorization code found');
      }

      // Call your backend callback endpoint with the code
      const response = await api.get(`/auth/callback?code=${code}`);
      
      if (response.data.access_token) {
        // Store the token
        Cookies.set('access_token', response.data.access_token, { expires: 7 });
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message);
      
      // Redirect to login with error after a short delay
      setTimeout(() => {
        router.push('/login?error=auth_failed');
      }, 2000);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-800 font-medium">Authentication failed</p>
          <p className="text-gray-600 text-sm mt-1">{error}</p>
          <p className="text-gray-500 text-sm mt-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we log you in...</p>
      </div>
    </div>
  );
}