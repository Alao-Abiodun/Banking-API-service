const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    user_deposited: { type: Schema.Types.ObjectId, ref: "Deposit" },
    user_withdrawn: { type: Schema.Types.ObjectId, ref: "WithDraw" },
    userSendFunds: { type: Schema.Types.ObjectId, ref: "User" },
    userRecieveFunds: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "successful", "failed", "reversed"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
