import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader2, ArrowLeft, Plus, Edit2, Trash2, Shield, X, Save, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminManagement() {
  const { user, theme, toggleTheme } = useContext(AuthContext);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  
  // form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchAdmins(); }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admins`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setAdmins(data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const openAddModal = () => {
    setEditAdmin(null);
    setUsername('');
    setPassword('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (admin) => {
    setEditAdmin(admin);
    setUsername(admin.username);
    setPassword(''); // leave blank meaning no change
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admins/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!res.ok) throw new Error('Failed to delete admin');
      fetchAdmins();
    } catch (e) { 
      alert(e.message); 
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const url = editAdmin 
      ? `${import.meta.env.VITE_API_BASE_URL}/api/admins/${editAdmin.id}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/admins`;
    
    const method = editAdmin ? 'PUT' : 'POST';
    
    const body = {};
    if (username) body.username = username;
    if (password) body.password = password;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save admin');
      
      setModalOpen(false);
      fetchAdmins();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

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

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Block */}
        <header className={`flex justify-between items-center mb-10 p-5 rounded-2xl border transition-all duration-305 ${
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
                Manage Admins
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Create, update, or remove Admin accounts</p>
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
            <button onClick={openAddModal} className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-605 hover:bg-emerald-550 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">
              <Plus className="w-4.5 h-4.5" /> Add Admin
            </button>
          </div>
        </header>

        {/* Admins List Panel */}
        <div className={`p-6 rounded-3xl border shadow-xl transition-all duration-300 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-slate-950/20 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {admins.length === 0 ? (
            <div className="text-center py-10 text-slate-500 italic text-sm">No administrators registered. Create one to begin.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-xs uppercase tracking-wider font-semibold ${theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    <th className="pb-4 font-semibold">ID</th>
                    <th className="pb-4 font-semibold">Username</th>
                    <th className="pb-4 font-semibold">Date Created</th>
                    <th className="pb-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/10">
                  {admins.map(a => (
                    <tr key={a.id} className={`border-b transition-colors ${
                      theme === 'dark' ? 'border-slate-800/40 hover:bg-slate-900/30' : 'border-slate-200/50 hover:bg-slate-50'
                    }`}>
                      <td className={`py-4 text-xs font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>#{a.id}</td>
                      <td className="py-4 font-bold text-sm">{a.username}</td>
                      <td className={`py-4 text-xs font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 flex justify-end gap-2.5">
                        <button 
                          onClick={() => openEditModal(a)} 
                          className={`p-2 border rounded-xl transition-colors ${
                            theme === 'dark' 
                              ? 'border-slate-800 bg-slate-900/40 text-blue-400 hover:bg-blue-500/10' 
                              : 'border-slate-200 bg-slate-50 text-blue-600 hover:bg-blue-50'
                          }`} 
                          title="Edit Admin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(a.id)} 
                          className={`p-2 border rounded-xl transition-colors ${
                            theme === 'dark' 
                              ? 'border-slate-800 bg-slate-900/40 text-red-400 hover:bg-red-500/10' 
                              : 'border-slate-200 bg-slate-50 text-red-600 hover:bg-red-50'
                          }`} 
                          title="Delete Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Admin Creator/Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md border rounded-3xl shadow-2xl overflow-hidden transition-all transform animate-in zoom-in-95 duration-150 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex justify-between items-center p-6 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className="text-lg font-bold">{editAdmin ? 'Edit Admin Account' : 'Register New Admin'}</h3>
              <button onClick={() => setModalOpen(false)} className={`hover:text-red-500 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              {error && <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs font-semibold">{error}</div>}
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium text-sm ${
                      theme === 'dark' 
                        ? 'bg-slate-950/70 border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    }`}
                    placeholder="e.g., jdoe_admin"
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>
                    Password {editAdmin && <span className="text-[10px] lowercase font-normal italic">(leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    required={!editAdmin}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium text-sm ${
                      theme === 'dark' 
                        ? 'bg-slate-950/70 border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    }`}
                    placeholder="Enter secure password"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    theme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-550 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition-colors shadow-md active:scale-95"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editAdmin ? 'Save Changes' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
