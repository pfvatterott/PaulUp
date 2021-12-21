const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new mongoose.Schema({

  email: {
    type: String,
  },
 
  firstName: {
    type: String,
  },

  lastName: {
      type: String,
  },

  image: {
      type: String
  },

  googleId: {
      type: String
  },

  workspaces: [String],

  favorites: {
    spaces: { type: [String] },
    folders: { type: [String] },
    lists: { type: [String] },
    tasks: { type: [String] }
  }

});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
