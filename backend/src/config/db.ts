import mongoose from "mongoose";

const getMongoErrorMessage = (err: any, rawUri?: string) => {
  if (!rawUri) {
    return "Missing MONGO_URI, RAILWAY_MONGODB_URI, or MONGODB_URI environment variable.";
  }

  if (err?.code === "ECONNREFUSED" || err?.code === "ENOTFOUND") {
    return `Unable to connect to MongoDB. Check that your MongoDB URI is valid, that the host is reachable, and that DNS/SRV lookups are allowed. If you are using mongodb+srv, try a standard mongodb:// seedlist URI instead.`;
  }

  return err?.message ?? String(err);
};

export const connectDB = async () => {
  const rawUri = process.env.MONGO_URI || process.env.RAILWAY_MONGODB_URI || process.env.MONGODB_URI;

  if (!rawUri) {
    console.error(
      "MongoDB connection failed: Missing MONGO_URI, RAILWAY_MONGODB_URI, or MONGODB_URI environment variable."
    );
    console.error("Environment check:", {
      MONGO_URI: !!process.env.MONGO_URI,
      RAILWAY_MONGODB_URI: !!process.env.RAILWAY_MONGODB_URI,
      MONGODB_URI: !!process.env.MONGODB_URI,
    });
    process.exit(1);
  }

  try {
    await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", getMongoErrorMessage(err, rawUri));
    process.exit(1);
  }
};
