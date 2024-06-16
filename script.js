// stopEvent
function stopEvent(event) {
  event.stopPropagation();
}

function greetUser(){
  let nickname = localStorage.getItem("userNickname");
  if(!nickname){
    nickname = sessionStorage.getItem("userNickname");
  }
  if(nickname){+
    alert("Seit gegrüßt " + nickname);
  }
}

function guestLogin() {
  sessionStorage.setItem("guestLoginStatus", "true");
  window.location.href = "summary.html";
}

function goToSignUp() {
  window.location.href = "register.html";
}

function backToLogin() {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  localStorage.removeItem('userNickname');
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("userNickname");
  window.location.href = "login.html";
}

function createLoggedInStatusObject() {
  let obj = {
    status: localStorage.getItem("isLoggedIn"),
    currentUser: localStorage.getItem("currentUser"),
    sessionUser: sessionStorage.getItem("currentUser"),
    sessionStatus: sessionStorage.getItem("isLoggedIn"),
    currentPath: window.location.pathname.split("/").pop(),
    guestLoginStatus: sessionStorage.getItem("guestLoginStatus"),
  };
  return obj;
}

function setStorageAttributes() {
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("guestLoginStatus");
  console.log("Sitzung abgelaufen. Benutzerdaten entfernt.");
}

function checkIfUserIsLoggedIn() {
  let LoggedInObject = createLoggedInStatusObject();
  if (LoggedInObject["guestLoginStatus"] == "true") {
    if (LoggedInObject["currentPath"] !== "summary.hmtl") {
      console.log("Nutzer ist als Gast eingeloggt");
    }
  } else if (
    (LoggedInObject["status"] === "true" && LoggedInObject["currentUser"]) ||
    (LoggedInObject["sessionStatus"] === "true" && LoggedInObject["sessionUser"])
  ) {
    console.log("Nutzer ist eingeloggt");
  } else {
    if (
      LoggedInObject["currentPath"] !== "register.html" &&
      LoggedInObject["currentPath"] !== "login.html"
    ) {
      window.location.href = "login.html";
    }
  }
  if (LoggedInObject["sessionStatus"] === "true" && !LoggedInObject["sessionUser"]) {
    setStorageAttributes();
  }
}

function saveLoggedInStatus(name, email, remember) {
  if (remember) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", email);
    localStorage.setItem("userNickname", name);
  } else {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("currentUser", email);
    sessionStorage.setItem("userNickname", name);
  }
  return;
}

async function testLoginFunction(event) {
  event.preventDefault();
  let loginEmail = document.getElementById("loginEmail").value;
  let loginPassword = document.getElementById("loginPassword").value;
  let remember = document.getElementById("remember").checked;
  let response = await loadData((path = ""));
  for (let key in response) {
    let user = response[key];
    if (user["email"] && user["password"]) {
      if (loginEmail == user["email"] && loginPassword == user["password"]) {
        saveLoggedInStatus(user["name"], user["email"], remember);
        window.location.href = "summary.html";
        return;
      }
    }
  }
  throwLoginError();
}

function throwLoginError() {
  let loginPasswordInput = document.getElementById("loginPasswordInputField");
  let loginInput = document.getElementById("loginInput");
  let loginPassword = document.getElementById("loginPassword");
  loginPassword.value = "";
  loginPasswordInput.style.border = "1px solid red";
  let existingNotification = document.querySelector(".notification.error");
  if (existingNotification) {
    existingNotification.remove();
  }
  let notification = document.createElement("div");
  notification.classList.add("notification", "error");
  notification.innerHTML = `<p>Ups! Wrong Password. Try again.</p>`;
  loginInput.appendChild(notification);
}

async function signUp(event) {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;
  let passwordRepeat = document.getElementById("loginPasswordRepeat").value;
  let privacyPolicity = document.getElementById("privacyPolicity");
  let signUpValid = await checkSignInRequirements(name, email, password, passwordRepeat, privacyPolicity);
  if (!signUpValid) {
    return;
  }
  let user = buildUserFunction(name, email, password);
  await createUserAndShowPopup((path = ""), user);
}

async function checkSignInRequirements(name, email, password, passwordRepeat, privacyPolicity) {
  if (!checkEmailAndPasswordWhenSignUp(email, password)) {
    return false;
  }
  if (await NicknameAlreadyExists(name) == true) {
    return false;
  }
  if (password !== passwordRepeat) {
    throwSignUpError();
    return false;
  }
  if (!privacyPolicity.checked) {
    alert("Akzeptieren Sie die Privacy Policy um fortzufahren");
    return false;
  }
  return true;
}

