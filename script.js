checkWebsiteLocation();
checkIfUserIsLoggedIn();

// stopEvent
function stopEvent(event) {
  event.stopPropagation();
}

function greetUser(){
  let nickname = localStorage.getItem("userNickname");
  if (!nickname) {
    nickname = sessionStorage.getItem("userNickname");
  }
  if (nickname) {
    alert("Sei gegrüßt " + nickname);
  }
}

// function addCheck() {
//   let checkboxCheck = document.getElementById("checkbox-check");
//   if (!checkboxCheck.classList.contains("d-none")) {
//     checkboxCheck.classList.add("d-none");
//   } else {
//     checkboxCheck.classList.remove("d-none");
//   }
// }

// function guestLogin() {
//   sessionStorage.setItem("guestLoginStatus", "true");
//   window.location.href = "summary.html";
// }

// function goToSignUp() {
//   window.location.href = "register.html";
// }

// function backToLogin() {
//   window.location.href = "login.html";
// }

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

// function setStorageAttributes() {
//   sessionStorage.removeItem("isLoggedIn");
//   sessionStorage.removeItem("currentUser");
//   sessionStorage.removeItem("guestLoginStatus");
//   console.log("Sitzung abgelaufen. Benutzerdaten entfernt.");
// }

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

// function saveLoggedInStatus(name, email, remember) {
//   if (remember) {
//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("currentUser", email);
//     localStorage.setItem("userNickname", name);
//   } else {
//     sessionStorage.setItem("isLoggedIn", "true");
//     sessionStorage.setItem("currentUser", email);
//     sessionStorage.setItem("userNickname", name);
//   }
//   return;
// }

// async function testLoginFunction(event) {
//   event.preventDefault();
//   let loginEmail = document.getElementById("loginEmail").value;
//   let loginPassword = document.getElementById("loginPassword").value;
//   let remember = document.getElementById("remember").checked;
//   let response = await loadData((path = ""));
//   for (let key in response) {
//     let user = response[key];
//     if (user["email"] && user["password"]) {
//       if (loginEmail == user["email"] && loginPassword == user["password"]) {
//         saveLoggedInStatus(user["name"], user["email"], remember);
//         window.location.href = "summary.html";
//         return;
//       }
//     }
//   }
//   throwLoginError();
// }

// function throwLoginError() {
//   let loginPasswordInput = document.getElementById("loginPasswordInputField");
//   let loginInput = document.getElementById("loginInput");
//   let loginPassword = document.getElementById("loginPassword");
//   loginPassword.value = "";
//   loginPasswordInput.style.border = "1px solid red";
//   let existingNotification = document.querySelector(".notification.error");
//   if (existingNotification) {
//     existingNotification.remove();
//   }
//   let notification = document.createElement("div");
//   notification.classList.add("notification", "error");
//   notification.innerHTML = `<p>Ups! Wrong Password. Try again.</p>`;
//   loginInput.appendChild(notification);
// }

// async function signUp(event) {
//   event.preventDefault();
//   let name = document.getElementById("name").value;
//   let email = document.getElementById("loginEmail").value;
//   let password = document.getElementById("loginPassword").value;
//   let passwordRepeat = document.getElementById("loginPasswordRepeat").value;
//   let privacyPolicity = document.getElementById("privacyPolicity");
//   let signUpValid = await checkSignInRequirements(
//     name,
//     email,
//     password,
//     passwordRepeat,
//     privacyPolicity
//   );
//   if (!signUpValid) {
//     return;
//   }
//   let user = buildUserFunction(name, email, password);
//   await createUserAndShowPopup((path = ""), user);
// }

// async function checkSignInRequirements(name, email, password, passwordRepeat, privacyPolicity) {
//   if (!checkEmailAndPasswordWhenSignUp(email, password)) {
//     return false;
//   }
//   if ((await NicknameAlreadyExists(name)) == true) {
//     return false;
//   }
//   if (password !== passwordRepeat) {
//     throwSignUpError();
//     return false;
//   }
//   if (!privacyPolicity.checked) {
//     alert("Akzeptieren Sie die Privacy Policy um fortzufahren");
//     return false;
//   }
//   return true;
// }

// async function NicknameAlreadyExists(name) {
//   let response = await loadData((path = ""));
//   for (let key in response) {
//     let user = response[key];
//     let availabelNickname = user["name"];
//     if (availabelNickname == name) {
//       alert("Dieser Nutzername ist schon vergeben!");
//       return true;
//     }
//   }
//   return false;
// }

