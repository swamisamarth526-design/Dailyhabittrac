import path from "path";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";

const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath, override: true });

const uriDisplay = process.env.MONGO_URI?.replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/, "$1***:***@");
console.log("Loaded MONGO_URI:", uriDisplay ?? "<not set>");

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
