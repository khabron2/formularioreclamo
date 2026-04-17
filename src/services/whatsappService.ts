import { Claim } from '../types';

export const whatsappService = {
  sendNewClaimAlert: (claim: Claim, phoneNumbers?: string[]) => {
    // Get numbers from localStorage or use the provided ones or the default
    const storedNumbers = localStorage.getItem('whatsapp_notification_numbers');
    let targetNumbers = phoneNumbers || (storedNumbers ? storedNumbers.split('\n').map(n => n.trim()).filter(Boolean) : []);
    
    // Default fallback
    if (targetNumbers.length === 0) {
      targetNumbers = ["3834465044"];
    }

    // Priority formatting
    const priorityEmoji = claim.prioridad === 'Urgente' ? '🔴' : claim.prioridad === 'Alta' ? '🟠' : '🟡';
    
    const message = encodeURIComponent(
      `📢 *NUEVO RECLAMO INGRESADO*\n\n` +
      `📌 *Expediente:* #${claim.expediente}\n` +
      `👤 *Denunciante:* ${claim.denuncianteNombre}\n` +
      `🏢 *Empresa:* ${claim.empresaDenunciada}\n` +
      `⚠️ *Prioridad:* ${priorityEmoji} ${claim.prioridad}\n` +
      `📅 *Fecha:* ${new Date(claim.fecha).toLocaleDateString('es-AR')}\n` +
      `💬 *Motivo:* ${claim.motivo}\n\n` +
      `🔗 *Ver en CRM:* ${window.location.origin}\n\n` +
      `_Notificación Automática - Defensa del Consumidor_`
    );

    const target = targetNumbers[0];
    
    // In this web context, we use the wa.me protocol
    window.open(`https://wa.me/${target}?text=${message}`, '_blank');
  }
};
