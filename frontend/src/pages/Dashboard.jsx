import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Plus, History, LogOut, ChevronLeft, ChevronRight, Search, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NetworkLogo from '../components/NetworkLogo.jsx';

function validateNigerianPhone(phone) {
  const normalized = String(phone).replace(/^\+?234/, '0').replace(/\s+/g, '');
  if (!/^0\d{10}$/.test(normalized)) {
    return { valid: false, message: 'Please enter a valid 11-digit Nigerian phone number (e.g. 0803...)' };
  }
  return { valid: true };
}

export default function Dashboard() {
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);
  const [bundles, setBundles] = useState({});
  const [requests, setRequests] = useState([]);
  const [isp, setIsp] = useState('');
  const [bundleSize, setBundleSize] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmOrder, setConfirmOrder] = useState(null);
  const [activeGateways, setActiveGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const historyDebounce = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBundles();
    fetchRequests(1);
    fetchActiveGateways();
  }, []);

  const fetchActiveGateways = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gateways`);
      const data = await res.json();
      setActiveGateways(data);
      const def = data.find(g => g.isDefault);
      if (def) {
        setSelectedGateway(def.name);
      } else if (data.length > 0) {
        setSelectedGateway(data[0].name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBundles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bundles`);
      const data = await res.json();
      setBundles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async (targetPage = page, currentStatus = statusFilter, currentSearch = historySearch) => {
    try {
      const params = new URLSearchParams({ page: targetPage, limit: PAGE_SIZE });
      if (currentStatus) params.set('status', currentStatus);
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

  const handleHistorySearchChange = (val) => {
    setHistorySearch(val);
    clearTimeout(historyDebounce.current);
    historyDebounce.current = setTimeout(() => {
      setPage(1);
      fetchRequests(1, statusFilter, val);
    }, 400);
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1);
    fetchRequests(1, val, historySearch);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isp || !bundleSize || !phoneNumber) return setError('Please fill all fields');

    const phoneValidation = validateNigerianPhone(phoneNumber);
    if (!phoneValidation.valid) return setError(phoneValidation.message);

    const selectedBundle = bundles[isp]?.find(b => b.size === bundleSize);
    if (!selectedBundle) return setError('Invalid bundle selected');

    setConfirmOrder({ isp, phoneNumber, bundle: selectedBundle });
  };

  const handleConfirmPayment = async () => {
    if (!confirmOrder) return;
    const { isp: ordIsp, phoneNumber: ordPhone, bundle } = confirmOrder;
    setConfirmOrder(null);
    setLoading(true);
    setError('');

    try {
      const gw = selectedGateway || 'monnify';
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${gw}/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          phoneNumber: ordPhone,
          isp: ordIsp,
          dataBundle: bundle.size
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment');

      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 md:p-10 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background decoration */}
      <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-emerald-950/10' : 'bg-emerald-100/20'
      }`}></div>

      {/* Confirmation Modal */}
      {confirmOrder && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl transition-all transform animate-in zoom-in-95 duration-150 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xl font-bold mb-1">Confirm Order</h3>
            <p className={`text-xs mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Review your transaction details.</p>
            
            <div className={`space-y-3.5 mb-6 p-4 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200/80'
            }`}>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 text-xs">Operator</span>
                <div className="flex items-center gap-2">
                  <NetworkLogo network={confirmOrder.isp} className="w-5 h-5" />
                  <span className="font-bold">{confirmOrder.isp}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 text-xs">Data Plan</span>
                <span className="font-bold">{confirmOrder.bundle.size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 text-xs">Recipient</span>
                <span className="font-bold">{confirmOrder.phoneNumber}</span>
              </div>
              <div className={`flex justify-between text-sm border-t pt-3.5 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className="text-slate-400 text-xs font-semibold">Total Cost</span>
                <span className="font-black text-emerald-500 text-base">₦{confirmOrder.bundle.price.toLocaleString()}</span>
              </div>
            </div>

            {/* Gateway Selector inside Modal */}
            {activeGateways.length === 0 ? (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs text-center font-medium">
                No active payment gateways. Please contact administrator.
              </div>
            ) : activeGateways.length > 1 ? (
              <div className="mb-6">
                <label className={`block text-[10px] font-black uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Select Payment Gateway
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {activeGateways.map(g => (
                    <button
                      key={g.name}
                      type="button"
                      onClick={() => setSelectedGateway(g.name)}
                      className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                        selectedGateway === g.name
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 ring-1 ring-emerald-500'
                          : theme === 'dark'
                            ? 'bg-slate-950/30 border-slate-800 text-slate-300 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {g.displayName}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setConfirmOrder(null)} 
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-705'
                }`}
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleConfirmPayment} 
                disabled={activeGateways.length === 0}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl font-bold text-white text-sm shadow-md shadow-emerald-500/10 transition-all active:scale-95 disabled:opacity-40"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header section */}
        <header className={`flex justify-between items-center mb-10 p-5 rounded-2xl border transition-all duration-305 ${
          theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/20' : 'bg-white border-slate-200 shadow-sm'
        } backdrop-blur-md`}>
          <div>
            <h1 className="text-2xl font-black text-emerald-500">
              Welcome, {user.username}
            </h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Subscriber Dashboard</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* New Request Form Card */}
          <div className={`md:col-span-1 p-6 rounded-3xl border shadow-xl h-fit transition-all duration-300 ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/20 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500"/> New Data Request
            </h2>
            
            {error && <div className="bg-red-500/10 text-red-500 p-3.5 rounded-xl mb-4 text-xs font-semibold">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Phone Number Input */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Phone Number</label>
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={e => setPhoneNumber(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium text-sm ${
                    theme === 'dark' 
                      ? 'bg-slate-950/70 border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                  }`} 
                  required 
                  placeholder="e.g., 0803 123 4567" 
                />
              </div>
              
              {/* Operator select cards */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Select Network Provider</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(bundles).map(networkName => {
                    const isSelected = isp === networkName;
                    return (
                      <button
                        key={networkName}
                        type="button"
                        onClick={() => { setIsp(networkName); setBundleSize(''); }}
                        className={`flex items-center gap-2.5 p-2 rounded-2xl border text-left transition-all active:scale-95 ${
                          isSelected 
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-1 ring-emerald-500' 
                            : theme === 'dark'
                              ? 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/80'
                              : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <NetworkLogo network={networkName} className="w-8 h-8" />
                        <span className="font-bold text-[11px] truncate">{networkName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Bundle list grid */}
              {isp && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Select Data Plan</label>
                  <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {bundles[isp]?.map((b, idx) => {
                      const isSelected = bundleSize === b.size;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setBundleSize(b.size)}
                          className={`flex flex-col p-2.5 rounded-xl border text-left transition-all active:scale-95 ${
                            isSelected 
                              ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-1 ring-emerald-500' 
                              : theme === 'dark'
                                ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950/70'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="font-bold text-xs">{b.size}</span>
                          <span className="text-emerald-500 font-extrabold text-[10px] mt-0.5">₦{b.price.toLocaleString()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 mt-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold shadow-md shadow-emerald-500/10 flex justify-center text-sm transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send Top-up Request'}
              </button>
            </form>
          </div>

          {/* Request History Card */}
          <div className={`md:col-span-2 p-6 rounded-3xl border shadow-xl transition-all duration-300 ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/20 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex flex-col gap-4 mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-500"/> Request History
              </h2>

              {/* Search input field */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by phone number…"
                  value={historySearch}
                  onChange={e => handleHistorySearchChange(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-all text-xs font-semibold ${
                    theme === 'dark' 
                      ? 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500' 
                      : 'bg-slate-55 border-slate-200 text-slate-900 focus:border-emerald-500 shadow-inner'
                  }`}
                />
              </div>

              {/* Status Tabs filter */}
              <div className="flex gap-2">
                {[
                  ['', 'All Statuses'],
                  ['pending', 'Pending'],
                  ['treated', 'Treated']
                ].map(([val, label]) => (
                  <button 
                    key={val} 
                    onClick={() => handleStatusFilterChange(val)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === val
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : theme === 'dark'
                          ? 'bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-800'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* History Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-xs uppercase tracking-wider font-semibold ${theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    <th className="py-3 px-1 font-semibold">Date</th>
                    <th className="py-3 px-1 font-semibold">Network</th>
                    <th className="py-3 px-1 font-semibold">Number</th>
                    <th className="py-3 px-1 font-semibold">Bundle</th>
                    <th className="py-3 px-1 font-semibold">Amount</th>
                    <th className="py-3 px-1 font-semibold">Ref</th>
                    <th className="py-3 px-1 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/10">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-10 text-center text-slate-500 text-sm italic">
                        No transactions found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    requests.map(req => (
                      <tr key={req.id} className={`border-b transition-colors ${
                        theme === 'dark' ? 'border-slate-800/40 hover:bg-slate-900/30' : 'border-slate-200/50 hover:bg-slate-50'
                      }`}>
                        <td className={`py-4 px-1 text-xs font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-1">
                          <div className="flex items-center gap-2">
                            <NetworkLogo network={req.isp} className="w-6 h-6" />
                            <span className="font-bold text-xs">{req.isp}</span>
                          </div>
                        </td>
                        <td className="py-4 px-1 text-xs font-semibold">{req.phoneNumber}</td>
                        <td className="py-4 px-1 text-xs">{req.dataBundle}</td>
                        <td className="py-4 px-1 text-xs font-extrabold text-emerald-500">₦{req.amount.toLocaleString()}</td>
                        <td className="py-4 px-1">
                          {req.reference
                            ? <span className={`font-mono text-[10px] truncate max-w-[80px] block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} title={req.reference}>{req.reference.slice(0, 10)}…</span>
                            : <span className="text-slate-500 italic text-[10px]">—</span>}
                        </td>
                        <td className="py-4 px-1">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                            req.status === 'treated' 
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                              : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={`flex items-center justify-between mt-4 pt-4 border-t ${theme === 'dark' ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <p className="text-xs text-slate-400">
                  Page {page} of {totalPages} &middot; {total} transactions
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setPage(p => p - 1); fetchRequests(page - 1); }} 
                    disabled={page <= 1}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 ${
                      theme === 'dark' ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                  <button 
                    onClick={() => { setPage(p => p + 1); fetchRequests(page + 1); }} 
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
    </div>
  );
}
