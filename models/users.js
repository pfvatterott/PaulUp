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

  favorites: [
    {
      id: {type: String},
      name: {type: String},
      type: {type: String},
    }
  ]

});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
