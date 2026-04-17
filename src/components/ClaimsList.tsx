import { useState, useMemo, useEffect } from 'react';
import { 
  Eye, 
  Search, 
  MoreHorizontal, 
  Filter, 
  ArrowUpDown,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Archive,
  Download,
  CheckCircle2
} from 'lucide-react';
import { claimsService } from '../services/claimsService';
import { Claim, ClaimStatus } from '../types';
import { cn } from '../lib/utils';
import ClaimDetails from './ClaimDetails';

interface ClaimsListProps {
  isSearchMode?: boolean;
}

export default function ClaimsList({ isSearchMode = false }: ClaimsListProps) {
  const [claims, setClaims] = useState<Claim[]>(claimsService.getClaims());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'Todos'>('Todos');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await claimsService.fetchFromGAS();
      setClaims(data);
    } catch (err) {
      setError("No se pudieron cargar los datos de Google Sheets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesSearch = 
        claim.expediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.denuncianteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.denuncianteDni.includes(searchTerm) ||
        claim.empresaDenunciada.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'Todos' || claim.estado === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [claims, searchTerm, statusFilter]);

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'Pendiente':
        return <span className="px-2 py-1 rounded bg-[#fef3c7] text-[#92400e] text-[0.7rem] font-bold uppercase tracking-wider">Pendiente</span>;
      case 'En Proceso':
        return <span className="px-2 py-1 rounded bg-[#e6f0fa] text-[#004a99] text-[0.7rem] font-bold uppercase tracking-wider">En Trámite</span>;
      case 'Resuelto':
        return <span className="px-2 py-1 rounded bg-[#dcfce7] text-[#166534] text-[0.7rem] font-bold uppercase tracking-wider">Cerrado</span>;
      case 'Archivado':
        return <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[0.7rem] font-bold uppercase tracking-wider">Archivado</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      Baja: 'text-slate-400',
      Media: 'text-warning',
      Alta: 'text-red-500',
      Urgente: 'text-red-700',
    };
    return (
      <span className="flex items-center justify-center gap-1.5 text-[0.85rem] font-medium text-text-main">
        <span className={cn("text-lg leading-none", colors[priority as keyof typeof colors])}>●</span>
        {priority}
      </span>
    );
  };

  if (selectedClaim) {
    return <ClaimDetails claim={selectedClaim} onBack={() => {
      setSelectedClaim(null);
      setClaims(claimsService.getClaims());
    }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isSearchMode ? 'Buscador de Reclamos' : 'Listado de Reclamos'}</h1>
          <p className="text-slate-500 text-sm">Gestioná todos los expedientes ingresados.</p>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <span className="text-red-500 text-xs font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 italic">
              {error}
            </span>
          )}
          <button 
            onClick={loadData}
            disabled={loading}
            className={cn(
              "flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            <Clock size={16} className={cn(loading && "animate-spin")} /> 
            {loading ? 'Sincronizando...' : 'Actualizar'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            <Download size={16} /> Exportar Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border-subtle overflow-hidden flex flex-col flex-1">
        {/* Table Filters */}
        <div className="p-4 border-b border-border-subtle flex flex-wrap items-center justify-between gap-4 bg-white">
          <h2 className="text-[1.1rem] font-bold text-text-main px-2">Reclamos Recientes</h2>
          <div className="flex items-center gap-3">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input 
                type="text" 
                placeholder="Filtrar por DNI o empresa..." 
                className="pl-10 pr-4 py-2 bg-[#f8fafc] border border-border-subtle rounded-lg text-sm outline-none transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-white border border-border-subtle rounded-lg px-3 py-2 text-sm outline-none font-medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="Todos">Filtro: Todos</option>
              <option value="Pendiente">Pendientes</option>
              <option value="En Proceso">En Trámite</option>
              <option value="Resuelto">Cerrados</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-text-muted text-[0.7rem] font-bold uppercase tracking-wider">
                <th className="px-6 py-3 border-b border-border-subtle">Expediente</th>
                <th className="px-6 py-3 border-b border-border-subtle">Denunciante</th>
                <th className="px-6 py-3 border-b border-border-subtle">Empresa</th>
                <th className="px-6 py-3 border-b border-border-subtle">Fecha</th>
                <th className="px-6 py-3 border-b border-border-subtle text-center">Estado</th>
                <th className="px-6 py-3 border-b border-border-subtle text-center">Prioridad</th>
                <th className="px-6 py-3 border-b border-border-subtle text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredClaims.map((claim) => (
                <tr 
                  key={claim.id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer text-[0.875rem]"
                  onClick={() => setSelectedClaim(claim)}
                >
                  <td className="px-6 py-3 whitespace-nowrap font-bold text-primary">
                    #{claim.expediente}
                  </td>
                  <td className="px-6 py-3 font-semibold text-text-main">
                    {claim.denuncianteNombre}
                  </td>
                  <td className="px-6 py-3 text-text-main font-medium">
                    {claim.empresaDenunciada}
                  </td>
                  <td className="px-6 py-3 text-text-muted">
                    {new Date(claim.fecha).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {getStatusBadge(claim.estado)}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {getPriorityBadge(claim.prioridad)}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="btn btn-outline py-1 px-3">Ver</button>
                  </td>
                </tr>
              ))}
              {filteredClaims.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Search size={40} className="mb-2 opacity-20" />
                      <p className="font-medium">No se encontraron reclamos</p>
                      <p className="text-xs">Probá con otros filtros o términos de búsqueda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-500">Mostrando {filteredClaims.length} de {claims.length} resultados</p>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded border border-slate-200 bg-white text-slate-400 disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">1</button>
            <button className="p-1 rounded border border-slate-200 bg-white text-slate-400 disabled:opacity-50" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
