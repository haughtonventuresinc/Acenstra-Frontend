import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { adminLogin, isLoading, error, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await adminLogin({ email, password });
    } catch (err) {
      console.error('Admin login error:', err);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAdminAuthenticated, navigate, location.state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white uppercase">
              Acenstra
            </span>
          </div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Sign in to Admin
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </span>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  placeholder="admin@acenstra.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </span>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-lg text-sm" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-white text-sm font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
