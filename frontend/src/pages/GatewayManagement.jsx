import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, CheckCircle2, ShieldAlert, Check, ToggleLeft, ToggleRight, Eye, EyeOff } from 'lucide-react';

export default function GatewayManagement() {
  const { user, theme } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  // Track credentials form inputs per gateway
  const [configs, setConfigs] = useState({});
  const [showSecret, setShowSecret] = useState({});

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gateways/admin`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch configurations');
      
      const data = await res.json();
      setGateways(data);
      
      // Initialize configs state
      const initialConfigs = {};
      data.forEach(gw => {
        try {
          initialConfigs[gw.id] = gw.config ? JSON.parse(gw.config) : {};
        } catch (e) {
          initialConfigs[gw.id] = {};
        }
      });
      setConfigs(initialConfigs);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error loading gateways');
      setLoading(false);
    }
  };

  const handleToggleActive = async (gw) => {
    try {
      setSavingId(gw.id);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gateways/admin/${gw.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          isActive: !gw.isActive
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update gateway status');
      
      // Update local state
      setGateways(gateways.map(g => g.id === gw.id ? data.gateway : g));
      setMessage(`Successfully toggled ${gw.displayName} active status.`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 4000);
    } finally {
      setSavingId(null);
    }
  };

  const handleSetDefault = async (gw) => {
    try {
      setSavingId(gw.id);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gateways/admin/${gw.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          isDefault: true
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to set default gateway');
      
      // Re-fetch because default updates other gateways in background
      await fetchGateways();
      setMessage(`${gw.displayName} is now set as the default gateway.`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 4000);
    } finally {
      setSavingId(null);
    }
  };

  const handleConfigChange = (gwId, field, value) => {
    setConfigs({
      ...configs,
      [gwId]: {
        ...configs[gwId],
        [field]: value
      }
    });
  };

  const handleSaveConfig = async (gw) => {
    try {
      setSavingId(gw.id);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gateways/admin/${gw.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          config: configs[gw.id]
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save configuration');
      
      // Update local state
      setGateways(gateways.map(g => g.id === gw.id ? data.gateway : g));
      setMessage(`Successfully updated ${gw.displayName} credentials.`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 4000);
    } finally {
      setSavingId(null);
    }
  };

  const toggleShowSecret = (gwId, field) => {
    const key = `${gwId}_${field}`;
    setShowSecret({
      ...showSecret,
      [key]: !showSecret[key]
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 md:p-10 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background decoration */}
      <div className={`absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-emerald-950/10' : 'bg-emerald-100/10'
      }`}></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back and Page Title Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Link 
              to="/super-admin" 
              className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                theme === 'dark' 
                  ? 'border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900' 
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-emerald-500">
                Payment Gateways
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Manage checkout gateways and credentials</p>
            </div>
          </div>
        </header>

        {/* Global Notifications */}
        {message && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2 text-sm font-semibold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 flex items-center gap-2 text-sm font-semibold animate-fadeIn">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Gateway List */}
        <div className="grid grid-cols-1 gap-8">
          {gateways.map((gw) => {
            const gwConfig = configs[gw.id] || {};
            const isMonnify = gw.name === 'monnify';
            const isSaving = savingId === gw.id;

            return (
              <div 
                key={gw.id}
                className={`p-6 rounded-3xl border shadow-xl transition-all duration-300 flex flex-col ${
                  theme === 'dark' 
                    ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/20' 
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                {/* Gateway Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/10 pb-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{gw.displayName}</h2>
                      {gw.isDefault && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isMonnify ? 'Sub-account collection & card/account payouts' : 'Standard card and bank transfer gateway'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Default Button */}
                    {!gw.isDefault && (
                      <button
                        onClick={() => handleSetDefault(gw)}
                        disabled={isSaving || !gw.isActive}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          theme === 'dark'
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40'
                        }`}
                      >
                        Set Default
                      </button>
                    )}

                    {/* Active Status toggle */}
                    <button
                      onClick={() => handleToggleActive(gw)}
                      disabled={isSaving}
                      className="focus:outline-none flex items-center transition-opacity hover:opacity-90 active:scale-95"
                      aria-label="Toggle active status"
                    >
                      {gw.isActive ? (
                        <ToggleRight className="w-10 h-10 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Gateway credentials form */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-wide uppercase text-emerald-500">API Credentials</h3>
                  
                  {isMonnify ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* API Key */}
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Monnify API Key
                        </label>
                        <input
                          type="text"
                          value={gwConfig.apiKey || ''}
                          onChange={(e) => handleConfigChange(gw.id, 'apiKey', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                            theme === 'dark'
                              ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                              : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                          }`}
                          placeholder="MK_PROD_..."
                        />
                      </div>

                      {/* Contract Code */}
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Monnify Contract Code
                        </label>
                        <input
                          type="text"
                          value={gwConfig.contractCode || ''}
                          onChange={(e) => handleConfigChange(gw.id, 'contractCode', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                            theme === 'dark'
                              ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                              : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                          }`}
                          placeholder="6266097631"
                        />
                      </div>

                      {/* Secret Key */}
                      <div className="md:col-span-2">
                        <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Monnify Secret Key
                        </label>
                        <div className="relative">
                          <input
                            type={showSecret[`${gw.id}_secretKey`] ? 'text' : 'password'}
                            value={gwConfig.secretKey || ''}
                            onChange={(e) => handleConfigChange(gw.id, 'secretKey', e.target.value)}
                            className={`w-full pl-4 pr-12 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                              theme === 'dark'
                                ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                            }`}
                            placeholder="Monnify API Secret Key"
                          />
                          <button
                            type="button"
                            onClick={() => toggleShowSecret(gw.id, 'secretKey')}
                            className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 focus:outline-none"
                          >
                            {showSecret[`${gw.id}_secretKey`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Sandbox mode */}
                      <div className="md:col-span-2 flex items-center gap-2.5 py-2">
                        <input
                          id={`sandbox-${gw.id}`}
                          type="checkbox"
                          checked={gwConfig.isSandbox !== false}
                          onChange={(e) => handleConfigChange(gw.id, 'isSandbox', e.target.checked)}
                          className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500/20 border-slate-700 bg-slate-950 focus:ring-offset-0 focus:outline-none"
                        />
                        <label 
                          htmlFor={`sandbox-${gw.id}`}
                          className={`text-sm font-semibold select-none cursor-pointer ${
                            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          Enable Sandbox Mode (Testing)
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Paystack Secret Key */}
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Paystack Secret Key
                        </label>
                        <div className="relative">
                          <input
                            type={showSecret[`${gw.id}_secretKey`] ? 'text' : 'password'}
                            value={gwConfig.secretKey || ''}
                            onChange={(e) => handleConfigChange(gw.id, 'secretKey', e.target.value)}
                            className={`w-full pl-4 pr-12 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                              theme === 'dark'
                                ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                            }`}
                            placeholder="sk_test_..."
                          />
                          <button
                            type="button"
                            onClick={() => toggleShowSecret(gw.id, 'secretKey')}
                            className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 focus:outline-none"
                          >
                            {showSecret[`${gw.id}_secretKey`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => handleSaveConfig(gw)}
                      disabled={isSaving}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-550 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-40"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Save Configuration
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
