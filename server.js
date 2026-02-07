const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// IMPORTANTE: Aquí usamos la llave que configuramos en Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(req.body.message);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({ error: "La IA no responde, revisa la API KEY" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor arrancado con éxito");
});
