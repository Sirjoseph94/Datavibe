import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader2, ArrowLeft, Plus, Edit2, Trash2, Shield, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminManagement() {
  const { user } = useContext(AuthContext);
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
    } catch (err) { console.error(err); } finally { setLoading(false); }
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
    } catch (e) { alert(e.message); }
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

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><Loader2 className="animate-spin w-8 h-8" /></div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-10 bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4">
            <Link to="/super-admin" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3"><Shield className="text-indigo-400"/> Manage Admins</h1>
              <p className="text-slate-400 text-sm mt-1">Create, update, or remove Admin accounts</p>
            </div>
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all font-semibold shadow-lg">
            <Plus className="w-5 h-5" /> Add Admin
          </button>
        </header>

        <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl">
          {admins.length === 0 ? (
            <div className="text-center py-10 text-slate-400">No admins found. Click 'Add Admin' to create one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-sm">
                    <th className="pb-4 font-medium">ID</th>
                    <th className="pb-4 font-medium">Username</th>
                    <th className="pb-4 font-medium">Joined</th>
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {admins.map(a => (
                    <tr key={a.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="py-4 text-slate-300">#{a.id}</td>
                      <td className="py-4 font-semibold text-lg">{a.username}</td>
                      <td className="py-4 text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 flex justify-end gap-3">
                        <button onClick={() => openEditModal(a)} className="p-2 bg-slate-700/50 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg transition-colors" title="Edit Admin">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(a.id)} className="p-2 bg-slate-700/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors" title="Delete Admin">
                          <Trash2 className="w-5 h-5" />
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 w-full max-w-md rounded-3xl border border-slate-600 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold">{editAdmin ? 'Edit Admin' : 'Create New Admin'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm">{error}</div>}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="e.g. jdoe_admin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Password {editAdmin && <span className="text-xs italic">(leave blank to keep current)</span>}</label>
                  <input
                    type="password"
                    required={!editAdmin}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Enter secure password"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-medium transition-colors shadow-lg">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
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
