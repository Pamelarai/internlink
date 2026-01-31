import React from 'react';
import { useNavigate } from 'react-router-dom';

const SelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-6"></div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Join InternLink</h1>
          <p className="text-gray-500 font-medium">Choose how you would like to use the platform.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-blue-600 transition-all group">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Internship Seeker</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">Discover personalized opportunities and grow your professional career.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={() => navigate('/signup/internship')}
                className="w-full bg-white border border-gray-200 text-gray-900 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Create Seeker Account
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-blue-600 transition-all group">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Company Partner</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">Source elite talent and manage your internship programs at scale.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={() => navigate('/signup/provider')}
                className="w-full bg-white border border-gray-200 text-gray-900 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Create Partner Account
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="mt-12 w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SelectionPage;
