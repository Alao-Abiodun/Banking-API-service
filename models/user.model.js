const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  firstname: { type: String, default: null },
  lastname: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
});

const User = model("User", userSchema);

module.exports = User;
