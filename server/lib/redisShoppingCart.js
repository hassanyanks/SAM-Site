import Product from "../models/product.js";

const CART_TTL = 7 * 24 * 60 * 60; // 7 days

export class ShoppingCart {
    constructor(userId, redisClient) {
        this.redisClient = redisClient;
        this.userId = userId; //either session id or authenticated user id after login
        this.cartKey = `cart:${userId}`;
        console.log(`*************************************ShoppingCart init--cartKey:  ${this.cartKey}`)
    }

    async addItem(productId, quantity = 1) {
        const result = await this.redisClient.hIncrBy(this.cartKey, productId, quantity);
        await this.redisClient.expire(this.cartKey, CART_TTL);

        console.log(`*************************************ShoppingCart.addItem(), cart key: ${this.cartKey}, result:  ${result.toString()}`)
        return result; 
    }

    async getAllItems(req, res) {
        const items = await this.redisClient.hGetAll(this.cartKey);
        return items;    
    }

    async mergeCarts(sessionId, authenticatedUserId ) {
        try {
            let guestCartItems = await this.redisClient.hGetAll(`cart:${sessionId}`);
            let userCartItems = await this.redisClient.hGetAll(`cart:${authenticatedUserId}`);
            console.log(`*************************************in mergeCarts()....hGetAll result for guest cart:  ${JSON.stringify(guestCartItems)}`);
            console.log(`*************************************in mergeCarts()....calling cart.getAllItems(), user cart ${JSON.stringify(userCartItems)}`);

            // use case 1:  user has no guest cart or user cart
            if( (!guestCartItems || Object.keys(guestCartItems).length === 0) && (!userCartItems || Object.keys(userCartItems).length === 0) ) return
            console.log(`*************************************in mergeCarts()....past use case 1....`);

            // use case 2: user has guest cart but no user cart; 1) convert to user cart 2) delete guest cart from redis
            if( (Object.keys(guestCartItems).length > 0) && (!userCartItems || Object.keys(userCartItems).length === 0) ) {
                for( const [productId, quantity] of Object.entries( guestCartItems ) ) {
                    const result = this.redisClient.hSet( `cart:${authenticatedUserId}`, productId, quantity );
                    console.log(`transferring ${quantity} of ${productId} into user cart....result ${result}`);
                }
                guestCartItems = await this.redisClient.hGetAll(`cart:${sessionId}`);
                userCartItems = await this.redisClient.hGetAll(`cart:${authenticatedUserId}`);
                if( guestCartItems === userCartItems ) {
                    const response = this.redisClient.del(`cart:${sessionId}`);
                    console.log(`redis delete cart ${sessionId} result:  ${response}`) //1 if deleted; 0 if key didn't exist    
                } else {
                    console.error(`Server error:  something went wrong creating user cart from guest cart`)

                }
            }
        } catch(err) {
            err.status = 500;
            console.error(`Server error:  ${err}`)
        }
    }

/*
mergeCarts( guestCart, userId ) { 

    let userCart = await Cart.findOne( { id: userId } );

    // use case 1:  user has no guest cart or user cart
    if( !guestCart && !userCart ) return

    // use case 2: user has guest cart but no user cart; 1) convert to user cart 2) delete guest cart from redis
    if( !userCart ) {

        userCart = new Cart({
            sessionId: null,
            userId: userId,
            items: guestCart.items
        });

        userCart.save()
            .then(userCart => {
                console.log(`new user cart is ${JSON.stringify(userCart)}`);
                req.session.cart = userCart;
                console.log(`req session cart is now user cart:  ${JSON.stringify(req.session.cart)}`);
            })
            .catch(err => {
                console.error(`user cart save error:  ${err}`);
            });
        //for( const item in guestCart.items ) {

        //}

    }

};
*/
    async renderItemsOnCartPage(req, res) {
        const cartDataToRender = [];
        const cartItems = await this.redisClient.hGetAll(this.cartKey);
        const productsInCart = await this.redisClient.hKeys(this.cartKey);
        if( !cartItems ) {
            return res.send('did not return any cart items');
        }
        for( const [productId, quantity] of Object.entries( cartItems )) {
            console.log(`*************************************ShoppingCart cart item ${productId}, ${quantity}`)
            if( !productId.includes('product:') ) {
                const product = await Product.findOne({ _id: productId });
                const dataToRender = {
                    _id: productId,
                    quantity: quantity,
                    name: product.name,
                    price: product.price,
                    image: product.image

                }
                cartDataToRender.push(dataToRender);
            }
        }
        //return res.send(`cart items to render ${JSON.stringify(cartDataToRender)}`)
        return res.render('cart', { user: req.user, products: cartDataToRender });

    }

    async clearCart() {
        await this.redisClient.del(this.cartKey, this.metaKey);
        return true;
    }

}