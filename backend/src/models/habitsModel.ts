import { Schema,model } from "mongoose";

const HabitsSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
});

export default model("Habits", HabitsSchema);