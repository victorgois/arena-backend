import { Schema, model } from "mongoose";

const eventSchema = new Schema({
  title: String,
  date: Schema.Types.Mixed,
  time: String,
  url: String,
});

export const eventsModel = model("Event", eventSchema, "arenaEvents");
