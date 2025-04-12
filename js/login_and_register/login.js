import {signInWithEmailAndPassword, signInAnonymously } from "../../config/database.js";
import db from "../../config/database.js";

const auth = db.auth;
const database = db.database;

/**
 * This function clears the input fields, highlights them in red and throws an error message. This function is executed in the case of a failed login attempt.
 * 
 */

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
//   notification.innerHTML = `<p>Ups! Wrong Password or Email. Try again.</p>`;
//   loginInput.appendChild(notification);
// }

/**
* This function toggles the visibility of the login error.
* 
* @param {string} reportFailedLogin - The ID of the element that resports the failed login.
* @param {string} allErrorMessagesLogin - The ID of the element that contains all the login error messages. 
*/

// function removeReportLogin(reportFailedLogin, allErrorMessagesLogin) {
//   if (
//     document.getElementById(allErrorMessagesLogin).classList.contains("d-none") &&
//     document.getElementById(reportFailedLogin).classList.contains("d-none")
//   ) {
//     document.getElementById(allErrorMessagesLogin).classList.remove("d-none");
//     document.getElementById(allErrorMessagesLogin).classList.add("d-flex");
//     document.getElementById(reportFailedLogin).classList.remove("d-none");
//   } else {
//     document.getElementById(allErrorMessagesLogin).classList.remove("d-flex");
//     document.getElementById(allErrorMessagesLogin).classList.add("d-none");
//     document.getElementById(reportFailedLogin).classList.add("d-none");
//   }
// }

/**
 * This function finds the element with the specified ID and the element for all error messages. It removes the d-flex class and adds the d-none class to both elements to hide them.
 * 
 * @param {string} id - The ID of the element that should be hided.
 */

// function removeReport(id) {
//   let report = document.getElementById(id);
//   let allErrorMessages = document.getElementById("allErrorMessages");
//   allErrorMessages.classList.remove("d-flex");
//   allErrorMessages.classList.add("d-none");
//   report.classList.add("d-none");
// }


/**
 * This function removes the login information (the attributes "isLoggedIn", "currentUser" and "guestLoginStatus") from the sessionstorage.
 * 
 */

// function setStorageAttributes() {
//   sessionStorage.removeItem("isLoggedIn");
//   sessionStorage.removeItem("currentUser");
//   sessionStorage.removeItem("guestLoginStatus");
// }

/**
 * This function stores the logged-in status, current user's email, and user's nickname.
 * If the user chooses to be remembered, the information is saved in the local storage.
 * Otherwise, it's saved in the session storage.
 * 
 * @param {string} name - The nickname of the user.
 * @param {string} email - The email address of the user.
 * @param {boolean} remember - A flag indicating whether to remember the user across sessions.
 * @returns
 */

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

/**
 * This function removes the "d-none" class from the element with the ID "registerPopup"
 * to make the registration popup visible.
 * 
 */

// function showRegisterPopup() {
//   let registerPopup = document.getElementById("registerPopup");
//   registerPopup.classList.remove("d-none");
// }

/**
 * This function changes the visibility of the password field identified by the provided variable.
 * It updates the associated visibility icons and checks the content type of the password field.
 * 
 * @param {string} variable - The ID of the password field to be toggled.
 */

// function showPassword(variable) {
//   let passwordContent = document.getElementById(variable);
//   let visibilityInputImage = document.getElementById("visibilityInputImage");
//   let visibilityInputImageRepeat = document.getElementById("visibilityInputImageRepeat");
//   let visibility = document.getElementById("visibility");
//   let visibilityRepeat = document.getElementById("visibilityRepeat");
//   checkAllCasesForShowPassword(variable, visibilityInputImage, visibilityInputImageRepeat, visibility, visibilityRepeat);
//   checkPasswordContentType(passwordContent);
// }

/**
 * This function updates the visibility of the password field identified by the provided variable.
 * It also manages the display of the visibility and lock icons based on the current state.
 * 
 * @param {string} variable - The ID of the password field whose visibility is being toggled.
 */

function showLoginPassword(variable) {
  let passwordContent = document.getElementById(variable);
  let loginLock = document.getElementById("loginLock");
  let visibility = document.getElementById("visibility");
  let visibilityInputImage = document.getElementById("visibilityInputImage");
  if (visibility.classList.contains("d-none")) {
    visibility.classList.remove("d-none");
    visibilityInputImage.classList.add("d-none");
    loginLock.classList.add("d-none");
  } else if (visibilityInputImage.classList.contains("d-none")) {
    visibility.classList.add("d-none");
    visibilityInputImage.classList.remove("d-none");
  }
  checkPasswordContentType(passwordContent);
}

/**
 * This function adds an event listener to the password input field. Depending on the input field's
 * value and type, it shows or hides the visibility icons and the login lock icon.
 * 
 * @param {HTMLElement} loginPassword - The password input field element.
 * @param {HTMLElement} loginLock - The element representing the login lock icon.
 * @param {HTMLElement} visibilityInputImage - The element representing the visibility input image.
 * @param {HTMLElement} visibility - The element representing the visibility control.
 */

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

/**
 * Manages the login process. Validates the user's email and password.
 * 
 * @param {Event} event - The event object from the form submission.
 */

// async function loginFunction(event) {
//   event.preventDefault();
//   let loginEmail = document.getElementById("loginEmail").value;
//   let loginPassword = document.getElementById("loginPassword").value;
//   let remember = document.getElementById("remember").checked;
//   let response = await loadData((path = "/users"));
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

// Login-Funktionalität

document.addEventListener('DOMContentLoaded', () => {
  let loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener("submit", loginFunction);
  }
});

document.getElementById('guestLogIn').addEventListener('click', () => {
  signInAnonymously(auth).then(result => {
    const user = result.user;
    console.log(`Als Gast eingeloggt! UID: ${user.uid}`);
    window.location.href="summary.html";
  }).catch(error => {
    console.error(error);
    console.log("Fehler beim Login: " + error.message);
  });
});

function loginFunction(event){
  event.preventDefault();
  let email = document.getElementById('loginEmail').value;
  let password = document.getElementById('loginPassword').value;
  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    const user = userCredential.user;
    console.log("Login erfolgreich: ", user.email);
    window.location.href="summary.html";
  }).catch((error) => {
    console.log("Fehler beim Login: ", error.message);
  });
}

// Optionaler Code, um zusätzliche Informationen aus der Datenbank zu laden

// const userRef = ref(db, "users/" + user.uid);
// get(userRef).then((snapshot) => {
//   if(snapshot.exists()){
//     console.log("Benutzerdaten: ", snapshot.val());
//   } else {
//     console.log("Keine zusätzlichen Benutzerdaten gefunden");
//   }
// });