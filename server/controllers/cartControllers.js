import User from "../models/user.js";
import Cart from "../models/cart.js";
import { redisClient } from "../app.js";
import { ShoppingCart } from "../lib/redisShoppingCart.js";

export const cart_details = async(req, res, next) => {
    try {
        const userId = req.session.passport ? req.user._id : req.session.id;
        const cart = new ShoppingCart(userId, redisClient.client);
        console.log(`*************************************in cart_details....calling cart.getAllItems(), cart key ${cart.cartKey}`);
        cart.renderItemsOnCartPage(req, res);
    } catch(err) {
        err.status = 500;
        console.error(`Server error:  ${err}`)
    }
};

    // use case 3: user has no guest cart but has user cart
    // use case 4: user has both a guest cart and a user cart

    /*
    if( guestCart ) {
    }


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
*/
