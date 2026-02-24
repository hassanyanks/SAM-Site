
var displayToggle = document.getElementById('togglePassword');

if(displayToggle) {

            var displayToggle = document.querySelector('span#togglePassword');
            var pswd = document.querySelector('input.text-input#password-fld');
            displayToggle.addEventListener('click', function(event) {
                event.preventDefault();
                const type = pswd.getAttribute('type') === 'password' ? 'text' : 'password';
        console.log(`***********************event listener:  type is ${type}`);
                const text = displayToggle.innerText === 'Show' ? 'Hide' : 'Show';
        console.log(`***********************event listener:  text is ${text}`);
                pswd.setAttribute('type', type);
                displayToggle.innerText = text;
            });    



}

/*

    displayToggle.addEventListener('click', function(event) {
        const pswdField = document.getElementById('password-fld');
        const type = pswdField.getAttribute('type') === 'password' ? 'text' : 'password';
        console.log(`***********************event listener:  type is ${type}`);
        const text = this.innerText === 'Show' ? 'Hide' : 'Show';
        console.log(`***********************event listener:  text is ${text}`);
        pswdField.setAttribute('type', type);
        this.innerText = text;
        console.log(`***********************event listener:  inner text should now be ${this.innerText}`);
   });    


script. 
        var displayToggle = document.querySelector('span#togglePassword');
        var pswd = document.querySelector('input.text-input#password-fld');
        displayToggle.addEventListener('click', function() {
        const type = pswd.getAttribute('type') === 'password' ? 'text' : 'password';
        const text = displayToggle.innerText === 'Show' ? 'Hide' : 'Show';
        pswd.setAttribute('type', type);
        displayToggle.innerText = text;
        });    

*/