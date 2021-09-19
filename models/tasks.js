const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
  task_name: { type: String },
  owner_id: { type: String },
  list_id: { type: String },
  task_description: { type: String },
  task_assignee: { type: String },
  start_date: { type: String },
  due_date: { type: String },
  order_index: { type: Number },
  task_status: {
    type: { type: String },
    status: { type: String }
  }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
