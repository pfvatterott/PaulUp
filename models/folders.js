const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const folderSchema = new mongoose.Schema({
  folder_name: { type: String },
  owner_id: { type: String },
  space_id: { type: String },
  lists: [ String ],
  order_index: { type: Number },
  statuses: [
    {
      name: {type: String},
      type: {type: String},
      color: {type: String},
      order_index: {type: Number}
    }
  ],
  favorited: [ String ]
});

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;
