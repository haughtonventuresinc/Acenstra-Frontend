import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, LogOut } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans" style={{ paddingLeft: '16rem' }}>
      <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 flex flex-col items-center border border-blue-100">
          <UserCircle size={56} className="text-blue-600 bg-blue-100 rounded-full p-2 mb-4 shadow-lg" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-1 drop-shadow">Welcome!</h1>
          <div className="text-lg md:text-xl text-blue-700 font-semibold">{user?.email || 'Your email here'}</div>
          <div className="flex justify-center mt-6 w-full">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-700 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all shadow-lg"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
