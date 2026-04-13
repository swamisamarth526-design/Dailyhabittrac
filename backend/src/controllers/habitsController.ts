import { Request, Response } from "express";
import Habits from "../models/habitsModel";

const defaultHabits = [
  { name: "Drink Water" },
  { name: "Exercise" },
  { name: "Read 10 pages" },
  { name: "Sleep 8 hours" },
];

export const createHabit = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const { name, status, date } = req.body;
    const newHabit = new Habits({
      name,
      UserId: req.user._id,
    });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAllHabits = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const habits = await Habits.find({ UserId: req.user._id });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteHabit = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const { id } = req.params;
    await Habits.findOneAndDelete({ _id: id, UserId: req.user._id });
    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateHabit = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const { id } = req.params;
    const { name } = req.body;
    const updateHabit = await Habits.findOneAndUpdate(
      { _id: id, UserId: req.user._id },
      { name },
      { new: true },
    );
    if (!updateHabit) {
      return res.status(404).json({ error: "Habit not found" });
    }
    res.status(200).json(updateHabit);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
