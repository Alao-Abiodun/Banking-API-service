const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    firstname: { type: String, required: true, select: false },
    lastname: { type: String, required: true, select: false },
    email: { type: String, unique: true, select: false },
    password: { type: String, required: true, select: false },
    acctBalance: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
