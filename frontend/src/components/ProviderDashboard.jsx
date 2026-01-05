import React, { useEffect } from 'react';

const ProviderDashboard = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'PROVIDER') {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">Provider Dashboard</h1>
      <p className="text-gray-600 mt-4">Welcome to your provider dashboard!</p>
    </div>
  );
};

export default ProviderDashboard;
