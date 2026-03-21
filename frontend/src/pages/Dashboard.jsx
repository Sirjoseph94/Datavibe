import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Plus, History, LogOut, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function validateNigerianPhone(phone) {
  const normalized = String(phone).replace(/^\+?234/, '0').replace(/\s+/g, '');
  if (!/^0\d{10}$/.test(normalized)) {
    return { valid: false, message: 'Please enter a valid 11-digit Nigerian phone number (e.g. 0801...)' };
  }
  return { valid: true };
}

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [bundles, setBundles] = useState({});
  const [requests, setRequests] = useState([]);
  const [isp, setIsp] = useState('');
  const [bundleSize, setBundleSize] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmOrder, setConfirmOrder] = useState(null);
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
  }, []);

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

    // Show confirmation before going to Paystack
    setConfirmOrder({ isp, phoneNumber, bundle: selectedBundle });
  };

  const handleConfirmPayment = async () => {
    if (!confirmOrder) return;
    const { isp: ordIsp, phoneNumber: ordPhone, bundle } = confirmOrder;
    setConfirmOrder(null);
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/paystack/initialize`, {
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
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Confirmation Modal */}
      {confirmOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Confirm Your Order</h3>
            <p className="text-slate-400 text-sm mb-6">Please review before proceeding to payment.</p>
            <div className="space-y-3 mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between text-sm"><span className="text-slate-400">Network</span><span className="font-semibold text-white">{confirmOrder.isp}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400">Bundle</span><span className="font-semibold text-white">{confirmOrder.bundle.size}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400">Phone</span><span className="font-semibold text-white">{confirmOrder.phoneNumber}</span></div>
              <div className="flex justify-between text-sm border-t border-slate-700 pt-3"><span className="text-slate-400">Total</span><span className="font-bold text-emerald-400 text-base">₦{confirmOrder.bundle.price}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmOrder(null)} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-colors">Cancel</button>
              <button onClick={handleConfirmPayment} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-white shadow-lg transition-all">Pay Now</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-10 bg-slate-800/50 p-4 rounded-2xl backdrop-blur-md border border-slate-700">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Welcome, {user.username}
            </h1>
            <p className="text-slate-400 text-sm">Subscriber Dashboard</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-red-500/80 rounded-xl transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* New Request Form */}
          <div className="md:col-span-1 bg-slate-800/60 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-xl h-fit">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-blue-400"/> New Data Request</h2>
            
            {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Phone Number</label>
                <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" required placeholder="080..." />
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-1">Select ISP</label>
                <select value={isp} onChange={e => {setIsp(e.target.value); setBundleSize('');}}
                  className="w-full px-4 py-3 bg-slate-900/50 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" required>
                  <option value="">-- Choose ISP --</option>
                  {Object.keys(bundles).map(network => (
                    <option key={network} value={network}>{network}</option>
                  ))}
                </select>
              </div>

              {isp && (
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Data Bundle</label>
                  <select value={bundleSize} onChange={e => setBundleSize(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" required>
                    <option value="">-- Choose Bundle --</option>
                    {bundles[isp]?.map((b, idx) => (
                      <option key={idx} value={b.size}>{b.size} (₦{b.price})</option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold shadow-lg shadow-blue-500/20 flex justify-center text-white">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit Request'}
              </button>
            </form>
          </div>

          {/* Request History */}
          <div className="md:col-span-2 bg-slate-800/60 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-xl">
            <div className="flex flex-col gap-3 mb-5">
              <h2 className="text-xl font-semibold flex items-center gap-2"><History className="w-5 h-5 text-purple-400"/> Request History</h2>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by phone number…"
                  value={historySearch}
                  onChange={e => handleHistorySearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-slate-500"
                />
              </div>

              {/* Status filter */}
              <div className="flex gap-2">
                {[['', 'All'], ['pending', 'Pending'], ['treated', 'Treated']].map(([val, label]) => (
                  <button key={val} onClick={() => handleStatusFilterChange(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === val ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-sm">
                    <th className="py-3 font-medium">Date</th>
                    <th className="py-3 font-medium">Network</th>
                    <th className="py-3 font-medium">Number</th>
                    <th className="py-3 font-medium">Bundle</th>
                    <th className="py-3 font-medium">Amount</th>
                    <th className="py-3 font-medium">Ref</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan="6" className="py-6 text-center text-slate-500">No requests found.</td></tr>
                  ) : (
                    requests.map(req => (
                      <tr key={req.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                        <td className="py-4 text-sm text-slate-300">{new Date(req.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 font-semibold text-white">{req.isp}</td>
                        <td className="py-4 text-slate-300">{req.phoneNumber}</td>
                        <td className="py-4 text-slate-300">{req.dataBundle}</td>
                        <td className="py-4 font-medium text-emerald-400">₦{req.amount}</td>
                        <td className="py-4">
                          {req.reference
                            ? <span className="font-mono text-xs text-slate-400" title={req.reference}>{req.reference.slice(0, 12)}…</span>
                            : <span className="text-slate-600 italic text-xs">—</span>}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${req.status === 'treated' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                <p className="text-sm text-slate-400">
                  Page {page} of {totalPages} &middot; {total} requests
                </p>
                <div className="flex gap-2">
                  <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm transition-colors">
                    Next <ChevronRight className="w-4 h-4" />
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
