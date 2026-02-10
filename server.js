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
  // Damos 3 minutos de margen
  req.setTimeout(180000); 

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Sin mensaje" });

    // MODELO MÁS RÁPIDO Y EFICIENTE
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    }, { apiVersion: 'v1alpha' });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        maxOutputTokens: 2500, 
        temperature: 0.3, // Muy bajo para rapidez extrema
      }
    });

    const response = await result.response;
    res.json({ text: response.text() });

  } catch (error) {
    console.error("Error táctico:", error);
    res.status(500).json({ error: "El Mister está pensando mucho, reinténtalo." });
  }
});

app.get("/", (req, res) => res.send("Motor Gemini 3 Activo"));
app.listen(PORT, () => console.log(`Ready on ${PORT}`));
