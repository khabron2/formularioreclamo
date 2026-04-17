export type ClaimStatus = 'Pendiente' | 'En Proceso' | 'Resuelto' | 'Archivado';
export type ClaimPriority = 'Baja' | 'Media' | 'Alta' | 'Urgente';

export interface Claim {
  id: string;
  expediente: string;
  fecha: string;
  denuncianteNombre: string;
  denuncianteDni: string;
  denuncianteTelefono: string;
  denuncianteEmail: string;
  denuncianteDireccion: string;
  empresaDenunciada: string;
  motivo: string;
  detalle: string;
  monto: number;
  estado: ClaimStatus;
  prioridad: ClaimPriority;
  observaciones: string;
  fotos: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Empleado' | 'Solo Lectura';
}

export interface DashboardStats {
  totalClaims: number;
  pendingClaims: number;
  resolvedClaims: number;
  todayClaims: number;
  topEmpresas: { name: string; count: number }[];
  monthlyData: { month: string; count: number }[];
}
