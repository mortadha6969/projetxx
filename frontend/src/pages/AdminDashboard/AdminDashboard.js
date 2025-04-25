import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import apiService from '../../utils/apiService';
import { FiUsers, FiTarget, FiCheckCircle, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Debug user info
    console.log('AdminDashboard - currentUser:', currentUser);
    console.log('AdminDashboard - isAuthenticated:', isAuthenticated);
    console.log('AdminDashboard - user role:', currentUser?.role);

    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user is an admin
    if (currentUser && currentUser.role !== 'admin') {
      console.log('User is not an admin, redirecting to home page');
      navigate('/');
      return;
    }

    // Fetch admin dashboard data
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard statistics
        try {
          console.log('Fetching dashboard statistics...');
          const statsResponse = await apiService.admin.getDashboardStats();
          console.log('Dashboard statistics response:', statsResponse);
          if (statsResponse && statsResponse.stats) {
            setStats(statsResponse.stats);
          } else {
            console.warn('Invalid dashboard statistics response:', statsResponse);
            // Set default stats
            setStats({
              userCount: 0,
              campaignCount: 0,
              activeCount: 0,
              completedCount: 0,
              totalDonated: 0
            });
          }
        } catch (statsError) {
          console.error('Error fetching dashboard statistics:', statsError);
          // Set default stats
          setStats({
            userCount: 0,
            campaignCount: 0,
            activeCount: 0,
            completedCount: 0,
            totalDonated: 0
          });
        }

        // Fetch users
        try {
          console.log('Fetching users...');
          const usersResponse = await apiService.admin.getUsers();
          console.log('Users response:', usersResponse);
          if (usersResponse && usersResponse.users) {
            setUsers(usersResponse.users);
          } else {
            console.warn('Invalid users response:', usersResponse);
            setUsers([]);
          }
        } catch (usersError) {
          console.error('Error fetching users:', usersError);
          setUsers([]);
        }

        // Fetch campaigns
        try {
          console.log('Fetching campaigns...');
          const campaignsResponse = await apiService.admin.getCampaigns();
          console.log('Campaigns response:', campaignsResponse);
          if (campaignsResponse && campaignsResponse.campaigns) {
            setCampaigns(campaignsResponse.campaigns);
          } else {
            console.warn('Invalid campaigns response:', campaignsResponse);
            setCampaigns([]);
          }
        } catch (campaignsError) {
          console.error('Error fetching campaigns:', campaignsError);
          setCampaigns([]);
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAuthenticated, currentUser, navigate]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.admin.deleteUser(userId);
      // Remove the deleted user from the state
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.admin.deleteCampaign(campaignId);
      // Remove the deleted campaign from the state
      setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
    } catch (err) {
      console.error('Error deleting campaign:', err);
      alert('Failed to delete campaign. Please try again.');
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    if (!window.confirm('Are you sure you want to promote this user to admin?')) {
      return;
    }

    try {
      await apiService.admin.updateUser(userId, { role: 'admin' });
      // Update the user's role in the state
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: 'admin' } : user
      ));
    } catch (err) {
      console.error('Error promoting user to admin:', err);
      alert('Failed to promote user to admin. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`py-4 px-6 font-medium text-sm ${
                    activeTab === 'dashboard'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-4 px-6 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className={`py-4 px-6 font-medium text-sm ${
                    activeTab === 'campaigns'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Campaigns
                </button>
              </nav>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && stats && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                        <FiUsers size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Total Users</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.userCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                        <FiTarget size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Total Campaigns</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.campaignCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                        <FiCheckCircle size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Active Campaigns</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.activeCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                        <FiDollarSign size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Total Donations</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {(stats.totalDonated || 0).toLocaleString()} DT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Users</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Username
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.slice(0, 5).map(user => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => setActiveTab('users')}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        View all users
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Campaigns</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Target
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {campaigns.slice(0, 5).map(campaign => (
                            <tr key={campaign.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">${campaign.target}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                                  campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {campaign.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => setActiveTab('campaigns')}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        View all campaigns
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">All Users</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.firstName} {user.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handlePromoteToAdmin(user.id)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Promote to Admin
                                </button>
                              )}
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">All Campaigns</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Creator
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Target
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Donated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {campaigns.map(campaign => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {campaign.user ? campaign.user.username : 'Unknown'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">${campaign.target}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">${campaign.donated || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                              campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/campaign/${campaign.id}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteCampaign(campaign.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
