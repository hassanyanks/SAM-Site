import User from "../models/user.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const cart_details = async(req, res, next) => {
    var cartItems = [];

    try {
        //const cart = await Cart.findOne({ $or: [{ userId }, { sessionId }] });
        //if(!cart) {
        //    return res.status(404).send('We could not find a cart for you!!!');           
        //}

        for(const item of req.session.cart.items) {
             const product = await Product.findOne({ _id: item.product_id });
            //const newItemForCart = { product_name: product.name, product_id: product._id, quantity, priceAtTimeOfAddition: product.price };
            if(product) {
                const cartPageItemDetails = {
                    name: product.name,
                    id: item.product_id,
                    quantity: item.quantity,
                    image: product.image,
                    price: item.priceAtTimeOfAddition,
                }
                console.log(`*********************in cart_details:  item details to show ${JSON.stringify(cartPageItemDetails)}`);
                cartItems.push(cartPageItemDetails);
            }
       };

    } catch(err) {
        err.status = 500;
        console.error(`Server error:  ${err}`)
    }
    //res.send(cartItems);
    res.render('cart', { products: cartItems });
};

export async function mergeCarts( guestCart, loggedInUserId ) { 
    //(loggedInUserId, guestCart) {

    if( guestCart.items.length === 0 ) {
        console.log( 'no guest cart so merging of carts not required.');
        return 1;
    }
    const userCart = new Cart({
        sessionId: null,
        userId: loggedInUserId,
    });

    const savedCart = null; //await userCart.save();
    console.log(`***********************inside mergeCarts()....user cart created is ${JSON.stringify(savedCart)}`)

    return
    // 1. Find the guest cart and the user's existing cart
  //const [guestCart, userCart] = await Promise.all([
   // Cart.findOne( sessionId ),
   // Cart.findOne( userId )
  //]);

      console.log(`************************userCart:  ${userCart}...guestCart:  ${guestCart}...`)

  if (!guestCart) {
    return userCart; // Nothing to merge
  }

  if (!userCart) {
    // 2. If user has no saved cart, simply assign the guest cart to them
    guestCart.userId = userId;
    guestCart.sessionId = null;
    await guestCart.save();
    return guestCart;
  }

    // 3. Merge guest items into existing user cart
  guestCart.items.forEach(guestItem => {
    const existingItem = userCart.items.find(
      item => item.productId.toString() === guestItem.productId.toString()
    );

    if (existingItem) {
      existingItem.quantity += guestItem.quantity; // Sum quantities for duplicates
    } else {
      userCart.items.push(guestItem); // Add new item
    }
  });

  // 4. Save merged cart and delete the old guest session cart
  await userCart.save();
  await Cart.deleteOne({ _id: guestCart._id });
  
  return userCart;

};
