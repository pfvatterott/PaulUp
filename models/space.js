const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const spaceSchema = new mongoose.Schema({
  workspace_name: { type: String },
  workspace_owner: { type: String },
  workspace_ownerId: { type: String },
  spaces: {
    space_name: { type: String },
    space_id: { type: String},
    lists: {
      list_name: { type: String },
      list_id: { type: String },
    },
    folders: {
      folder_name: { type: String },
      folder_id: { type: String },
      lists: {
        list_name: { type: String },
        list_id: { type: String },
      }
    }
  }
});

const Space = mongoose.model("Space", spaceSchema);

module.exports = Space;
