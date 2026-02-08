const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  // CONFIGURACIÓN DE TIEMPO: Damos 2 minutos de margen para sesiones complejas
  req.setTimeout(120000); 

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No hay mensaje" });

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    }, { apiVersion: 'v1alpha' });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        maxOutputTokens: 3500, // Espacio suficiente para los 5 bloques de la sesión
        temperature: 0.6,      // Más rápido y técnico
      }
    });

    const response = await result.response;
    res.json({ text: response.text() });

  } catch (error) {
    console.error("Error en sesión larga:", error);
    res.status(500).json({ 
      error: "Análisis prolongado", 
      message: "El Mister está detallando los ejercicios, espera un momento..." 
    });
  }
});

app.get("/", (req, res) => res.send("Servidor Gemini 3 - Generador Optimizado OK"));

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
