'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Modal from '../../components/Modal';
import api from '../../lib/api';
import Link from 'next/link';

// Label mapping (same as in predict page)
const RESULT_LABELS = {
  0: { label: "Negative", color: "green", risk: "low" },
  1: { label: "Hepatitis", color: "yellow", risk: "medium" },
  2: { label: "Fibrosis", color: "orange", risk: "high" },
  3: { label: "Cirrhosis", color: "red", risk: "critical" }
};

export default function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      // Assuming you have an endpoint to get all user predictions
      const response = await api.get('/predictions/');
      setPredictions(response.data);
    } catch (err) {
      setError('Failed to load prediction history');
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictionDetails = async (predictionId) => {
    setDetailsLoading(true);
    try {
      const response = await api.get(`/predictions/${predictionId}`);
      setSelectedPrediction(response.data);
      setModalOpen(true);
    } catch (err) {
      alert('Failed to load prediction details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const getResultInfo = (resultId) => {
    return RESULT_LABELS[resultId] || { label: "Unknown", color: "gray", risk: "unknown" };
  };

const [deletingId, setDeletingId] = useState(null);

const deletePrediction = async (predictionId) => {
  if (!confirm('Are you sure you want to delete this prediction?')) {
    return;
  }

  setDeletingId(predictionId);
  try {
    await api.delete(`/predictions/${predictionId}`);
    // Remove the deleted prediction from the list
    setPredictions(predictions.filter(p => p.id !== predictionId));
  } catch (error) {
    alert('Failed to delete prediction');
  } finally {
    setDeletingId(null);
  }
};

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPrediction(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Prediction History</h1>
            <Link 
              href="/predict" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Prediction
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          ) : predictions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg">No predictions yet</p>
              <Link href="/predict" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
                Make your first prediction →
              </Link>
            </div>
          ) : (
<div>
  {/* Desktop Table View */}
  <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Result
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Risk Level
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {predictions.map((prediction) => {
          const resultInfo = getResultInfo(prediction.result_id);
          return (
            <tr key={prediction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{prediction.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(prediction.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  resultInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                  resultInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  resultInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                  resultInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {resultInfo.label}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-medium capitalize ${
                  resultInfo.risk === 'low' ? 'text-green-600' :
                  resultInfo.risk === 'medium' ? 'text-yellow-600' :
                  resultInfo.risk === 'high' ? 'text-orange-600' :
                  resultInfo.risk === 'critical' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {resultInfo.risk}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => fetchPredictionDetails(prediction.id)}
                    disabled={detailsLoading}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
                  </button>
                  <button
                    onClick={() => deletePrediction(prediction.id)}
                    disabled={deletingId === prediction.id}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    {deletingId === prediction.id ? (
                      <span className="flex items-center">
                        <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

                    )}
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>

  {/* Mobile Card View */}
  <div className="md:hidden space-y-4">
    {predictions.map((prediction) => {
      const resultInfo = getResultInfo(prediction.result_id);
      return (
        <div key={prediction.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm text-gray-500">ID</span>
              <p className="font-semibold text-gray-900">#{prediction.id}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">Date</span>
              <p className="font-medium text-gray-900">
                {new Date(prediction.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500 block mb-1">Result</span>
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                resultInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                resultInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                resultInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                resultInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {resultInfo.label}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block mb-1">Risk Level</span>
              <span className={`text-sm font-medium capitalize ${
                resultInfo.risk === 'low' ? 'text-green-600' :
                resultInfo.risk === 'medium' ? 'text-yellow-600' :
                resultInfo.risk === 'high' ? 'text-orange-600' :
                resultInfo.risk === 'critical' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {resultInfo.risk}
              </span>
            </div>
          </div>
          
          <div className="pt-3 border-t space-y-2">
            <button
              onClick={() => fetchPredictionDetails(prediction.id)}
              disabled={detailsLoading}
              className="w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
            >
              View Details
            </button>
            <button
              onClick={() => deletePrediction(prediction.id)}
              disabled={deletingId === prediction.id}
              className="w-full text-center bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
            >
              {deletingId === prediction.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      );
    })}
  </div>
</div>
          )}

          {/* Details Modal */}
          <Modal isOpen={modalOpen} onClose={closeModal}>
            {selectedPrediction && (
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Prediction Details
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {(() => {
                  const resultInfo = getResultInfo(selectedPrediction.result_id);
                  return (
                    <div className="space-y-6">
                      {/* Result Summary */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Prediction ID</p>
                            <p className="text-lg font-semibold text-gray-900">#{selectedPrediction.id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Date</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {new Date(selectedPrediction.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Result</p>
                            <p className={`text-lg font-bold ${
                              resultInfo.color === 'green' ? 'text-green-600' :
                              resultInfo.color === 'yellow' ? 'text-yellow-600' :
                              resultInfo.color === 'orange' ? 'text-orange-600' :
                              resultInfo.color === 'red' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {resultInfo.label}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Risk Level</p>
                            <p className={`text-lg font-bold capitalize ${
                              resultInfo.risk === 'low' ? 'text-green-600' :
                              resultInfo.risk === 'medium' ? 'text-yellow-600' :
                              resultInfo.risk === 'high' ? 'text-orange-600' :
                              resultInfo.risk === 'critical' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {resultInfo.risk}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Risk Assessment */}
                      <div className={`p-4 rounded-lg ${
                        resultInfo.color === 'green' ? 'bg-green-50 border border-green-200' :
                        resultInfo.color === 'yellow' ? 'bg-yellow-50 border border-yellow-200' :
                        resultInfo.color === 'orange' ? 'bg-orange-50 border border-orange-200' :
                        resultInfo.color === 'red' ? 'bg-red-50 border border-red-200' :
                        'bg-gray-50 border border-gray-200'
                      }`}>
                        <h4 className="font-semibold text-gray-900 mb-2">Clinical Assessment</h4>
                        <p className="text-sm text-gray-700">
                          {resultInfo.label === 'Negative' && 
                            'No signs of HCV detected. Continue regular health monitoring.'}
                          {resultInfo.label === 'Hepatitis' && 
                            'Hepatitis detected. Immediate medical consultation recommended.'}
                          {resultInfo.label === 'Fibrosis' && 
                            'Liver fibrosis detected. Urgent specialist consultation required.'}
                          {resultInfo.label === 'Cirrhosis' && 
                            'Advanced liver cirrhosis detected. Seek emergency medical care.'}
                        </p>
                      </div>

                      {/* Test Parameters */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Test Parameters</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Required Parameters */}
                            <div className="space-y-2">
                              <h5 className="font-medium text-gray-700 text-sm uppercase tracking-wider">Required</h5>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">ALB:</span>
                                  <span className="text-sm font-medium text-gray-900">{selectedPrediction.ALB}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">ALP:</span>
                                  <span className="text-sm font-medium text-gray-900">{selectedPrediction.ALP}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">AST:</span>
                                  <span className="text-sm font-medium text-gray-900">{selectedPrediction.AST}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">CHE:</span>
                                  <span className="text-sm font-medium text-gray-900">{selectedPrediction.CHE}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">CGT:</span>
                                  <span className="text-sm font-medium text-gray-// app/dashboard/page.js (continued)
                                  text-gray-900">{selectedPrediction.CGT}</span>
                                </div>
                              </div>
                            </div>

                            {/* Optional Parameters */}
                            <div className="space-y-2">
                              <h5 className="font-medium text-gray-700 text-sm uppercase tracking-wider">Optional</h5>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">CREA:</span>
                                  <span className="text-sm font-medium text-gray-900">{selectedPrediction.CREA}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">CHOL:</span>
                                  <span className="text-sm font-medium text-gray-900">{selectedPrediction.CHOL}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">PROT:</span>
                                  <span className="text-sm font-medium text-gray-900">{selectedPrediction.PROT}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">BIL:</span>
                                  <span className="text-sm font-medium text-gray-900">{selectedPrediction.BIL}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">ALT:</span>
                                  <span className="text-sm font-medium text-gray-900">{selectedPrediction.ALT}</span>
                                </div>
                              </div>
                            </div>

                            {/* Demographics */}
                            <div className="space-y-2">
                              <h5 className="font-medium text-gray-700 text-sm uppercase tracking-wider">Demographics</h5>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Age:</span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {selectedPrediction.Age > 0 ? selectedPrediction.Age : 'N/A'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Sex:</span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {selectedPrediction.Sex === 'M' ? 'Male' : selectedPrediction.Sex === 'F' ? 'Female' : 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Parameter Legend */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Parameter Definitions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div><span className="font-medium text-blue-800">ALB:</span> <span className="text-blue-700">Albumin</span></div>
                          <div><span className="font-medium text-blue-800">ALP:</span> <span className="text-blue-700">Alkaline Phosphatase</span></div>
                          <div><span className="font-medium text-blue-800">AST:</span> <span className="text-blue-700">Aspartate Aminotransferase</span></div>
                          <div><span className="font-medium text-blue-800">CHE:</span> <span className="text-blue-700">Cholinesterase</span></div>
                          <div><span className="font-medium text-blue-800">CGT:</span> <span className="text-blue-700">γ-glutamyltransferase</span></div>
                          <div><span className="font-medium text-blue-800">ALT:</span> <span className="text-blue-700">Alanine Aminotransferase</span></div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => {
                            // Create a printable version
                            const printWindow = window.open('', '_blank');
                            printWindow.document.write(`
                              <html>
                                <head>
                                  <title>HCV Prediction Report #${selectedPrediction.id}</title>
                                  <style>
                                    body { font-family: Arial, sans-serif; padding: 20px; }
                                    h1 { color: #1f2937; }
                                    .result { font-size: 20px; font-weight: bold; margin: 20px 0; }
                                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                                    th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
                                    th { background-color: #f3f4f6; }
                                  </style>
                                </head>
                                <body>
                                  <h1>HCV Prediction Report</h1>
                                  <p><strong>ID:</strong> #${selectedPrediction.id}</p>
                                  <p><strong>Date:</strong> ${new Date(selectedPrediction.created_at).toLocaleString()}</p>
                                  <p class="result"><strong>Result:</strong> ${resultInfo.label} (${resultInfo.risk} risk)</p>
                                  <table>
                                    <tr><th>Parameter</th><th>Value</th></tr>
                                    <tr><td>ALB</td><td>${selectedPrediction.ALB}</td></tr>
                                    <tr><td>ALP</td><td>${selectedPrediction.ALP}</td></tr>
                                    <tr><td>AST</td><td>${selectedPrediction.AST}</td></tr>
                                    <tr><td>CHE</td><td>${selectedPrediction.CHE}</td></tr>
                                    <tr><td>CGT</td><td>${selectedPrediction.CGT}</td></tr>
                                    <tr><td>Age</td><td>${selectedPrediction.Age || 'N/A'}</td></tr>
                                    <tr><td>Sex</td><td>${selectedPrediction.Sex === 'M' ? 'Male' : selectedPrediction.Sex === 'F' ? 'Female' : 'N/A'}</td></tr>
                                  </table>
                                </body>
                              </html>
                            `);
                            printWindow.document.close();
                            printWindow.print();
                          }}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                          Print Report
                        </button>
                        <button
                          onClick={closeModal}
                          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            {detailsLoading && (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </ProtectedRoute>
  );
}