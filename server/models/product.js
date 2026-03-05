import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  price: { type: Number, required: true, unique: false },
  name: { type: String, required: true, minLength:  3, maxLength: 100, unique: false },
  type: { type: Schema.Types.ObjectId, ref: "ProductType", required: true },
  image: { type: String, required: true, minLength:  5, maxLength: 100 }
});

// Virtual for product sample URL
ProductSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/productsample/${this._id}`;
});

// Export model
const Product = mongoose.model("Product", ProductSchema);
export default Product;