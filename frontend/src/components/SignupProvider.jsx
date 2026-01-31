import React, { useState } from 'react';
import api from '../utils/api';

const SignupProvider = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    industry: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/provider/signup', formData);
      window.location.href = '/login';
    } catch (err) {
      console.error('Provider signup error', err);
      const errMsg = err.response?.data?.error || 'Signup failed';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 tracking-tight font-['Inter']">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-center mb-10">
            <div className="w-10 h-10 bg-gray-900 rounded-xl mx-auto mb-6"></div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Partner Signup</h2>
            <p className="text-gray-500 font-medium text-sm">Onboard your company to InternLink.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black rounded-xl text-center uppercase tracking-widest">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all font-medium text-gray-800"
                placeholder="Acme Corp"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all font-medium text-gray-800"
                placeholder="hr@acme.com"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all font-medium text-gray-800"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all font-medium text-gray-800"
                placeholder="Technology"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-black disabled:bg-gray-400 transition-all mt-4"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            Already have an account? <a href="/login" className="text-gray-900 font-bold hover:underline">Sign in</a>
          </p>
        </div>
        
        <button 
          onClick={() => window.location.href = '/selection'}
          className="mt-8 w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          Change Role
        </button>
      </div>
    </div>
  );
};

export default SignupProvider;
