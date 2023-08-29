const mongoose = require("mongoose");

let userBuyingId, productBuyingId;

userBuyingId = mongoose.Schema.Types.ObjectId;
productBuyingId = mongoose.Schema.Types.ObjectId;

const salesSchema = new mongoose.Schema(
  {
    userBuying: {
      type: userBuyingId,
      ref: "users",
    },
    productBuying: {
      type: productBuyingId,
      ref: "products",
    },
    quantity: {
      type: Number,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("sales", salesSchema);
