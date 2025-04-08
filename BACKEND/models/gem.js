const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  reserved: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Gem", gemSchema);
