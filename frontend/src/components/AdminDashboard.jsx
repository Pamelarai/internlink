import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingInternship, setViewingInternship] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchInternships();
    fetchApplications();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchInternships = async () => {
    try {
      const res = await api.get('/admin/internships');
      setInternships(res.data.data);
    } catch (err) {
      console.error('Error fetching internships:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get('/admin/applications');
      setApplications(res.data.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };


  const handleToggleBlock = async (id) => {
    try {
      await api.put(`/admin/users/${id}/block`);
      fetchUsers();
    } catch (err) {
      alert('Error toggling block status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
        fetchStats();
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  const handleApproveInternship = async (id) => {
    try {
      await api.put(`/admin/internships/${id}/approve`);
      fetchInternships();
    } catch (err) {
      alert('Error approving internship');
    }
  };

  const handleRejectInternship = async (id) => {
    try {
      await api.put(`/admin/internships/${id}/reject`);
      fetchInternships();
    } catch (err) {
      alert('Error rejecting internship');
    }
  };


  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
        <span className="text-gray-500 text-sm font-medium uppercase">Total Users</span>
        <span className="text-3xl font-bold text-indigo-600">{stats?.userCount || 0}</span>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
        <span className="text-gray-500 text-sm font-medium uppercase">Interns</span>
        <span className="text-3xl font-bold text-green-600">{stats?.internCount || 0}</span>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
        <span className="text-gray-500 text-sm font-medium uppercase">Providers</span>
        <span className="text-3xl font-bold text-orange-600">{stats?.providerCount || 0}</span>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
        <span className="text-gray-500 text-sm font-medium uppercase">Internships</span>
        <span className="text-3xl font-bold text-blue-600">{stats?.internshipCount || 0}</span>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
        <span className="text-gray-500 text-sm font-medium uppercase">Applications</span>
        <span className="text-3xl font-bold text-purple-600">{stats?.applicationCount || 0}</span>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : user.role === 'PROVIDER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.isBlocked ? (
                  <span className="text-red-600 font-medium">Blocked</span>
                ) : (
                  <span className="text-green-600 font-medium">Active</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleToggleBlock(user.id)}
                  className={`mr-4 ${user.isBlocked ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'}`}
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderInternships = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {internships.map((internship) => (
            <tr key={internship.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{internship.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{internship.provider?.companyName || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {internship.isApproved ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => setViewingInternship(internship)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  View
                </button>
                {!internship.isApproved ? (
                  <button
                    onClick={() => handleApproveInternship(internship.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => handleRejectInternship(internship.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Reject
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderApplications = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intern</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((app) => (
            <tr key={app.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.intern?.fullName || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.internship?.title || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : app.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                  {app.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(app.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-['Inter'] tracking-tight">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">InternLink</h1>
            <span className="px-2 py-1 bg-gray-100 text-gray-400 text-[10px] font-black uppercase rounded tracking-widest">Admin</span>
          </div>
          
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Overview', icon: 'M4 6h16M4 12h16M4 18h16' },
              { id: 'users', label: 'User Management', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
              { id: 'internships', label: 'Internships', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              { id: 'applications', label: 'Applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-8 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
          <div className="lg:hidden flex items-center gap-4">
             {/* Simple Mobile Menu would go here */}
             <select 
               value={activeTab} 
               onChange={(e) => setActiveTab(e.target.value)}
               className="bg-white border border-gray-300 rounded-md px-2 py-1"
             >
                <option value="dashboard">Dashboard</option>
                <option value="users">Users</option>
                <option value="internships">Internships</option>
                <option value="applications">Applications</option>
             </select>
          </div>
        </header>

        {activeTab === 'dashboard' && renderStats()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'internships' && renderInternships()}
        {activeTab === 'applications' && renderApplications()}
      </main>

        {/* View Internship Details Modal */}
        {viewingInternship && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingInternship.title}</h2>
                  <p className="text-indigo-600 font-semibold">{viewingInternship.provider?.companyName || viewingInternship.companyName}</p>
                </div>
                <button 
                  onClick={() => setViewingInternship(null)} 
                  className="text-gray-400 hover:text-gray-600 p-2 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
              
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-sm font-semibold text-gray-800">{viewingInternship.location} ({viewingInternship.locationType})</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-sm font-semibold text-gray-800">{viewingInternship.duration}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stipend</p>
                    <p className="text-sm font-semibold text-gray-800">{viewingInternship.stipend ? `₹${viewingInternship.stipend}` : 'Unpaid'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
                    <p className="text-sm font-semibold text-gray-800">{viewingInternship.category}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b pb-1">About the Internship</h4>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewingInternship.aboutInternship || viewingInternship.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b pb-1">Requirements</h4>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewingInternship.requirements}</p>
                  </div>
                  {viewingInternship.requiredSkills && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b pb-1">Skills Required</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewingInternship.requiredSkills.split(',').map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
                 {!viewingInternship.isApproved ? (
                    <button
                      onClick={() => {
                        handleApproveInternship(viewingInternship.id);
                        setViewingInternship(null);
                      }}
                      className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve This Posting
                    </button>
                 ) : (
                    <button
                      onClick={() => {
                        handleRejectInternship(viewingInternship.id);
                        setViewingInternship(null);
                      }}
                      className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject This Posting
                    </button>
                 )}
                 <button
                   onClick={() => setViewingInternship(null)}
                   className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                 >
                   Close
                 </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminDashboard;
