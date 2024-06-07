const BASE_URL = 'https://join-privat-default-rtdb.europe-west1.firebasedatabase.app/';
const myurl = 'https://join-test-33e18-default-rtdb.europe-west1.firebasedatabase.app/';

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
    window.location.href='summary.html'
}

function goToSignUp() {
    window.location.href="register.html"
}

function backToLogin() {
    window.location.href= "login.html"
}

function signUp(){
    let name = document.getElementById('name').value;
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let passwordRepeat = document.getElementById('loginPasswordRepeat').value;
    let privacyPolicity = document.getElementById('privacyPolicity');
    createNewUser(name, email, password, passwordRepeat, privacyPolicity);
}

function createNewUser(name, email, password, passwordRepeat, privacyPolicity){
    if(!checkEmailAndPasswordWhenSignUp(email, password)){
        return;
    };
    if(password != passwordRepeat){
        alert("Wiederholtes Passwort stimmt nicht mit dem ersten eingegeben Passwort überein");
        return;
    } 
    if(!privacyPolicity.checked){
        alert("Akzeptieren Sie die Privacy Policy um fortzufahren");
        return;
    } 
    user = {
        "name": name,
        "email": email,
        "password": password
    }
    pushNewUserToDataBase("", user);
}

function checkEmailAndPasswordWhenSignUp(email, password){
    let emailError = checkIfEmailValid(email);
    if(emailError){
        alert(emailError);
        return false;
    }
    let passwordError = checkIfPasswordIsValid(password);
    if(passwordError){
        alert(passwordError);
        return false;
    }
    return true
}

async function pushNewUserToDataBase(path="", user){
    try {
        let response = await fetch(myurl + path + ".json", {
            method: "POST",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        })
        if(!response.ok){
            throw new Error('Network response was not ok' + response.statusText);
        }
        responseToJson = await response.json();
        let registerPopup = document.getElementById('registerPopup');
        registerPopup.classList.remove('d-none');
        // alert("Registrierung erfolgreich!");
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000); 
        return responseToJson;
    } catch(error){
        console.error('Es gab ein Problem mit ihrer Fetch-Operation:', error);
        alert('Es gab ein Problem bei der Registrierung. Bitte versuchen Sie es später erneut');
    }
}

function checkIfEmailValid(email){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? null: "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
}

function checkIfPasswordIsValid(password){
    let minLength = 6;
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(password.length < minLength){
        return `Das Passwort muss mindestens ${minLength} Zeichen lang sein.`;
    } 
    if(!regex.test(password)){
        return "Das Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.";
    }
    return null;
}