const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const spaceSchema = new mongoose.Schema({
  space_name: { type: String },
  owner_id: { type: String },
  workspace_id: { type: String },
  folders: [ String ],
  lists: [ String ],
  order_index: { type: Number },
  statuses: {
    open: [String],
    progress: [String],
    done: [String],
    closed: [String]

  }
});

const Space = mongoose.model("Space", spaceSchema);

module.exports = Space;
