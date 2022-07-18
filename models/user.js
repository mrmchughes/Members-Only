let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, minLength: 8 },
  member: { type: boolean },
  admin: { type: boolean },
});

// Virtual for user's full name
UserSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ", " + this.first_name;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

//Export model
module.exports = mongoose.model("User", UserSchema);
