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
    {
      name: {type: String},
      type: {type: String},
      color: {type: String},
      order_index: {type: Number}
    }
  ]
});

const List = mongoose.model("List", listSchema);

module.exports = List;
