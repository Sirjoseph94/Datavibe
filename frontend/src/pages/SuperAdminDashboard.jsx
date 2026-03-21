import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader2, LogOut, TrendingUp, Users, CheckSquare, DollarSign, Activity, Clock, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f472b6'];

export default function SuperAdminDashboard() {
  const { user, logout } = useContext(AuthContext);
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

  if (!stats) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><Loader2 className="animate-spin w-8 h-8" /></div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex justify-between items-center flex-wrap gap-4 mb-10 bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-xl">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Super Admin HeadQuarters</h1>
            <p className="text-slate-400 text-sm mt-1">System Overview & Analytics</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/manage-admins" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-semibold shadow-lg">
              <Shield className="w-5 h-5" /> Manage Admins
            </Link>
            <Link to="/admin" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 border border-indigo-500/30 rounded-xl transition-all font-semibold">
              Go to Admin View
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-red-500/80 rounded-xl transition-all font-semibold shadow-lg">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
          {[
            { label: 'Total Requests', value: stats.totalRequests, icon: <Users className="w-6 h-6 text-blue-400"/>, bg: 'bg-blue-500/10' },
            { label: 'Total Treated', value: stats.totalTreated, icon: <CheckSquare className="w-6 h-6 text-emerald-400"/>, bg: 'bg-emerald-500/10' },
            { label: 'Total Pending', value: stats.totalPending, icon: <Loader2 className="w-6 h-6 text-amber-400"/>, bg: 'bg-amber-500/10' },
            { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-6 h-6 text-indigo-400"/>, bg: 'bg-indigo-500/10' },
            { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: <Activity className="w-6 h-6 text-fuchsia-400"/>, bg: 'bg-fuchsia-500/10' },
            { label: 'Avg Time (hrs)', value: stats.averageCompletionTimeHours, icon: <Clock className="w-6 h-6 text-teal-400"/>, bg: 'bg-teal-500/10' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} border border-slate-700/50 p-6 rounded-3xl shadow-lg backdrop-blur-sm flex flex-col md:flex-row items-center gap-4 hover:-translate-y-1 transition-transform`}>
              <div className="p-3 bg-slate-800 rounded-2xl shadow-inner shrink-0">
                {stat.icon}
              </div>
              <div className="text-center md:text-left">
                <p className="text-slate-400 text-xs font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Revenue By ISP Bar Chart */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-slate-100">Revenue by Network (₦)</h2>
            <div className="h-72">
              {stats.revenueByIsp && stats.revenueByIsp.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.revenueByIsp} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value}`} />
                    <Tooltip cursor={{ fill: '#334155' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }} />
                    <Bar dataKey="revenue" fill="#818cf8" radius={[6, 6, 0, 0]}>
                      {stats.revenueByIsp.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-slate-100">Request Volume Distribution</h2>
            <div className="h-72">
              {stats.ispTrends && stats.ispTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.ispTrends} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                      {stats.ispTrends.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 italic">No volume data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Top Admins */}
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><TrendingUp className="text-emerald-400"/> Top Performing Admins</h2>
          {stats.topAdmins.length === 0 ? (
            <p className="text-slate-400 italic">No admins have treated requests yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.topAdmins.map((admin, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-slate-700/30 hover:bg-slate-700/60 rounded-2xl border border-slate-600/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold shadow-lg">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{admin.username}</p>
                      <p className="text-emerald-400 text-sm font-medium">{admin.handledCount} requests treated</p>
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
