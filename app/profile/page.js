
'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Modal from '@/components/Modal';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await api.get('/users/me');
            setUserData(response.data);
            setFormData({
                name: response.data.name,
                email: response.data.email,
                password: ''
            });

            // If user is admin, fetch all users
            // Check for different possible admin indicators
            const isAdmin = response.data.is_admin || response.data.admin || response.data.role === 'admin';
            if (isAdmin) {
                console.log('Fetching all users because user is admin');  // Debug log
                const usersResponse = await api.get('/users/');
                console.log('All users:', usersResponse.data);  // Debug log
                setAllUsers(usersResponse.data);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to load user data');
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/users/me', formData);
            setUserData(response.data);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await api.delete('/users/me');
                logout();
            } catch (err) {
                setError('Failed to delete account');
            }
        }
    };

    const viewUserDetails = async (userId) => {
        try {
            const response = await api.get(`/users/${userId}`);
            setSelectedUser(response.data);
            setIsModalOpen(true);
        } catch (err) {
            setError('Failed to fetch user details');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete user ${userName}? This action cannot be undone.`)) {
            try {
                await api.delete(`/users/${userId}`);
                // Refresh the users list
                const usersResponse = await api.get('/users');
                setAllUsers(usersResponse.data);
                setError(null);
            } catch (err) {
                setError('Failed to delete user');
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        {!isEditing ? (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Details</h2>
                                <div className="space-y-4">
                                    <p className="text-gray-700"><span className="font-semibold">Name:</span> {userData?.name}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Email:</span> {userData?.email}</p>
                                    {(userData?.is_admin || userData?.admin || userData?.role === 'admin') && <p className="text-green-600 font-semibold">Administrator Account</p>}
                                </div>
                                <div className="mt-6 space-x-4">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Profile</h2>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Password (required to update profile)</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Admin Section */}
                    {(userData?.is_admin || userData?.admin || userData?.role === 'admin') && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {allUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">#{user.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                                    <div className="flex items-center space-x-3">

                                                    <button
                                                        onClick={() => viewUserDetails(user.id)}
                                                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200 flex items-center text-sm"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User Details Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div>
                    {/* Modal Header */}
                    <div className="border-b border-gray-200 pb-4 mb-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Modal Content */}
                    {selectedUser && (
                        <div className="space-y-6">
                            {/* User Avatar and Basic Info */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="bg-blue-100 rounded-full p-3">
                                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h3>
                                    <p className="text-gray-600">{selectedUser.email}</p>
                                </div>
                            </div>

                            {/* Detailed Information */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                                        <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                                        <p className="text-gray-900 font-semibold">{selectedUser.id}</p>
                                    </div>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Authentication Type</label>
                                        <p className="text-gray-900 font-semibold capitalize">
                                            {selectedUser.auth_provider || 'Email'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-500 mb-4">Account Status</h4>
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-block w-2 h-2 rounded-full ${selectedUser.is_active ? 'bg-green-500' : 'bg-gray-500'
                                        }`}></span>
                                    <span className="text-gray-700">
                                        {selectedUser.is_active ? 'Active Account' : 'Inactive Account'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Footer */}
                    <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </ProtectedRoute>
    );
}