import ProductSample from "../models/productsample.js";
import ProductType from "../models/producttype.js";

export const product_samples = async(req, res, next) => {
    const productType = await ProductType.findOne({ name: req.query.type }).exec();
    const products = productType ? await ProductSample.find({ type: productType._id }).exec() : [];
    res.render("products", {
        products: products,
    });
};


