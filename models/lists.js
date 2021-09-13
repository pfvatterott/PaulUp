const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = new mongoose.Schema({
  list_name: { type: String },
  owner_id: { type: String },
  space_id: { type: String },
  folder_id: { type: String },
  tasks: [ String ],
  order_index: { type: Number },
  statuses: [
    {open: [String]},
    {progress: [String]},
    {done: [String]},
    {closed: [String]}
  ]
});

const List = mongoose.model("List", listSchema);

module.exports = List;
