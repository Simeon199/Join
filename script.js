// const BASE_URL = 'https://join-privat-default-rtdb.europe-west1.firebasedatabase.app/';

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

// Hier kommen meine ganzen neuen Funktionen //

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Hier enden meine ganzen neuen Funktionen //

async function testLoginFunction(){
    let loginEmail = document.getElementById('loginEmail').value;
    let loginPassword = document.getElementById('loginPassword').value;
    let remember = document.getElementById('remember').checked;
    let response = await loadData(path="");
    // console.log(response);
    for(key in response){
        let user = response[key];
        if(user["email"] && user["password"]){
            let email = user["email"];
            let password = user["password"];
            if(loginEmail == email && loginPassword == password){
                if(remember){
                    // Set cookie for 30 days if "remember me" is checked 
                    setCookie('authToken', 'YourAuthTokenValue', 30);
                } else {
                    // Set the cookie for the session (no expiration date)
                    setCookie('authToken', 'YourAuthTokenValue', 0);
                }
                window.location.href = "summary.html";
                return;
            } else {
                alert("Eingegebene E-Mail oder Passwort sind falsch! Bitte versuchen Sie es erneut");
            }
        } else {
            alert('E-Mail oder Passwort wurden nicht übergeben!');
        }
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
        let response = await fetch(BASE_URL + path + ".json", {
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