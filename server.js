const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
// CORS configurado para que Vercel y Netlify hablen con Render sin problemas
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Cliente de IA preparado para la Serie 3
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No se recibió ningún mensaje" });
    }

    // Usamos v1alpha para mantener la compatibilidad con modelos dinámicos de 2026
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    }, { apiVersion: 'v1alpha' });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        // Quitamos thinking_level para que la IA use su propia potencia según la dificultad
        maxOutputTokens: 2500, // Permite entrenamientos largos sin cortarse
        temperature: 0.7,      // Equilibrio entre precisión técnica y fluidez
      }
    });

    const response = await result.response;
    res.json({ text: response.text() });

  } catch (error) {
    console.error("Error en la conexión con Gemini 3:", error);
    res.status(500).json({ 
      error: "El Mister está analizando la jugada...", 
      details: error.message 
    });
  }
});

// Ruta de salud del servidor
app.get("/", (req, res) => {
  res.send("Servidor del Entrenador IA (Gemini 3) optimizado y listo.");
});

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
