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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'PROVIDER') {
      window.location.href = '/login';
    } else {
      const loadDashboardData = async () => {
        try {
          const [internshipsRes, applicationsRes, notificationsRes] = await Promise.all([
            api.get('/internships/provider'),
            api.get('/applications/provider'),
            api.get('/notifications')
          ]);

          setInternships(internshipsRes.data);
          setApplications(applicationsRes.data);
          setNotifications(notificationsRes.data);

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Applications</h2>
      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{application.intern.user.email}</h3>
                <p className="text-sm text-gray-600">{application.intern.university} - {application.intern.major}</p>
                <p className="text-sm text-gray-600">Applied for: {application.internship.title}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApplicationAction(application.id, 'SHORTLISTED')}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleApplicationAction(application.id, 'REJECTED')}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApplicationAction(application.id, 'SELECTED')}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Select
                </button>
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                  Schedule Interview
                </button>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm"><strong>Status:</strong> {application.status}</p>
              <p className="text-sm"><strong>Cover Letter:</strong> {application.coverLetter}</p>
              <a href={application.resume} className="text-blue-600 text-sm hover:underline">View Resume</a>
            </div>
          </div>
        ))}
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Company Profile</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Industry</label>
          <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input type="url" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows="4"></textarea>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Update Profile
        </button>
      </form>
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



    </div>
  );
};

export default ProviderDashboard;
