import React from 'react';

interface BannerProps {
  banner: {
    id: string;
    image: string;
    title: string;
    price: number;
    backgroundColor: string;
    ctaText: string;
  };
  isActive?: boolean;
}

const HeroBanner: React.FC<BannerProps> = ({ banner, isActive = true }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
      }`}
    >
      <div className={`bg-gradient-to-br ${banner.backgroundColor} min-h-[400px] lg:min-h-[500px] px-8 lg:px-12 py-12 lg:py-16 flex items-center`}>
        <div className="grid grid-cols-2 gap-8 w-full items-center">
          <div className="flex flex-col justify-center">
            <p className="text-orange-600 font-bold text-sm tracking-widest mb-3">
              Big Saving Days Sale
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-6">
              {banner.title}
            </h2>
            <div className="mb-8">
              <p className="text-gray-600 text-sm mb-1">Starting At Only</p>
              <p className="text-4xl font-black text-orange-500">
                ${banner.price.toFixed(2)}
              </p>
            </div>
            <button className="w-fit bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold py-3.5 px-8 rounded-lg hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 transform hover:scale-105 active:scale-95">
              {banner.ctaText}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-9xl drop-shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
              {banner.image}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;