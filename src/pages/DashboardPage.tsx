import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, LogOut } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl p-8 mb-8 flex flex-col items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-20 blur-2xl w-40 h-40 bg-white rounded-full" />
          <UserCircle size={56} className="text-white bg-blue-700 rounded-full p-2 mb-4 shadow-lg" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">Welcome, {user?.username || 'User'}!</h1>
          <p className="text-lg md:text-xl text-blue-100">This is your personal dashboard. More features coming soon!</p>
        </div>
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Your Profile</h2>
          <ul className="space-y-2 text-gray-700">
            <li><span className="font-semibold">User ID:</span> {user?.userId}</li>
            <li><span className="font-semibold">Username:</span> {user?.username}</li>
          </ul>
        </div>
        {/* Actions */}
        <div className="flex justify-center mt-6">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-all shadow-lg"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
