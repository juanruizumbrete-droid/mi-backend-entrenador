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
  req.setTimeout(300000); // Aumentamos a 5 minutos el margen

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Sin mensaje" });

    // Forzamos el modelo Flash que es el más rápido de 2026
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    }, { apiVersion: 'v1alpha' });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        maxOutputTokens: 2000, // Bajamos tokens para que termine antes
        temperature: 0.3,      // Casi 0 para que no se "enrolle" y sea ultra rápido
      }
    });

    const response = await result.response;
    res.json({ text: response.text() });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "El servidor está saturado. Intenta pedir solo un ejercicio." });
  }
});

app.get("/", (req, res) => res.send("Motor Gemini 3 Activo"));
app.listen(PORT, () => console.log(`Ready on ${PORT}`));
