import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import productService from '../services/product.service';
import cartService from '../services/cart.service';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'default', label: 'Pertinence' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'name_asc', label: 'Nom A → Z' },
];

export default function ProductList() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useState(params.get('search') || '');
  const [inputValue, setInputValue] = useState(params.get('search') || '');
  const [sortBy, setSortBy] = useState('default');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  const user = useAuthStore((s) => s.user);
  const setCart = useCartStore((s) => s.setCart);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('search') || '';
    setSearch(q);
    setInputValue(q);
  }, [location.search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', search],
    queryFn: async () => {
      const res = search
       ? await productService.searchByName(search)
        : await productService.getAll();
      return res.data;
    },
  });

  const handleAddToCart = async (productId: number) => {
    if (!user) { window.location.href = '/login'; return; }
    try {
      const res = await cartService.addToCart(Number(user.id), productId, 1);
      setCart(res.data);
    } catch {
      alert("Erreur lors de l'ajout au panier");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputValue.trim());
  };

  const products: any[] = Array.isArray(data) ? [...data] : [];

  const filtered = products.filter((p) =>
    maxPrice === '' ? true : p.price <= Number(maxPrice)
  );

  const sorted = filtered.sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#f4f7f8]">
      <Navbar />

      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-xs font-bold tracking-widest text-[#4a9aaa] uppercase mb-2">
            Notre catalogue
          </p>
          <h1 className="text-4xl font-black text-[#1a2f38]">Tous les produits</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9aaa] transition"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => { setInputValue(''); setSearch(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-9 py-3 text-sm text-[#1a2f38] focus:outline-none focus:ring-2 focus:ring-[#4a9aaa] cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-semibold transition ${
              filtersOpen
                ? 'bg-[#1a2f38] text-white border-[#1a2f38]'
                : 'bg-white border-gray-200 text-[#1a2f38] hover:border-[#4a9aaa]'
            }`}
          >
            <Filter size={15} />
            Filtres
          </button>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 flex flex-wrap gap-8 items-end">
            <div>
              <label className="block text-xs font-bold text-[#1a2f38] uppercase tracking-wider mb-2">
                Prix maximum (DH)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 2000"
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#4a9aaa]"
              />
            </div>
            <button
              onClick={() => setMaxPrice('')}
              className="text-sm text-gray-400 hover:text-[#4a9aaa] transition underline"
            >
              Réinitialiser
            </button>
          </div>
        )}

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-gray-400 mb-6">
            {sorted.length} produit{sorted.length !== 1 ? 's' : ''} trouvé{sorted.length !== 1 ? 's' : ''}
            {search ? ` pour "${search}"` : ''}
          </p>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-52 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-5 bg-gray-100 rounded-full w-1/3" />
                    <div className="h-8 bg-gray-100 rounded-full w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">⚠️</span>
            <p className="text-[#1a2f38] font-bold text-lg mb-2">Impossible de charger les produits</p>
            <p className="text-gray-400 text-sm">Vérifiez que le serveur backend est démarré sur le port 8080.</p>
          </div>
        )}

        {/* Product grid */}
        {!isLoading && !error && (
          <>
            {sorted.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sorted.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-6xl mb-4">🔍</span>
                <p className="text-[#1a2f38] font-bold text-xl mb-2">Aucun produit trouvé</p>
                <p className="text-gray-400 text-sm mb-6">
                  {search ? `Aucun résultat pour "${search}"` : 'Aucun produit disponible pour le moment.'}
                </p>
                {search && (
                  <button
                    onClick={() => { setSearch(''); setInputValue(''); }}
                    className="bg-[#1a2f38] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#4a9aaa] transition"
                  >
                    Voir tous les produits
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
