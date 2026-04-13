export type Habit = {
  _id: string;
  name: string;
  status: "pending" | "completed";
  date: string;
};
