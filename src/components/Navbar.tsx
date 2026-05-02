// Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const itemCount = useCartStore((s) => s.itemCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        {/* Top bar */}
        <div className="bg-[#1a2f38] text-white/80 text-xs py-2 px-6 flex justify-between items-center">
          <span>Livraison gratuite au Maroc à partir de <strong className="text-white">500 DH</strong></span>
          <div className="flex gap-6 items-center">
            {user ? (
              <span className="text-white/90">{user.email}</span>
            ) : (
              <>
                <Link to="/login" className="hover:text-white transition">Connexion</Link>
                <Link to="/register" className="hover:text-white transition">Inscription</Link>
              </>
            )}
          </div>
        </div>

        {/* Main nav */}
        <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-2xl font-black text-[#1a2f38] tracking-tight">
              E<span className="text-[#4a9aaa]">·</span>Store
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Accueil', to: '/' },
              { label: 'Produits', to: '/products' },
              { label: 'Nouveautés', to: '/products' },
              { label: 'Promotions', to: '/products' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-sm font-medium text-[#1a2f38]/70 hover:text-[#4a9aaa] transition-colors relative group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4a9aaa] transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-[#1a2f38]/70 hover:text-[#4a9aaa] transition"
            >
              <Search size={20} />
            </button>

            <Link to="/cart" className="relative text-[#1a2f38]/70 hover:text-[#4a9aaa] transition">
              <ShoppingCart size={20} />
              {itemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#4a9aaa] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount()}
                </span>
              )}
            </Link>

            {user ? (
              <button
                onClick={() => logout()}
                className="hidden md:flex items-center gap-2 text-sm text-[#1a2f38]/70 hover:text-[#4a9aaa] transition"
              >
                <User size={18} />
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden md:block bg-[#1a2f38] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#4a9aaa] transition-colors"
              >
                Se connecter
              </Link>
            )}

            <button
              className="md:hidden text-[#1a2f38]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-6 py-4 max-w-7xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="flex-1 border border-gray-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9aaa]"
              />
              <button
                type="submit"
                className="bg-[#4a9aaa] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3d8494] transition"
              >
                Rechercher
              </button>
            </form>
          </div>
        )}

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-4">
            {[
              { label: 'Accueil', to: '/' },
              { label: 'Produits', to: '/products' },
              { label: 'Nouveautés', to: '/products' },
              { label: 'Promotions', to: '/products' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium text-[#1a2f38] hover:text-[#4a9aaa] transition"
              >
                {label}
              </Link>
            ))}
            {!user && (
              <Link
                to="/login"
                className="block text-center bg-[#1a2f38] text-white text-sm font-semibold px-5 py-2.5 rounded-full"
              >
                Se connecter
              </Link>
            )}
          </div>
        )}
      </header>
      <div className="h-[104px]" />
    </>
  );
};

export default Navbar;