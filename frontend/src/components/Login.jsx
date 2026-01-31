import React, { useState } from 'react';
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      
      const userRole = res.data.data.user.role;
      if (userRole === 'PROVIDER') {
        window.location.href = '/provider-dashboard';
      } else if (userRole === 'INTERN') {
        window.location.href = '/seeker-dashboard';
      } else if (userRole === 'ADMIN') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/'; 
      }
    } catch (err) {
      console.error('Login error', err);
      const errMsg = err.response?.data?.error || 'Login failed';
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
            <div className="w-10 h-10 bg-blue-600 rounded-xl mx-auto mb-6"></div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 font-medium text-sm">Enter your credentials to continue.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black rounded-xl text-center uppercase tracking-widest">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium text-gray-800"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] font-black text-blue-600 hover:underline">Forgot?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium text-gray-800"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:bg-gray-400 transition-all mt-4 shadow-lg shadow-blue-100"
            >
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            Don't have an account? <a href="/selection" className="text-blue-600 font-bold hover:underline">Get started</a>
          </p>
        </div>
        
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-8 w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;
