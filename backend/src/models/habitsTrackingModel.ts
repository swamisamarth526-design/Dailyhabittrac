import { model, Mongoose, Schema } from "mongoose";

const HabitsTrackingSchema = new Schema({
  UserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  habitId: { type: Schema.Types.ObjectId, ref: "Habits", required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["complete", "partial", "missed"],
    default: "missed",
  },
});

HabitsTrackingSchema.index({ UserId: 1, habitId: 1, date: 1 }, { unique: true });

export default model("HabitsTracking", HabitsTrackingSchema);
