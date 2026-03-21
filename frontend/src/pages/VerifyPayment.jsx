import { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function VerifyPayment() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const [status, setStatus] = useState('verifying');
  const [errorMsg, setErrorMsg] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);
  const { user } = useContext(AuthContext);
  const hasVerified = useRef(false); // Guard against React Strict Mode double-invocation

  useEffect(() => {
    if (hasVerified.current) return; // Skip if already running
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/paystack/verify/${reference}`, {
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 shadow-2xl text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment...</h2>
            <p className="text-slate-400">Please wait while we confirm your transaction securely.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-in zoom-in">
            <CheckCircle2 className="w-20 h-20 text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-slate-300 mb-8">Your data request has been successfully queued and is pending fulfillment.</p>

            <div className="bg-slate-900/50 w-full p-4 rounded-xl border border-slate-700 mb-8 text-left">
              <p className="text-sm text-slate-400 mb-1">Network: <span className="font-semibold text-white">{requestDetails?.isp}</span></p>
              <p className="text-sm text-slate-400 mb-1">Bundle: <span className="font-semibold text-white">{requestDetails?.dataBundle}</span></p>
              <p className="text-sm text-slate-400">Phone: <span className="font-semibold text-white">{requestDetails?.phoneNumber}</span></p>
            </div>

            <Link to={user ? "/dashboard" : "/"} className="w-full block py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors">
              Return Home
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center animate-in zoom-in">
            <XCircle className="w-20 h-20 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-red-400 mb-8 p-4 bg-red-500/10 rounded-xl">{errorMsg}</p>

            <Link to={user ? "/dashboard" : "/"} className="w-full block py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors">
              Go Back
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
