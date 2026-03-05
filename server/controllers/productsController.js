import Product from "../models/product.js";
import ProductType from "../models/producttype.js";

export const products = async(req, res, next) => {
    const productType = await ProductType.findOne({ name: req.query.type }).exec();
    const products = productType ? await Product.find({ type: productType._id }).exec() : [];
    res.render("products", {
        products: products,
    });
};


