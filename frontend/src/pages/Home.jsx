import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';

function validateNigerianPhone(phone) {
  const normalized = String(phone).replace(/^\+?234/, '0').replace(/\s+/g, '');
  if (!/^0\d{10}$/.test(normalized)) {
    return { valid: false, message: 'Please enter a valid 11-digit Nigerian phone number (e.g. 0801...)' };
  }
  return { valid: true };
}

export default function Home() {
  const [bundles, setBundles] = useState({});
  const [isp, setIsp] = useState('');
  const [bundleSize, setBundleSize] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bundles`)
      .then(res => res.json())
      .then(data => setBundles(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isp || !bundleSize || !phoneNumber) return setError('Please fill all fields');

    const phoneValidation = validateNigerianPhone(phoneNumber);
    if (!phoneValidation.valid) return setError(phoneValidation.message);

    const selectedBundle = bundles[isp]?.find(b => b.size === bundleSize);
    if (!selectedBundle) return setError('Invalid bundle selected');

    // Show confirmation modal first
    setError('');
    setConfirmOrder({ isp, phoneNumber, bundle: selectedBundle });
  };

  const handleConfirmPayment = async () => {
    if (!confirmOrder) return;
    const { isp: ordIsp, phoneNumber: ordPhone, bundle } = confirmOrder;
    setConfirmOrder(null);
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/paystack/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row items-center justify-center p-6 md:p-16 text-center md:text-left relative overflow-hidden gap-12">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Confirmation Modal */}
      {confirmOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Confirm Your Order</h3>
            <p className="text-slate-400 text-sm mb-6">Please review your details before payment.</p>
            <div className="space-y-3 mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between text-sm"><span className="text-slate-400">Network</span><span className="font-semibold text-white">{confirmOrder.isp}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400">Bundle</span><span className="font-semibold text-white">{confirmOrder.bundle.size}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400">Phone</span><span className="font-semibold text-white">{confirmOrder.phoneNumber}</span></div>
              <div className="flex justify-between text-sm border-t border-slate-700 pt-3"><span className="text-slate-400">Total</span><span className="font-bold text-emerald-400 text-base">₦{confirmOrder.bundle.price}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmOrder(null)} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-colors text-white">Cancel</button>
              <button onClick={handleConfirmPayment} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-white shadow-lg transition-all">Pay Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Left Text Column */}
      <div className="relative z-10 max-w-2xl flex-1 flex flex-col items-center md:items-start">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 drop-shadow-lg tracking-tight leading-tight">
          Next-Gen Data Subscriptions
        </h1>
        <p className="text-lg md:text-2xl text-slate-300 mb-10 font-light leading-relaxed">
          Seamless, instant, and reliable data top-ups for MTN, Airtel, Glo, and 9mobile. Experience the future of connectivity.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto mt-4">
          <Link to="/register" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-full border border-slate-700 transition-all shadow-lg w-full sm:w-auto text-center">
            Create an Account
          </Link>
          <Link to="/login" className="px-8 py-4 bg-transparent hover:bg-slate-800/50 text-slate-300 font-semibold rounded-full transition-all w-full sm:w-auto text-center">
            Login to Dashboard
          </Link>
        </div>
      </div>

      {/* Right Guest Form */}
      <div className="relative z-10 flex-1 w-full max-w-md">
        <div className="bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Buy Data Instantly</h2>
          <p className="text-slate-400 text-sm mb-6">No registration required. Just enter your details below.</p>

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
               <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
               <p className="text-emerald-400 text-sm font-medium text-left">Subscription successful! Your data is on the way.</p>
            </div>
          )}
          {error && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm text-left">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1 text-left">Phone Number</label>
              <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 text-white rounded-xl border border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all" required placeholder="080..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1 text-left">Select Network</label>
              <select value={isp} onChange={e => {setIsp(e.target.value); setBundleSize('');}}
                className="w-full px-4 py-3 bg-slate-900/50 text-white rounded-xl border border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all" required>
                <option value="">-- Choose ISP --</option>
                {Object.keys(bundles).map(network => (
                  <option key={network} value={network}>{network}</option>
                ))}
              </select>
            </div>

            {isp && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-slate-300 mb-1 text-left">Data Bundle</label>
                <select value={bundleSize} onChange={e => setBundleSize(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 text-white rounded-xl border border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all" required>
                  <option value="">-- Choose Bundle --</option>
                  {bundles[isp]?.map((b, idx) => (
                    <option key={idx} value={b.size}>{b.size} (₦{b.price})</option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 flex justify-center items-center transition-all transform hover:scale-[1.02] active:scale-[0.98]">
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Subscribe Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
