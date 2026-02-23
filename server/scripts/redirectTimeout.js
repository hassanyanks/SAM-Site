console.log('**********************starting redirect timeout.........');
window.addEventListener('load', function(req) {
    setTimeout(() => { window.location.href = "/"; }, 500);
});
