import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register(form);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'firstName', label: 'Prénom',          icon: User,    type: 'text',     placeholder: 'Votre prénom' },
    { key: 'lastName',  label: 'Nom',              icon: User,    type: 'text',     placeholder: 'Votre nom' },
    { key: 'email',     label: 'Email',             icon: Mail,    type: 'email',    placeholder: 'votre@email.com' },
    { key: 'phone',     label: 'Téléphone',         icon: Phone,   type: 'tel',      placeholder: '+212 6 00 00 00 00' },
    { key: 'address',   label: 'Adresse',            icon: MapPin,  type: 'text',     placeholder: 'Votre adresse complète' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-black text-[#1a2f38]">
              E<span className="text-[#4a9aaa]">·</span>Store
            </span>
          </Link>
          <p className="text-[#1a2f38]/50 text-sm mt-2">Créez votre compte gratuitement</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-[#1a2f38] uppercase tracking-wider mb-2">
                  {label}
                </label>
                <div className="relative">
                  <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={update(key)}
                    required
                    placeholder={placeholder}
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9aaa] transition"
                  />
                </div>
              </div>
            ))}

            {/* Password séparé pour toggle */}
            <div>
              <label className="block text-xs font-bold text-[#1a2f38] uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  required
                  minLength={6}
                  placeholder="Minimum 6 caractères"
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
              className="w-full bg-[#1a2f38] text-white font-bold py-4 rounded-2xl hover:bg-[#4a9aaa] transition-colors flex items-center justify-center gap-2 group disabled:opacity-60 mt-2"
            >
              {loading ? 'Inscription...' : (
                <>
                  Créer mon compte
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-[#4a9aaa] font-semibold hover:text-[#1a2f38] transition">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}