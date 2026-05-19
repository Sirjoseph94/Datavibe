import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import NetworkLogo from '../components/NetworkLogo.jsx';

export default function VerifyPayment() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref') || searchParams.get('paymentReference');
  const isMonnify = !!searchParams.get('paymentReference');
  
  const [status, setStatus] = useState('verifying');
  const [errorMsg, setErrorMsg] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);
  const { user, theme, toggleTheme } = useContext(AuthContext);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    if (!reference) {
      setStatus('error');
      setErrorMsg('No payment reference found in URL.');
      return;
    }
    verifyTransaction();
  }, []);

  const verifyTransaction = async () => {
    try {
      const endpoint = isMonnify
        ? `${import.meta.env.VITE_API_BASE_URL}/api/monnify/verify/${reference}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/paystack/verify/${reference}`;

      const res = await fetch(endpoint, {
        method: 'POST'
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Payment verification failed');

      setRequestDetails(data.request);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background decoration */}
      <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-emerald-950/15' : 'bg-emerald-100/20'
      }`}></div>

      {/* Floating Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
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
      </div>

      <div className={`relative z-10 w-full max-w-md p-8 rounded-3xl border shadow-2xl text-center transition-all duration-300 ${
        theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/40 backdrop-blur-md' : 'bg-white border-slate-200 shadow-slate-200/50'
      }`}>
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-14 h-14 text-emerald-500 animate-spin mb-6" />
            <h2 className="text-xl font-bold mb-2">Verifying Payment...</h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Please wait while we confirm your transaction securely.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-150">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
            <h2 className="text-2xl font-black mb-2">Payment Successful!</h2>
            <p className={`text-xs mb-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Your data request has been successfully queued and is pending admin processing.</p>

            <div className={`w-full p-4 rounded-2xl border mb-6 text-left space-y-2.5 ${
              theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200/80'
            }`}>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Operator:</span>
                {requestDetails?.isp && (
                  <div className="flex items-center gap-1.5 font-bold">
                    <NetworkLogo network={requestDetails.isp} className="w-4.5 h-4.5" />
                    <span>{requestDetails.isp}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Data Bundle:</span>
                <span className="font-bold">{requestDetails?.dataBundle}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Recipient Phone:</span>
                <span className="font-bold">{requestDetails?.phoneNumber}</span>
              </div>
            </div>

            <Link to={user ? "/dashboard" : "/"} className="w-full block py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/10 transition-all active:scale-95">
              Return to Dashboard
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-150">
            <XCircle className="w-16 h-16 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]" />
            <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
            <p className="text-red-500 text-xs mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl font-semibold w-full">{errorMsg}</p>

            <Link to={user ? "/dashboard" : "/"} className={`w-full block py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
              theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}>
              Go Back
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
