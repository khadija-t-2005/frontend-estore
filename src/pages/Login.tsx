import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import authService from '../services/auth.service';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser  = useAuthStore((s) => s.setUser);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // ✅ Reçoit { token, user } depuis le backend
      const { data } = await authService.login({ email, password });
      setToken(data.token);
      setUser({
        id:    data.user.id,
        email: data.user.email,
        role:  data.user.role,
      });
      navigate('/products');
    } catch (err: any) {
      setError(err.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f8] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-3xl font-black text-[#1a2f38]">
              E<span className="text-[#4a9aaa]">·</span>Store
            </span>
          </Link>
          <p className="text-[#1a2f38]/50 text-sm mt-2">Connectez-vous à votre compte</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#1a2f38] uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9aaa] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a2f38] uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9aaa] transition"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a2f38] text-white font-bold py-4 rounded-2xl hover:bg-[#4a9aaa] transition-colors flex items-center justify-center gap-2 group disabled:opacity-60"
            >
              {loading ? 'Connexion...' : (
                <>
                  Se connecter
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-[#4a9aaa] font-semibold hover:text-[#1a2f38] transition">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}