var loginButton = document.getElementById('login-button');
//var pswd = document.querySelector('input.text-input#password-fld');

if(loginButton) {
    loginButton.addEventListener('click', function() {
        location.href='/login';
    });
}

