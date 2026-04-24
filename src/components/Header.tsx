import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, User } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount, wishlistCount }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white border-b border-gray-100">
      {/* Top bar with delivery info */}
      <div className="hidden lg:block bg-gradient-to-r from-orange-50 to-red-50 py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-end items-center">
          <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.488 5.951 1.488a1 1 0 001.169-1.409l-7-14z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Free International Delivery</span>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">CLASSYSHOP</h1>
                <p className="text-xs text-gray-500 tracking-widest">ECOMMERCE STORE</p>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-1.5 rounded font-semibold text-sm hover:shadow-lg transition-shadow">
                SEARCH
              </button>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-6">
            <button className="hidden sm:flex items-center gap-1 font-semibold text-gray-900 hover:text-orange-500 transition-colors text-sm">
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Login / Register</span>
            </button>

            {/* Wishlist */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <Heart className="w-6 h-6 text-gray-700 group-hover:text-red-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-orange-500 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group hidden sm:block">
              <svg className="w-6 h-6 text-gray-700 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l1.72-1.35c.15-.12.19-.34.1-.51l-1.63-2.82c-.12-.22-.37-.29-.59-.22l-2.03.81c-.42-.32-.9-.6-1.42-.82l-.31-2.15c-.05-.24-.24-.41-.48-.41h-3.26c-.24 0-.43.17-.49.41l-.31 2.15c-.51.23-.99.5-1.42.82l-2.03-.81c-.22-.09-.47 0-.59.22L2.74 8.87c-.12.22-.08.44.1.51l1.72 1.35c-.05.3-.07.62-.07.94s.02.64.07.94l-1.72 1.35c-.15.12-.19.34-.1.51l1.63 2.82c.12.22.37.29.59.22l2.03-.81c.42.32.9.6 1.42.82l.31 2.15c.05.24.24.41.48.41h3.26c.24 0 .44-.17.49-.41l.31-2.15c.51-.23.99-.5 1.42-.82l2.03.81c.22.09.47 0 .59-.22l1.63-2.82c.12-.22.07-.44-.1-.51l-1.72-1.35zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="sm:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-orange-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;