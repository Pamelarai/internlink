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
    skills: '',
    bio: '',
    resumeUrl: '',
    portfolioUrl: '',
    githubUrl: '',
    linkedinUrl: ''
  });
  const [viewingInternship, setViewingInternship] = useState(null);
  const [viewingCompanyProfile, setViewingCompanyProfile] = useState(null);
  const [applyingToInternship, setApplyingToInternship] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    coverLetter: '',
    resume: '',
    phoneNumber: '',
    availability: '',
    portfolioUrl: '',
    githubUrl: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'INTERN') {
      window.location.href = '/login';
    } else {
      const loadDashboardData = async () => {
        try {
          const [internshipsRes, applicationsRes, notificationsRes, profileRes] = await Promise.all([
            api.get('/internships'),
            api.get('/applications/intern'),
            api.get('/notifications'),
            api.get('/intern/my/profile').catch(() => ({ data: { data: null } })) // Handle case where profile doesn't exist yet
          ]);

          setInternships(internshipsRes.data);
          setApplications(applicationsRes.data);
          setNotifications(notificationsRes.data);

          // Load profile data if it exists
          if (profileRes.data && profileRes.data.data && profileRes.data.data.profile) {
            const profile = profileRes.data.data.profile;
            setProfileData({
              fullName: profile.fullName,
              university: profile.university,
              major: profile.major,
              graduationYear: profile.graduationYear,
              skills: profile.skills || '',
              bio: profile.bio || '',
              resumeUrl: profile.resumeUrl || '',
              portfolioUrl: profile.portfolioUrl || '',
              githubUrl: profile.githubUrl || '',
              linkedinUrl: profile.linkedinUrl || ''
            });
            setProfileForm({
              fullName: profile.fullName,
              university: profile.university,
              major: profile.major,
              graduationYear: profile.graduationYear || '',
              skills: profile.skills || '',
              bio: profile.bio || '',
              resumeUrl: profile.resumeUrl || '',
              portfolioUrl: profile.portfolioUrl || '',
              githubUrl: profile.githubUrl || '',
              linkedinUrl: profile.linkedinUrl || ''
            });
          }

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

  const handleApply = (internship) => {
    setApplyingToInternship(internship);
    // Pre-fill with profile data if available
    setApplicationForm({
      coverLetter: '',
      resume: profileData?.resumeUrl || '',
      phoneNumber: '',
      availability: '',
      portfolioUrl: profileData?.portfolioUrl || '',
      githubUrl: profileData?.githubUrl || ''
    });
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    try {
      await api.post('/applications/apply', {
        internshipId: applyingToInternship.id,
        ...applicationForm
      });
      setReloadTrigger(prev => prev + 1);
      setApplyingToInternship(null);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for internship:', error);
      const errorMsg = error.response?.data?.message || 'Failed to apply. Please try again.';
      const errorDetails = error.response?.data?.details ? `\nDetails: ${error.response.data.details}` : '';
      alert(`${errorMsg}${errorDetails}`);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/intern/my/profile', {
        fullName: profileForm.fullName,
        university: profileForm.university,
        major: profileForm.major,
        graduationYear: profileForm.graduationYear,
        skills: profileForm.skills,
        bio: profileForm.bio,
        resumeUrl: profileForm.resumeUrl,
        portfolioUrl: profileForm.portfolioUrl,
        githubUrl: profileForm.githubUrl,
        linkedinUrl: profileForm.linkedinUrl
      });

      const updatedProfile = res.data.data.profile;
      // Update local state with the saved data
      setProfileData({
        fullName: updatedProfile.fullName,
        university: updatedProfile.university,
        major: updatedProfile.major,
        graduationYear: updatedProfile.graduationYear,
        skills: updatedProfile.skills || '',
        bio: updatedProfile.bio || '',
        resumeUrl: updatedProfile.resumeUrl || '',
        portfolioUrl: updatedProfile.portfolioUrl || '',
        githubUrl: updatedProfile.githubUrl || '',
        linkedinUrl: updatedProfile.linkedinUrl || ''
      });
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const fetchCompanyProfile = async (companyId) => {
    try {
      const res = await api.get(`/company/${companyId}`);
      setViewingCompanyProfile(res.data.data.company);
    } catch (error) {
      console.error('Error fetching company profile:', error);
      alert('Failed to load company profile.');
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
            <div className="flex justify-between items-center mt-auto">
              <div className="text-blue-700 font-bold">
                {internship.stipend ? `₹${internship.stipend}/mo` : 'Unpaid'}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewingInternship(internship)}
                  className="bg-white text-blue-600 border border-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors text-sm font-bold"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleApply(internship)}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold shadow-sm"
                >
                  Apply
                </button>
              </div>
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
              placeholder="List your skills, interests..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">Short Bio (Optional)</label>
            <textarea
              rows="3"
              value={profileForm.bio}
              onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
              className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us a bit about yourself..."
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Resume Link (Optional)</label>
              <input
                type="url"
                value={profileForm.resumeUrl}
                onChange={(e) => setProfileForm({...profileForm, resumeUrl: e.target.value})}
                className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Google Drive / Dropbox link"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Portfolio/Website (Optional)</label>
              <input
                type="url"
                value={profileForm.portfolioUrl}
                onChange={(e) => setProfileForm({...profileForm, portfolioUrl: e.target.value})}
                className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">GitHub URL (Optional)</label>
              <input
                type="url"
                value={profileForm.githubUrl}
                onChange={(e) => setProfileForm({...profileForm, githubUrl: e.target.value})}
                className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">LinkedIn URL (Optional)</label>
              <input
                type="url"
                value={profileForm.linkedinUrl}
                onChange={(e) => setProfileForm({...profileForm, linkedinUrl: e.target.value})}
                className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
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
                <label className="block text-sm font-medium text-blue-700 mb-2">Bio</label>
                <div className="bg-white p-4 rounded-md border border-blue-200">
                  <p className="text-blue-900 whitespace-pre-wrap">{profileData.bio || 'Your bio will appear here.'}</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-blue-700 mb-2">Skills & Interests</label>
                <div className="bg-white p-4 rounded-md border border-blue-200 flex flex-wrap gap-2">
                  {profileData.skills ? profileData.skills.split(',').map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {skill.trim()}
                    </span>
                  )) : (
                    <p className="text-gray-400 italic text-sm">No skills added yet.</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-blue-700 mb-2">Professional Links</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.resumeUrl && (
                    <a href={profileData.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-white p-3 rounded-md border border-blue-200">
                      📄 View Resume
                    </a>
                  )}
                  {profileData.portfolioUrl && (
                    <a href={profileData.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-white p-3 rounded-md border border-blue-200">
                      🌐 Portfolio Website
                    </a>
                  )}
                  {profileData.githubUrl && (
                    <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-white p-3 rounded-md border border-blue-200">
                       GitHub Profile
                    </a>
                  )}
                  {profileData.linkedinUrl && (
                    <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-white p-3 rounded-md border border-blue-200">
                       LinkedIn Profile
                    </a>
                  )}
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

      {/* Internship Details Modal */}
      {viewingInternship && (
        <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-auto animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-blue-50 flex justify-between items-center bg-blue-50/30 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-black text-blue-900">Internship Details</h2>
                <p className="text-blue-600 text-sm font-medium">Opportunity at {viewingInternship.provider?.companyName || viewingInternship.companyName}</p>
              </div>
              <button onClick={() => setViewingInternship(null)} className="text-blue-400 hover:text-blue-600 p-2 bg-white rounded-full shadow-sm transition-all text-xl font-bold">&times;</button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto">
              <div>
                 <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-tighter">{viewingInternship.category}</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-tighter">{viewingInternship.locationType}</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-tighter">{viewingInternship.stipend ? 'Paid' : 'Unpaid'}</span>
                 </div>
                 <h3 className="text-3xl font-black text-gray-900 leading-tight mb-2">{viewingInternship.title}</h3>
                 <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <button 
                      onClick={() => fetchCompanyProfile(viewingInternship.providerId)}
                      className="hover:underline cursor-pointer text-left"
                    >
                      {viewingInternship.provider?.companyName || viewingInternship.companyName}
                    </button>
                    <span className="w-1.5 h-1.5 bg-blue-200 rounded-full"></span>
                    <span className="text-gray-500 font-medium">{viewingInternship.location}</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50/50 p-6 rounded-2xl flex-shrink-0">
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-sm font-bold text-blue-900">{viewingInternship.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Stipend</p>
                  <p className="text-sm font-bold text-blue-900">{viewingInternship.stipend ? `₹${viewingInternship.stipend}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Deadline</p>
                  <p className="text-sm font-bold text-blue-900">{new Date(viewingInternship.applicationDeadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Date Posted</p>
                  <p className="text-sm font-bold text-blue-900">{new Date(viewingInternship.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-blue-600"></span> About the Role
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{viewingInternship.aboutInternship || viewingInternship.description}</p>
                </section>

                <section>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-blue-600"></span> Requirements
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{viewingInternship.requirements}</p>
                </section>

                {viewingInternship.requiredSkills && (
                  <section>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-blue-600"></span> Skills Preferred
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingInternship.requiredSkills.split(',').map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white border border-blue-100 text-blue-600 rounded-xl text-xs font-bold shadow-sm">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-blue-50 bg-gray-50/50 flex gap-4 flex-shrink-0">
              <button 
                onClick={() => setViewingInternship(null)}
                className="flex-1 px-6 py-4 border border-blue-200 text-blue-700 rounded-2xl font-black hover:bg-white transition-all tracking-tight"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  handleApply(viewingInternship);
                  setViewingInternship(null);
                }}
                className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all tracking-tight"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Profile Modal */}
      {viewingCompanyProfile && (
        <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-auto animate-in fade-in slide-in-from-bottom-8 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700 flex-shrink-0">
               <button 
                 onClick={() => setViewingCompanyProfile(null)}
                 className="absolute top-6 right-6 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all font-bold text-xl w-10 h-10 flex items-center justify-center"
               >
                 &times;
               </button>
               <div className="absolute -bottom-12 left-12 p-2 bg-white rounded-2xl shadow-xl">
                  <div className="w-24 h-24 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-4xl font-black border border-blue-100">
                    {viewingCompanyProfile.companyName.charAt(0)}
                  </div>
               </div>
            </div>
            
            <div className="pt-16 px-12 pb-12 overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 mb-1">{viewingCompanyProfile.companyName}</h2>
                  <p className="text-blue-600 font-bold text-lg">{viewingCompanyProfile.industry}</p>
                  <div className="flex gap-4 mt-4 text-sm text-gray-500 font-medium">
                     <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {viewingCompanyProfile.location}
                     </span>
                     <span className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 115.656 5.656l-1.102 1.101" /></svg>
                        <a href={viewingCompanyProfile.website} target="_blank" rel="noopener noreferrer">{viewingCompanyProfile.website}</a>
                     </span>
                  </div>
                </div>
                <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 text-center">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Company Size</p>
                   <p className="font-bold text-blue-900">{viewingCompanyProfile.companySize || 'Private Limited'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                  <section>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <span className="w-8 h-[2px] bg-blue-600"></span> About the Company
                    </h4>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{viewingCompanyProfile.description}</p>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <section className="bg-blue-50/30 p-6 rounded-2xl border border-blue-50">
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-3">Our Mission</h4>
                        <p className="text-gray-600 text-sm italic">"{viewingCompanyProfile.mission}"</p>
                     </section>
                     <section className="bg-indigo-50/30 p-6 rounded-2xl border border-indigo-50">
                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">Our Vision</h4>
                        <p className="text-gray-600 text-sm italic">"{viewingCompanyProfile.vision}"</p>
                     </section>
                  </div>

                  {viewingCompanyProfile.culture && (
                    <section>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <span className="w-8 h-[2px] bg-blue-600"></span> Culture & Values
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-sm">{viewingCompanyProfile.culture}</p>
                    </section>
                  )}
                </div>

                <div className="space-y-8">
                   <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Recent Openings</h4>
                      <div className="space-y-4">
                        {(viewingCompanyProfile.internships || []).map(intern => (
                           <div key={intern.id} className="group cursor-pointer">
                              <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{intern.title}</h5>
                              <p className="text-xs text-gray-500">{intern.location} • {new Date(intern.createdAt).toLocaleDateString()}</p>
                           </div>
                        ))}
                        {(!viewingCompanyProfile.internships || viewingCompanyProfile.internships.length === 0) && (
                          <p className="text-sm text-gray-400 italic">No active openings at the moment.</p>
                        )}
                      </div>
                   </div>

                   {viewingCompanyProfile.benefits && (
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-100">
                        <h4 className="text-xs font-black opacity-60 uppercase tracking-widest mb-4">Why Join Us?</h4>
                        <p className="text-sm leading-relaxed">{viewingCompanyProfile.benefits}</p>
                      </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Application Form Modal */}
      {applyingToInternship && (
        <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-md flex items-center justify-center z-[70] p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-auto animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-blue-50 flex justify-between items-center bg-blue-50/30">
              <div>
                <h2 className="text-2xl font-black text-blue-900">Apply for Internship</h2>
                <p className="text-blue-600 text-sm font-medium">{applyingToInternship.title} at {applyingToInternship.provider?.companyName || applyingToInternship.companyName}</p>
              </div>
              <button onClick={() => setApplyingToInternship(null)} className="text-blue-400 hover:text-blue-600 p-2 bg-white rounded-full shadow-sm transition-all text-xl font-bold">&times;</button>
            </div>

            <form onSubmit={submitApplication} className="p-8 space-y-6 overflow-y-auto">
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-50 mb-6">
                <p className="text-sm text-blue-800 leading-relaxed font-medium">
                  Provide detailed information to help the company trust your application and understand your skills better.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Cover Letter</label>
                <textarea
                  required
                  rows="4"
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm({...applicationForm, coverLetter: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                  placeholder="Why are you a good fit for this role? Share your motivation and relevant experience."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Resume URL</label>
                  <input
                    required
                    type="url"
                    value={applicationForm.resume}
                    onChange={(e) => setApplicationForm({...applicationForm, resume: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                    placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={applicationForm.phoneNumber}
                    onChange={(e) => setApplicationForm({...applicationForm, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Availability</label>
                <input
                  required
                  type="text"
                  value={applicationForm.availability}
                  onChange={(e) => setApplicationForm({...applicationForm, availability: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                  placeholder="e.g., Immediate, From next month, Part-time"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Portfolio URL (Optional)</label>
                  <input
                    type="url"
                    value={applicationForm.portfolioUrl}
                    onChange={(e) => setApplicationForm({...applicationForm, portfolioUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-blue-400 uppercase tracking-widest mb-2">GitHub URL (Optional)</label>
                  <input
                    type="url"
                    value={applicationForm.githubUrl}
                    onChange={(e) => setApplicationForm({...applicationForm, githubUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-blue-50 flex gap-4">
                <button
                  type="button"
                  onClick={() => setApplyingToInternship(null)}
                  className="flex-1 px-6 py-4 border border-blue-200 text-blue-700 rounded-2xl font-black hover:bg-blue-50 transition-all tracking-tight"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all tracking-tight"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
