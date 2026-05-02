import { Link } from 'react-router-dom';
import { ShoppingBag, Shield, Truck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <span className="text-xl font-bold text-blue-600">E-Store</span>
        <div className="flex gap-4">
          <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">Connexion</Link>
          <Link to="/register" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            S'inscrire
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Bienvenue sur <span className="text-blue-600">E-Store</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8">Découvrez nos produits au meilleur prix</p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition shadow"
        >
          Voir les produits
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: ShoppingBag, title: 'Large choix', desc: 'Des milliers de produits disponibles' },
          { icon: Shield, title: 'Paiement sécurisé', desc: 'Transactions 100% sécurisées' },
          { icon: Truck, title: 'Livraison rapide', desc: 'Livraison en 24/48h' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <Icon className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}