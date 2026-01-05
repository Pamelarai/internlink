import React, { useEffect } from 'react';

const SeekerDashboard = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'INTERN') {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">Seeker Dashboard</h1>
      <p className="text-gray-600 mt-4">Welcome to your seeker dashboard!</p>
    </div>
  );
};

export default SeekerDashboard;
