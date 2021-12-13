const { Schema, model } = require("mongoose");

const withdrawSchema = new Schema(
  {
    amount_withdrawn: { type: Number, default: 0 },
    payment_status: {
      type: String,
      enum: ["successful", "failed", "pending", "reverted"],
      default: "pending",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const WithDraw = model("WithDraw", withdrawSchema);

module.exports = WithDraw;
