import ProductSample from "../models/productsample.js";

export const product_details = async (req, res, next) => {
    console.log(`inside product detals controller, product is ${req.params.id}`);
    const product = await ProductSample.findOne({ id: Number(req.params.id) }).exec();
    if( product === null) {
        const err = new Error('Product sample details not found');
        err.status = 404;
        return next(err);
    }
    res.render("product_details", { product: product });
};
