import React, { useState } from 'react';
import HeroBanner from './HeroBanner';
import ProductCard from './ProductCard';

const HeroSection: React.FC = () => {
  const [activeSlide] = useState(0);


  const mainBanners = [
    {
      id: '1',
      title: 'Buy Modern Chair In Black Color',
      price: 99.00,
      image: '🪑', 
      backgroundColor: 'from-blue-100 to-blue-200', // نفس السمية اللي فـ HeroBanner
      ctaText: 'SHOP NOW'
    }
  ];

  const sideProducts = [
    {
      id: '3',
      title: 'Samsung Gear VR Camera',
      price: 129.00,
      image: '📷',
      backgroundColor: 'from-purple-100 to-purple-50',
      ctaText: 'SHOP NOW'
    },
    {
      id: '4',
      title: 'Marcel Dining Room Chair',
      price: 129.00,
      image: '🪑',
      backgroundColor: 'from-green-100 to-green-50',
      ctaText: 'SHOP NOW'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       
        <div className="lg:col-span-2">
          <HeroBanner banner={mainBanners[activeSlide]} isActive={true} />
        </div>


        <div className="flex flex-col gap-6">
          {sideProducts.map(product => (
            <ProductCard key={product.id} product={product} layout="vertical" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;