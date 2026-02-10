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
  // AUMENTAMOS TIEMPO A 4 MINUTOS (240000 ms)
  req.setTimeout(240000); 

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No hay mensaje" });

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    }, { apiVersion: 'v1alpha' });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        maxOutputTokens: 4000, 
        temperature: 0.4, // Más bajo = más rápido y menos creativo
      }
    });

    const response = await result.response;
    res.json({ text: response.text() });

  } catch (error) {
    console.error("Error táctico:", error);
    res.status(500).json({ 
      error: "Tiempo de respuesta agotado", 
      message: "El servidor está lento, reinténtalo." 
    });
  }
});

app.get("/", (req, res) => res.send("Servidor Gemini 3 Flash listo"));

app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
