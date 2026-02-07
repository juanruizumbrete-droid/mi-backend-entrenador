const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    // Hemos añadido "models/" delante del nombre para que Google lo encuentre
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    
    const result = await model.generateContent(req.body.message);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({ error: "Fallo en el modelo de Google" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor listo y modelo actualizado");
});
