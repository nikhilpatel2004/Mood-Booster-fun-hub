import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleJokes } from "./routes/jokes";
import { handleQuotes } from "./routes/quotes";
import {
  handleMusicSearch,
  handleMusicStream,
  handleTrendingMusic,
} from "./routes/music";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/jokes", handleJokes);
  app.get("/api/quotes", handleQuotes);
  app.get("/api/music", handleMusicSearch);
  app.get("/api/music/stream/:videoId", handleMusicStream);
  app.get("/api/music/trending", handleTrendingMusic);

  return app;
}
