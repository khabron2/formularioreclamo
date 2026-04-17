import { Claim, DashboardStats } from '../types';
import { format, subMonths, startOfMonth } from 'date-fns';

const GAS_WEB_APP_URL = '/api/claims';

const transformDriveUrl = (url: string): string => {
  if (!url) return "";
  // Handle Google Drive links from forms
  // Common formats: 
  // 1. https://drive.google.com/open?id=FILE_ID
  // 2. https://drive.google.com/file/d/FILE_ID/view?usp=drivesdk
  const driveIdMatch = url.match(/(?:id=|d\/|file\/d\/)([\w-]{25,})/);
  if (driveIdMatch && driveIdMatch[1]) {
    const fileId = driveIdMatch[1];
    // This is a direct download link pattern for images in Drive
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  return url;
};

const STORAGE_KEY = 'defensa_consumidor_claims';

// Local cache for speed, will be synced with GAS
let cachedClaims: Claim[] = [];

/**
 * Note: To bypass CORS, usually GAS requires JSONP or we fetch from the proxy.
 * In the context of a Google Apps Script Web App, the standard browser fetch 
 * will work if the GAS script is set to "Anyone".
 */

export const claimsService = {
  fetchFromGAS: async () => {
    try {
      console.log("Fetching claims from GAS proxy...");
      const response = await fetch(GAS_WEB_APP_URL);
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        const text = await response.text();
        console.error("Failed to parse GAS response as JSON. Body:", text.substring(0, 100));
        throw new Error("El servidor devolvió un formato inválido (no es JSON).");
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }
      
      let data = responseData;
      console.log("Data received from GAS proxy:", data);
      
      // Standardize data from GAS (mapping Spanish headers to internal keys if necessary)
      if (Array.isArray(data)) {
        const mappedData = data.map((item: any) => ({
          id: item.id || Math.random().toString(36).substr(2, 9),
          expediente: item.expediente || item["Nº Expediente"] || item["Marca temporal"] || "",
          fecha: item.fecha || item["Marca temporal"] || new Date().toISOString(),
          denuncianteNombre: item.denuncianteNombre || item["NOMBRE Y APELLIDO"] || item.Nombre || "",
          denuncianteDni: item.denuncianteDni || item.DNI || "",
          denuncianteTelefono: item.denuncianteTelefono || item["TELÉFONO DE CONTACTO"] || item.Telefono || "",
          denuncianteEmail: item.denuncianteEmail || item["CORREO ELECTRÓNICO"] || item.Email || "",
          denuncianteDireccion: item.denuncianteDireccion || item["DIRECCIÓN EXACTA (O APROXIMADA) DEL COMERCIO"] || item.Direccion || "",
          empresaDenunciada: item.empresaDenunciada || item["NOMBRE DEL COMERCIO"] || item.Empresa || "",
          motivo: item.motivo || item["MOTIVO DE DENUNCIA"] || "",
          detalle: item.detalle || item["DESCRIBA BREVEMENTE EL MOTIVO"] || "",
          monto: Number(item.monto || item.Monto || 0),
          estado: item.estado || item.Estado || "Pendiente",
          prioridad: item.prioridad || item.Prioridad || "Media",
          observaciones: item.observaciones || item.Observaciones || "",
          fotos: [
            item["1) Insertar fotos de  (factura, ticket, presupuesto, etc)"],
            item["2) Insertar fotos de  (factura, ticket, presupuesto, etc)"],
            item["3) Insertar fotos de  (factura, ticket, presupuesto, etc)"]
          ].filter(Boolean).map(url => transformDriveUrl(url))
        }));
        
        cachedClaims = mappedData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedData));
        return mappedData;
      }
      return claimsService.getClaimsLocal();
    } catch (e) {
      console.error("Error syncing with GAS:", e);
      return claimsService.getClaimsLocal();
    }
  },

  getClaimsLocal: (): Claim[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getClaims: (): Claim[] => {
    if (cachedClaims.length > 0) return cachedClaims;
    return claimsService.getClaimsLocal();
  },

  saveClaim: async (claim: Claim) => {
    // Save locally first
    const claims = claimsService.getClaimsLocal();
    const index = claims.findIndex(c => c.id === claim.id);
    if (index >= 0) {
      claims[index] = claim;
    } else {
      claims.push(claim);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
    cachedClaims = claims;

    // Save to GAS
    try {
      console.log("Saving claim to GAS proxy...");
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(claim)
      });
      
      if (!response.ok) {
        console.warn("GAS proxy POST returned non-ok status:", response.status);
      }
    } catch (e) {
      console.error("Error saving to GAS proxy:", e);
    }
    
    return claim;
  },

  deleteClaim: (id: string) => {
    const claims = claimsService.getClaimsLocal();
    const filtered = claims.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    cachedClaims = filtered;
  },

  getStats: (): DashboardStats => {
    const claims = claimsService.getClaims();
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');

    const monthlyMap: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const month = format(subMonths(startOfMonth(now), i), 'MMM');
      monthlyMap[month] = 0;
    }

    const empresaMap: Record<string, number> = {};

    claims.forEach(c => {
      const date = new Date(c.fecha);
      if (!isNaN(date.getTime())) {
        const month = format(date, 'MMM');
        if (monthlyMap[month] !== undefined) {
          monthlyMap[month]++;
        }
      }
      if (c.empresaDenunciada) {
        empresaMap[c.empresaDenunciada] = (empresaMap[c.empresaDenunciada] || 0) + 1;
      }
    });

    const topEmpresas = Object.entries(empresaMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const monthlyData = Object.entries(monthlyMap).map(([month, count]) => ({
      month,
      count
    }));

    return {
      totalClaims: claims.length,
      pendingClaims: claims.filter(c => c.estado === 'Pendiente').length,
      resolvedClaims: claims.filter(c => c.estado === 'Resuelto').length,
      todayClaims: claims.filter(c => {
        const date = new Date(c.fecha);
        return !isNaN(date.getTime()) && format(date, 'yyyy-MM-dd') === today;
      }).length,
      topEmpresas,
      monthlyData
    };
  }
};
