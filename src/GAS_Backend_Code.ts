/**
 * GOOGLE APPS SCRIPT BACKEND CODE (Code.gs)
 * 
 * Copia y pega este código en tu editor de Google Apps Script.
 * Asegúrate de configurar el ID de tu Hoja de Cálculo.
 */

/*
// ID de la hoja proporcionado: 1fZnwvD6CGu9Aqw8-AZ6ZmSZrwRpifL2zsOjzCHSAXSI

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Defensa del Consumidor CRM')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getClaimsData() {
  const ss = SpreadsheetApp.openById('1fZnwvD6CGu9Aqw8-AZ6ZmSZrwRpifL2zsOjzCHSAXSI');
  const sheet = ss.getSheets()[0]; // Primera hoja
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const data = values.slice(1);
  
  return data.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

function saveClaim(claimData) {
  const ss = SpreadsheetApp.openById('1fZnwvD6CGu9Aqw8-AZ6ZmSZrwRpifL2zsOjzCHSAXSI');
  const sheet = ss.getSheets()[0];
  
  // Si tiene ID, buscamos para editar
  if (claimData.id) {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
       if (data[i][0] == claimData.id) { // Asumiendo ID en columna A
         // Actualizar fila
         const headers = data[0];
         const row = headers.map(h => claimData[h] || '');
         sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
         return { status: 'updated' };
       }
    }
  }
  
  // Si no, agregamos nuevo
  const headers = sheet.getDataRange().getValues()[0];
  const row = headers.map(h => claimData[h] || '');
  sheet.appendRow(row);
  
  // Alertar WhatsApp (Ejemplo con CallMeBot o similar)
  sendWhatsAppAlert(claimData);
  
  return { status: 'created' };
}

function sendWhatsAppAlert(claim) {
  // Número configurado por el usuario
  const phoneNumber = "3834465044"; 
  
  const priorityEmoji = claim.prioridad === 'Urgente' ? '🔴' : claim.prioridad === 'Alta' ? '🟠' : '🟡';
  
  const msg = `📢 *NUEVO RECLAMO*\n\n` +
              `📌 Expediente: #${claim.expediente}\n` +
              `👤 Denunciante: ${claim.denuncianteNombre}\n` +
              `🏢 Empresa: ${claim.empresaDenunciada}\n` +
              `⚠️ Prioridad: ${priorityEmoji} ${claim.prioridad || 'Media'}\n` +
              `💬 Motivo: ${claim.motivo}`;

  // Se recomienda usar un servicio como CallMeBot para envíos automáticos sin intervención humana
  // Para usarlo, debes obtener tu API Key en https://www.callmebot.com/
  const apiKey = "YOUR_CALLMEBOT_API_KEY"; // REEMPLAZAR CON TU API KEY
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodeURIComponent(msg)}&apikey=${apiKey}`;
  
  try {
    if (apiKey !== "YOUR_CALLMEBOT_API_KEY") {
      UrlFetchApp.fetch(url);
    } else {
      Logger.log("WhatsApp no enviado: Falta configurar API Key de CallMeBot");
    }
  } catch(e) {
    Logger.log("Error enviando WhatsApp: " + e.toString());
  }
}

function uploadFileToDrive(base64Data, fileName) {
  const folderId = "YOUR_FOLDER_ID";
  const folder = DriveApp.getFolderById(folderId);
  const contentType = base64Data.substring(5, base64Data.indexOf(';'));
  const bytes = Utilities.base64Decode(base64Data.split(',')[1]);
  const blob = Utilities.newBlob(bytes, contentType, fileName);
  const file = folder.createFile(blob);
  return file.getUrl();
}
*/
