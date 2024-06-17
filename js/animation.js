document.addEventListener('DOMContentLoaded', (event) => {
    let logo = document.getElementById('logoKlein');
    let overlay = document.getElementById('overlay');
    let mainContainer = document.getElementById('main');

    
    setTimeout(() => {
        logo.classList.add('shrink');
    }, 1000); 

    logo.addEventListener('animationend', () => {
        overlay.classList.add('d-none');
        mainContainer.classList.remove('d-none');
        mainContainer.classList.add('show');
    });
});
