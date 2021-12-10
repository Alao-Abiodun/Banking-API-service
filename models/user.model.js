const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    acctBalance: { type: Number, default: 0 },
    role: { type: String, enum: ["Admin", "User"], default: "User" },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
