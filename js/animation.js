/**
 * Start the animation when the html-side is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    let logo = document.getElementById('logoKlein');
    let overlay = document.getElementById('overlay');
    let mainContainer = document.getElementById('main');

    
    setTimeout(() => {
        logo.classList.add('shrink');
        overlay.classList.add('changebackground');
    }, 1000); 

    logo.addEventListener('animationend', () => {
        overlay.classList.add('d-none');
        mainContainer.classList.remove('d-none');
        mainContainer.classList.add('show');
    });
});
