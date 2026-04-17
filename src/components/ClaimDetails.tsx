import { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Archive,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Building2,
  AlertCircle,
  FileText,
  MessageCircle
} from 'lucide-react';
import { Claim, ClaimStatus } from '../types';
import { cn } from '../lib/utils';
import { claimsService } from '../services/claimsService';
import { whatsappService } from '../services/whatsappService';
import ReportPrint from './ReportPrint';

interface ClaimDetailsProps {
  claim: Claim;
  onBack: () => void;
}

export default function ClaimDetails({ claim, onBack }: ClaimDetailsProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    // Give state time to render the print component if it was unmounted
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 250);
  };

  const handleDelete = () => {
    if (confirm('¿Está seguro de eliminar este reclamo? Esta acción no se puede deshacer.')) {
      claimsService.deleteClaim(claim.id);
      onBack();
    }
  };

  const getStatusDisplay = (status: ClaimStatus) => {
    switch (status) {
      case 'Pendiente':
        return { icon: Clock, label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
      case 'En Proceso':
        return { icon: ShieldCheck, label: 'En Proceso', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'Resuelto':
        return { icon: CheckCircle2, label: 'Resuelto', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
      case 'Archivado':
        return { icon: Archive, label: 'Archivado', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  const status = getStatusDisplay(claim.estado);

  return (
    <div className="space-y-6">
      {/* Container for the manual print method */}
      <div className="hidden print:block print-only print:static print:w-full">
        <ReportPrint claim={claim} />
      </div>

      <div className="flex items-center justify-between no-print">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition font-medium"
        >
          <ArrowLeft size={20} /> Volver al listado
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="btn btn-outline flex items-center gap-2"
          >
            <Printer size={16} /> Imprimir
          </button>
          <button 
            onClick={() => whatsappService.sendNewClaimAlert(claim)}
            className="btn btn-primary flex items-center gap-2 bg-[#25D366] border-[#25D366] hover:bg-[#128C7E] hover:border-[#128C7E] shadow-md shadow-green-500/20"
          >
            <MessageCircle size={16} /> WhatsApp
          </button>
          <button 
             onClick={handleDelete}
             className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-xl border border-border-subtle shadow-sm relative overflow-hidden">
            <div className={cn("absolute top-0 right-0 px-6 py-2 rounded-bl-2xl font-bold uppercase tracking-widest text-xs border-b border-l", status.color, status.bg, status.border)}>
              {status.label}
            </div>
            
            <div className="mb-8">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-1">Expediente Oficial</p>
              <h1 className="text-4xl font-extrabold text-slate-900">{claim.expediente}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 border-b border-sidebar-bg/5 pb-2 flex items-center gap-2">
                   Denunciante
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Nombre completo</p>
                    <p className="font-semibold text-slate-800 text-lg">{claim.denuncianteNombre}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">DNI / CUIL</p>
                      <p className="font-medium text-slate-700">{claim.denuncianteDni}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Fecha Ingreso</p>
                      <p className="font-medium text-slate-700">{new Date(claim.fecha).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone size={16} className="text-primary" /> {claim.denuncianteTelefono}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail size={16} className="text-primary" /> {claim.denuncianteEmail}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin size={16} className="text-primary" /> {claim.denuncianteDireccion}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 border-b border-sidebar-bg/5 pb-2 flex items-center gap-2">
                   Empresa Denunciada
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Nombre de Empresa</p>
                    <p className="font-semibold text-slate-800 text-lg">{claim.empresaDenunciada}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Motivo del Reclamo</p>
                    <div className="mt-1 flex items-center gap-2 px-3 py-1 bg-slate-100 rounded text-sm text-slate-700 font-medium">
                      <MessageSquare size={14} className="text-slate-400" /> {claim.motivo}
                    </div>
                  </div>
                  {claim.monto > 0 && (
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Monto del Reclamo</p>
                      <p className="font-bold text-amber-600 text-xl">${claim.monto.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                 Detalle y Descripción
              </h3>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{claim.detalle}</p>
              </div>
            </div>

            {claim.observaciones && (
              <div className="mt-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Observaciones Internas</h3>
                <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100/50 italic text-sm text-slate-600">
                  {claim.observaciones}
                </div>
              </div>
            )}
          </div>

          {/* Photos Grid */}
          <div className="bg-white p-8 rounded-xl border border-border-subtle shadow-sm">
            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
              <FileText size={20} className="text-primary" /> Documentación Adjunta
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {claim.fotos.map((foto, i) => (
                <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-zoom-in">
                  <img 
                    src={foto} 
                    alt={`Documento ${i+1}`} 
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // If it fails to load as an image, we can indicate it or provide a generic icon
                      (e.target as HTMLImageElement).src = "https://picsum.photos/seed/error/400/400?blur=5";
                    }}
                  />
                  <div 
                    onClick={() => window.open(foto.replace('/uc?export=view&id=', '/open?id='), '_blank')}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  >
                    <Download className="text-white" size={24} />
                  </div>
                </div>
              ))}
              {claim.fotos.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
                  <p className="text-slate-400 text-sm">No se adjuntaron imágenes a este reclamo.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Status / Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Estado del Trámite</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-2 h-12 rounded-full", status.bg)}></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Estado Actual</p>
                  <p className={cn("font-bold text-lg", status.color)}>{status.label}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cambiar a:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Pendiente', 'En Proceso', 'Resuelto', 'Archivado'].filter(s => s !== claim.estado).map(s => (
                    <button 
                      key={s}
                      onClick={() => {
                        claimsService.saveClaim({ ...claim, estado: s as any });
                        onBack();
                      }}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold uppercase hover:bg-slate-100 transition text-slate-600"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sidebar-bg p-6 rounded-xl shadow-xl text-white">
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-white/40">Acciones Directas</h3>
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary rounded-lg font-bold hover:opacity-90 transition"
                onClick={() => window.open(`https://wa.me/${claim.denuncianteTelefono}`, '_blank')}
              >
                <Phone size={18} /> Llamar Denunciante
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 rounded-lg font-bold hover:bg-white/20 transition">
                <Mail size={18} /> Enviar Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
