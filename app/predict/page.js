'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';

// Label mapping
const RESULT_LABELS = {
  0: { label: "Negative", color: "green", risk: "low" },
  1: { label: "Hepatitis", color: "yellow", risk: "medium" },
  2: { label: "Fibrosis", color: "orange", risk: "high" },
  3: { label: "Cirrhosis", color: "red", risk: "critical" }
};

export default function Predict() {
  const [formData, setFormData] = useState({
    // Required fields
    ALB: '',
    ALP: '',
    AST: '',
    CHE: '',
    CGT: '',
    // Optional fields
    CREA: 0,
    CHOL: 0,
    PROT: 0,
    BIL: 0,
    ALT: 0,
    Age: 0,
    Sex: 'M'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'Sex' ? value : parseFloat(value) || 0
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    // Validate required fields
    if (!formData.ALB || !formData.ALP || !formData.AST || !formData.CHE || !formData.CGT) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/predictions/', formData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getResultInfo = (resultId) => {
    return RESULT_LABELS[resultId] || { label: "Unknown", color: "gray", risk: "unknown" };
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">HCV Risk Prediction</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Required Fields Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Required Parameters
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ALB (Albumin) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="ALB"
                      value={formData.ALB}
                      onChange={handleChange}
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder-gray-400"
                      placeholder="e.g., 47"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ALP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="ALP"
                      value={formData.ALP}
                      onChange={handleChange}
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder-gray-400"
                      placeholder='e.g., 37.9'
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      AST (Aspartate Aminotransferase) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="AST"
                      value={formData.AST}
                      onChange={handleChange}
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder-gray-400"
                      placeholder="e.g., 7.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CHE (Cholinesterase) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="CHE"
                      value={formData.CHE}
                      onChange={handleChange}
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder-gray-400"
                      placeholder="e.g., 6.6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CGT (γ-glutamyltransferase) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="CGT"
                      value={formData.CGT}
                      onChange={handleChange}
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder-gray-400"
                      placeholder="e.g., 12.1"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Fields Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Optional Parameters
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CREA (Creatinine)
                    </label>
                    <input
                      type="number"
                      name="CREA"
                      value={formData.CREA}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CHOL (Cholesterol)
                    </label>
                    <input
                      type="number"
                      name="CHOL"
                      value={formData.CHOL}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PROT (Protein)
                    </label>
                    <input
                      type="number"
                      name="PROT"
                      value={formData.PROT}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      BIL (Bilirubin)
                    </label>
                    <input
                      type="number"
                      name="BIL"
                      value={formData.BIL}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ALT (Alanine Aminotransferase)
                    </label>
                    <input
                      type="number"
                      name="ALT"
                      value={formData.ALT}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="Age"
                      value={formData.Age}
                      onChange={handleChange}
                      min="0"
                      max="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sex
                    </label>
                    <select
                      name="Sex"
                      value={formData.Sex}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Get Prediction'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Prediction Results */}
          {prediction && (
            <div className="bg-white rounded-lg shadow-md p-6" id="prediction-results">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Prediction Results</h2>
              
              {(() => {
                const resultInfo = getResultInfo(prediction.result_id);
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-lg font-medium text-gray-700">Prediction ID:</span>
                      <span className="text-lg font-semibold text-gray-900">{prediction.id}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-lg font-medium text-gray-700">HCV Status:</span>
                      <span className={`text-lg font-bold ${
                        resultInfo.color === 'green' ? 'text-green-600' :
                        resultInfo.color === 'yellow' ? 'text-yellow-600' :
                        resultInfo.color === 'orange' ? 'text-orange-600' :
                        resultInfo.color === 'red' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {resultInfo.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-lg font-medium text-gray-700">Risk Level:</span>
                      <span className={`text-lg font-semibold capitalize ${
                        resultInfo.risk === 'low' ? 'text-green-600' :
                        resultInfo.risk === 'medium' ? 'text-yellow-600' :
                        resultInfo.risk === 'high' ? 'text-orange-600' :
                        resultInfo.risk === 'critical' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {resultInfo.risk}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-lg font-medium text-gray-700">Date:</span>
                      <span className="text-lg text-gray-900">
                        {new Date(prediction.created_at).toLocaleString()}
                      </span>
                    </div>

                    {/* Risk Level Messages */}
                    {resultInfo.label === 'Negative' && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start">
                          <svg className="h-6 w-6 text-green-600 mr-3 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <div>
                            <h3 className="text-lg font-semibold text-green-800">No HCV Detected</h3>
                            <p className="mt-1 text-sm text-green-700">
                              The test results indicate no presence of HCV. Continue maintaining good health practices and regular check-ups.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {resultInfo.label === 'Hepatitis' && (
                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                          <svg className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                          </svg>
                          <div>
                            <h3 className="text-lg font-semibold text-yellow-800">Hepatitis Detected</h3>
                            <p className="mt-1 text-sm text-yellow-700">
                              The results indicate hepatitis. Please consult with a healthcare professional immediately for proper diagnosis and treatment plan.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {resultInfo.label === 'Fibrosis' && (
                      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-start">
                          <svg className="h-6 w-6 text-orange-600 mr-3 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <div>
                            <h3 className="text-lg font-semibold text-orange-800">Liver Fibrosis Detected</h3>
                            <p className="mt-1 text-sm text-orange-700">
                              The results indicate liver fibrosis. This is a serious condition requiring immediate medical attention. Please consult a hepatologist as soon as possible.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {resultInfo.label === 'Cirrhosis' && (
                      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start">
                          <svg className="h-6 w-6 text-red-600 mr-3 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                          </svg>
                          <div>
                            <h3 className="text-lg font-semibold text-red-800">Cirrhosis Detected - Critical</h3>
                            <p className="mt-1 text-sm text-red-700">
                              The results indicate cirrhosis, an advanced stage of liver disease. Seek immediate medical attention from a liver specialist. Early intervention is crucial.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Test Parameters Summary */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Parameters</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-900">
                        <div><span className="font-medium">ALB:</span> {prediction.ALB}</div>
                        <div><span className="font-medium">ALP:</span> {prediction.ALP}</div>
                        <div><span className="font-medium">AST:</span> {prediction.AST}</div>
                        <div><span className="font-medium">CHE:</span> {prediction.CHE}</div>
                        <div><span className="font-medium">CGT:</span> {prediction.CGT}</div>
                        {prediction.Age > 0 && <div><span className="font-medium">Age:</span> {prediction.Age}</div>}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={() => {
                          setPrediction(null);
                          setFormData({
                            ALB: '',
                            ALP: '',
                            AST: '',
                            CHE: '',
                            CGT: '',
                            CREA: 0,
                            CHOL: 0,
                            PROT: 0,
                            BIL: 0,
                            ALT: 0,
                            Age: 0,
                            Sex: 'M'
                          });
                        }}
                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 font-medium"
                      >
                        New Prediction
                      </button>
                      <button
                        onClick={() => {
                          const printContent = document.getElementById('prediction-results').innerHTML;
                          const originalContent = document.body.innerHTML;
                          document.body.innerHTML = printContent;
                          window.print();
                          document.body.innerHTML = originalContent;
                          window.location.reload();
                        }}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                      >
                        Print Results
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Information Box */}
          {!prediction && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">About HCV Prediction</h3>
                    <div className="mt-2 text-sm text-blue-700">
                        <p>
                        This tool uses machine learning to predict the risk of Hepatitis C Virus (HCV) infection based on blood test parameters. It is intended for informational purposes only and should not replace professional medical advice. Always consult a healthcare provider for diagnosis and treatment.
                        </p>
                    </div>
                </div>
                </div>
            </div>
            )}
        </div>
        </div>
    </ProtectedRoute>
    );
}
