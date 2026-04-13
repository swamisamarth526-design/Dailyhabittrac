import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

const envPath = path.resolve(__dirname, "../.env");
const fallbackEnvPath = path.resolve(process.cwd(), "backend/.env");
const configPath = fs.existsSync(envPath) ? envPath : fallbackEnvPath;

dotenv.config({ path: configPath, override: true });

const rawUri = process.env.MONGO_URI || process.env.RAILWAY_MONGODB_URI || process.env.MONGODB_URI;
const uriDisplay = rawUri?.replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/, "$1***:***@");
console.log("Loaded MongoDB URI:", uriDisplay ?? "<not set>");

const app = require("./app").default;
const start = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5001;

  app.get("/", (req, res) => {
    res.send("API is running...");
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
