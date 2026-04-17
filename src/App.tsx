/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  PlusCircle, 
  Search, 
  Settings, 
  Home, 
  LogOut,
  User,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import Dashboard from './components/Dashboard';
import ClaimsList from './components/ClaimsList';
import { User as UserType } from './types';
import { claimsService } from './services/claimsService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'reclamos' | 'buscar' | 'informes' | 'configuracion'>('inicio');
  const [user, setUser] = useState<UserType | null>({
    id: '1',
    name: 'Admin User',
    email: 'admin@defensa.gob.ar',
    role: 'Administrador'
  });

  const sidebarItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'reclamos', label: 'Reclamos', icon: Layers },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'informes', label: 'Informes', icon: FileText },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  useEffect(() => {
    // Initial sync from Google Apps Script
    claimsService.fetchFromGAS();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Acceso al Sistema</h1>
          <button 
            onClick={() => setUser({ id: '1', name: 'Admin', email: 'admin@defensa.gob.ar', role: 'Administrador' })}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Iniciar Sesión (Demo)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-main text-text-main font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-sidebar-bg text-white flex flex-col shrink-0 no-print">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
            <h1 className="text-white font-bold text-lg uppercase tracking-wider">Defensa AR</h1>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-6 py-3 text-[0.9rem] font-medium transition-all duration-200 border-l-4",
                    activeTab === item.id 
                      ? "bg-white/5 text-white border-primary" 
                      : "border-transparent text-white/70 hover:text-white"
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center text-[0.75rem] font-bold text-white uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-[0.85rem] font-semibold text-white truncate">{user.name}</p>
              <p className="text-[0.7rem] text-text-muted truncate uppercase tracking-wider">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={() => setUser(null)}
            className="flex items-center gap-2 text-[0.7rem] text-white/40 hover:text-red-400 transition-colors uppercase tracking-widest font-bold"
          >
            <LogOut size={12} />
            Cerrar sesión
          </button>
          <div className="mt-4 text-[0.7rem] color-white/40 opacity-40">v2.4.0 • Google Apps Script</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 print:overflow-visible">
        {/* Header */}
        <header className="h-16 bg-white border-b border-border-subtle flex items-center justify-between px-8 shrink-0 no-print">
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              placeholder="Buscar por DNI o Expediente..." 
              className="px-4 py-2 bg-[#f1f5f9] border border-border-subtle rounded-lg text-sm outline-none transition-all w-[300px]"
              onFocus={() => activeTab !== 'buscar' && setActiveTab('buscar')}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[0.85rem] font-semibold text-text-main">{user.name}</div>
              <div className="text-[0.7rem] text-text-muted uppercase tracking-wider">
                {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-[0.75rem] font-bold text-white uppercase">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {activeTab === 'inicio' && <Dashboard />}
              {activeTab === 'reclamos' && <ClaimsList />}
              {activeTab === 'buscar' && <ClaimsList isSearchMode={true} />}
              {activeTab === 'informes' && (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
                  <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                  <h2 className="text-xl font-bold text-slate-800">Sección de Informes</h2>
                  <p className="text-slate-500 mt-2">Seleccione un reclamo desde la lista para generar su informe oficial.</p>
                </div>
              )}
              {activeTab === 'configuracion' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800 mb-6">Configuración del Sistema</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Números de WhatsApp para Alertas (uno por línea)</label>
                      <textarea 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="3834465044"
                        defaultValue="3834465044"
                        id="whatsapp-config"
                      />
                      <p className="mt-2 text-xs text-slate-400 italic">Ejemplo: 3834465044 (sin espacios ni símbolos)</p>
                    </div>
                    <button 
                      onClick={() => {
                        const val = (document.getElementById('whatsapp-config') as HTMLTextAreaElement).value;
                        localStorage.setItem('whatsapp_notification_numbers', val);
                        alert('Configuración guardada correctamente.');
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
