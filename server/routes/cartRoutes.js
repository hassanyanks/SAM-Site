// routes/cart.js (or directly in index.js)
import flash from 'connect-flash';
import express from 'express';
import Product from "../models/product.js";
import Cart from '../models/cart.js';
import { cart_details } from '../controllers/cartControllers.js';
import { redisClient } from '../app.js';
import { ShoppingCart } from '../lib/redisShoppingCart.js';

var router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json()); 

router.put('/api/cart/update', async (req, res, next) => {
    const { cartId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ _id: cartId });
        if(!cart) {
            return res.status(500).send('Cart not found!!!')
        }
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId.toString());
        if(itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        }
        cart = await cart.save();
        res.redirect(200, cart_details);
    } catch(err) {
        console.error(err);
        res.status(500).send(`cart update error:  ${err}`)
    }
    //return res.status(201).send({result: `in cart/update PUT:  cart id is ${cartId} product id is ${productId}, quantity is ${quantity}`});
});

router.get('/cart', cart_details);

router.post('/add-to-cart', async (req, res) => {
    try {
        const productId = req.body._id;
        const quantity = req.body.quantity;
        const userId = req.session.passport ? req.user._id : req.session.id;
        const cart = new ShoppingCart(userId, redisClient.client);
        const result = await cart.addItem(productId, quantity);
        //return res.send( statresult[0] );
        return res.redirect(`/cart`);
    } catch(err) {
        console.error(err);
        res.status(500).send(`server error:  ${err}`)
    }
});
        //const sessionId = req.sessionID ? req.sessionID : req.session.id;

        //const product = await Product.findOne({ id: productId });
        //if(!product) {
        //    return res.status(404).send('Product not found!!!')
        //}
/*
        let resp = `<p>************************in /cart/add POST.....adding to cart: ${JSON.stringify(req.session.cart)}**********************************...</p>`;

        if( req.session.cart.items.length > 0 ) {
            const index = req.session.cart.items.findIndex((item) => item.product_name.toString() === productId.toString());
            if( index > -1 ) {
                req.session.items[index].quantity += quantity;
            }
        } else {
            req.session.cart.items.push({ product_name: product.name, image: product.image, product_id: product._id, quantity, priceAtTimeOfAddition: product.price })
        }

        if( req.session.passport ) {
            await Cart.updateOne( { userId: req.user._id }, { $set: { cart: req.session.cart } } );
        } else {
            await Cart.updateOne( { sessionId }, { $set: { cart: req.session.cart } } );
        }
*/
        //req.session.save((err) => {
        //    if(err) console.error(`encountered session save error: ${err}`)
        //});

        //const resp = `<p>************************in /add-to-cart POST.....cart items: ${JSON.stringify(req.session.cart.items)}, session id:  '${req.session.id}'**********************************...</p>`;

        //req.session.cartItems = newCart.items;
        //res.send(resp);



/*
        console.log(`****************************inside add to cart POST, user id is ${userId}, product is ${product._id}...*****************************************`)
        const newItemForCart = { product_name: product.name, product_id: product._id, quantity, priceAtTimeOfAddition: product.price };
        if(existingCart) {
            existingCart.items.push( newItemForCart );
            console.log(`****************************adding item to cart, saving...cart is ${JSON.stringify(existingCart)}...*****************************************`)
            console.log(`****************************item added to cart, cart saved...*****************************************`)
            req.session.cartItems = existingCart.items;
            console.log(`****************************added item to cart, current items: ${existingCart.items}...*****************************************`)
        } else {
            console.log(`****************************creating new cart...*****************************************`)
            const newCart = await Cart.create({
                user: userId,
                items: [newItemForCart]
            });
            console.log(`****************************created cart, item is ${newCart.items}...*****************************************`)
            
        }
*/


export default router;

