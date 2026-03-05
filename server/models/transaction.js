import mongoose from "mongoose";
import Product from "./product.js";
import User from "./user.js";

const { Schema } = mongoose;

const TransactionSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', nullable: true },
  id: { type: String, required: true }, // Session id + timestamp; guest buyers can also use for reference
  items: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: Product, // Reference to the Product model
        required: true,
      },
      product_name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      // You can also store the current price here for historical accuracy
      // in case the product price changes later
      priceAtTimeOfAddition: { type: Number },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
