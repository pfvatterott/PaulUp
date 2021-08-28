const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const spaceSchema = new mongoose.Schema({
  title: { type: String, required: true }
});

const Space = mongoose.model("Space", spaceSchema);

module.exports = Space;
