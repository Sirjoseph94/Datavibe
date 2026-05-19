import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader2, LogOut, TrendingUp, Users, CheckSquare, DollarSign, Activity, Clock, Shield, Wifi, Sun, Moon, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const getNetworkColor = (networkName) => {
  const name = String(networkName).toLowerCase();
  if (name.includes('mtn')) return '#FDB913';
  if (name.includes('airtel')) return '#ED1C24';
  if (name.includes('glo')) return '#22B14C';
  if (name.includes('9mobile')) return '#8CC63F';
  return '#64748B';
};

export default function SuperAdminDashboard() {
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stats`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!stats) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-305 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
      </div>
    );
  }

  // Dynamic colors for Recharts based on active theme
  const chartGridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  const chartTickColor = theme === 'dark' ? '#94a3b8' : '#475569';
  const tooltipBg = theme === 'dark' ? '#0f172a' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#1e293b' : '#cbd5e1';
  const tooltipTextColor = theme === 'dark' ? '#f8fafc' : '#0f172a';

  return (
    <div className={`min-h-screen p-6 md:p-10 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background decoration */}
      <div className={`absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-indigo-955/10' : 'bg-indigo-100/10'
      }`}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header panel */}
        <header className={`flex justify-between items-center flex-wrap gap-4 mb-10 p-5 rounded-2xl border transition-all duration-305 ${
          theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/20' : 'bg-white border-slate-200 shadow-sm'
        } backdrop-blur-md`}>
          <div>
            <h1 className="text-2xl font-black text-emerald-500">
              Super Admin HQ
            </h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>System Overview & Analytics</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/manage-admins" className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-550 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">
              <Shield className="w-4 h-4" /> Manage Admins
            </Link>
            <Link to="/manage-bundles" className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-550 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">
              <Wifi className="w-4 h-4" /> Manage Bundles
            </Link>
            <Link to="/manage-gateways" className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-550 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">
              <Settings className="w-4 h-4" /> Manage Gateways
            </Link>
            <Link to="/admin" className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
              theme === 'dark' ? 'border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}>
              Admin View
            </Link>
            
            <button 
              type="button"
              onClick={toggleTheme} 
              className={`p-2 rounded-xl border transition-all active:scale-90 ${
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

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-10">
          {[
            { label: 'Total Requests', value: stats.totalRequests, icon: <Users className="w-5 h-5 text-blue-500"/>, baseColor: 'blue' },
            { label: 'Total Treated', value: stats.totalTreated, icon: <CheckSquare className="w-5 h-5 text-emerald-500"/>, baseColor: 'emerald' },
            { label: 'Total Pending', value: stats.totalPending, icon: <Loader2 className="w-5 h-5 text-amber-500 animate-spin"/>, baseColor: 'amber' },
            { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-indigo-500"/>, baseColor: 'indigo' },
            { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: <Activity className="w-5 h-5 text-fuchsia-500"/>, baseColor: 'fuchsia' },
            { label: 'Avg Time (hrs)', value: stats.averageCompletionTimeHours, icon: <Clock className="w-5 h-5 text-teal-500"/>, baseColor: 'teal' },
          ].map((stat, i) => (
            <div 
              key={i} 
              className={`p-5 rounded-3xl border shadow-md flex flex-col md:flex-row items-center gap-4 transition-all hover:-translate-y-0.5 ${
                theme === 'dark' 
                  ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/20' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className={`p-2.5 rounded-2xl shrink-0 ${
                theme === 'dark' ? 'bg-slate-950 border border-slate-800' : 'bg-slate-100 border border-slate-200'
              }`}>
                {stat.icon}
              </div>
              <div className="text-center md:text-left">
                <p className={`text-xs font-semibold mb-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                <h3 className="text-xl font-extrabold">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Revenue By ISP Bar Chart */}
          <div className={`p-6 rounded-3xl border shadow-xl transition-all duration-300 ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/20' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h2 className="text-lg font-bold mb-6">Revenue by Network (₦)</h2>
            <div className="h-72">
              {stats.revenueByIsp && stats.revenueByIsp.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.revenueByIsp} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                    <XAxis dataKey="name" stroke={chartTickColor} tickLine={false} axisLine={false} className="text-xs font-bold" />
                    <YAxis stroke={chartTickColor} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value.toLocaleString()}`} className="text-xs font-bold" />
                    <Tooltip cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f1f5f9' }} contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px', color: tooltipTextColor, fontSize: '12px', fontWeight: 'bold' }} />
                    <Bar dataKey="revenue" fill="#34d399" radius={[6, 6, 0, 0]}>
                      {stats.revenueByIsp.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={getNetworkColor(entry.name)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 italic">No revenue data available</div>
              )}
            </div>
          </div>

          {/* Request Volume by ISP Pie Chart */}
          <div className={`p-6 rounded-3xl border shadow-xl transition-all duration-300 ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/20' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h2 className="text-lg font-bold mb-6">Request Volume Distribution</h2>
            <div className="h-72">
              {stats.ispTrends && stats.ispTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.ispTrends} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                      {stats.ispTrends.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={getNetworkColor(entry.name)} stroke={theme === 'dark' ? '#0f172a' : '#ffffff'} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px', color: tooltipTextColor, fontSize: '12px', fontWeight: 'bold' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" className="text-xs font-bold" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 italic">No volume data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Top Admins */}
        <div className={`p-6 rounded-3xl border shadow-xl transition-all duration-300 ${
          theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-slate-950/20' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-emerald-500"/> Top Performing Admins
          </h2>
          {stats.topAdmins.length === 0 ? (
            <p className="text-slate-500 italic text-sm">No admins have treated requests yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.topAdmins.map((admin, idx) => (
                <div key={idx} className={`flex items-center justify-between p-5 rounded-2xl border transition-colors ${
                  theme === 'dark' ? 'bg-slate-950/40 border-slate-800 hover:bg-slate-950/80' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-emerald-500/10">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{admin.username}</p>
                      <p className="text-emerald-500 text-xs font-semibold">{admin.handledCount} requests treated</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
