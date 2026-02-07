const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Configuración de CORS para que tu web de Vercel pueda hablar con este servidor
app.use(cors());
app.use(express.json());

// Cargamos la llave desde las variables de entorno de Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    // Usamos el modelo más actualizado
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    // Enviamos la respuesta de la IA de vuelta a tu web
    res.json({ text: text });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ error: "La IA no ha podido responder", details: error.message });
  }
});

// El puerto 10000 es el que usa Render por defecto
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor de fútbol listo en el puerto ${PORT}`);
});
