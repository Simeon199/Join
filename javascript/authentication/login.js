/**
 * Manages the login process. Validates the user's email and password.
 * 
 * @param {Event} event - The event object from the form submission.
 */

async function loginFunction(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const remember = document.getElementById("remember").checked;
  const users = await loadData("/users");
  const user = findUser(email, password, users);
  if (user) {
    saveLoggedInStatus(user.name, user.email, remember);
    window.location.href = "summary.html";
  } else {
    throwLoginError();
  }
}

/**
 * Finds a user by email and password from the users object.
 * 
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {object} users - The users data object.
 * @returns {object|null} The user object if found, null otherwise.
 */

function findUser(email, password, users) {
  for (let key in users) {
    const user = users[key];
    if (user.email === email && user.password === password) {
      return user;
    }
  }
  return null;
}

/**
 * This function clears the input fields, highlights them in red and throws an error message. This function is executed in the case of a failed login attempt.
 * 
 */

function throwLoginError() {
  clearLoginFields();
  showLoginErrorNotification();
}

/**
 * Clears the login password field and highlights the input in red.
 */

function clearLoginFields() {
  const loginPassword = document.getElementById("loginPassword");
  loginPassword.value = "";
  const loginPasswordInput = document.getElementById("loginPasswordInputField");
  loginPasswordInput.style.border = "1px solid red";
}

/**
 * Shows the login error notification.
 */

function showLoginErrorNotification() {
  const existing = document.querySelector(".notification.error");
  if (existing) existing.remove();
  const notification = document.createElement("div");
  notification.classList.add("notification", "error");
  notification.innerHTML = "<p>Ups! Wrong Password or Email. Try again.</p>";
  const loginInput = document.getElementById("loginInput");
  loginInput.appendChild(notification);
}

/**
* This function toggles the visibility of the login error.
* 
* @param {string} reportFailedLogin - The ID of the element that reports the failed login.
* @param {string} allErrorMessagesLogin - The ID of the element that contains all the login error messages. 
*/

function removeReportLogin(reportFailedLogin, allErrorMessagesLogin) {
  const allErrors = document.getElementById(allErrorMessagesLogin);
  const report = document.getElementById(reportFailedLogin);
  const isHidden = allErrors.classList.contains("d-none") && report.classList.contains("d-none");
  if (isHidden) {
    allErrors.classList.remove("d-none");
    allErrors.classList.add("d-flex");
    report.classList.remove("d-none");
  } else {
    allErrors.classList.remove("d-flex");
    allErrors.classList.add("d-none");
    report.classList.add("d-none");
  }
}

/**
 * This function finds the element with the specified ID and the element for all error messages. It removes the d-flex class and adds the d-none class to both elements to hide them.
 * 
 * @param {string} id - The ID of the element that should be hided.
 */

function removeReport(id) {
  let report = document.getElementById(id);
  let allErrorMessages = document.getElementById("allErrorMessages");
  allErrorMessages.classList.remove("d-flex");
  allErrorMessages.classList.add("d-none");
  report.classList.add("d-none");
}

/**
 * This function checks the visibility of the checkbox element with the ID "checkbox-check".
 * If the checkbox is currently visible, it hides it and if the checkbox is currently hidden, it shows it.
 * 
 */

function addCheck() {
  let checkboxCheck = document.getElementById("checkbox-check");
  if (!checkboxCheck.classList.contains("d-none")) {
    checkboxCheck.classList.add("d-none");
  } else {
    checkboxCheck.classList.remove("d-none");
  }
}

/**
 * This function sets the guest login status in the session storage and redirects the user to the summary page.
 * It also marks the first-time login status in the local storage.
 * 
 */

function guestLogin() {
  sessionStorage.setItem("guestLoginStatus", "true");
  window.location.href = "summary.html";

  localStorage.setItem("firstTime", "true");
}

/**
 * This function removes the login information (the attributes "isLoggedIn", "currentUser" and "guestLoginStatus") from the sessionstorage.
 * 
 */

function setStorageAttributes() {
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("guestLoginStatus");
}

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

/**
 * This function removes the "d-none" class from the element with the ID "registerPopup"
 * to make the registration popup visible.
 * 
 */

function showRegisterPopup() {
  let registerPopup = document.getElementById("registerPopup");
  registerPopup.classList.remove("d-none");
}

/**
 * This function changes the visibility of the password field identified by the provided variable.
 * It updates the associated visibility icons and checks the content type of the password field.
 * 
 * @param {string} variable - The ID of the password field to be toggled.
 */

function showPassword(variable) {
  let passwordContent = document.getElementById(variable);
  let visibilityInputImage = document.getElementById("visibilityInputImage");
  let visibilityInputImageRepeat = document.getElementById("visibilityInputImageRepeat");
  let visibility = document.getElementById("visibility");
  let visibilityRepeat = document.getElementById("visibilityRepeat");
  checkAllCasesForShowPassword(variable, visibilityInputImage, visibilityInputImageRepeat, visibility, visibilityRepeat);
  checkPasswordContentType(passwordContent);
}

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

function loginPasswordFunction(loginPassword, loginLock, visibilityInputImage, visibility) {
  loginPassword.addEventListener("input", () => handlePasswordInput(loginPassword, loginLock, visibilityInputImage, visibility));
}

/**
 * Handles the input event for the password field, updating icon visibility.
 * 
 * @param {HTMLElement} loginPassword - The password input field.
 * @param {HTMLElement} loginLock - The lock icon.
 * @param {HTMLElement} visibilityInputImage - The visibility input image.
 * @param {HTMLElement} visibility - The visibility control.
 */

function handlePasswordInput(loginPassword, loginLock, visibilityInputImage, visibility) {
  loginLock.classList.add("d-none");
  if (loginPassword.value.length > 0 && loginPassword.type === "password") {
    visibilityInputImage.classList.remove("d-none");
    visibility.classList.add("d-none");
  } else if (loginPassword.value.length > 0 && loginPassword.type === "text") {
    visibilityInputImage.classList.add("d-none");
    visibility.classList.remove("d-none");
  } else {
    loginLock.classList.remove("d-none");
    visibilityInputImage.classList.add("d-none");
    visibility.classList.add("d-none");
  }
}

/**
 * This function redirects the user directly to the login site.
 * 
 */

function backToLogin() {
  window.location.href = "login.html";
}

/**
 * This function redirects the user directly to the sign up site.
 * 
 */

function goToSignUp() {
  window.location.href = "register.html";
}

/**
 * This function changes the type of the given password input field to either "text" or "password".
 * If the current type is "password", it sets the type to "text" to show the password. If the current
 * type is "text", it sets the type back to "password" to hide the password.
 * 
 * @param {HTMLInputElement} passwordContent - The password input field element whose type will be toggled.
 */

function checkPasswordContentType(passwordContent) {
  if (passwordContent.type == "password") {
    passwordContent.type = "text";
  } else {
    passwordContent.type = "password";
  }
}