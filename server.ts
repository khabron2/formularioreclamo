import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzBVwXGAIShSXUHVikaAeac5MIhbZDbHqzDL0pbQYHj5-L60thpnANTJ5ReMSGJNEiPpw/exec';

  // API Proxy for Google Apps Script to bypass CORS
  app.get("/api/claims", async (req, res) => {
    try {
      console.log(`[GET] Proxying to GAS: ${GAS_WEB_APP_URL}`);
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getClaims`);
      
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        const text = await response.text();
        if (text.includes("Service-Login")) {
           return res.status(403).json({ error: "Permisos: Configure la Web App como 'Anyone'." });
        }
      }

      const rawData = await response.json();
      let finalData = Array.isArray(rawData) ? rawData : (rawData.data || rawData.records || []);
      res.json(finalData);
    } catch (error: any) {
      console.error("[GET ERROR] GAS Proxy:", error.message);
      res.status(500).json({ error: "Error de conexión con Google.", message: error.message });
    }
  });

  app.post("/api/claims", async (req, res) => {
    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
      });
      // GAS often returns a temporary redirect or a success message
      res.json({ status: "ok", gasStatus: response.status });
    } catch (error) {
      console.error("GAS Proxy POST Error:", error);
      res.status(500).json({ error: "Failed to post to GAS via proxy" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
