const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
// Esto permite que tu web de Vercel pueda hablar con este servidor
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Configuración de Gemini 3 para 2026
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No se recibió ningún mensaje" });
    }

    // CONFIGURACIÓN CLAVE: Usamos v1alpha para activar el razonamiento de Gemini 3
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    }, { apiVersion: 'v1alpha' });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        // Nivel de pensamiento optimizado para rapidez táctica
        thinking_config: { thinking_level: "low" }
      }
    });

    const response = await result.response;
    res.json({ text: response.text() });

  } catch (error) {
    console.error("Error en la conexión con Gemini 3:", error);
    res.status(500).json({ 
      error: "Error en el servidor de IA", 
      details: error.message 
    });
  }
});

// Ruta de prueba para saber si el servidor está vivo
app.get("/", (req, res) => {
  res.send("Servidor del Entrenador IA (Gemini 3) funcionando correctamente.");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
