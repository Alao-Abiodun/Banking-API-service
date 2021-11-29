const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
    transactionId: { type: Number, trim: true },
    name: { type: String, required: [true, "name is required"], trim: true },
    email: { type: String, required: [true, "email is required"], trim: true },
    phone: { type: String },
    amount: { type: String, required: [true, "amount is required"] },
    currency: {
      type: String,
      required: [true, "currency is required"],
      enum: ["NGN", "USD", "EUR", "GBP"],
    },
    paymentStatus: {
      type: String,
      enum: ["successfull", "failed", "pending"],
      default: "pending",
    },
    paymentGateWay: {
      type: String,
      required: [true, "payment gateway is required"],
      enum: ["flutterwave", "paystack"],
    },
  },
  { timestamps: true }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
