import Cart from "../models/cart.js";
import User from "../models/user.js";

export const user_from_email = async(req, res, next) => {
    const user = await User.find({ email: req.body.email }).exec();
    res.render("products", {
        user: user
    });
};

export const home = async(req, res, next) => {

     
    //if(!req.session.passport) {
    //return res.send(`guest cart is ${JSON.stringify(req.session.cart)}`);
    //}
    //    console.log(`inside home render /index....session passport user id is ${req.session.passport.user}....guest cart items is ${JSON.stringify(req.session.cart.items)}`)
    //    mergeCarts(req.session.passport.user, req.session.cart);
    //}


    //const userId = req.session.passport ? req.session.passport.user._id : null;
    //const sessionId = req.sessionID ? req.sessionID : req.session.id;  
    //const cart = await mergeCarts(userId, sessionId);

    //const productId = req.body.id;
    //const quantity = req.body.quantity;
    //const userId = req.session.passport.user?._id;
    //console.log(`************************productId:  ${req.body.productId}, passport userid: ${userId}, session id is ${JSON.stringify(req.session.id)}`)

    //if(!req.session.cart) {

    //}





    res.render('index', { user: req.user });
}

export const login = async(req, res, next) => {
    res.render("login");
}

export const signup = async(req, res, next) => {
    res.render("signup", { url: '/signup' });
}