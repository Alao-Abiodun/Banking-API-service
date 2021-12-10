const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    amount: { type: Number, default: 0 },
    payment_status: {
      type: String,
      enum: ["successful", "failed", "pending", "reverted"],
      default: "pending",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
