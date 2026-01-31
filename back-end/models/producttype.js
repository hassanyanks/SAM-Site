import mongoose from 'mongoose';
//const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductTypeSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, minLength:  3, maxLength: 100, unique: true }
});

// Virtual for product type URL
ProductTypeSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/producttype/${this._id}`;
});

// Export model
const ProductType = mongoose.model("ProductType", ProductTypeSchema);
export default ProductType;