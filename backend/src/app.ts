import express from "express";
import cors from "cors";
import sleepTrackerRoutes from "./routes/sleepTrackerRoutes";
import habitsRoutes from "./routes/habitsRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,       // your Vercel URL (set in Render env vars)
  "http://localhost:3000",         // local dev
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

app.use(sleepTrackerRoutes);
app.use(habitsRoutes);
app.use(authRoutes);


export default app;