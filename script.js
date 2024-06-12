function validatePassword() {
    let msgbox = document.getElementById('msgbox');
    //if (password !== passwordConfirm) {
    //    msgbox.innerHTML = 'Password incorrect';
    //    return false;
    //}
    //return true;
    msgbox.innerHTML = "Password incorrect";
}

// function validateCheckbox() {
//     let checkbox = document.getElementById('remember');
//     let loginBTN = document.getElementById('loginBtn');
//     if (checkbox.checked = true) {
//         loginBTN.enabled = true;
//     } else {
//         loginBTN.enabled = false;
//     }
// }

// function login() {
//     validateCheckbox();
//     validatePassword();
//     window.location.href='summary.html';
// }

function guestLogin(){
    sessionStorage.setItem('guestLoginStatus', 'true');
    window.location.href = 'summary.html';
}

function goToSignUp() {
    window.location.href="register.html"
}

function backToLogin() {
    window.location.href= "login.html"
}

// function invokeFunctions(){
//     loadData();
//     checkIfUserIsLoggedIn();
// }

function logout(){
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function createLoggedInStatusObject() {
    let obj = {
        'status': localStorage.getItem('isLoggedIn'),
        'currentUser': localStorage.getItem('currentUser'),
        'sessionUser': sessionStorage.getItem('currentUser'),
        'sessionStatus': sessionStorage.getItem('isLoggedIn'),
        'currentPath': window.location.pathname.split('/').pop(),
        'guestLoginStatus': sessionStorage.getItem('guestLoginStatus')
    }
    return obj;
}

function setStorageAttributes(){
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('guestLoginStatus');
    console.log("Sitzung abgelaufen. Benutzerdaten entfernt.");
}

function checkIfUserIsLoggedIn(){
    let LoggedInObject = createLoggedInStatusObject();
    if(LoggedInObject["guestLoginStatus"] == 'true'){
        if(LoggedInObject["currentPath"] !== 'summary.hmtl'){
            console.log('Nutzer ist als Gast eingeloggt');
        }
    } else if((LoggedInObject["status"] === 'true' && LoggedInObject["currentUser"]) || (LoggedInObject["sessionStatus"] === 'true' && LoggedInObject["sessionUser"])){
        console.log("Nutzer ist eingeloggt");
    } else {
        if(LoggedInObject["currentPath"] !== 'register.html' && LoggedInObject["currentPath"] !== 'login.html'){
            window.location.href='login.html';
        }
    }
    if (LoggedInObject["sessionStatus"] === 'true' && !LoggedInObject["sessionUser"]){
        setStorageAttributes();
    }
}

function saveLoggedInStatus(email, remember){
    if(remember){
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', email);
    } else {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', email);
    }
    return;
}

async function testLoginFunction(event){
    event.preventDefault();
    let loginEmail = document.getElementById('loginEmail').value;
    let loginPassword = document.getElementById('loginPassword').value;
    let remember = document.getElementById('remember').checked;
    let response = await loadData(path="");
    for(let key in response){
        let user = response[key];
        if(user["email"] && user["password"]){
            if(loginEmail == user["email"] && loginPassword == user["password"]){
                saveLoggedInStatus(user["email"], remember);
                window.location.href = "summary.html";
                return;
            }
        }
    }
    alert("Eingegebene E-Mail oder Passwort sind falsch! Bitte versuchen Sie es erneut");
}

function signUp(event){
    event.preventDefault();
    let name = document.getElementById('name').value;
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let passwordRepeat = document.getElementById('loginPasswordRepeat').value;
    let privacyPolicity = document.getElementById('privacyPolicity');
    checkSignInRequirements(email, password, passwordRepeat, privacyPolicity);
    let user = buildUserFunction(name, email, password);
    createUserAndShowPopup(path="", user);
}

function checkSignInRequirements(email, password, passwordRepeat, privacyPolicity){
    if (!checkEmailAndPasswordWhenSignUp(email, password)){
        return;
    }
    if (password !== passwordRepeat) {
        alert("Wiederholtes Passwort stimmt nicht mit dem ersten eingegeben Passwort überein");
        return;
    } 
    if (!privacyPolicity.checked) {
        alert("Akzeptieren Sie die Privacy Policy um fortzufahren");
        return;
    }
}

function buildUserFunction(name, email, password){
    let user = {
        "name": name,
        "email": email,
        "password": password
    }
    return user;
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

async function postDataToDatabase(path, data) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('Es gab ein Problem mit der Registrierung:', error);
        throw error;
    }
}

async function createUserAndShowPopup(path, user) {
    try {
        let responseToJson = await postDataToDatabase(path, user);
        showRegisterPopup();
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return responseToJson;
    } catch (error) {
        alert('Es gab ein Problem bei der Registrierung. Bitte versuchen Sie es später erneut');
    }
}

function showRegisterPopup() {
    let registerPopup = document.getElementById('registerPopup');
    registerPopup.classList.remove('d-none');
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
