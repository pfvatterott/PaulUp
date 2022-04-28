const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskHistorySchema = new mongoose.Schema({
    task_id: { type: String },
    event: [
        {
            action: {type: String},
            user: { type: String },
            date: { type: String },
            from: { type: String },
            to: {type: String}
        }
    ]
});

const TaskHistory = mongoose.model("TaskHistory", taskHistorySchema);

module.exports = TaskHistory;
