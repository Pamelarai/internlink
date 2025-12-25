import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    alert('Login submitted');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-gray-100/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-80 border border-gray-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
        </div>
        <button type="submit" className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200 border border-gray-300">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
