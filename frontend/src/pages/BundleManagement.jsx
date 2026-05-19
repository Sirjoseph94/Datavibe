import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader2, ArrowLeft, Plus, Edit2, Trash2, X, Save, ShieldAlert, Wifi, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import NetworkLogo from '../components/NetworkLogo.jsx';

const DEFAULT_NETWORKS = ['MTN', 'Airtel', 'Glo', '9mobile'];

const getNetworkStyle = (network, theme) => {
  const isDark = theme === 'dark';
  switch (network.toLowerCase()) {
    case 'mtn':
      return {
        border: isDark ? 'border-yellow-550/20 hover:border-yellow-500/40' : 'border-yellow-500/30 hover:border-yellow-500/50',
        bg: isDark ? 'bg-yellow-500/5' : 'bg-yellow-50/30',
        text: 'text-yellow-500',
        badge: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'
      };
    case 'airtel':
      return {
        border: isDark ? 'border-red-500/20 hover:border-red-500/40' : 'border-red-500/30 hover:border-red-500/50',
        bg: isDark ? 'bg-red-500/5' : 'bg-red-50/30',
        text: 'text-red-500',
        badge: 'bg-red-500/10 text-red-600 border border-red-500/20'
      };
    case 'glo':
      return {
        border: isDark ? 'border-emerald-500/20 hover:border-emerald-500/40' : 'border-emerald-500/30 hover:border-emerald-500/50',
        bg: isDark ? 'bg-emerald-500/5' : 'bg-emerald-50/30',
        text: 'text-emerald-500',
        badge: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
      };
    case '9mobile':
      return {
        border: isDark ? 'border-teal-500/20 hover:border-teal-500/40' : 'border-teal-500/30 hover:border-teal-500/50',
        bg: isDark ? 'bg-teal-500/5' : 'bg-teal-50/30',
        text: 'text-teal-500',
        badge: 'bg-teal-500/10 text-teal-650 border border-teal-500/20'
      };
    default:
      return {
        border: isDark ? 'border-indigo-500/20 hover:border-indigo-500/40' : 'border-indigo-500/30 hover:border-indigo-500/50',
        bg: isDark ? 'bg-indigo-500/5' : 'bg-indigo-50/30',
        text: 'text-indigo-500',
        badge: 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'
      };
  }
};

