import express, { RequestHandler } from "express";
import { createSleepEntry, deleteSleepEntry, getAllSleepEntries, updateSleepEntry } from "../controllers/sleepTrackerController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
router.post("/api/sleepTrackers", authMiddleware , createSleepEntry as unknown as RequestHandler);
router.get("/api/sleepTrackers", authMiddleware , getAllSleepEntries as unknown as RequestHandler);
router.patch("/api/sleepTrackers/:id", authMiddleware , updateSleepEntry as unknown as RequestHandler);
router.delete("/api/sleepTrackers/:id", authMiddleware , deleteSleepEntry as unknown as RequestHandler);

export default router;