import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API health
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      platform: "Manos Abiertas",
      version: "2.5.0",
      timestamp: new Date().toISOString()
    });
  });

  // Server-side Gemini AI Chat / Tutor endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, systemInstruction, history } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "El mensaje es obligatorio" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          reply: "¡Hola! Soy Manos, tu acompañante y orientador en España. Actualmente el servicio responde en modo asistido local porque la clave de Gemini no está configurada, pero puedes usar todas las guías oficiales, el simulador DELE, las 4 plantillas de CV ATS y los 15 nodos de recursos.",
          isFallback: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        for (const h of history) {
          if (h && h.text) {
            contents.push({
              role: h.role === "user" ? "user" : "model",
              parts: [{ text: String(h.text) }]
            });
          }
        }
      }
      contents.push({ role: "user", parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction: systemInstruction || "Eres 'Manos', el tutor y orientador solidario de la plataforma Manos Abiertas (creada para apoyar a comunidades migrantes e hispanohablantes en España). Ofreces información fidedigna sobre extranjería (arraigo, asilo, NIE/TIE, nacionalidad), derechos laborales (SMI, contratos, nóminas), homologación de títulos, cursos de IA y Office, salud pública universal, vivienda digna y recursos de ONGs (Cruz Roja, Cáritas, CEAR). Tu tono es cálido, empático, claro, riguroso y pedagógico. Responde siempre en el idioma en que te hablen.",
          temperature: 0.7,
        }
      });

      const reply = response.text || "No se ha obtenido respuesta del modelo.";
      return res.json({ reply, isFallback: false });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return res.status(500).json({
        error: error.message || "Error procesando la solicitud con IA",
        reply: "Ha ocurrido un error al conectar con el asistente de IA en la nube. Puedes consultar toda la información y guías de trámites directamente en la biblioteca de recursos y en el menú de Derechos."
      });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
