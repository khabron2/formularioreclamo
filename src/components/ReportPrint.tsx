import { forwardRef } from 'react';
import { Claim } from '../types';

interface ReportPrintProps {
  claim: Claim;
}

const ReportPrint = forwardRef<HTMLDivElement, ReportPrintProps>(({ claim }, ref) => {
  return (
    <div ref={ref} className="p-12 text-slate-900 font-serif max-w-[800px] mx-auto bg-white">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold uppercase tracking-tight">Defensa del Consumidor</h1>
          <p className="text-sm font-medium">Ministerio de Justicia y Derechos Humanos</p>
          <p className="text-xs text-slate-600">Dirección Nacional de Defensa del Consumidor y Arbitraje de Consumo</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-slate-300 mb-1">{claim.expediente}</div>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Informe de Reclamo</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        <div className="flex justify-between items-baseline">
          <div className="text-sm italic">Fecha de emisión: {new Date().toLocaleDateString()}</div>
          <div className="text-sm font-bold">Estado: {claim.estado.toUpperCase()}</div>
        </div>

        {/* Section: Denunciante */}
        <div className="border border-slate-200 p-6 rounded">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">I. DATOS DEL DENUNCIANTE</h2>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div><span className="font-bold">Nombre:</span> {claim.denuncianteNombre}</div>
            <div><span className="font-bold">DNI:</span> {claim.denuncianteDni}</div>
            <div><span className="font-bold">Teléfono:</span> {claim.denuncianteTelefono}</div>
            <div><span className="font-bold">Email:</span> {claim.denuncianteEmail}</div>
            <div className="col-span-2"><span className="font-bold">Dirección:</span> {claim.denuncianteDireccion}</div>
          </div>
        </div>

        {/* Section: Empresa */}
        <div className="border border-slate-200 p-6 rounded">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">II. DATOS DE LA EMPRESA DENUNCIADA</h2>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div><span className="font-bold">Empresa:</span> {claim.empresaDenunciada}</div>
            <div><span className="font-bold">Motivo:</span> {claim.motivo}</div>
            <div className="col-span-2"><span className="font-bold">Monto del reclamo:</span> ${claim.monto.toLocaleString()}</div>
          </div>
        </div>

        {/* Section: Hechos */}
        <div className="border border-slate-200 p-6 rounded">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">III. RELATO DE LOS HECHOS</h2>
          <p className="text-sm leading-relaxed text-justify whitespace-pre-wrap">{claim.detalle}</p>
        </div>

        {/* Section: Observaciones */}
        {claim.observaciones && (
          <div className="border border-slate-200 p-6 rounded bg-slate-50/20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">IV. OBSERVACIONES ADICIONALES</h2>
            <p className="text-sm italic">{claim.observaciones}</p>
          </div>
        )}

        {/* Photos in report */}
        {claim.fotos.length > 0 && (
          <div className="break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">V. DOCUMENTACIÓN ADJUNTA</h2>
            <div className="grid grid-cols-2 gap-4">
              {claim.fotos.slice(0, 4).map((foto, i) => {
                if (!foto) return null;
                return (
                  <div key={i} className="border border-slate-300 p-1 rounded">
                    <img 
                      src={foto} 
                      alt="" 
                      className="w-full h-40 object-contain bg-slate-50" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {claim.fotos.length > 4 && (
              <p className="text-[10px] italic mt-2 text-right">Se han adjuntado {claim.fotos.length} imágenes adicionales.</p>
            )}
          </div>
        )}
      </div>

      {/* Footer / Signatures */}
      <div className="mt-24 grid grid-cols-2 gap-24 pt-12">
        <div className="border-t border-slate-400 pt-2 text-center text-xs">
          <p className="font-bold">{claim.denuncianteNombre}</p>
          <p>Firma del Denunciante</p>
        </div>
        <div className="border-t border-slate-400 pt-2 text-center text-xs">
          <p className="font-bold">Firma y Sello</p>
          <p>Autoridad de Aplicación</p>
        </div>
      </div>
    </div>
  );
});

ReportPrint.displayName = 'ReportPrint';

export default ReportPrint;
