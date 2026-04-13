import mongoose from "mongoose";

const getMongoErrorMessage = (err: any) => {
  if (!process.env.MONGO_URI) {
    return "Missing MONGO_URI environment variable.";
  }

  if (err?.code === "ECONNREFUSED" || err?.code === "ENOTFOUND") {
    return `Unable to connect to MongoDB. Check that your MONGO_URI is valid, that the host is reachable, and that DNS/SRV lookups are allowed. If you are using mongodb+srv, try a standard mongodb:// seedlist URI instead.`;
  }

  return err?.message ?? String(err);
};

export const connectDB = async () => {
  const rawUri = process.env.MONGO_URI || process.env.RAILWAY_MONGODB_URI || process.env.MONGODB_URI;

  if (!rawUri) {
    console.error("MongoDB connection failed: Missing MONGO_URI or RAILWAY_MONGODB_URI environment variable.");
    process.exit(1);
  }

  try {
    await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("mongo Db connected");
  } catch (err) {
    console.error("MongoDB connection failed:", getMongoErrorMessage(err));
    process.exit(1);
  }
};
