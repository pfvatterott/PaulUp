const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
  task_name: { type: String },
  owner_id: { type: String },
  list_id: { type: String },
  task_description: { type: String },
  task_status: { type: String },
  task_assignee: { type: String },
  start_date: { type: Date },
  due_date: { type: Date },
  order_index: { type: Number }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
