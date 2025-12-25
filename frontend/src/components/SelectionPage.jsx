import React from 'react';
import { useNavigate } from 'react-router-dom';

const SelectionPage = () => {
  const navigate = useNavigate();

  const handleSelection = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-gray-100/90 backdrop-blur-sm rounded-2xl shadow-2xl p-12 max-w-md w-full mx-4 border border-gray-300">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Select Your Role
          </h1>
          <p className="text-gray-600 text-sm">Choose how you'd like to proceed</p>
        </div>

        <div className="space-y-6">
          <div className="group">
            <button
              onClick={() => handleSelection('Internship')}
              className="w-full px-6 py-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg border border-gray-300"
            >
              🎓 Internship Seeker
            </button>
            <p className="text-center text-sm text-gray-600 mt-3">
              Looking for internship opportunities?{' '}
              <a href="/signup/internship" className="text-gray-700 hover:text-gray-900 font-medium hover:underline transition-colors">
                Sign up here
              </a>
            </p>
          </div>

          <div className="group">
            <button
              onClick={() => handleSelection('Provider')}
              className="w-full px-6 py-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg border border-gray-300"
            >
              🏢 Internship Provider
            </button>
            <p className="text-center text-sm text-gray-600 mt-3">
              Offering internship positions?{' '}
              <a href="/signup/provider" className="text-gray-700 hover:text-gray-900 font-medium hover:underline transition-colors">
                Sign up here
              </a>
            </p>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default SelectionPage;
