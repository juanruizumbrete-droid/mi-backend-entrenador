const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    // Usamos el modelo que acabas de leer: Gemini 3 Flash Preview
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    });
    
    // Configuración recomendada para Gemini 3
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: req.body.message }] }],
      generationConfig: {
        // En 2026 recomiendan temperatura 1.0 para modelos de pensamiento
        temperature: 1.0, 
      },
      // Activamos el pensamiento nivel "low" para que sea rápido pero inteligente
      thinkingConfig: {
        thinking_level: "low"
      }
    });

    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ error: "Error en la Serie 3", message: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Entrenador IA Serie 3 listo en puerto " + PORT);
});
