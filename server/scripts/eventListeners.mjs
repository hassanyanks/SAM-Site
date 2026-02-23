

var loginButton = document.getElementById('login-button');
var displayToggle = document.querySelector('span#togglePassword');
var pswd = document.querySelector('input.text-input#password-fld');
var productDetailButton = document.getElementById('productdetail-button');
var datainfoInput = document.getElementById('datainfo-input');

if(loginButton) {
    loginButton.addEventListener('click', function() {
        location.href='/login';
    });
}

if(displayToggle) {
    displayToggle.addEventListener('click', function() {
        const type = pswd.getAttribute('type') === 'password' ? 'text' : 'password';
        const text = displayToggle.innerText === 'Show' ? 'Hide' : 'Show';
        pswd.setAttribute('type', type);
        displayToggle.innerText = text;
    });    
}

if(productDetailButton) {
    productDetailButton.addEventListener('click', function() {
        const productId = this.dataset.info;
        console.log('in productDetailButton event listener');
        location.href=`https://localhost:443/products/${productId}`;
    });
}

if(datainfoInput) {

}
