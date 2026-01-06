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

  const handlePostInternship = async (formData) => {
    try {
      await api.post('/internships', formData);
      setShowPostForm(false);
      setReloadTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error posting internship:', error);
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">My Internships</h2>
        <button
          onClick={() => setShowPostForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Post New Internship
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Applications</th>
              <th className="px-4 py-2 text-left">Deadline</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {internships.map((internship) => (
              <tr key={internship.id} className="border-t">
                <td className="px-4 py-2">{internship.title}</td>
                <td className="px-4 py-2">{internship.category}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    internship.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                    internship.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {internship.status}
                  </span>
                </td>
                <td className="px-4 py-2">{internship.applications?.length || 0}</td>
                <td className="px-4 py-2">{new Date(internship.applicationDeadline).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">View</button>
                  <button className="text-green-600 hover:text-green-800 mr-2">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
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

      {/* Post Internship Modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Post New Internship</h2>
            <form onSubmit={(e) => { e.preventDefault(); handlePostInternship(new FormData(e.target)); }}>
              <div className="space-y-6">
                {/* Basic Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🔹 Basic Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="title" placeholder="Internship Title" required className="w-full p-2 border rounded" />
                    <input name="companyName" placeholder="Company Name" required className="w-full p-2 border rounded" />
                    <select name="category" required className="w-full p-2 border rounded">
                      <option value="">Select Category</option>
                      <option value="IT">IT</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Design">Design</option>
                      <option value="HR">HR</option>
                    </select>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Internship Type</label>
                      <div className="flex space-x-4">
                        <label><input type="radio" name="type" value="Paid" required /> Paid</label>
                        <label><input type="radio" name="type" value="Unpaid" /> Unpaid</label>
                      </div>
                      <div className="flex space-x-4">
                        <label><input type="radio" name="locationType" value="Remote" required /> Remote</label>
                        <label><input type="radio" name="locationType" value="Onsite" /> Onsite</label>
                        <label><input type="radio" name="locationType" value="Hybrid" /> Hybrid</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duration & Schedule */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🔹 Duration & Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="duration" required className="w-full p-2 border rounded">
                      <option value="">Select Duration</option>
                      <option value="1 month">1 month</option>
                      <option value="3 months">3 months</option>
                      <option value="6 months">6 months</option>
                    </select>
                    <input name="startDate" type="date" required className="w-full p-2 border rounded" />
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Working Hours</label>
                      <div className="flex space-x-4">
                        <label><input type="radio" name="workingHours" value="Full-time" required /> Full-time</label>
                        <label><input type="radio" name="workingHours" value="Part-time" /> Part-time</label>
                      </div>
                    </div>
                    <input name="hoursPerDay" type="number" placeholder="Hours per day" required className="w-full p-2 border rounded" />
                  </div>
                </div>

                {/* Stipend & Benefits */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🔹 Stipend & Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="stipend" type="number" placeholder="Stipend Amount" className="w-full p-2 border rounded" />
                    <div className="space-y-2">
                      <label><input type="checkbox" name="certificate" /> Certificate Provided</label>
                      <label><input type="checkbox" name="jobOffer" /> Job Offer After Internship</label>
                    </div>
                  </div>
                  <textarea name="otherBenefits" placeholder="Other Benefits (e.g., Flexible hours, Learning resources, Mentorship)" className="w-full p-2 border rounded mt-2"></textarea>
                </div>

                {/* Skills & Eligibility */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🔹 Skills & Eligibility</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea name="requiredSkills" placeholder="Required Skills (comma-separated)" required className="w-full p-2 border rounded"></textarea>
                    <select name="educationLevel" required className="w-full p-2 border rounded">
                      <option value="">Education Level</option>
                      <option value="+2">+2</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Any">Any</option>
                    </select>
                    <select name="experienceRequired" required className="w-full p-2 border rounded">
                      <option value="">Experience Required</option>
                      <option value="Fresher">Fresher</option>
                      <option value="Basic knowledge">Basic knowledge</option>
                    </select>
                  </div>
                </div>

                {/* Internship Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🔹 Internship Description</h3>
                  <textarea name="aboutInternship" placeholder="About the Internship" required className="w-full p-2 border rounded mb-2"></textarea>
                  <textarea name="rolesResponsibilities" placeholder="Roles & Responsibilities" required className="w-full p-2 border rounded mb-2"></textarea>
                  <textarea name="whatInternWillLearn" placeholder="What Intern Will Learn" required className="w-full p-2 border rounded"></textarea>
                </div>

                {/* Application Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🔹 Application Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="numberOfOpenings" type="number" placeholder="Number of Openings" required className="w-full p-2 border rounded" />
                    <input name="applicationDeadline" type="date" required className="w-full p-2 border rounded" />
                  </div>
                  <textarea name="selectionProcess" placeholder="Selection Process (e.g., Resume screening, Interview, Task)" required className="w-full p-2 border rounded mt-2"></textarea>
                </div>

                <div className="flex space-x-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Publish</button>
                  <button type="button" onClick={() => setShowPostForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
