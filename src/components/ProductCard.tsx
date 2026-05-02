import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryName?: string;
    stockQuantity: number;
  };
  onAddToCart: (id: number) => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  mobilier: '🪑',
  éclairage: '💡',
  décoration: '🪴',
  bureau: '🖥️',
  cuisine: '🍳',
  chambre: '🛏️',
  default: '📦',
};

const CARD_COLORS = [
  'from-[#c8e8ed] to-[#e6f4f7]',
  'from-[#e8e8d8] to-[#f5f5ec]',
  'from-[#dce8dc] to-[#eff7ef]',
  'from-[#e8dced] to-[#f4eff7]',
];

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [favorited, setFavorited] = useState(false);
  const [adding, setAdding] = useState(false);

  const colorIdx = product.id % CARD_COLORS.length;
  const bgGradient = CARD_COLORS[colorIdx];

  const catKey = (product.categoryName || '').toLowerCase();
  const emoji = Object.entries(CATEGORY_EMOJI).find(([k]) => catKey.includes(k))?.[1] ?? CATEGORY_EMOJI.default;

  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart(product.id);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#4a9aaa]/40 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image / visual zone */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden">
        <div className={`bg-gradient-to-br ${bgGradient} h-52 flex items-center justify-center relative`}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
              {emoji}
            </span>
          )}

          {/* Out of stock overlay */}
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
                Rupture de stock
              </span>
            </div>
          )}

          {/* Category badge */}
          {product.categoryName && (
            <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-[#1a2f38] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {product.categoryName}
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => { e.preventDefault(); setFavorited(!favorited); }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        >
          <Heart
            size={15}
            className={favorited ? 'text-red-500 fill-red-500' : 'text-gray-500'}
          />
        </button>
      </Link>

      {/* Info zone */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-[#1a2f38] text-base leading-snug mb-1 hover:text-[#4a9aaa] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Stars */}
        <div className="flex items-center gap-1 mb-4">
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={11} fill="#4a9aaa" stroke="none" />
          ))}
          <span className="text-xs text-gray-400 ml-1">(12)</span>
        </div>

        {/* Footer: price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-xl font-black text-[#4a9aaa]">
              {product.price.toLocaleString('fr-MA')}
            </span>
            <span className="text-sm text-gray-400 ml-1">DH</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stockQuantity === 0 || adding}
            className="flex items-center gap-1.5 bg-[#1a2f38] text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-[#4a9aaa] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={13} />
            {adding ? 'Ajouté ✓' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
