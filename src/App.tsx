import React from 'react';
import './App.css';


interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

function App() {
  
  const isLoading = false;
  const error = null;

  
  const products = [
    { 
      id: 1, 
      name: "Caméra IP Smart", 
      price: 450, 
      description: "Caméra haute définition wifi avec vision nocturne et détection de mouvement.", 
      imageUrl: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=400" 
    },
    { 
      id: 2, 
      name: "Ampoule Connectée", 
      price: 120, 
      description: "Ampoule RGB contrôlable par téléphone, compatible Google Home et Alexa.", 
      imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400" 
    },
    { 
      id: 3, 
      name: "Prise Intelligent", 
      price: 190, 
      description: "Prise avec contrôle de consommation d'énergie et programmation horaire.", 
      imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400" 
    }
  ];

  if (isLoading) return <div className="flex justify-center items-center h-screen font-bold">Chargement...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500 font-bold">Erreur de connexion</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
     
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Smart Home <span className="text-blue-600">🏠</span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg">Gérez votre maison intelligente avec facilité</p>
      </header>

     
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
           
            <div className="h-48 bg-gray-200">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {product.price} <small className="text-sm font-medium uppercase">dh</small>
                </span>
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;