const { Schema, model } = require("mongoose");

const walletTransactionSchema = new Schema(
  {
    amount: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    walletId: { type: Schema.Types.ObjectId, required: true, ref: "Wallet" },
    isInflow: { type: Boolean },
    paymentMethod: {
      type: String,
      enum: ["flutterwave", "paystack"],
      default: "flutterwave",
    },
    status: {
      type: String,
      required: [true, "payment status is required"],
      enum: ["successful", "pending", "failed"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("WalletTransaction", walletTransactionSchema);
