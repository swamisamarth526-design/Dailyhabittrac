import { Request, Response } from "express";
import SleepTracker from "../models/sleepTrackerModel";

export const createSleepEntry = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const { hoursSlept, sleepdate } = req.body;

    const newEntery = new SleepTracker({
      UserId: req.user._id,
      hoursSlept,
      sleepdate,
    });
    await newEntery.save();
    res.status(201).json(newEntery);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAllSleepEntries = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const sleepEntries = await SleepTracker.find({ UserId: req.user._id });
    res.status(200).json(sleepEntries);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateSleepEntry = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const { id } = req.params;
    const { hoursSlept, sleepdate } = req.body;
    const updateSleepEntry = await SleepTracker.findOneAndUpdate(
      { _id: id, UserId: req.user._id },
      { hoursSlept, sleepdate },
      { new: true },
    );
    if (!updateSleepEntry) {
      return res.status(404).json({ error: "Sleep entry not found" });
    }
    res.status(200).json(updateSleepEntry);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteSleepEntry = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const { id } = req.params;
    const deleted = await SleepTracker.findOneAndDelete({ _id: id, UserId: req.user._id });
    if (!deleted) {
      return res.status(404).json({ error: "Sleep entry not found" });
    }
    res.status(200).json({ message: "Sleep entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
