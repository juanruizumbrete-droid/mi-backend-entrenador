const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Usamos la llave que tienes guardada en Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    // CAMBIO CLAVE: Usamos el nombre del modelo con la versión v1
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(req.body.message);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Error en la IA:", error);
    res.status(500).json({ error: "Fallo de conexión con Google" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor listo en puerto " + PORT);
});
