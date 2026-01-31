import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/selection');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">InternLink</h1>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={handleGetStarted}
                className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Connect with the <span className="text-blue-600">Perfect Internship</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium">
            Bridging the gap between ambitious talent and innovative companies. InternLink is the elite workspace for the next generation of professionals.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-bold text-lg shadow-xl shadow-gray-200"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">For Interns</h3>
              <p className="text-gray-500 font-medium">
                Personalized opportunities tailored to your vertical, skills, and professional ambitions.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">For Providers</h3>
              <p className="text-gray-500 font-medium">
                Scale your team with elite talent using our data-driven matching and recruitment tools.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Seamless Flow</h3>
              <p className="text-gray-500 font-medium">
                End-to-end management from discovery to certification in a unified professional interface.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 font-bold text-xs uppercase tracking-widest">
          &copy; {new Date().getFullYear()} InternLink. Built for the future of work.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
