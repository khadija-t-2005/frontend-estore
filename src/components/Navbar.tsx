import React, { useState } from 'react';
import { Menu, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports & Outdoors',
    'Beauty & Personal Care',
    'Books & Media',
    'Toys & Games',
    'Automotive',
  ];

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Fashion', href: '#' },
    { label: 'New Arrivals', href: '#' },
    { label: 'All Brands', href: '#' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Category Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 px-4 py-3 font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
              <span>SHOP BY CATEGORIES</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                {categories.map((category, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium text-sm"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 ml-8 flex-1">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="font-semibold text-gray-900 hover:text-orange-500 transition-colors text-sm whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
            <button className="text-gray-900 hover:text-orange-500 transition-colors font-semibold text-sm">
              More
              <ChevronDown className="w-4 h-4 inline ml-1" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <button className="w-full text-left px-4 py-2.5 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
              SHOP BY CATEGORIES
            </button>
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;