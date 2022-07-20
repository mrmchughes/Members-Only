const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, minLength: 8 },
  member: { type: Boolean },
  admin: { type: Boolean },
});

//Export model
module.exports = mongoose.model("User", UserSchema);
