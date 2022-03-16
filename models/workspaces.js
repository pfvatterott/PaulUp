const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workspaceSchema = new mongoose.Schema({
  workspace_name: { type: String },
  owner_id: { type: String },
  spaces: [ String ],
  users: [
    {
      id: {type: String},
      first_name: {type: String},
      last_name: {type: String},
      img: {type: String} 
    }
  ]
});

const Workspace = mongoose.model("Workspace", workspaceSchema);

module.exports = Workspace;
