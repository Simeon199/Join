const BASE_URL = 'https://join-privat-default-rtdb.europe-west1.firebasedatabase.app/';

function validatePassword() {
    let msgbox = document.getElementById('msgbox');
    //if (password !== passwordConfirm) {
    //    msgbox.innerHTML = 'Password incorrect';
    //    return false;
    //}
    //return true;
    msgbox.innerHTML = "Password incorrect";
}

function validateCheckbox() {
    let checkbox = document.getElementById('remember');
    let loginBTN = document.getElementById('loginBtn');
    if (checkbox.checked = true) {
        loginBTN.enabled = true;
    } else {
        loginBTN.enabled = false;
    }
}

function login() {
    validateCheckbox();
    validatePassword();
    window.location.href='board.html'
}

function goToSignUp() {
    window.location.href="register.html"
}

function backToLogin() {
    window.location.href= "login.html"
}