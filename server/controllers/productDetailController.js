import Product from "../models/product.js";

export const product_details = async (req, res, next) => {
    console.log(`inside product detals controller, product is ${JSON.stringify(req.params)}`);
    const product = await Product.findOne({ _id: req.params._id }).exec();
    if( product === null) {
        const err = new Error('Product sample details not found');
        err.status = 404;
        return next(err);
    }
    res.render("product_details", { 
        user: req.user,
        product: product });
};
