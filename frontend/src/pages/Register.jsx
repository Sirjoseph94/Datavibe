import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Sun, Moon, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, theme, toggleTheme } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      const loginRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        login(loginData);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background glow effects */}
      <div className={`absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-emerald-950/10' : 'bg-emerald-100/20'
      }`}></div>
      <div className={`absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-green-950/10' : 'bg-green-100/20'
      }`}></div>

      {/* Floating Header Controls */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
        <Link 
          to="/" 
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
            theme === 'dark' ? 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800' : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        
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

      <div className={`w-full max-w-md p-8 rounded-3xl border shadow-xl transition-all duration-300 relative z-10 ${
        theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/40 backdrop-blur-md' : 'bg-white border-slate-200 shadow-slate-200/50'
      }`}>
        <h2 className="text-2xl font-black mb-1 text-center">Create Account</h2>
        <p className={`text-xs text-center mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Start your instant data top-up journey</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3.5 rounded-xl mb-6 text-xs text-left font-semibold">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium text-sm ${
                theme === 'dark' 
                  ? 'bg-slate-950/70 border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
              }`}
              required 
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium text-sm ${
                theme === 'dark' 
                  ? 'bg-slate-950/70 border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
              }`}
              required 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold shadow-md shadow-emerald-500/10 flex items-center justify-center disabled:opacity-70 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
          </button>
        </form>
        
        <div className={`mt-6 text-center text-xs ${theme === 'dark' ? 'text-slate-405' : 'text-slate-505'}`}>
          Already have an account? <Link to="/login" className="text-emerald-500 hover:text-emerald-650 font-bold ml-1">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
