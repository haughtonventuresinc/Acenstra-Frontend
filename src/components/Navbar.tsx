import { Menu, X, UserCircle, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home or login page after logout
    setIsOpen(false); // Close mobile menu if open
  };

  // Helper for smooth scroll to section on landing
  const handleSectionNav = (e: React.MouseEvent, hash: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const section = document.querySelector(hash);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on landing, navigate home then scroll
      e.preventDefault();
      navigate('/');
      setTimeout(() => {
        const section = document.querySelector(hash);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navItems = [
    { label: 'CREDIT REPAIR', hash: '#credit-repair' },
    { label: 'BUSINESS FUNDING', hash: '#business-funding' },
    { label: 'TESTIMONIALS', hash: '#testimonials' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/60 backdrop-blur-lg shadow-lg z-50 border-b border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm uppercase">
            <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mr-2 shadow-md"></span>
            ACENSTRA
          </Link>

          {/* Desktop Navigation - Left side (existing items) */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="uppercase tracking-wide text-sm text-gray-700 font-semibold px-2 py-1 hover:text-blue-700 hover:underline underline-offset-4 transition-all duration-150"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.hash}
                  onClick={e => handleSectionNav(e, item.hash!)}
                  className="uppercase tracking-wide text-sm text-gray-700 font-semibold px-2 py-1 hover:text-blue-700 hover:underline underline-offset-4 transition-all duration-150 cursor-pointer"
                >
                  {item.label}
                </a>
              )
            )} 
            {/* GET STARTED button or other CTAs can remain here or be conditional */}
            <a 
              href="#pricing" 
              className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full shadow hover:from-blue-700 hover:to-purple-700 transition-all font-bold tracking-wide text-sm uppercase"
            >
              Get Started
            </a>
          </div>

          {/* Desktop Navigation - Right side (Auth links) */}
          <div className="hidden md:flex items-center space-x-6 ml-8">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-white text-blue-700 font-semibold shadow-sm hover:bg-blue-50 hover:text-blue-900 transition-all">
                  <UserCircle size={18} /> Dashboard {user?.username ? `(${user.username})` : ''}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-sm hover:from-red-600 hover:to-pink-600 transition-all"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                {location.pathname === '/login' ? (
                  <Link to="/register" className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold shadow-sm hover:from-green-600 hover:to-teal-600 transition-all">
                    <UserPlus size={18} /> Register
                  </Link>
                ) : location.pathname === '/register' ? (
                  <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-white text-blue-700 font-semibold shadow-sm hover:bg-blue-50 hover:text-blue-900 transition-all">
                    <LogIn size={18} /> Login
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-white text-blue-700 font-semibold shadow-sm hover:bg-blue-50 hover:text-blue-900 transition-all">
                      <LogIn size={18} /> Login
                    </Link>
                    <Link to="/register" className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold shadow-sm hover:from-green-600 hover:to-teal-600 transition-all">
                      <UserPlus size={18} /> Register
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-1">
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 text-base text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                {item.label}
              </a>
            ))}
            {/* "GET STARTED" link for mobile - keep as <a> if it's a hash link */}
            <a
              href="#pricing"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 text-base bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors font-semibold text-center"
            >
              GET STARTED
            </a>
            {/* Mobile Auth Links - Corrected Placement */}
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center py-3 px-4 text-base text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <UserCircle size={20} className="mr-2" /> Dashboard {user?.username ? `(${user.username})` : ''}
                  </Link>
                  <button
                    onClick={handleLogout} // handleLogout already calls setIsOpen(false)
                    className="w-full flex items-center text-left py-3 px-4 text-base text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
                  >
                    <LogOut size={20} className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center py-3 px-4 text-base text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <LogIn size={20} className="mr-2" /> Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center py-3 px-4 text-base text-green-600 hover:bg-green-50 rounded-md transition-colors font-medium"
                  >
                    <UserPlus size={20} className="mr-2" /> Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}