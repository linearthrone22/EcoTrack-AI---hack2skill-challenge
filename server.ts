import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route first: AI chat proxy using @google/genai
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      // Elegant, high-fidelity local simulation if key is not configured yet
      const lowercaseMsg = message.toLowerCase();
      let responseText = "I'm your EcoTrack AI Assistant! Let's explore how to reduce your carbon footprint. You can ask me custom questions about commuting, food, and energy.";
      
      if (lowercaseMsg.includes("reduce") || lowercaseMsg.includes("emission") || lowercaseMsg.includes("transportation")) {
        responseText = "To lower your transportation emissions, standard alternatives like light rail, cycling, and ridesharing offer the highest impact. Compared to a personal combustion car, transit and micro-mobility can cut weekly carbon outputs by over 10-15 kg CO2e.";
      } else if (lowercaseMsg.includes("diet") || lowercaseMsg.includes("meat") || lowercaseMsg.includes("food")) {
        responseText = "Adapting your meal plans even 2 days a week to be plant-based eliminates approximately 15.4 kg of carbon emissions monthly. Incorporating legumes, vegetables, and local grains is both highly nutritious and structurally eco-friendly.";
      } else if (lowercaseMsg.includes("energy") || lowercaseMsg.includes("home") || lowercaseMsg.includes("laundry")) {
        responseText = "Household power accounts for nearly 20% of residential carbon loads. Running major appliances like laundry units during off-peak hours (between 7 PM and 7 AM) eases strain on grid systems and optimizes consumption.";
      } else if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi")) {
        responseText = "Hello! I am EcoTrack AI, your intelligent carbon consultant. Ask me anything about practical modifications you can make to your daily routine to maximize point score and save kg of CO2e!";
      }

      return res.json({
        text: responseText,
        source: "simulated"
      });
    }

    // Initialize actual GoogleGenAI with modern named argument and telemetry headers
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Provide robust system guide instructions to instruct model role and styling with dynamic user context
    const userInfo = req.body.stats ? ` [User Profile Context: Region=${req.body.stats.region}, Transport=${req.body.stats.transportType}, Diet=${req.body.stats.dietType}, Energy=${req.body.stats.energyType}]` : "";

    const systemInstruction = 
      "You are EcoTrack AI Assistant, an elite, supportive, and scientifically accurate carbon coach. " +
      "Your sole mission is to guide users to lower their personal greenhouse gas emissions." + userInfo + " " +
      "Formulate your answers using positive, inspiring language. Keep recommendations extremely brief, highly practical, " +
      "specifically calling out measurable saving estimates (in kg CO2e) where relevant. " +
      "Always output standard, clean, concise markdown (focusing on actionable bullet points). " +
      "Never mention internal folder structures, port configurations, or server details.";

    // Query Gemini 3.5 Flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const outputText = response.text || "I was unable to formulate a response. Please try describing your reduction goals differently!";

    return res.json({
      text: outputText,
      source: "gemini-api"
    });
  } catch (err: any) {
    console.error("Gemini API backend error:", err);
    return res.status(500).json({
      error: "Error contacting Gemini. Showing eco advice.",
      text: "Emissions tracking is a powerful tool! Shifting commuting habits and integrating eco-friendly power schedules directly reduce localized pollution and carbon metrics. Try choosing public transit options or off-peak hours for optimal savings."
    });
  }
});

// Start server and handle static/Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for continuous dev mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production statics
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EcoTrack AI Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
