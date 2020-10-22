const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tasksSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String },
  completed: { type: String, required: true },
});

module.exports = mongoose.model("Task", tasksSchema);
