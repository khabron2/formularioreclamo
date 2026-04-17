import { Claim } from '../types';

export const whatsappService = {
  sendNewClaimAlert: (claim: Claim, phoneNumbers: string[]) => {
    const message = encodeURIComponent(
      `📢 *Nuevo Reclamo Ingresado*\n\n` +
      `*Expediente:* ${claim.expediente}\n` +
      `*Nombre:* ${claim.denuncianteNombre}\n` +
      `*Empresa:* ${claim.empresaDenunciada}\n` +
      `*Motivo:* ${claim.motivo}\n` +
      `*Fecha:* ${new Date(claim.fecha).toLocaleDateString()}\n\n` +
      `_Gestor Defensa del Consumidor_`
    );

    // In a real automated system, we might use an API.
    // For this app, we'll open WhatsApp Web for each configured number or the first one.
    if (phoneNumbers.length > 0) {
      window.open(`https://wa.me/${phoneNumbers[0]}?text=${message}`, '_blank');
    }
  }
};
