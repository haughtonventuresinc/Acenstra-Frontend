import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Users,
  Activity,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Eye,
  Trash2,
  Loader2,
  Save,
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getAdminStats,
  getAdminUsers,
  getAdminApplications,
  type AdminStats,
  type AdminUser,
  type AdminApplication,
} from '../../services/adminService';

// --- Overview Section ---
const OverviewSection: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getAdminStats();
      setStats(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      growth: stats.userGrowth,
      icon: <Users className="h-5 w-5" />,
      color: 'bg-blue-600',
    },
    {
      label: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      growth: stats.activeGrowth,
      icon: <Activity className="h-5 w-5" />,
      color: 'bg-emerald-600',
    },
    {
      label: 'Applications',
      value: stats.totalApplications.toLocaleString(),
      growth: stats.applicationGrowth,
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-amber-600',
    },
    {
      label: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      growth: stats.revenueGrowth,
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-indigo-600',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">{card.label}</span>
              <div className={`${card.color} text-white p-2 rounded-lg`}>
                {card.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {card.growth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  card.growth >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {card.growth >= 0 ? '+' : ''}
                {card.growth}%
              </span>
              <span className="text-xs text-slate-400 ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { text: 'New user registered: emily.chen@email.com', time: '2 hours ago', dot: 'bg-blue-500' },
            { text: 'Application approved: John Doe - Credit Repair', time: '5 hours ago', dot: 'bg-emerald-500' },
            { text: 'New application submitted: Lisa Garcia - Business Funding', time: '8 hours ago', dot: 'bg-amber-500' },
            { text: 'User account deactivated: david.martinez@email.com', time: '1 day ago', dot: 'bg-red-500' },
            { text: 'Payment received: $2,400 from Sarah Jones', time: '1 day ago', dot: 'bg-indigo-500' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-3 py-2">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">{activity.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Users Section ---
const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await getAdminUsers();
      setUsers(data);
      setLoading(false);
    };
    load();
  }, []);

  const filteredUsers = users.filter(
    (u) => u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Date Joined</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-slate-800 font-medium">{user.email}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(user.dateJoined).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          aria-label={`View ${user.email}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label={`Delete ${user.email}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Applications Section ---
const ApplicationsSection: React.FC = () => {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getAdminApplications();
      setApplications(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  const statusStyles: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Rejected: 'bg-red-50 text-red-700 border-red-200',
    'In Review': 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Application Management</h1>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Applicant</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Date</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-slate-800 font-medium">{app.applicantName}</p>
                      <p className="text-xs text-slate-400">{app.applicantEmail}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        app.type === 'Credit Repair'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-teal-50 text-teal-700 border-teal-200'
                      }`}
                    >
                      {app.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        statusStyles[app.status] || ''
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(app.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      aria-label={`View application from ${app.applicantName}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Showing {applications.length} applications
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Settings Section ---
const SettingsSection: React.FC = () => {
  const { admin } = useAdminAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Admin Profile */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Admin Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={admin?.email || ''}
                readOnly
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Change Password</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Save className="h-4 w-4" />
              Update Password
            </button>
          </div>
        </div>

        {/* Site Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Site Settings</h2>
          <div className="space-y-4">
            {[
              { label: 'Enable new user registrations', defaultChecked: true },
              { label: 'Require email verification', defaultChecked: true },
              { label: 'Maintenance mode', defaultChecked: false },
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-700">{setting.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={setting.defaultChecked}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Layout ---
const AdminDashboardPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentSection = queryParams.get('section') || 'overview';

  const renderSection = () => {
    switch (currentSection) {
      case 'overview':
        return <OverviewSection />;
      case 'users':
        return <UsersSection />;
      case 'applications':
        return <ApplicationsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />
      <main className="lg:pl-64">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8 max-w-6xl mx-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
