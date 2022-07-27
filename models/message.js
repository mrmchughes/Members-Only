const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let MessageSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
  user: { type: String, required: true },
});

//Export model
module.exports = mongoose.model("Message", MessageSchema);
