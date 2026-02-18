//THIS IS CODE TO RUN ON THE FRONT END, NOT BACK-END; RESIDES WHERE IT IS FOR COPYING FROM A CENTRAL LOCATION
        var displayToggle = document.querySelector('span#togglePassword');
        var pswd = document.querySelector('input.text-input#password-fld');
        document.addEventListener('click', function() {
        const type = pswd.getAttribute('type') === 'password' ? 'text' : 'password';
        const text = displayToggle.innerText === 'Show' ? 'Hide' : 'Show';
        pswd.setAttribute('type', type);
        displayToggle.innerText = text;
        });    
