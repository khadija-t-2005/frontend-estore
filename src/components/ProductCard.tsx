import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  backgroundColor: string;
  ctaText: string;
}

interface ProductCardProps {
  product: Product;
  layout?: 'vertical' | 'horizontal';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'horizontal' }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (layout === 'vertical') {
    return (
      <div
        className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`bg-gradient-to-br ${product.backgroundColor} aspect-square flex items-center justify-center relative overflow-hidden`}>
          <div className={`text-7xl transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
            {product.image}
          </div>

          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors`} />

          {/* Heart button */}
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
          >
            <Heart
              className="w-5 h-5"
              fill={isFavorited ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <div className="p-4 bg-white">
          <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xl font-black text-orange-500">
              ${product.price.toFixed(2)}
            </p>
            <button className="text-xs font-bold text-gray-900 hover:text-orange-500 transition-colors uppercase tracking-wider">
              {product.ctaText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Horizontal layout for larger cards
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer flex">
      <div className={`flex-1 bg-gradient-to-br ${product.backgroundColor} p-6 flex items-center justify-center relative`}>
        <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {product.image}
        </div>
      </div>
      <div className="flex-1 p-6 flex flex-col justify-center">
        <p className="text-orange-600 text-xs font-bold tracking-widest mb-2">FEATURED</p>
        <h3 className="font-bold text-gray-900 mb-4 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-2xl font-black text-orange-500 mb-4">
          ${product.price.toFixed(2)}
        </p>
        <button className="self-start bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
          {product.ctaText}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;