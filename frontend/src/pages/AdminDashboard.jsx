import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader2, LogOut, CheckCircle, ChevronLeft, ChevronRight, Search, Filter, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NetworkLogo from '../components/NetworkLogo.jsx';

const PAGE_SIZE = 10;
const ISP_OPTIONS = ['', 'MTN', 'Airtel', 'Glo', '9mobile'];

export default function AdminDashboard() {
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);
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
  }, [filter, ispFilter, page]);

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
    <div className={`min-h-screen p-6 md:p-10 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background glow decorator */}
      <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-emerald-950/10' : 'bg-emerald-100/15'
      }`}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Block */}
        <header className={`flex justify-between items-center mb-10 p-5 rounded-2xl border transition-all duration-305 ${
          theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/20' : 'bg-white border-slate-200 shadow-sm'
        } backdrop-blur-md`}>
          <div>
            <h1 className="text-2xl font-black text-emerald-500">
              Admin Portal
            </h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Manage Subscriber Data Requests</p>
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
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-650 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        {/* Request List Panel */}
        <div className={`p-6 rounded-3xl border shadow-xl transition-all duration-300 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-slate-950/20 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">All Requests</h2>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-650'}`}>
                {total} total
              </span>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by phone or username…"
                  value={search}
                  onChange={e => handleSearchChange(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-all text-xs font-semibold ${
                    theme === 'dark' 
                      ? 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 shadow-inner'
                  }`}
                />
              </div>

              {/* ISP Selector filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={ispFilter}
                  onChange={e => setIspFilter(e.target.value)}
                  className={`pl-9 pr-8 py-2.5 rounded-xl border outline-none transition-all text-xs font-bold appearance-none cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                  }`}
                >
                  {ISP_OPTIONS.map(o => (
                    <option key={o} value={o}>{o || 'All Networks'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Button Filter */}
            <div className="flex gap-2">
              {['ALL', 'pending', 'treated'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
                    f === filter 
                      ? 'bg-emerald-605 text-white shadow-sm' 
                      : theme === 'dark'
                        ? 'bg-slate-950 text-slate-400 hover:bg-slate-900 border border-slate-800'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-xs uppercase tracking-wider font-semibold ${theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
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
              <tbody className="divide-y divide-slate-800/10">
                {requests.map(req => (
                  <tr key={req.id} className={`border-b transition-colors ${
                    theme === 'dark' ? 'border-slate-800/40 hover:bg-slate-900/30' : 'border-slate-200/50 hover:bg-slate-50'
                  }`}>
                    <td className={`py-4 px-2 text-xs font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>#{req.id}</td>
                    <td className="py-4 px-2 text-xs font-bold">{req.subscriberName || <span className="text-slate-500 italic">Guest</span>}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <NetworkLogo network={req.isp} className="w-6 h-6" />
                        <span className="font-bold text-xs">{req.isp}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-xs font-semibold">{req.phoneNumber}</td>
                    <td className="py-4 px-2 text-xs font-bold text-slate-650">
                      <span className={`${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{req.dataBundle}</span>
                      <span className="text-emerald-500 ml-1.5 font-extrabold">₦{req.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-2">
                      {req.reference
                        ? <span className={`font-mono text-[10px] truncate max-w-[80px] block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} title={req.reference}>{req.reference.slice(0, 10)}…</span>
                        : <span className="text-slate-500 italic text-[10px]">—</span>}
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        req.status === 'treated' 
                          ? 'bg-emerald-500/10 text-emerald-555 border-emerald-500/20' 
                          : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      {req.status === 'pending' ? (
                        <button 
                          onClick={() => handleTreat(req.id)} 
                          disabled={loading}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-550 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 ml-auto transition-all active:scale-95 shadow-sm shadow-emerald-550/10"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Treated
                        </button>
                      ) : (
                        <span className="text-slate-500 text-xs italic">By Admin {req.treatedBy}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-slate-500 text-sm italic">
                      No customer requests match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className={`flex items-center justify-between mt-4 pt-4 border-t ${theme === 'dark' ? 'border-slate-800/60' : 'border-slate-200'}`}>
              <p className="text-xs text-slate-400">
                Page {page} of {totalPages} &middot; {total} requests
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPage(p => p - 1)} 
                  disabled={page <= 1}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 ${
                    theme === 'dark' ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button 
                  onClick={() => setPage(p => p + 1)} 
                  disabled={page >= totalPages}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 ${
                    theme === 'dark' ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
