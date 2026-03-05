
const minusButton = document.querySelector('.cart-quantity-minus-button');
const plusButton = document.querySelector('.cart-quantity-plus-button');
const quantityElement = document.getElementById('modify-quantity-input');
const updateQuantityBtn = document.getElementById('cart-update-quantity-btn');
var initialQuantity;

if( quantityElement ) {
    try {
        window.addEventListener('load', function(event) {
            initialQuantity = quantityElement.value; 
        });
    } catch(info) {
        console.log(`${info}--user may not have any cart items yet`);
    }
}

if( quantityElement && updateQuantityBtn ) {
    try {
        quantityElement.addEventListener('click', function(event) {
            event.preventDefault();
            if( quantityElement ) {
                const currentQuantity = quantityElement.value;
                console.log(`current quantity ${currentQuantity}, initial quantity ${initialQuantity}`) 
                if( currentQuantity === initialQuantity ) {
                    updateQuantityBtn.style.display = 'none';
                } else {
                    updateQuantityBtn.style.display = 'inline';
                }
            }
        });
    } catch(info) {
        console.log(`${info}--user may not have any cart items yet`);
    }
}

if( updateQuantityBtn && quantityElement ) {
    try {
        updateQuantityBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const currentQuantity = quantityElement.value;
            const productId = event.target.dataset.productId;
            const cartId = event.target.dataset.cartId;
            const userId = event.target.dataset.userId;
            const quantity = event.target.dataset.quantity;
            console.log(`cart id ${cartId}, productId ${productId}, userId ${userId}, quantity ${currentQuantity}`)
            updateData('/api/cart/update', { cartId: cartId, productId: productId, quantity: currentQuantity });
        });
    } catch(info) {
        console.log(`${info}--user may not have any cart items yet`);
    }
}

function updateData( url, data ) {
    console.log(`cart id ${data.cartId}, productId ${data.productId}, quantity ${data.quantity}`)
    try {
        fetch( url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' //'application/json', // or 
            },
            body: JSON.stringify({ cartId: data.cartId, productId: data.productId, quantity: data.quantity }),
        });
    } catch(err) {
        console.error('Error:', err);       
    }
    //.then(response => response.json())
    //.then(data => console.log('Success:', data))
    //.catch((error) => console.error('Error:', error));
}

/*
if( minusButton && quantityElement ) {
    minusButton.addEventListener('click', function(event) {
        const currentQuantity = quantityElement.value == 1 ? 1 : quantityElement.value--;
        console.log(`current cart quantity is ${currentQuantity}`) 
        event.preventDefault();
    });
} else {
    console.log('minus button and/or quantity element undefined');
}
if( plusButton && quantityElement ) {
    plusButton.addEventListener('click', function(event) {
        const currentQuantity = quantityElement.value++;
        console.log(`current cart quantity is ${currentQuantity}`) 
        event.preventDefault();
    });
} else {
    console.log('plus button and/or quantity element undefined');
}
*/