export default function BundleManagement() {
  const { user, theme, toggleTheme } = useContext(AuthContext);
  const [bundles, setBundles] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBundle, setEditBundle] = useState(null);

  // Form states
  const [network, setNetwork] = useState('');
  const [customNetwork, setCustomNetwork] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bundles`);
      const data = await res.json();
      setBundles(data);
    } catch (err) {
      console.error('Error fetching bundles:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = (initialNetwork = '') => {
    setEditBundle(null);
    setNetwork(initialNetwork || DEFAULT_NETWORKS[0]);
    setCustomNetwork('');
    setSize('');
    setPrice('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (bundle) => {
    setEditBundle(bundle);
    if (DEFAULT_NETWORKS.includes(bundle.network)) {
      setNetwork(bundle.network);
      setCustomNetwork('');
    } else {
      setNetwork('Other');
      setCustomNetwork(bundle.network);
    }
    setSize(bundle.size);
    setPrice(bundle.price.toString());
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bundle? This action will remove it from subscriber request forms.')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bundles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete bundle');
      fetchBundles();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const finalNetwork = network === 'Other' ? customNetwork.trim() : network;
    if (!finalNetwork) {
      setError('Please specify a network provider name');
      setSaving(false);
      return;
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Price must be a valid positive number');
      setSaving(false);
      return;
    }

    const payload = {
      network: finalNetwork,
      size: size.trim(),
      price: parsedPrice
    };

    const url = editBundle
      ? `${import.meta.env.VITE_API_BASE_URL}/api/bundles/${editBundle.id}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/bundles`;
    
    const method = editBundle ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save bundle');
      
      setModalOpen(false);
      fetchBundles();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const allNetworkKeys = Array.from(new Set([...DEFAULT_NETWORKS, ...Object.keys(bundles)]));

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-305 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 md:p-10 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background decoration */}
      <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-emerald-950/10' : 'bg-emerald-100/10'
      }`}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Block */}
        <header className={`flex justify-between items-center mb-10 p-5 rounded-2xl border transition-all duration-350 ${
          theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/20' : 'bg-white border-slate-200 shadow-sm'
        } backdrop-blur-md`}>
          <div className="flex items-center gap-4">
            <Link to="/super-admin" className={`p-2.5 rounded-xl border transition-colors ${
              theme === 'dark' ? 'border-slate-800 hover:bg-slate-900/50 text-slate-400 hover:text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-650 hover:text-slate-900 bg-white shadow-sm'
            }`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-emerald-500">
                ISP Bundles
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Configure data subscription sizes, providers, and prices</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={toggleTheme} 
              className={`p-2.5 rounded-xl border transition-all active:scale-90 ${
                theme === 'dark' 
                  ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-amber-400' 
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm'
              }`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => openAddModal()} className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-550 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">
              <Plus className="w-4.5 h-4.5" /> Add Bundle
            </button>
          </div>
        </header>

        {/* Network Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {allNetworkKeys.map((networkKey) => {
            const networkStyle = getNetworkStyle(networkKey, theme);
            const list = bundles[networkKey] || [];

            return (
              <div 
                key={networkKey} 
                className={`rounded-3xl p-6 border transition-all shadow-xl flex flex-col justify-between ${networkStyle.border} ${networkStyle.bg} ${
                  theme === 'dark' ? 'backdrop-blur-md' : 'bg-white'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <NetworkLogo network={networkKey} className="w-8 h-8" />
                      <span className={`px-4 py-1 rounded-full text-xs font-bold ${networkStyle.badge}`}>
                        {networkKey}
                      </span>
                      <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {list.length} {list.length === 1 ? 'bundle' : 'bundles'} active
                      </span>
                    </div>
                    <button
                      onClick={() => openAddModal(networkKey)}
                      className={`p-2 border rounded-xl transition-all ${
                        theme === 'dark' 
                          ? 'border-slate-800/80 bg-slate-900/30 text-slate-400 hover:text-white' 
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 shadow-sm'
                      }`}
                      title={`Add bundle to ${networkKey}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {list.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm italic">
                      No data bundles created for {networkKey}.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {list.map((bundle) => (
                        <div
                          key={bundle.id}
                          className={`flex justify-between items-center p-4 border rounded-2xl transition-all ${
                            theme === 'dark' 
                              ? 'bg-slate-950/45 border-slate-800 hover:border-slate-700/60 hover:bg-slate-950/80' 
                              : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <p className="font-extrabold text-sm">{bundle.size}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">ID: #{bundle.id}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-emerald-500 font-black text-sm">
                              ₦{bundle.price.toLocaleString()}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditModal(bundle)}
                                className={`p-2 border rounded-xl transition-colors ${
                                  theme === 'dark' 
                                    ? 'border-slate-800 bg-slate-900/50 text-blue-400 hover:bg-blue-500/10' 
                                    : 'border-slate-200 bg-slate-100 text-blue-600 hover:bg-blue-50 shadow-sm'
                                }`}
                                title="Edit Bundle"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(bundle.id)}
                                className={`p-2 border rounded-xl transition-colors ${
                                  theme === 'dark' 
                                    ? 'border-slate-800 bg-slate-900/50 text-red-400 hover:bg-red-500/10' 
                                    : 'border-slate-200 bg-slate-100 text-red-600 hover:bg-red-50 shadow-sm'
                                }`}
                                title="Delete Bundle"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md border rounded-3xl shadow-2xl overflow-hidden transition-all transform animate-in zoom-in-95 duration-150 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex justify-between items-center p-6 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className="text-lg font-bold flex items-center gap-2">
                {editBundle ? 'Modify Bundle Settings' : 'Create Data Subscription Bundle'}
              </h3>
              <button onClick={() => setModalOpen(false)} className={`hover:text-red-500 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              {error && (
                <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs flex items-center gap-2 font-semibold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-4">
                {/* Network Provider Selector */}
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Network Operator</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-bold text-sm ${
                      theme === 'dark' 
                        ? 'bg-slate-950/70 border-slate-800 text-white focus:border-emerald-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                    }`}
                  >
                    {DEFAULT_NETWORKS.map(net => (
                      <option key={net} value={net}>{net}</option>
                    ))}
                    <option value="Other">Other / Custom Network</option>
                  </select>
                </div>

                {/* Custom Network Input */}
                {network === 'Other' && (
                  <div className="animate-in slide-in-from-top-2 duration-150">
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Network Name</label>
                    <input
                      type="text"
                      required
                      value={customNetwork}
                      onChange={(e) => setCustomNetwork(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium text-sm ${
                        theme === 'dark' 
                          ? 'bg-slate-950/70 border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      }`}
                      placeholder="e.g. Spectranet"
                    />
                  </div>
                )}

                {/* Size / Name Input */}
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Data Allowance / Size</label>
                  <input
                    type="text"
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium text-sm ${
                      theme === 'dark' 
                        ? 'bg-slate-950/70 border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    }`}
                    placeholder="e.g. 5GB, 20GB, Unlimited"
                  />
                </div>

                {/* Price Input */}
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Price (₦)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₦</span>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`w-full pl-8 pr-4 py-3 rounded-xl border outline-none transition-all font-bold text-sm ${
                        theme === 'dark' 
                          ? 'bg-slate-950/70 border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      }`}
                      placeholder="e.g. 1500"
                    />
                  </div>
                </div>
              </div>

              <div className={`mt-8 flex justify-end gap-3 border-t pt-5 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    theme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-650 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-550 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editBundle ? 'Save Changes' : 'Create Bundle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
