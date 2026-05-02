import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2, Rss, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a2f38] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div>
          <span className="text-2xl font-black tracking-tight">
            E<span className="text-[#4a9aaa]">·</span>Store
          </span>
          <p className="text-white/50 text-sm leading-relaxed mt-4 mb-6">
            Votre boutique design au Maroc. Mobilier, éclairage et décoration livrés partout en 24h.
          </p>
          <div className="flex gap-3">
            {[Share2, Rss, Globe].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-[#4a9aaa] rounded-full flex items-center justify-center transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#4a9aaa] mb-5">Navigation</h4>
          <ul className="space-y-3">
            {[
              { label: 'Accueil', to: '/' },
              { label: 'Produits', to: '/products' },
              { label: 'Nouveautés', to: '/products' },
              { label: 'Promotions', to: '/products' },
              { label: 'Mon panier', to: '/cart' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-white/55 hover:text-white text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#4a9aaa] mb-5">Mon compte</h4>
          <ul className="space-y-3">
            {[
              { label: 'Se connecter', to: '/login' },
              { label: 'Créer un compte', to: '/register' },
              { label: 'Mes commandes', to: '/orders' },
              { label: 'Favoris', to: '/products' },
              { label: 'Aide & FAQ', to: '/' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-white/55 hover:text-white text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#4a9aaa] mb-5">Contact</h4>
          <ul className="space-y-4">
            {[
              { icon: MapPin, text: 'Casablanca, Maroc' },
              { icon: Phone, text: '+212 6 00 00 00 00' },
              { icon: Mail, text: 'contact@estore.ma' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/55 text-sm">
                <Icon size={15} className="text-[#4a9aaa] flex-shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/30">
          <span>© 2026 E·Store. Tous droits réservés.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition">Politique de confidentialité</a>
            <a href="#" className="hover:text-white/60 transition">CGV</a>
            <a href="#" className="hover:text-white/60 transition">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
