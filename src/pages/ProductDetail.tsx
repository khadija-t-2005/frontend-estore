import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import productService from '../services/product.service';
import cartService from '../services/cart.service';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setCart = useCartStore((s) => s.setCart);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await productService.getById(Number(id));
      return res.data;
    },
  });

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const res = await cartService.addToCart(Number(user.id), Number(id), 1);
      setCart(res.data);
      alert('Produit ajouté au panier !');
    } catch {
      alert('Erreur lors de l\'ajout');
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!product) return <div className="text-center mt-20 text-gray-400">Produit non trouvé</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
        <ArrowLeft className="w-5 h-5" /> Retour
      </button>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 h-72 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400">Pas d'image</span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.description}</p>
          <p className="text-sm text-gray-400 mb-2">Catégorie : {product.categoryName || 'N/A'}</p>
          <p className="text-sm text-gray-400 mb-6">Stock disponible : {product.stockQuantity}</p>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-blue-600">{product.price} DH</span>
            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stockQuantity === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}