import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'HOME', href: '#' },
    { label: 'CREDIT REPAIR', href: '#credit-repair' },
    { label: 'BUSINESS FUNDING', href: '#business-funding' },
    { label: 'TESTIMONIALS', href: '#testimonials' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Acenstra
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#pricing"
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 font-medium"
            >
              GET STARTED
            </a>
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
          <div className="md:hidden py-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-3 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#pricing"
              className="block py-3 text-blue-600 hover:text-blue-700 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              GET STARTED
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}