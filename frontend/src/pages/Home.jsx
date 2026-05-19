import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle2, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import NetworkLogo from '../components/NetworkLogo.jsx';

function validateNigerianPhone(phone) {
  const normalized = String(phone).replace(/^\+?234/, '0').replace(/\s+/g, '');
  if (!/^0\d{10}$/.test(normalized)) {
    return { valid: false, message: 'Please enter a valid 11-digit Nigerian phone number (e.g. 0803...)' };
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
  const [activeGateways, setActiveGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('');
  
  // Consume global theme state
  const { theme, toggleTheme } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bundles`)
      .then(res => res.json())
      .then(data => setBundles(data))
      .catch(console.error);

    // Fetch active payment gateways
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gateways`)
      .then(res => res.json())
      .then(data => {
        setActiveGateways(data);
        const def = data.find(g => g.isDefault);
        if (def) {
          setSelectedGateway(def.name);
        } else if (data.length > 0) {
          setSelectedGateway(data[0].name);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isp || !bundleSize || !phoneNumber) return setError('Please fill all fields');

    const phoneValidation = validateNigerianPhone(phoneNumber);
    if (!phoneValidation.valid) return setError(phoneValidation.message);

    const selectedBundle = bundles[isp]?.find(b => b.size === bundleSize);
    if (!selectedBundle) return setError('Invalid bundle selected');

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
      const gw = selectedGateway || 'monnify';
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${gw}/initialize`, {
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
    <div className={`min-h-screen flex flex-col md:flex-row items-center justify-center p-6 md:p-16 relative overflow-hidden gap-12 pt-28 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Background glow effects */}
      <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-emerald-955/15' : 'bg-emerald-100/30'
      }`}></div>
      <div className={`absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-green-955/15' : 'bg-green-100/30'
      }`}></div>

      {/* Navigation Bar */}
      <nav className={`w-full absolute top-0 left-0 px-6 py-4 flex justify-between items-center z-20 border-b transition-colors duration-300 ${
        theme === 'dark' ? 'border-slate-900/60 bg-slate-950/70' : 'border-slate-200/40 bg-white/70'
      } backdrop-blur-md`}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-500/20">
            D
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            Data<span className="text-emerald-500">Vibe</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/login" className={`text-sm font-semibold hover:text-emerald-500 transition-colors px-3 py-2 rounded-xl ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Login
          </Link>
          <Link to="/register" className="px-5 py-2.5 bg-emerald-650 hover:bg-emerald-600 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10">
            Get Started
          </Link>
          <button 
            type="button"
            onClick={toggleTheme} 
            className={`p-2.5 rounded-xl border transition-all active:scale-90 ${
              theme === 'dark' 
                ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-amber-400' 
                : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
            }`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
        </div>
      </nav>

      {/* Confirmation Modal */}
      {confirmOrder && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl transition-all transform animate-in zoom-in-95 duration-155 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xl font-bold mb-1">Confirm Order</h3>
            <p className={`text-xs mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Review your top-up details below.</p>
            
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
                  theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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

      {/* Left Column: Hero Content */}
      <div className="relative z-10 max-w-xl flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
          Superfast Data <br/>
          <span className="text-emerald-500">
            Top-up, Instantly.
          </span>
        </h1>
        
        <p className={`text-base md:text-lg mb-8 max-w-md ${
          theme === 'dark' ? 'text-slate-400 font-light' : 'text-slate-650'
        }`}>
          Purchase instant data subscriptions for MTN, Airtel, Glo, and 9mobile in seconds. No logins required for quick top-ups.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/register" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-md shadow-emerald-500/10 w-full sm:w-auto text-center active:scale-95">
            Create an Account
          </Link>
          <Link to="/login" className={`px-8 py-4 rounded-2xl font-bold transition-all w-full sm:w-auto text-center border ${
            theme === 'dark' 
              ? 'border-slate-800 hover:bg-slate-900 text-slate-300' 
              : 'border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}>
            Login to Dashboard
          </Link>
        </div>
      </div>

      {/* Right Column: Guest Purchase Box */}
      <div className="relative z-10 flex-1 w-full max-w-md">
        <div className={`p-6 md:p-8 rounded-3xl border shadow-xl transition-all duration-300 ${
          theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/40 backdrop-blur-md' : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}>
          <h2 className="text-xl font-bold mb-1">Buy Data Instantly</h2>
          <p className={`text-xs mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Select network and data size. No card signup needed.
          </p>

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 animate-in fade-in">
               <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
               <p className="text-emerald-500 text-xs font-semibold text-left">Top-up initiated! Processing transaction.</p>
            </div>
          )}
          {error && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs text-left font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Recipient Phone Number */}
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
            
            {/* Operator Card Selection */}
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Select Operator</label>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.keys(bundles).map(networkName => {
                  const isSelected = isp === networkName;
                  return (
                    <button
                      key={networkName}
                      type="button"
                      onClick={() => { setIsp(networkName); setBundleSize(''); }}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all active:scale-95 ${
                        isSelected 
                          ? 'bg-emerald-500/10 border-emerald-500 shadow-sm ring-1 ring-emerald-500' 
                          : theme === 'dark' 
                            ? 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/70' 
                            : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <NetworkLogo network={networkName} className="w-7 h-7" />
                      <span className="font-bold text-[11px] truncate">{networkName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Plan Card Grid */}
            {isp && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Select Data Plan</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {bundles[isp]?.map((b, idx) => {
                    const isSelected = bundleSize === b.size;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBundleSize(b.size)}
                        className={`flex flex-col p-2.5 rounded-xl border text-left transition-all active:scale-95 ${
                          isSelected 
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-sm ring-1 ring-emerald-500' 
                            : theme === 'dark'
                              ? 'bg-slate-950/30 border-slate-800/60 hover:border-slate-700'
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

            {/* Subscribe Action Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold shadow-md shadow-emerald-500/10 flex justify-center items-center transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Subscribe Now'}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
