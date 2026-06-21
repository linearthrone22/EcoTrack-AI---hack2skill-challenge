import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cors from "cors";
import DOMPurify from "isomorphic-dompurify";

dotenv.config();

const app = express();
const PORT = 3000;

// Security & Efficiency Plugins
app.use(compression()); // Compress all responses for fast delivery
app.use(cors()); // Allow cross origin
app.use(helmet({
  contentSecurityPolicy: false, // disabled for dev mode vite hot reload, ensure to configure properly setup in production
  crossOriginEmbedderPolicy: false,
}));

// Security: Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many requests, please try again later." }
});

app.use(express.json({ limit: "1mb" })); // Prevent large payload attacks

// API route first: AI chat proxy using @google/genai limits applied
app.post("/api/chat", apiLimiter, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required and must be a string." });
    }

    // Security: Validate and sanitize client payload string to prevent injection
    const cleanMessage = DOMPurify.sanitize(message.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      // Elegant, high-fidelity local simulation if key is not configured yet
      const lowercaseMsg = cleanMessage.toLowerCase();
      const userProfileCtx = req.body.stats ? `Since you live in ${req.body.stats.region} and your current diet is ${req.body.stats.dietType}, ` : '';

      let responseText = `I'm your EcoTrack AI Assistant! ${userProfileCtx}Let's explore how to reduce your carbon footprint. You can ask me custom questions about commuting, food, and energy.`;
      
      if (lowercaseMsg.includes("reduce") || lowercaseMsg.includes("emission") || lowercaseMsg.includes("transportation")) {
        const transTip = req.body.stats?.transportType === 'car' ? 'As a car driver, switching to light rail or cycling just two days a week is your #1 opportunity to cut emissions.' : 'Since you already use transit, optimizing your last-mile with cycling or walking provides additional savings.';
        responseText = `To lower your transportation emissions, standard alternatives like light rail, cycling, and ridesharing offer the highest impact. ${transTip} Compared to a personal combustion car, transit and micro-mobility can cut weekly carbon outputs by over 10-15 kg CO2e.`;
      } else if (lowercaseMsg.includes("diet") || lowercaseMsg.includes("meat") || lowercaseMsg.includes("food")) {
        const dietTip = req.body.stats?.dietType === 'heavy_meat' ? 'Since your profile indicates heavy meat consumption, replacing just one beef meal per week with lentils makes a massive difference.' : 'Adapting your meal plans even 2 days a week to be plant-based eliminates approximately 15.4 kg of carbon emissions monthly.';
        responseText = `${dietTip} Incorporating legumes, vegetables, and local grains is both highly nutritious and structurally eco-friendly.`;
      } else if (lowercaseMsg.includes("energy") || lowercaseMsg.includes("home") || lowercaseMsg.includes("laundry") || lowercaseMsg.includes("grid")) {
        const energyTip = req.body.stats?.region === 'ID' ? 'Because the ID region grid has a high carbon intensity, reducing electricity usage here has a disproportionately large benefit.' : 'Running major appliances like laundry units during off-peak hours eases strain on grid systems.';
        responseText = `Household power accounts for nearly 20% of residential carbon loads. ${energyTip}`;
      } else if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi")) {
        responseText = `${userProfileCtx}Hello! I am EcoTrack AI, your intelligent carbon consultant. Ask me anything about practical modifications you can make to your daily routine to maximize point score and save kg of CO2e!`;
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
      contents: cleanMessage,
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
