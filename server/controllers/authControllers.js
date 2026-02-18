import User from "../models/user.js";

export const user_from_email = async(req, res, next) => {
    const user = await User.find({ email: req.body.email }).exec();
    res.render("products", {
        user: user
    });
};

export const home = async(req, res, next) => {
    res.render('index', { user: req.user });
}
//export const logout = async(req, res, next) => {
//    res.render('index', { user: null });
//}

export const login = async(req, res, next) => {
    res.render("login", { url: '/login' });
}

export const signup = async(req, res, next) => {
    res.render("signup", { url: '/signup' });
}