async function NicknameAlreadyExists(name) {
  let response = await loadData((path = ""));
  for (let key in response) {
    let user = response[key];
    let availabelNickname = user["name"];
    if (availabelNickname == name) {
      alert("Dieser Nutzername ist schon vergeben!");
      return true;
    }
  }
  return false;
}

function throwSignUpError() {
  let signUpInput = document.getElementById("signUpInput");
  let signUpPasswordRepeat = document.getElementById("signUpPasswordRepeat");
  signUpPasswordRepeat.style.border = "1px solid red";
  let notification = document.createElement("div");
  notification.classList.add("notification", "error");
  notification.innerHTML = `<p>Ups! Your password dont match.</p>`;
  signUpInput.appendChild(notification);
}

function buildUserFunction(name, email, password) {
  let user = {
    name: name,
    email: email,
    password: password,
  };
  return user;
}

function checkEmailAndPasswordWhenSignUp(email, password) {
  let emailError = checkIfEmailValid(email);
  if (emailError) {
    alert(emailError);
    return false;
  }
  let passwordError = checkIfPasswordIsValid(password);
  if (passwordError) {
    alert(passwordError);
    return false;
  }
  return true;
}

async function postDataToDatabase(path, data) {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Es gab ein Problem mit der Registrierung:", error);
    throw error;
  }
}

async function createUserAndShowPopup(path, user) {
  try {
    let responseToJson = await postDataToDatabase(path, user);
    showRegisterPopup();
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
    return responseToJson;
  } catch (error) {
    alert("Es gab ein Problem bei der Registrierung. Bitte versuchen Sie es später erneut");
  }
}

function showRegisterPopup() {
  let registerPopup = document.getElementById("registerPopup");
  registerPopup.classList.remove("d-none");
}

function checkIfEmailValid(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
}

function checkIfPasswordIsValid(password) {
  let minLength = 6;
  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (password.length < minLength) {
    return `Das Passwort muss mindestens ${minLength} Zeichen lang sein.`;
  }
  if (!regex.test(password)) {
    return "Das Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.";
  }
  return null;
}

function showPassword(variable) {
  let passwordContent = document.getElementById(variable);
  let visibilityInputImage = document.getElementById("visibilityInputImage");
  let visibilityInputImageRepeat = document.getElementById("visibilityInputImageRepeat");
  let inputLock = document.getElementById("inputLock");
  let inputLockRepeat = document.getElementById("inputLockRepeat");
  checkAllCasesForShowPassword(
    variable,
    visibilityInputImage,
    visibilityInputImageRepeat,
    inputLock,
    inputLockRepeat
  );
  checkPasswordContentType(passwordContent);
}

function showLoginPassword(variable) {
  let passwordContent = document.getElementById(variable);
  let loginLock = document.getElementById("loginLock");
  let visibilityInputImage = document.getElementById("visibilityInputImage");
  if (variable == "loginPassword" && visibilityInputImage.classList.contains("d-none")) {
    visibilityInputImage.classList.remove("d-none");
    loginLock.classList.add("d-none");
  } else {
    visibilityInputImage.classList.add("d-none");
    loginLock.classList.remove("d-none");
  }
  checkPasswordContentType(passwordContent);
}

function checkAllCasesForShowPassword(
  variable,
  visibilityInputImage,
  visibilityInputImageRepeat,
  inputLock,
  inputLockRepeat
) {
  if (variable == "loginPassword" && visibilityInputImage.classList.contains("d-none")) {
    visibilityInputImage.classList.remove("d-none");
    inputLock.classList.add("d-none");
  } else if (variable == "loginPassword" && inputLock.classList.contains("d-none")) {
    inputLock.classList.remove("d-none");
    visibilityInputImage.classList.add("d-none");
  } else if (
    variable == "loginPasswordRepeat" &&
    visibilityInputImageRepeat.classList.contains("d-none")
  ) {
    visibilityInputImageRepeat.classList.remove("d-none");
    inputLockRepeat.classList.add("d-none");
  } else if (variable == "loginPasswordRepeat" && inputLockRepeat.classList.contains("d-none")) {
    inputLockRepeat.classList.remove("d-none");
    visibilityInputImageRepeat.classList.add("d-none");
  }
}

function checkPasswordContentType(passwordContent) {
  if (passwordContent.type == "password") {
    passwordContent.type = "text";
  } else {
    passwordContent.type = "password";
  }
}