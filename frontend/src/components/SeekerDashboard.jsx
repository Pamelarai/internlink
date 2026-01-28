import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const SeekerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0
  });
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    university: '',
    major: '',
    graduationYear: '',
    skills: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'INTERN') {
      window.location.href = '/login';
    } else {
      const loadDashboardData = async () => {
        try {
          const [internshipsRes, applicationsRes, notificationsRes] = await Promise.all([
            api.get('/internships'),
            api.get('/applications/intern'),
            api.get('/notifications')
          ]);

          setInternships(internshipsRes.data);
          setApplications(applicationsRes.data);
          setNotifications(notificationsRes.data);

          // Calculate stats
          const totalApplications = applicationsRes.data.length;
          const pendingApplications = applicationsRes.data.filter(a => a.status === 'PENDING').length;
          const acceptedApplications = applicationsRes.data.filter(a => a.status === 'SELECTED').length;
          const rejectedApplications = applicationsRes.data.filter(a => a.status === 'REJECTED').length;

          setStats({
            totalApplications,
            pendingApplications,
            acceptedApplications,
            rejectedApplications
          });
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        }
      };
      loadDashboardData();
    }
  }, [reloadTrigger]);

  const handleApply = async (internshipId) => {
    try {
      await api.post('/applications/apply', {
        internshipId,
        coverLetter: 'I am very interested in this internship opportunity.',
        resume: 'resume.pdf'
      });
      setReloadTrigger(prev => prev + 1);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for internship:', error);
      alert('Failed to apply. Please try again.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to update the profile
      // For now, we'll just simulate the update and switch to view mode
      setProfileData({
        fullName: profileForm.fullName || 'John Doe',
        university: profileForm.university || 'University Name',
        major: profileForm.major || 'Computer Science',
        graduationYear: profileForm.graduationYear || 2025,
        skills: profileForm.skills || 'Programming, Problem Solving, Team Work'
      });
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Welcome to Your Dashboard</h1>
          <p className="text-blue-600">Discover amazing internship opportunities and track your applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-800 mb-2">{stats.totalApplications}</div>
            <div className="text-sm text-blue-600">Total Applications</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-800 mb-2">{stats.pendingApplications}</div>
            <div className="text-sm text-blue-600">Pending Review</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-800 mb-2">{stats.acceptedApplications}</div>
            <div className="text-sm text-blue-600">Accepted</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-800 mb-2">{internships.length}</div>
            <div className="text-sm text-blue-600">Available Internships</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveTab('internships')}
          className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors text-center"
        >
          <div className="text-lg font-semibold mb-2">Browse Internships</div>
          <div className="text-blue-100 text-sm">Find your dream opportunity</div>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className="bg-blue-500 text-white p-6 rounded-xl hover:bg-blue-600 transition-colors text-center"
        >
          <div className="text-lg font-semibold mb-2">My Applications</div>
          <div className="text-blue-100 text-sm">Track your application status</div>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className="bg-blue-400 text-white p-6 rounded-xl hover:bg-blue-500 transition-colors text-center"
        >
          <div className="text-lg font-semibold mb-2">Update Profile</div>
          <div className="text-blue-100 text-sm">Enhance your profile</div>
        </button>
      </div>
    </div>
  );

  const renderInternships = () => (
    <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Available Internships</h2>
        <div className="text-sm text-blue-600">Showing {internships.length} opportunities</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => (
          <div key={internship.id} className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">{internship.title}</h3>
              <p className="text-blue-700 font-medium">{internship.provider?.companyName || 'Company'}</p>
              <p className="text-blue-600 text-sm">{internship.location}</p>
            </div>
            <div className="mb-4">
              <p className="text-blue-800 text-sm mb-2">{internship.description.substring(0, 100)}...</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{internship.category}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{internship.duration}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-blue-700 font-medium">
                {internship.stipend ? `₹${internship.stipend}/month` : 'Unpaid'}
              </div>
              <button
                onClick={() => handleApply(internship.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">My Applications</h2>
        <div className="text-sm text-blue-600">Total: {applications.length}</div>
      </div>
      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application.id} className="border border-blue-200 rounded-lg p-6 bg-blue-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  {application.internship?.title}
                </h3>
                <p className="text-blue-700">{application.internship?.provider?.companyName}</p>
                <p className="text-blue-600 text-sm">Applied on {new Date(application.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                application.status === 'SELECTED' ? 'bg-green-100 text-green-800' :
                application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {application.status}
              </span>
            </div>
            <div className="text-blue-800 text-sm">
              <p><strong>Cover Letter:</strong> {application.coverLetter}</p>
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-blue-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">No applications yet</h3>
            <p className="text-blue-600 mb-4">Start exploring internships and submit your first application!</p>
            <button
              onClick={() => setActiveTab('internships')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Internships
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Notifications</h2>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className={`p-4 rounded-lg border ${notification.isRead ? 'bg-blue-50 border-blue-100' : 'bg-blue-100 border-blue-200'}`}>
            <p className="text-sm text-blue-900">{notification.message}</p>
            <p className="text-xs text-blue-600 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-blue-400 text-6xl mb-4">🔔</div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">No notifications</h3>
            <p className="text-blue-600">You'll receive updates about your applications here.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">My Profile</h2>
        {!isEditingProfile && profileData && (
          <button
            onClick={handleEditProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditingProfile ? (
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">University</label>
              <input
                type="text"
                value={profileForm.university}
                onChange={(e) => setProfileForm({...profileForm, university: e.target.value})}
                className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your university"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Major</label>
              <input
                type="text"
                value={profileForm.major}
                onChange={(e) => setProfileForm({...profileForm, major: e.target.value})}
                className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your major/field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Graduation Year</label>
              <input
                type="number"
                value={profileForm.graduationYear}
                onChange={(e) => setProfileForm({...profileForm, graduationYear: e.target.value})}
                className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="2025"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">Skills & Interests</label>
            <textarea
              rows="4"
              value={profileForm.skills}
              onChange={(e) => setProfileForm({...profileForm, skills: e.target.value})}
              className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="List your skills, interests, and what you're looking for in an internship..."
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Update Profile
            </button>
          </div>
        </form>
      ) : (
        profileData ? (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {profileData.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">{profileData.fullName}</h3>
                  <p className="text-blue-600">Internship Seeker</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">University</label>
                    <p className="text-blue-900 bg-white px-3 py-2 rounded-md border border-blue-200">{profileData.university}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Major</label>
                    <p className="text-blue-900 bg-white px-3 py-2 rounded-md border border-blue-200">{profileData.major}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Graduation Year</label>
                    <p className="text-blue-900 bg-white px-3 py-2 rounded-md border border-blue-200">{profileData.graduationYear}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Status</label>
                    <p className="text-blue-900 bg-white px-3 py-2 rounded-md border border-blue-200">
                      {new Date().getFullYear() <= profileData.graduationYear ? 'Student' : 'Graduate'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-blue-700 mb-2">Skills & Interests</label>
                <div className="bg-white p-4 rounded-md border border-blue-200">
                  <p className="text-blue-900">{profileData.skills}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Quick Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalApplications}</div>
                  <div className="text-sm text-blue-700">Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.pendingApplications}</div>
                  <div className="text-sm text-blue-700">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.acceptedApplications}</div>
                  <div className="text-sm text-blue-700">Accepted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{internships.length}</div>
                  <div className="text-sm text-blue-700">Available</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-blue-400 text-6xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Profile Not Set Up</h3>
            <p className="text-blue-600 mb-4">Complete your profile to enhance your internship applications.</p>
            <button
              onClick={handleEditProfile}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Set Up Profile
            </button>
          </div>
        )
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-blue-900">InternLink - Seeker</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-100'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('internships')}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'internships' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-100'}`}
              >
                Browse Internships
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'applications' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-100'}`}
              >
                My Applications
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-100'}`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-100'}`}
              >
                Profile
              </button>
              <button
                onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                className="text-blue-600 hover:text-blue-800 transition-colors"
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
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

export default SeekerDashboard;
