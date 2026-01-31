import React, { useState } from 'react';
import api from '../utils/api';

const SignupInternship = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    university: '',
    major: '',
    graduationYear: ''
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
      await api.post('/intern/signup', formData);
      window.location.href = '/login';
    } catch (err) {
      console.error('Signup error', err);
      const errMsg = err.response?.data?.error || 'Signup failed';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 tracking-tight font-['Inter'] py-12">
      <div className="max-w-xl w-full">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-center mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl mx-auto mb-6"></div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Create Seeker Account</h2>
            <p className="text-gray-500 font-medium text-sm">Join the elite community of interns.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black rounded-xl text-center uppercase tracking-widest">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium text-gray-800"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium text-gray-800"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium text-gray-800"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">University / Institution</label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium text-gray-800"
                placeholder="Harvard University"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Field of Study (Major)</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium text-gray-800"
                  placeholder="Computer Science"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium text-gray-800"
                  placeholder="2025"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:bg-gray-400 transition-all mt-6 shadow-lg shadow-blue-100"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            Already have an account? <a href="/login" className="text-blue-600 font-bold hover:underline">Sign in</a>
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

export default SignupInternship;
