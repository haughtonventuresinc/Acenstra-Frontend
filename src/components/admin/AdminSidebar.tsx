import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface NavItem {
  label: string;
  section: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Overview', section: 'overview', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Users', section: 'users', icon: <Users className="h-5 w-5" /> },
  { label: 'Applications', section: 'applications', icon: <FileText className="h-5 w-5" /> },
  { label: 'Settings', section: 'settings', icon: <Settings className="h-5 w-5" /> },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { adminLogout, admin } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const currentSection = queryParams.get('section') || 'overview';

  const isActive = (section: string) => currentSection === section;

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-slate-800 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white uppercase block leading-tight">
            Acenstra
          </span>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.section}
            to={`/admin/dashboard?section=${item.section}`}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.section)
                ? 'bg-blue-600/15 text-blue-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 flex-shrink-0 border-t border-slate-800 pt-4 mt-auto">
        {admin?.email && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-slate-500 truncate">{admin.email}</p>
          </div>
        )}
        <button
          onClick={() => {
            adminLogout();
            setMobileOpen(false);
          }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle admin menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-slate-950 border-r border-slate-800 flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Sidebar - mobile */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50 transform transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
