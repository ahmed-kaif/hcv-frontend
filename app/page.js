'use client';

import Link from 'next/link';
import { useAuth } from '../providers/AuthProvider';
import ModelComparisonChart from '@/components/ModelComparisonChart';
import Image from 'next/image'

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            HCV Risk Predictor
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Advanced machine learning model to predict Hepatitis C Virus (HCV) patient classification
            based on clinical parameters
          </p>

          <div className="flex justify-center space-x-4 mb-16">
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

        {/* Research Methodology Section */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Research Methodology</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our research focused on developing a robust machine learning model for HCV classification
                  using a comprehensive dataset of clinical parameters. The study involved multiple phases
                  of data collection, preprocessing, and model validation.
                </p>
                <p>
                  We employed advanced feature selection techniques to identify the most significant
                  clinical markers that contribute to accurate HCV classification. This approach helped
                  us achieve higher prediction accuracy while minimizing the required input parameters.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Image
                src="workflow.svg"
                width={500}
                height={500}
                alt="Research Methodology Workflow"
                onClick={() => window.open('workflow.svg', '_blank')}
                className='cursor-pointer'
              />
            </div>
          </div>

          {/* Model Training Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Model Training Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
                <p className="text-gray-600">Comprehensive clinical data from multiple healthcare facilities</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Feature Engineering</h3>
                <p className="text-gray-600">Advanced preprocessing and feature selection techniques</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Model Optimization</h3>
                <p className="text-gray-600">Iterative training and validation for optimal performance</p>
              </div>
            </div>
          </div>

          {/* Key Findings Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-white p-6 rounded-lg shadow-lg order-2 md:order-1">
              <ModelComparisonChart />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Findings</h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border-l-4 border-blue-600">
                  <h3 className="font-semibold text-lg mb-2">Model Accuracy</h3>
                  <p className="text-gray-700">Achieved 95% accuracy in HCV classification across different patient groups</p>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-green-600">
                  <h3 className="font-semibold text-lg mb-2">Key Indicators</h3>
                  <p className="text-gray-700">Identified 5 critical biomarkers that show strongest correlation with HCV progression</p>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-purple-600">
                  <h3 className="font-semibold text-lg mb-2">Early Detection</h3>
                  <p className="text-gray-700">Enables early identification of high-risk patients with 92% sensitivity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-12">
            <h2 className="text-3xl font-bold mb-4">Start Using Our HCV Predictor Today</h2>
            <p className="text-xl mb-8">Join healthcare professionals worldwide in leveraging AI for better patient outcomes</p>
            {!user && (
              <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-200">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}