const { Schema, model } = require("mongoose");

const depositSchema = new Schema(
  {
    amount_deposited: { type: Number, default: 0 },
    payment_status: {
      type: String,
      enum: ["successful", "failed", "pending", "reverted"],
      default: "pending",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Deposit = model("Deposit", depositSchema);

module.exports = Deposit;
