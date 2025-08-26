'use client';

import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import ClientOnly from './ClientOnly';

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            HCV Predictor
          </Link>
          
          <ClientOnly>
            <div className="flex items-center space-x-4">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                        Dashboard
                      </Link>
                      <Link href="/predict" className="text-gray-700 hover:text-blue-600">
                        Predict
                      </Link>
                      <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="text-gray-700 hover:text-blue-600">
                        Login
                      </Link>
                      <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Register
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </ClientOnly>
        </div>
      </div>
    </nav>
  );
}