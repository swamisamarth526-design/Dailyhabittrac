import { Schema, model, Types } from "mongoose";

const SleepTrackerSchema = new Schema({
        UserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        hoursSlept: { type: Number, required: true },
        sleepdate: { type: Date, required: true },
   
});

export default model("SleepTracker", SleepTrackerSchema);