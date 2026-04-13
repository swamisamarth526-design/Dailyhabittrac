import express, { RequestHandler } from "express";
import { createHabit, deleteHabit, getAllHabits, updateHabit } from "../controllers/habitsController";
import { getHabitTracking, getHabitTrackingByMonth, updateHabitStatus } from "../controllers/habitsTrackingController";
import { authMiddleware } from "../middleware/authMiddleware";


const router = express.Router();
router.post("/api/habits", authMiddleware , createHabit as unknown as RequestHandler);
router.get("/api/habits", authMiddleware , getAllHabits as unknown as RequestHandler);
router.delete("/api/habits/:id", authMiddleware , deleteHabit as unknown as RequestHandler);
router.put("/api/habits/:id", authMiddleware , updateHabit as unknown as RequestHandler);

// habit tracking routes
router.post("/api/habits/tracking", authMiddleware, updateHabitStatus as unknown as RequestHandler);
// router.get("/api/habits/tracking/:habitId", authMiddleware , getHabitTracking as unknown as RequestHandler);
router.get("/api/habits/tracking/month", authMiddleware , getHabitTrackingByMonth as unknown as RequestHandler);

export default router;