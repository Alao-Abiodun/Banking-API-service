const { Schema, model } = require("mongoose");

const walletSchema = new Schema(
  {
    name: { type: String, required: [true, "Please enter your wallet name"] },
    min_balance: { type: Number, default: 0 },
    monthly_interest_rate: {
      type: Number,
      required: [true, "Please enter the monthly interest rate"],
    },
    owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    transactionHistory: {
      type: Schema.Types.ObjectId,
      ref: "WalletTransaction",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Wallet", walletSchema);