// function throwSignUpError() {
//   let signUpInput = document.getElementById("signUpInput");
//   let signUpPasswordRepeat = document.getElementById("signUpPasswordRepeat");
//   signUpPasswordRepeat.style.border = "1px solid red";
//   let notification = document.createElement("div");
//   notification.classList.add("notification", "error");
//   notification.innerHTML = `<p>Ups! Your password dont match.</p>`;
//   signUpInput.appendChild(notification);
// }

// function buildUserFunction(name, email, password) {
//   let user = {
//     name: name,
//     email: email,
//     password: password,
//   };
//   return user;
// }

// function checkEmailAndPasswordWhenSignUp(email, password) {
//   let emailError = checkIfEmailValid(email);
//   if (emailError) {
//     alert(emailError);
//     return false;
//   }
//   let passwordError = checkIfPasswordIsValid(password);
//   if (passwordError) {
//     alert(passwordError);
//     return false;
//   }
//   return true;
// }

// async function postDataToDatabase(path, data) {
//   try {
//     let response = await fetch(BASE_URL + path + ".json", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       throw new Error("Network response was not ok: " + response.statusText);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Es gab ein Problem mit der Registrierung:", error);
//     throw error;
//   }
// }

// async function createUserAndShowPopup(path, user) {
//   try {
//     let responseToJson = await postDataToDatabase(path, user);
//     showRegisterPopup();
//     setTimeout(() => {
//       window.location.href = "login.html";
//     }, 1000);
//     return responseToJson;
//   } catch (error) {
//     alert("Es gab ein Problem bei der Registrierung. Bitte versuchen Sie es später erneut");
//   }
// }

// function showRegisterPopup() {
//   let registerPopup = document.getElementById("registerPopup");
//   registerPopup.classList.remove("d-none");
// }

// function checkIfEmailValid(email) {
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return regex.test(email) ? null : "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
// }

// function checkIfPasswordIsValid(password) {
//   let minLength = 6;
//   let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
//   if (password.length < minLength) {
//     return `Das Passwort muss mindestens ${minLength} Zeichen lang sein.`;
//   }
//   if (!regex.test(password)) {
//     return "Das Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben, und eine Zahl enthalten.";
//   }
//   return null;
// }

// function showPassword(variable) {
//   let passwordContent = document.getElementById(variable);
//   let visibilityInputImage = document.getElementById("visibilityInputImage");
//   let visibilityInputImageRepeat = document.getElementById("visibilityInputImageRepeat");
//   let visibility = document.getElementById("visibility");
//   let visibilityRepeat = document.getElementById("visibilityRepeat");
//   checkAllCasesForShowPassword(
//     variable,
//     visibilityInputImage,
//     visibilityInputImageRepeat,
//     visibility,
//     visibilityRepeat
//   );
//   checkPasswordContentType(passwordContent);
// }

// function showLoginPassword(variable) {
//   let passwordContent = document.getElementById(variable);
//   let loginLock = document.getElementById("loginLock");
//   let visibility = document.getElementById("visibility");
//   let visibilityInputImage = document.getElementById("visibilityInputImage");
//   if (visibility.classList.contains("d-none")) {
//     visibility.classList.remove("d-none");
//     visibilityInputImage.classList.add("d-none");
//     loginLock.classList.add("d-none");
//   } else if (visibilityInputImage.classList.contains("d-none")) {
//     visibility.classList.add("d-none");
//     visibilityInputImage.classList.remove("d-none");
//   }
//   checkPasswordContentType(passwordContent);
// }

function registerInputFieldFunction(
  inputLock,
  registerInputField,
  visibilityInputImage,
  visibility
) {
  registerInputField.addEventListener("input", function () {
    inputLock.classList.add("d-none");
    if (registerInputField.value.length > 0 && registerInputField.type == "password") {
      visibilityInputImage.classList.remove("d-none");
      visibility.classList.add("d-none");
    } else if (registerInputField.value.length > 0 && registerInputField.type == "text") {
      visibilityInputImage.classList.add("d-none");
      visibility.classList.remove("d-none");
    } else if (registerInputField.value.length == 0) {
      inputLock.classList.remove("d-none");
      visibilityInputImage.classList.add("d-none");
      visibility.classList.add("d-none");
    }
  });
}

