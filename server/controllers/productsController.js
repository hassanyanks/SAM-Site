import ProductSample from "../models/productsample.js";
//import ProductType from "../models/producttype.js";

export const product_samples = async(req, res, next) => {
    const allproductSamples = await ProductSample.find({}).sort({ name: 1 }).exec();
    res.render("products", {
        products: allproductSamples
    });
};


