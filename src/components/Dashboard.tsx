import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar as CalendarIcon,
  TrendingUp,
  Building2
} from 'lucide-react';
import { claimsService } from '../services/claimsService';
import { DashboardStats } from '../types';

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await claimsService.fetchFromGAS();
      setStats(claimsService.getStats());
    };
    loadData();
  }, []);

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>
          <p className="text-slate-500 text-sm">Resumen de actividad y métricas clave.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <span className="stat-label">Total Reclamos</span>
          <span className="stat-value">{stats.totalClaims}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Pendientes</span>
          <span className="stat-value">{stats.pendingClaims}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Resueltos</span>
          <span className="stat-value">{stats.resolvedClaims}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Tasa de Éxito</span>
          <span className="stat-value">
            {stats.totalClaims > 0 ? Math.round((stats.resolvedClaims / stats.totalClaims) * 100) : 0}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tendencia Mensual</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#004a99" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Empresas más Denunciadas</h3>
          <div className="space-y-4">
            {stats.topEmpresas.map((empresa, idx) => (
              <div key={empresa.name} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Building2 size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-700">{empresa.name}</span>
                    <span className="text-sm font-bold text-primary">{empresa.count} reclamos</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${(empresa.count / stats.totalClaims) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {stats.topEmpresas.length === 0 && (
              <p className="text-center text-slate-400 py-12">No hay datos suficientes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
