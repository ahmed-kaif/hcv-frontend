// app/page.js
'use client';

import Link from 'next/link';
import { useAuth } from '../providers/AuthProvider';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            HCV Risk Predictor
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Advanced machine learning model to predict Hepatitis C Virus (HCV) patient classification 
            based on clinical parameters
          </p>
          
          <div className="flex justify-center space-x-4">
            {user ? (
              <Link href="/predict" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200">
                Start Prediction
              </Link>
            ) : (
              <>
                <Link href="/login" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition duration-200">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}