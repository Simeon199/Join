// const BASE_URL = 'https://join-privat-default-rtdb.europe-west1.firebasedatabase.app/';

let isLoggedIn = false;

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

function invokeFunctions(){
    loadData();
    checkIfUserIsLoggedIn();
}

function logout(){
    isLoggedIn = false;
    localStorage.item = isLoggedIn;
}

function checkIfUserIsLoggedIn(){
    let status = localStorage.getItem('isLoggedIn');
    if(status == 'true'){
        window.location.href = 'summary.html';
    }
}

function saveLoggedInStatus(){
    localStorage.setItem('isLoggedIn', isLoggedIn);
}

async function testLoginFunction(){
    let loginEmail = document.getElementById('loginEmail').value;
    let loginPassword = document.getElementById('loginPassword').value;
    let remember = document.getElementById('remember').checked;
    let response = await loadData(path="");
    for(let key in response){
        let user = response[key];
        if(user["email"] && user["password"]){
            let email = user["email"];
            let password = user["password"];
            if(loginEmail == email && loginPassword == password){
                if(remember){
                    isLoggedIn = true;
                    saveLoggedInStatus();
                } else {
                    isLoggedIn = false;
                    saveLoggedInStatus();
                }
                window.location.href = "summary.html";
                return;
            } else {
                alert("Eingegebene E-Mail oder Passwort sind falsch! Bitte versuchen Sie es erneut");
                return;
            }
        } else {
            alert('E-Mail oder Passwort wurden nicht übergeben!');
        }
    }
}

function signUp(event){
    event.preventDefault();
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