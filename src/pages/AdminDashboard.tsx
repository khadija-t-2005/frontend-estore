import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../middleware/axios.interceptor';
import {
  LayoutDashboard, Package, Tag, ShoppingBag, Users,
  Warehouse, LogOut, Plus, Pencil, Trash2, X, Check,
  ChevronRight, AlertTriangle, RefreshCw, Menu
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────
interface Product   { id: number; name: string; price: number; stockQuantity: number; categoryName: string; imageUrl?: string; description?: string; categoryId?: number; }
interface Category  { id: number; name: string; }
interface Order     { id: number; orderDate: string; totalAmount: number; status: string; customerEmail?: string; }
interface UserItem  { id: number; email: string; role: string; createdAt: string; }
interface Inventory { id: number; productId: number; productName: string; quantity: number; threshold: number | null; }

type Section = 'dashboard' | 'products' | 'categories' | 'orders' | 'users' | 'inventory';

// ── Modal générique ────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-[#1a2f38] text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Badge statut commande ──────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING:   'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED:   'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}

export default function AdminDashboard() {
  const navigate   = useNavigate();
  const user       = useAuthStore(s => s.user);
  const logout     = useAuthStore(s => s.logout);
  const [section, setSection]     = useState<Section>('dashboard');
  const [sideOpen, setSideOpen]   = useState(false);

  // Data states
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders,     setOrders]     = useState<Order[]>([]);
  const [users,      setUsers]      = useState<UserItem[]>([]);
  const [inventory,  setInventory]  = useState<Inventory[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  // Modal states
  const [modal, setModal] = useState<null | 'addProduct' | 'editProduct' | 'addCategory' | 'editCategory' | 'editStock' | 'editOrderStatus'>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  // Guard: redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') navigate('/', { replace: true });
  }, [user]);

  // Fetch data on section change
  useEffect(() => { fetchSection(section); }, [section]);

  async function fetchSection(s: Section) {
    setLoading(true); setError('');
    try {
      if (s === 'dashboard' || s === 'products')   { const r = await api.get('/products');    setProducts(r.data); }
      if (s === 'dashboard' || s === 'categories') { const r = await api.get('/categories');  setCategories(r.data); }
      if (s === 'dashboard' || s === 'orders')     { const r = await api.get('/orders'); setOrders(r.data); } // all orders via admin
      if (s === 'dashboard' || s === 'users')      { const r = await api.get('/users');        setUsers(r.data); }
      if (s === 'dashboard' || s === 'inventory')  { const r = await api.get('/inventory');    setInventory(r.data); }
    } catch { setError('Erreur de chargement'); }
    finally { setLoading(false); }
  }

  const openModal = (type: typeof modal, item?: any) => {
    setSelected(item ?? null);
    setForm(item ? { ...item } : {});
    setModal(type);
  };
  const closeModal = () => { setModal(null); setSelected(null); setForm({}); };

  // ── CRUD Produits ──
  const saveProduct = async () => {
    try {
      if (selected) await api.put(`/products/${selected.id}`, form);
      else          await api.post('/products', form);
      fetchSection('products'); closeModal();
    } catch { setError('Erreur sauvegarde produit'); }
  };
  const deleteProduct = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await api.delete(`/products/${id}`);
    fetchSection('products');
  };

  // ── CRUD Catégories ──
  const saveCategory = async () => {
    try {
      if (selected) await api.put(`/categories/${selected.id}`, form);
      else          await api.post('/categories', form);
      fetchSection('categories'); closeModal();
    } catch { setError('Erreur sauvegarde catégorie'); }
  };
  const deleteCategory = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await api.delete(`/categories/${id}`);
    fetchSection('categories');
  };

  // ── Update stock ──
  const saveStock = async () => {
    try {
      await api.put(`/inventory/product/${selected.productId}/quantity?quantity=${form.quantity}`);
      fetchSection('inventory'); closeModal();
    } catch { setError('Erreur mise à jour stock'); }
  };

  // ── Update order status ──
  const saveOrderStatus = async () => {
    try {
      await api.put('/orders/status', { orderId: selected.id, status: form.status });
      fetchSection('orders'); closeModal();
    } catch { setError('Erreur mise à jour statut'); }
  };

  // ── Delete user ──
  const deleteUser = async (id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    await api.delete(`/users/${id}`);
    fetchSection('users');
  };

  const navItems: { id: Section; label: string; icon: any; color: string }[] = [
    { id: 'dashboard',  label: 'Tableau de bord', icon: LayoutDashboard, color: '#4a9aaa' },
    { id: 'products',   label: 'Produits',         icon: Package,         color: '#e07a2f' },
    { id: 'categories', label: 'Catégories',       icon: Tag,             color: '#8b5cf6' },
    { id: 'orders',     label: 'Commandes',        icon: ShoppingBag,     color: '#16a34a' },
    { id: 'users',      label: 'Utilisateurs',     icon: Users,           color: '#0ea5e9' },
    { id: 'inventory',  label: 'Inventaire',       icon: Warehouse,       color: '#ca8a04' },
  ];

  const stats = [
    { label: 'Produits',     value: products.length,   color: '#e07a2f', icon: Package   },
    { label: 'Catégories',   value: categories.length, color: '#8b5cf6', icon: Tag       },
    { label: 'Commandes',    value: orders.length,     color: '#16a34a', icon: ShoppingBag },
    { label: 'Utilisateurs', value: users.length,      color: '#0ea5e9', icon: Users     },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f8] flex">

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1a2f38] flex flex-col transition-transform duration-300 ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link to="/" className="text-2xl font-black text-white tracking-tight">
            E<span className="text-[#4a9aaa]">·</span>Store
            <span className="ml-2 text-xs bg-[#4a9aaa] text-white px-2 py-0.5 rounded-full font-semibold">Admin</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon, color }) => (
            <button key={id} onClick={() => { setSection(id); setSideOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                section === id
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              <Icon size={18} style={{ color: section === id ? color : undefined }} />
              {label}
              {section === id && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 bg-[#4a9aaa] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">{user?.email}</p>
              <p className="text-white/50 text-[10px]">Administrateur</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm font-medium">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sideOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSideOpen(false)} />}

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setSideOpen(!sideOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#1a2f38]">
              {navItems.find(n => n.id === section)?.label}
            </h1>
            <p className="text-xs text-gray-400">Tableau de bord administrateur</p>
          </div>
          <button onClick={() => fetchSection(section)}
            className="ml-auto flex items-center gap-2 text-xs text-[#4a9aaa] hover:bg-[#e6f4f6] px-3 py-2 rounded-xl transition font-semibold">
            <RefreshCw size={14} /> Actualiser
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-5 py-4 mb-6 flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#4a9aaa] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && (
            <>
              {/* ── DASHBOARD ── */}
              {section === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map(({ label, value, color, icon: Icon }) => (
                      <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                            <Icon size={18} style={{ color }} />
                          </div>
                        </div>
                        <p className="text-3xl font-black text-[#1a2f38]">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Stock faible */}
                  {inventory.filter(i => i.quantity <= (i.threshold ?? 5)).length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={16} className="text-yellow-600" />
                        <h3 className="font-bold text-yellow-800">Stock faible</h3>
                      </div>
                      <div className="space-y-2">
                        {inventory.filter(i => i.quantity <= (i.threshold ?? 5)).map(i => (
                          <div key={i.id} className="flex items-center justify-between text-sm">
                            <span className="text-yellow-800 font-medium">{i.productName}</span>
                            <span className="bg-yellow-200 text-yellow-800 font-bold px-2 py-0.5 rounded-full text-xs">{i.quantity} restants</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dernières commandes */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-bold text-[#1a2f38] mb-4">Dernières commandes</h3>
                    <div className="space-y-3">
                      {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="text-sm font-bold text-[#1a2f38]">Commande #{o.id}</p>
                            <p className="text-xs text-gray-400">{new Date(o.orderDate).toLocaleDateString('fr-MA')}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#4a9aaa] text-sm">{Number(o.totalAmount).toLocaleString('fr-MA')} DH</span>
                            <StatusBadge status={o.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PRODUITS ── */}
              {section === 'products' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-sm text-gray-400">{products.length} produits</p>
                    <button onClick={() => openModal('addProduct')}
                      className="flex items-center gap-2 bg-[#1a2f38] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#4a9aaa] transition">
                      <Plus size={16} /> Nouveau produit
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-[#f4f7f8]">
                        <tr>
                          {['ID', 'Nom', 'Prix', 'Stock', 'Catégorie', 'Actions'].map(h => (
                            <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50 transition">
                            <td className="px-5 py-4 text-gray-400 font-mono text-xs">#{p.id}</td>
                            <td className="px-5 py-4 font-bold text-[#1a2f38]">{p.name}</td>
                            <td className="px-5 py-4 text-[#4a9aaa] font-bold">{Number(p.price).toLocaleString('fr-MA')} DH</td>
                            <td className="px-5 py-4">
                              <span className={`font-bold ${p.stockQuantity <= 5 ? 'text-red-500' : 'text-green-600'}`}>{p.stockQuantity}</span>
                            </td>
                            <td className="px-5 py-4 text-gray-500">{p.categoryName}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => openModal('editProduct', p)}
                                  className="p-1.5 hover:bg-blue-50 rounded-lg transition text-blue-500"><Pencil size={14} /></button>
                                <button onClick={() => deleteProduct(p.id)}
                                  className="p-1.5 hover:bg-red-50 rounded-lg transition text-red-400"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── CATÉGORIES ── */}
              {section === 'categories' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-sm text-gray-400">{categories.length} catégories</p>
                    <button onClick={() => openModal('addCategory')}
                      className="flex items-center gap-2 bg-[#1a2f38] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#4a9aaa] transition">
                      <Plus size={16} /> Nouvelle catégorie
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(c => (
                      <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#1a2f38]">{c.name}</p>
                          <p className="text-xs text-gray-400 font-mono">ID #{c.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openModal('editCategory', c)}
                            className="p-2 hover:bg-blue-50 rounded-xl transition text-blue-500"><Pencil size={15} /></button>
                          <button onClick={() => deleteCategory(c.id)}
                            className="p-2 hover:bg-red-50 rounded-xl transition text-red-400"><Trash2 size={15} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── COMMANDES ── */}
              {section === 'orders' && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f4f7f8]">
                      <tr>
                        {['#', 'Date', 'Total', 'Statut', 'Actions'].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-4 font-mono text-xs text-gray-400">#{o.id}</td>
                          <td className="px-5 py-4 text-gray-600">{new Date(o.orderDate).toLocaleDateString('fr-MA')}</td>
                          <td className="px-5 py-4 font-bold text-[#4a9aaa]">{Number(o.totalAmount).toLocaleString('fr-MA')} DH</td>
                          <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                          <td className="px-5 py-4">
                            <button onClick={() => openModal('editOrderStatus', o)}
                              className="flex items-center gap-1.5 text-xs font-bold text-[#4a9aaa] hover:bg-[#e6f4f6] px-3 py-1.5 rounded-lg transition">
                              <Pencil size={12} /> Statut
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── UTILISATEURS ── */}
              {section === 'users' && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f4f7f8]">
                      <tr>
                        {['ID', 'Email', 'Rôle', 'Inscription', 'Actions'].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-4 font-mono text-xs text-gray-400">#{u.id}</td>
                          <td className="px-5 py-4 font-bold text-[#1a2f38]">{u.email}</td>
                          <td className="px-5 py-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              u.role === 'ADMIN' ? 'bg-[#4a9aaa]/15 text-[#4a9aaa]' : 'bg-gray-100 text-gray-600'
                            }`}>{u.role}</span>
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString('fr-MA')}</td>
                          <td className="px-5 py-4">
                            {u.role !== 'ADMIN' && (
                              <button onClick={() => deleteUser(u.id)}
                                className="p-1.5 hover:bg-red-50 rounded-lg transition text-red-400"><Trash2 size={14} /></button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── INVENTAIRE ── */}
              {section === 'inventory' && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f4f7f8]">
                      <tr>
                        {['Produit', 'Quantité', 'Seuil alerte', 'État', 'Actions'].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {inventory.map(i => {
                        const low = i.quantity <= (i.threshold ?? 5);
                        return (
                          <tr key={i.id} className="hover:bg-gray-50 transition">
                            <td className="px-5 py-4 font-bold text-[#1a2f38]">{i.productName}</td>
                            <td className="px-5 py-4">
                              <span className={`text-lg font-black ${low ? 'text-red-500' : 'text-green-600'}`}>{i.quantity}</span>
                            </td>
                            <td className="px-5 py-4 text-gray-400">{i.threshold ?? 5}</td>
                            <td className="px-5 py-4">
                              {low
                                ? <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit"><AlertTriangle size={10} /> Stock faible</span>
                                : <span className="bg-green-100 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit"><Check size={10} /> OK</span>
                              }
                            </td>
                            <td className="px-5 py-4">
                              <button onClick={() => openModal('editStock', i)}
                                className="flex items-center gap-1.5 text-xs font-bold text-[#4a9aaa] hover:bg-[#e6f4f6] px-3 py-1.5 rounded-lg transition">
                                <Pencil size={12} /> Modifier
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── MODALS ── */}

      {/* Produit Add/Edit */}
      {(modal === 'addProduct' || modal === 'editProduct') && (
        <Modal title={modal === 'addProduct' ? 'Nouveau produit' : 'Modifier produit'} onClose={closeModal}>
          <div className="space-y-4">
            {[
              { key: 'name', label: 'Nom', type: 'text' },
              { key: 'description', label: 'Description', type: 'text' },
              { key: 'price', label: 'Prix (DH)', type: 'number' },
              { key: 'stockQuantity', label: 'Stock', type: 'number' },
              { key: 'imageUrl', label: 'URL image', type: 'text' },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">{label}</label>
                <input type={type} value={form[key] ?? ''} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9aaa]" />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Catégorie</label>
              <select value={form.categoryId ?? ''} onChange={e => setForm({ ...form, categoryId: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9aaa]">
                <option value="">-- Choisir --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={closeModal} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition">Annuler</button>
              <button onClick={saveProduct} className="flex-1 bg-[#1a2f38] text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#4a9aaa] transition">Enregistrer</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Catégorie Add/Edit */}
      {(modal === 'addCategory' || modal === 'editCategory') && (
        <Modal title={modal === 'addCategory' ? 'Nouvelle catégorie' : 'Modifier catégorie'} onClose={closeModal}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Nom</label>
              <input type="text" value={form.name ?? ''} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9aaa]" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={closeModal} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition">Annuler</button>
              <button onClick={saveCategory} className="flex-1 bg-[#1a2f38] text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#4a9aaa] transition">Enregistrer</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Stock Edit */}
      {modal === 'editStock' && (
        <Modal title={`Stock — ${selected?.productName}`} onClose={closeModal}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Nouvelle quantité</label>
              <input type="number" value={form.quantity ?? ''} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9aaa]" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={closeModal} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition">Annuler</button>
              <button onClick={saveStock} className="flex-1 bg-[#1a2f38] text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#4a9aaa] transition">Enregistrer</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Order Status Edit */}
      {modal === 'editOrderStatus' && (
        <Modal title={`Statut commande #${selected?.id}`} onClose={closeModal}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Statut</label>
              <select value={form.status ?? ''} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9aaa]">
                {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={closeModal} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition">Annuler</button>
              <button onClick={saveOrderStatus} className="flex-1 bg-[#1a2f38] text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#4a9aaa] transition">Enregistrer</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
