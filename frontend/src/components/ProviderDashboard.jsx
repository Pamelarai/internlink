import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalInternships: 0,
    activeInternships: 0,
    totalApplications: 0,
    selectedInterns: 0
  });
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [viewingInternship, setViewingInternship] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [viewingInternProfile, setViewingInternProfile] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    companyName: '',
    industry: '',
    website: '',
    description: '',
    location: '',
    companySize: '',
    foundedYear: '',
    mission: '',
    vision: '',
    logo: '',
    culture: '',
    benefits: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'PROVIDER') {
      window.location.href = '/login';
    } else {
      const loadDashboardData = async () => {
        try {
          const [internshipsRes, applicationsRes, notificationsRes, profileRes] = await Promise.all([
            api.get('/internships/provider'),
            api.get('/applications/provider'),
            api.get('/notifications'),
            api.get('/company/my/profile').catch(() => ({ data: { data: null } }))
          ]);
 
          setInternships(internshipsRes.data);
          setApplications(applicationsRes.data);
          setNotifications(notificationsRes.data);

          if (profileRes.data && profileRes.data.data && profileRes.data.data.company) {
            const profile = profileRes.data.data.company;
            setCompanyProfile(profile);
            setProfileForm({
              companyName: profile.companyName || '',
              industry: profile.industry || '',
              website: profile.website || '',
              description: profile.description || '',
              location: profile.location || '',
              companySize: profile.companySize || '',
              foundedYear: profile.foundedYear || '',
              mission: profile.mission || '',
              vision: profile.vision || '',
              logo: profile.logo || '',
              culture: profile.culture || '',
              benefits: profile.benefits || ''
            });
          }

          // Calculate stats
          const totalInternships = internshipsRes.data.length;
          const activeInternships = internshipsRes.data.filter(i => i.status === 'OPEN').length;
          const totalApplications = applicationsRes.data.length;
          const selectedInterns = applicationsRes.data.filter(a => a.status === 'SELECTED').length;

          setStats({
            totalInternships,
            activeInternships,
            totalApplications,
            selectedInterns
          });
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        }
      };
      loadDashboardData();
    }
  }, [reloadTrigger]);

  const handlePostInternship = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      
      const internshipData = {
        title: formData.get('title'),
        companyName: formData.get('companyName'),
        location: formData.get('location'),
        category: formData.get('category'),
        locationType: formData.get('locationType'),
        duration: formData.get('duration'),
        applicationDeadline: formData.get('applicationDeadline'),
        stipend: formData.get('stipend') ? parseFloat(formData.get('stipend')) : null,
        aboutInternship: formData.get('aboutInternship'),
        requirements: formData.get('requirements'),
        // Map to required backend fields
        description: formData.get('aboutInternship'),
        status: editingInternship ? editingInternship.status : 'OPEN'
      };

      if (editingInternship) {
        await api.put(`/internships/${editingInternship.id}`, internshipData);
        alert('Internship updated successfully!');
      } else {
        await api.post('/internships', internshipData);
        alert('Internship posted successfully!');
      }
      
      setEditingInternship(null);
      setShowPostForm(false);
      setReloadTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error saving internship:', error);
      alert('Failed to save internship. Please ensure all required fields are filled.');
    }
  };


  const handleDeleteInternship = async (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        await api.delete(`/internships/${id}`);
        alert('Internship deleted successfully!');
        setReloadTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting internship:', error);
        alert('Failed to delete internship.');
      }
    }
  };


  const handleApplicationAction = async (applicationId, action) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: action });
      setReloadTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/company/my/profile', profileForm);
      setCompanyProfile(res.data.data.company);
      setIsEditingProfile(false);
      alert('Company profile updated successfully!');
    } catch (error) {
      console.error('Error updating company profile:', error);
      alert('Failed to update company profile.');
    }
  };

  const fetchInternProfile = async (internId) => {
    try {
      const res = await api.get(`/intern/${internId}`);
      setViewingInternProfile(res.data.data.profile);
    } catch (error) {
      console.error('Error fetching intern profile:', error);
      alert('Failed to load intern profile.');
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">Total Internships Posted</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.totalInternships}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">Active Internships</h3>
        <p className="text-3xl font-bold text-green-600">{stats.activeInternships}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">Total Applications</h3>
        <p className="text-3xl font-bold text-purple-600">{stats.totalApplications}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">Selected Interns</h3>
        <p className="text-3xl font-bold text-orange-600">{stats.selectedInterns}</p>
      </div>
    </div>
  );

  const renderInternships = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Internships</h2>
          <p className="text-sm text-gray-500">Manage your active postings</p>
        </div>
        <button
          onClick={() => {
            setEditingInternship(null);
            setShowPostForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Post Internship
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 font-medium">
              <th className="px-6 py-4 text-left">Internal Title</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Applicants</th>
              <th className="px-6 py-4 text-left text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {internships.map((internship) => (
              <tr key={internship.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{internship.title}</div>
                  <div className="text-xs text-gray-500 uppercase">{internship.locationType} • {internship.location}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    {internship.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    internship.status === 'OPEN' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${internship.status === 'OPEN' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {internship.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <span className="font-bold text-gray-900">{internship.applications?.length || 0}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setViewingInternship(internship)}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                      title="View"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => {
                        setEditingInternship(internship);
                        setShowPostForm(true);
                      }}
                      className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteInternship(internship.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );



  const renderApplications = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Applications</h2>
        <p className="text-sm text-gray-500">Review and manage internship applications</p>
      </div>
      <div className="p-6 space-y-6">
        {applications.map((application) => (
          <div key={application.id} className="border border-gray-100 rounded-2xl p-6 bg-gray-50/30 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    {application.intern.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <button 
                      onClick={() => fetchInternProfile(application.internId)}
                      className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors cursor-pointer text-left"
                    >
                      {application.intern.fullName || application.intern.user.email}
                    </button>
                    <p className="text-sm text-gray-500">{application.intern.university} • {application.intern.major}</p>
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      Applied for: {application.internship.title}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                    <p className="text-sm font-bold text-gray-900">{application.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Availability</p>
                    <p className="text-sm font-bold text-gray-900">{application.availability || 'Not provided'}</p>
                  </div>
                  {application.portfolioUrl && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Portfolio</p>
                      <a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">View Portfolio</a>
                    </div>
                  )}
                  {application.githubUrl && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">GitHub</p>
                      <a href={application.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">View GitHub</a>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cover Letter</p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-48 space-y-3">
                <div className="text-center md:text-right mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${
                    application.status === 'SELECTED' ? 'bg-green-100 text-green-700' :
                    application.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    application.status === 'SHORTLISTED' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {application.status}
                  </span>
                </div>
                
                <a 
                  href={application.resume} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  View Resume
                </a>

                {application.status === 'PENDING' && (
                  <button
                    onClick={() => handleApplicationAction(application.id, 'SHORTLISTED')}
                    className="w-full bg-yellow-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-yellow-600 transition-all shadow-md shadow-yellow-100"
                  >
                    Shortlist
                  </button>
                )}
                
                {application.status !== 'REJECTED' && application.status !== 'SELECTED' && (
                  <button
                    onClick={() => handleApplicationAction(application.id, 'SELECTED')}
                    className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-all shadow-md shadow-green-100"
                  >
                    Approve / Select
                  </button>
                )}

                {application.status !== 'REJECTED' && (
                  <button
                    onClick={() => handleApplicationAction(application.id, 'REJECTED')}
                    className="w-full bg-red-50 text-red-600 border border-red-100 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-all"
                  >
                    Reject Candidate
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="text-4xl mb-4">Inbox</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No applications yet</h3>
            <p className="text-gray-500">New applications will appear here once students apply.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifications</h2>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div key={notification.id} className={`p-3 rounded ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}>
            <p className="text-sm">{notification.message}</p>
            <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompanyProfile = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Company Profile</h2>
          <p className="text-sm text-gray-500">Manage your company's public information</p>
        </div>
        {!isEditingProfile && (
          <button
            onClick={() => setIsEditingProfile(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="p-6">
        {isEditingProfile ? (
          <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  value={profileForm.companyName}
                  onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Industry</label>
                <input
                  type="text"
                  value={profileForm.industry}
                  onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Website</label>
                <input
                  type="url"
                  value={profileForm.website}
                  onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location</label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company Size</label>
                  <input
                    type="text"
                    value={profileForm.companySize}
                    onChange={(e) => setProfileForm({ ...profileForm, companySize: e.target.value })}
                    placeholder="e.g. 50-200"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Founded Year</label>
                  <input
                    type="number"
                    value={profileForm.foundedYear}
                    onChange={(e) => setProfileForm({ ...profileForm, foundedYear: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  value={profileForm.description}
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mission</label>
                <textarea
                  value={profileForm.mission}
                  onChange={(e) => setProfileForm({ ...profileForm, mission: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                  rows="2"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Vision</label>
                <textarea
                  value={profileForm.vision}
                  onChange={(e) => setProfileForm({ ...profileForm, vision: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                  rows="2"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company Culture (Optional)</label>
                <textarea
                  value={profileForm.culture}
                  onChange={(e) => setProfileForm({ ...profileForm, culture: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                  rows="3"
                  placeholder="Describe your work environment..."
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Benefits Offered (Optional)</label>
                <textarea
                  value={profileForm.benefits}
                  onChange={(e) => setProfileForm({ ...profileForm, benefits: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                  rows="3"
                  placeholder="e.g. Health insurance, flexible hours..."
                ></textarea>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          companyProfile ? (
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-3xl font-bold border border-blue-100 shadow-sm">
                  {companyProfile.logo ? (
                    <img src={companyProfile.logo} alt={companyProfile.companyName} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    companyProfile.companyName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{companyProfile.companyName}</h3>
                  <p className="text-lg text-blue-600 font-medium">{companyProfile.industry}</p>
                  <div className="flex gap-4 mt-2">
                    {companyProfile.website && (
                      <a href={companyProfile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 115.656 5.656l-1.102 1.101" /></svg>
                        Website
                      </a>
                    )}
                    {companyProfile.location && (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {companyProfile.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">About the Company</h4>
                    <p className="text-gray-600 leading-relaxed">{companyProfile.description || 'No description provided.'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Our Mission</h4>
                      <p className="text-gray-600 text-sm italic">"{companyProfile.mission || 'To empower the next generation of talent.'}"</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Our Vision</h4>
                      <p className="text-gray-600 text-sm italic">"{companyProfile.vision || 'To be the world leader in innovation.'}"</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Company Culture</h4>
                    <p className="text-gray-600 leading-relaxed text-sm">{companyProfile.culture || 'A collaborative and innovative environment.'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Benefits</h4>
                    <p className="text-gray-600 leading-relaxed text-sm">{companyProfile.benefits || 'Competitive stipend and growth opportunities.'}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 h-fit">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Quick Facts</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Company Size</span>
                      <span className="font-semibold text-gray-900">{companyProfile.companySize || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Founded</span>
                      <span className="font-semibold text-gray-900">{companyProfile.foundedYear || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Total Internships</span>
                      <span className="font-semibold text-gray-900">{internships.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-4xl mx-auto mb-4">🏢</div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Not Set Up</h3>
               <p className="text-gray-500 mb-6">Complete your company profile to start posting internships.</p>
               <button
                 onClick={() => setIsEditingProfile(true)}
                 className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
               >
                 Set Up Profile
               </button>
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">InternLink - Provider</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 rounded ${activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('internships')}
                className={`px-3 py-2 rounded ${activeTab === 'internships' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
              >
                My Internships
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-3 py-2 rounded ${activeTab === 'applications' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-3 py-2 rounded ${activeTab === 'notifications' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-2 rounded ${activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
              >
                Company Profile
              </button>
              <button
                onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'internships' && renderInternships()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'profile' && renderCompanyProfile()}
      </div>

      {/* Post/Edit Modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-8">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingInternship ? 'Edit Internship' : 'Post New Internship'}
              </h2>
              <button 
                onClick={() => { setShowPostForm(false); setEditingInternship(null); }}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handlePostInternship} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Internship Title</label>
                    <input name="title" defaultValue={editingInternship?.title} placeholder="e.g. Frontend Developer" required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company Display Name</label>
                    <input name="companyName" defaultValue={editingInternship?.companyName} placeholder="Your Brand Name" required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">City / Location</label>
                    <input name="location" defaultValue={editingInternship?.location} placeholder="e.g. Kathmandu, Nepal" required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                    <select name="category" defaultValue={editingInternship?.category || ""} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none">
                      <option value="IT">IT & Software</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Design">Design</option>
                      <option value="HR">Human Resources</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location Type</label>
                    <div className="flex gap-4 pt-2">
                       {['Remote', 'Onsite', 'Hybrid'].map(loc => (
                         <label key={loc} className="flex items-center gap-2 cursor-pointer">
                           <input type="radio" name="locationType" value={loc} defaultChecked={editingInternship?.locationType === loc} required className="text-blue-600" />
                           <span className="text-sm font-medium">{loc}</span>
                         </label>
                       ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Application Deadline</label>
                    <input name="applicationDeadline" defaultValue={editingInternship?.applicationDeadline ? editingInternship.applicationDeadline.split('T')[0] : ""} type="date" required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">About Internship (Description)</label>
                    <textarea name="aboutInternship" defaultValue={editingInternship?.aboutInternship} placeholder="Briefly describe the role..." required rows="4" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Requirements</label>
                    <textarea name="requirements" defaultValue={editingInternship?.requirements} placeholder="What are you looking for?" required rows="4" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Duration</label>
                    <input name="duration" defaultValue={editingInternship?.duration} placeholder="e.g. 3 months" required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Monthly Stipend (Optional)</label>
                    <input name="stipend" defaultValue={editingInternship?.stipend} type="number" placeholder="₹ per month" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600" />
                  </div>
                </div>

                <div className="pt-6 border-t flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all cursor-pointer">
                    {editingInternship ? 'Save Changes' : 'Post Internship'}
                  </button>
                  <button type="button" onClick={() => { setShowPostForm(false); setEditingInternship(null); }} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-all cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* View Modal */}
      {viewingInternship && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Internship Details</h2>
              <button onClick={() => setViewingInternship(null)} className="text-gray-400 hover:text-gray-600 p-2">
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{viewingInternship.title}</h3>
                <p className="text-blue-600 font-semibold">{viewingInternship.companyName}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                  <p className="text-sm font-semibold">{viewingInternship.locationType}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Duration</p>
                  <p className="text-sm font-semibold">{viewingInternship.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Stipend</p>
                  <p className="text-sm font-semibold">{viewingInternship.stipend ? `₹${viewingInternship.stipend}` : 'Unpaid'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Category</p>
                  <p className="text-sm font-semibold">{viewingInternship.category}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase mb-1">About the Internship</h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewingInternship.aboutInternship}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase mb-1">Requirements</h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewingInternship.requirements}</p>
                </div>
                {viewingInternship.requiredSkills && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase mb-1">Skills Required</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingInternship.requiredSkills.split(',').map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              <button 
                onClick={() => {
                  setEditingInternship(viewingInternship);
                  setViewingInternship(null);
                  setShowPostForm(true);
                }}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-colors cursor-pointer"
              >
                Edit This Posting
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Intern Profile Modal */}
      {viewingInternProfile && (
        <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-auto animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Intern Profile</h2>
                <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">Applicant Details</p>
              </div>
              <button 
                onClick={() => setViewingInternProfile(null)}
                className="text-gray-400 hover:text-gray-600 text-3xl font-bold p-2"
              >
                &times;
              </button>
            </div>
            
            <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto">
               <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-blue-100">
                    {viewingInternProfile.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 mb-1">{viewingInternProfile.fullName}</h3>
                    <p className="text-gray-500 font-medium">{viewingInternProfile.university}</p>
                    <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">{viewingInternProfile.major}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-50">
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Graduation</p>
                    <p className="font-bold text-blue-900">{viewingInternProfile.graduationYear || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="font-bold text-blue-900">{viewingInternProfile.user?.email}</p>
                  </div>
               </div>

               {viewingInternProfile.bio && (
                 <section>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <span className="w-8 h-[2px] bg-blue-600"></span> Bio
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{viewingInternProfile.bio}</p>
                 </section>
               )}

               <section>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <span className="w-8 h-[2px] bg-blue-600"></span> Skills & Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingInternProfile.skills ? viewingInternProfile.skills.split(',').map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white border border-blue-100 text-blue-700 rounded-xl text-xs font-bold shadow-sm">
                        {skill.trim()}
                      </span>
                    )) : (
                      <p className="text-sm text-gray-400 italic">No skills listed.</p>
                    )}
                  </div>
               </section>

               {(viewingInternProfile.resumeUrl || viewingInternProfile.portfolioUrl || viewingInternProfile.githubUrl || viewingInternProfile.linkedinUrl) && (
                 <section>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <span className="w-8 h-[2px] bg-blue-600"></span> Professional Links
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewingInternProfile.resumeUrl && (
                        <a href={viewingInternProfile.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                          📄 View Resume
                        </a>
                      )}
                      {viewingInternProfile.portfolioUrl && (
                        <a href={viewingInternProfile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 p-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
                          🌐 Portfolio
                        </a>
                      )}
                      {viewingInternProfile.githubUrl && (
                        <a href={viewingInternProfile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-gray-900 text-white p-3 rounded-xl font-bold text-sm hover:bg-black transition-all">
                          GitHub
                        </a>
                      )}
                      {viewingInternProfile.linkedinUrl && (
                        <a href={viewingInternProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#0077b5] text-white p-3 rounded-xl font-bold text-sm hover:bg-[#006396] transition-all">
                          LinkedIn
                        </a>
                      )}
                    </div>
                 </section>
               )}
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50">
               <button 
                 onClick={() => setViewingInternProfile(null)}
                 className="w-full bg-white border-2 border-gray-200 text-gray-900 py-3 rounded-2xl font-black hover:border-gray-900 transition-all"
               >
                 Close Profile
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
