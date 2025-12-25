import React, { useState } from 'react';

const SignupProvider = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    industry: '',
    website: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    alert('Provider Signup submitted');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-gray-100/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-80 border border-gray-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up as Provider</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Industry</label>
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
        </div>
        <button type="submit" className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200 border border-gray-300">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupProvider;
