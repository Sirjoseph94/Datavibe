import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader2, LogOut, CheckCircle, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;
const ISP_OPTIONS = ['', 'MTN', 'Airtel', 'Glo', '9mobile'];

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [ispFilter, setIspFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const debounceRef = useRef(null);

  // Reset page when any filter changes
  useEffect(() => { setPage(1); }, [filter, ispFilter, search]);

  useEffect(() => {
    fetchRequests(filter, ispFilter, search, page);
  }, [filter, ispFilter, page]); // page already resets when filter/isp changes

  // Debounce search separately so typing doesn't fire on every keystroke
  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchRequests(filter, ispFilter, val, 1);
    }, 400);
  };

  const fetchRequests = async (currentFilter, currentIsp, currentSearch, currentPage) => {
    try {
      const params = new URLSearchParams({ page: currentPage, limit: PAGE_SIZE });
      if (currentFilter !== 'ALL') params.set('status', currentFilter);
      if (currentIsp) params.set('isp', currentIsp);
      if (currentSearch) params.set('search', currentSearch);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests?${params}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const json = await res.json();
      setRequests(json.data ?? []);
      setTotal(json.total ?? 0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTreat = async (id) => {
    try {
      setLoading(true);
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests/${id}/treat`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      await fetchRequests(filter, ispFilter, search, page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Manage Data Requests</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-red-500/80 rounded-lg transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </header>

        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Requests</h2>
              <span className="text-sm text-slate-400">{total} total</span>
            </div>

            {/* Search + ISP Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by phone or username…"
                  value={search}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/60 text-white placeholder-slate-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={ispFilter}
                  onChange={e => setIspFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/60 text-white appearance-none cursor-pointer"
                >
                  {ISP_OPTIONS.map(o => (
                    <option key={o} value={o}>{o || 'All Networks'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2">
              {['ALL', 'pending', 'treated'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${f === filter ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-2">User</th>
                  <th className="py-3 px-2">Network</th>
                  <th className="py-3 px-2">Number</th>
                  <th className="py-3 px-2">Bundle</th>
                  <th className="py-3 px-2">Ref</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-4 px-2 text-slate-400">#{req.id}</td>
                    <td className="py-4 px-2 font-medium">{req.subscriberName || <span className="text-slate-500 italic">Guest</span>}</td>
                    <td className="py-4 px-2 font-bold text-amber-300">{req.isp}</td>
                    <td className="py-4 px-2">{req.phoneNumber}</td>
                    <td className="py-4 px-2">{req.dataBundle} (₦{req.amount})</td>
                    <td className="py-4 px-2">
                      {req.reference
                        ? <span className="font-mono text-xs text-slate-400 truncate max-w-[100px] block" title={req.reference}>{req.reference.slice(0, 12)}…</span>
                        : <span className="text-slate-600 italic text-xs">—</span>}
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded capitalize ${req.status === 'treated' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      {req.status === 'pending' ? (
                        <button onClick={() => handleTreat(req.id)} disabled={loading}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold flex items-center gap-2 ml-auto">
                          <CheckCircle className="w-4 h-4" /> Mark Treated
                        </button>
                      ) : (
                        <span className="text-slate-500 text-sm italic">Treated by Admin {req.treatedBy}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan="7" className="text-center py-6 text-slate-500">No requests match this filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400">
                Page {page} of {totalPages} &middot; {total} total
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => p - 1)} disabled={page <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm transition-colors">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
