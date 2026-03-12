import mongoose from "mongoose";
import Product from "./product.js";
import User from "../models/user.js";
import ProductType from "../models/producttype.js";

const { Schema } = mongoose;

const CartSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', nullable: true },
  sessionId: { type: String, nullable: true }, // Unique ID from guest cookie
  items: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: Product, // Reference to the Product model
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

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