function registerInputFieldRepeatFunction(
  registerInputFieldRepeat,
  inputLockRepeat,
  visibilityInputImageRepeat,
  visibility,
  visibilityRepeat
) {
  registerInputFieldRepeat.addEventListener("input", function () {
    inputLockRepeat.classList.add("d-none");
    if (registerInputFieldRepeat.value.length > 0 && registerInputFieldRepeat.type == "password") {
      visibilityInputImageRepeat.classList.remove("d-none");
      visibility.classList.add("d-none");
    } else if (
      registerInputFieldRepeat.value.length > 0 &&
      registerInputFieldRepeat.type == "text"
    ) {
      visibilityInputImageRepeat.classList.add("d-none");
      visibilityRepeat.classList.remove("d-none");
    } else if (registerInputFieldRepeat.value.length == 0) {
      inputLockRepeat.classList.remove("d-none");
      visibilityInputImageRepeat.classList.add("d-none");
      visibilityRepeat.classList.add("d-none");
    }
  });
}

// function loginPasswordFunction(loginPassword, loginLock, visibilityInputImage, visibility) {
//   loginPassword.addEventListener("input", function () {
//     loginLock.classList.add("d-none");
//     if (loginPassword.value.length > 0 && loginPassword.type == "password") {
//       visibilityInputImage.classList.remove("d-none");
//       visibility.classList.add("d-none");
//     } else if (loginPassword.value.length > 0 && loginPassword.type == "text") {
//       visibilityInputImage.classList.add("d-none");
//       visibility.classList.remove("d-none");
//     } else if (loginPassword.value.length == 0) {
//       loginLock.classList.remove("d-none");
//       visibilityInputImage.classList.add("d-none");
//       visibility.classList.add("d-none");
//     }
//   });
// }

function checkWebsiteLocation() {
  let currentURL = window.location.href;
  if (currentURL.includes("login.html")) {
    document.addEventListener("DOMContentLoaded", () => {
      let loginPassword = document.getElementById("loginPassword");
      let loginLock = document.getElementById("loginLock");
      loginPasswordFunction(loginPassword, loginLock, visibilityInputImage, visibility);
    });
  } else if (currentURL.includes("register.html")) {
    document.addEventListener("DOMContentLoaded", () => {
      let obj = createObjectforEventListener();
      registerInputFieldFunction(
        obj["inputLock"],
        obj["registerInputField"],
        obj["visibilityInputImage"],
        obj["visibility"]
      );
      registerInputFieldRepeatFunction(
        obj["registerInputFieldRepeat"],
        obj["inputLockRepeat"],
        obj["visibilityInputImageRepeat"],
        obj["visibility"],
        obj["visibilityRepeat"]
      );
    });
  } else {
    checkIfUserIsLoggedIn();
  }
}

function createObjectforEventListener() {
  let object = {
    visibility: document.getElementById("visibility"),
    visibilityRepeat: document.getElementById("visibilityRepeat"),
    registerInputField: document.getElementById("loginPassword"),
    registerInputFieldRepeat: document.getElementById("loginPasswordRepeat"),
    visibilityInputImage: document.getElementById("visibilityInputImage"),
    visibilityInputImageRepeat: document.getElementById("visibilityInputImageRepeat"),
    inputLock: document.getElementById("inputLock"),
    inputLockRepeat: document.getElementById("inputLockRepeat"),
  };
  return object;
}

// function checkAllCasesForShowPassword(
//   variable,
//   visibilityInputImage,
//   visibilityInputImageRepeat,
//   visibility,
//   visibilityRepeat
// ) {
//   if (variable == "loginPassword" && visibilityInputImage.classList.contains("d-none")) {
//     visibilityInputImage.classList.remove("d-none");
//     visibility.classList.add("d-none");
//   } else if (variable == "loginPassword" && inputLock.classList.contains("d-none")) {
//     visibility.classList.remove("d-none");
//     visibilityInputImage.classList.add("d-none");
//   } else if (
//     variable == "loginPasswordRepeat" &&
//     visibilityInputImageRepeat.classList.contains("d-none")
//   ) {
//     visibilityInputImageRepeat.classList.remove("d-none");
//     visibilityRepeat.classList.add("d-none");
//   } else if (variable == "loginPasswordRepeat" && inputLockRepeat.classList.contains("d-none")) {
//     visibilityRepeat.classList.remove("d-none");
//     visibilityInputImageRepeat.classList.add("d-none");
//   }
// }

// function checkPasswordContentType(passwordContent) {
//   if (passwordContent.type == "password") {
//     passwordContent.type = "text";
//   } else {
//     passwordContent.type = "password";
//   }
// }
