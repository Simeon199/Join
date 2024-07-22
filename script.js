checkWebsiteLocation();
checkIfUserIsLoggedIn();

/**
 * Stops the propagation of an event through the DOM.
 * 
 * @param {Event} event - The event object to stop propagation for.
 */

function stopEvent(event) {
  event.stopPropagation();
}

/**
 * Creates an object representing the current logged-in status and user information.
 * 
 */

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

/**
 * Redirects the user to the login site.
 * 
 */

function redirectToLogin() {
  window.location.href = "login.html";
}

/**
 * Sets session attributes related to user login status.
 * 
 * This function updates the sessionStorage to set the "isLoggedIn" attribute to "false",
 * indicating that the user is not logged in. It then calls the `isNotLoggedIn` function.
 */

function setSessionAttributes() {
  sessionStorage.setItem("isLoggedIn", "false");
  isNotLoggedIn();
}

/**
 * This function evaluates the `guestLoginStatus` and `currentPath` properties of the provided
 * object to determine if the user is currently logged in as a guest and is not on the "summary.html" page.
 * 
 * @param {Object} obj - An object containing user and login information.
 * @param {string} obj.guestLoginStatus - The guest login status ("true" or other values).
 * @param {string} obj.currentPath - The current path of the window location.
 */

function isGuestLoggedIn(obj) {
  return obj["guestLoginStatus"] == "true" && obj["currentPath"] !== "summary.html";
}

/**
 * This function determines if the user is logged in by evaluating either the localStorage or
 * sessionStorage status and user details.
 * 
 * @param {Object} obj - An object containing login status and user information.
 * @param {string} obj.status - The login status from localStorage ("true" or other values).
 * @param {string} obj.currentUser - The current user email from localStorage.
 * @param {string} obj.sessionStatus - The login status from sessionStorage ("true" or other values).
 * @param {string} obj.sessionUser - The current user email from sessionStorage.
 */

function isUserLoggedIn(obj) {
  return (obj["status"] === "true" && obj["currentUser"]) || (obj["sessionStatus"] === "true" && obj["sessionUser"]);
}

/**
 * This function checks if the current path is not one of the specified pages (e.g., "register.html",
 * "login.html", "legal_notice.html", "privacy_policy_en.html") and if the provided boolean flag is `true`.
 * It returns `true` if both conditions are met, indicating that a redirect should occur.
 * 
 * @param {Object} obj - An object containing the current path information.
 * @param {string} obj.currentPath - The current path of the window location.
 * @param {boolean} boolean - A flag indicating whether the redirect condition is met.
 */

function shouldRedirect(obj, bolean) {
  return (obj["currentPath"] !== "register.html" && obj["currentPath"] !== "login.html" &&
    obj["currentPath"] !== "legal_notice.html" && obj["currentPath"] !== "privacy_policy_en.html") && bolean;
}

/**
 * Checks if the user is logged in and manages redirection and session attributes accordingly thereby performing the following actions:
 * - Redirect the user to the login page if required.
 * - Sets storage attributes if the session status indicates an active session without a current user.
 * - Updates session attributes or removes the "isLoggedIn" item from sessionStorage based on the current path and boolean flag.
 * 
 */

function checkIfUserIsLoggedIn() {
  let LoggedInObject = createLoggedInStatusObject();
  let bolean = proveIfEverythingIsNullExceptCurrentPath(LoggedInObject);
  if (isGuestLoggedIn(LoggedInObject) || isUserLoggedIn(LoggedInObject)) return;
  if (shouldRedirect(LoggedInObject, bolean)) {
    redirectToLogin();
  }
  if (LoggedInObject["sessionStatus"] === "true" && !LoggedInObject["sessionUser"] &&
    (LoggedInObject["currentPath"] !== "legal_notice.html" || LoggedInObject["currentPath"] !== "privacy_policy_en.html")) {
    setStorageAttributes();
  }
  if (bolean && (LoggedInObject["currentPath"] == "legal_notice.html" || LoggedInObject["currentPath"] == "privacy_policy_en.html")) {
    setSessionAttributes();
  } else {
    sessionStorage.removeItem("isLoggedIn");
  }
}

/**
 * This function removes session-related information associated with the user's login state and current session (namely the attributes "isLoggedIn", "currentUser" and "guestLoginStatus").
 * 
 */

function setStorageAttributes() {
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("guestLoginStatus");
}

function proveIfEverythingIsNullExceptCurrentPath(obj) {
  if (obj["currentPath"] && obj["currentUser"] == null && obj["guestLoginStatus"] == null && obj["sessionUser"] == null) {
    return true;
  } else {
    return false;
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

function testLoginStatus() {
  if (!localStorage.getItem("isLoggedIn") || !sessionStorage.getItem("isLoggedIn")) {
    sessionStorage.setItem("isLoggedIn", "true");
  }
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

function showRegisterPopup() {
  let registerPopup = document.getElementById("registerPopup");
  registerPopup.classList.remove("d-none");
}

function showPassword(variable) {
  let passwordContent = document.getElementById(variable);
  let visibilityInputImage = document.getElementById("visibilityInputImage");
  let visibilityInputImageRepeat = document.getElementById("visibilityInputImageRepeat");
  let visibility = document.getElementById("visibility");
  let visibilityRepeat = document.getElementById("visibilityRepeat");
  checkAllCasesForShowPassword(variable, visibilityInputImage, visibilityInputImageRepeat, visibility, visibilityRepeat);
  checkPasswordContentType(passwordContent);
}

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

function registerInputFieldFunction(inputLock, registerInputField, visibilityInputImage, visibility) {
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

function registerInputFieldRepeatFunction(registerInputFieldRepeat, inputLockRepeat, visibilityInputImageRepeat, visibility, visibilityRepeat) {
  registerInputFieldRepeat.addEventListener("input", function () {
    inputLockRepeat.classList.add("d-none");
    if (registerInputFieldRepeat.value.length > 0 && registerInputFieldRepeat.type == "password") {
      visibilityInputImageRepeat.classList.remove("d-none");
      visibility.classList.add("d-none");
    } else if (registerInputFieldRepeat.value.length > 0 && registerInputFieldRepeat.type == "text") {
      visibilityInputImageRepeat.classList.add("d-none");
      visibilityRepeat.classList.remove("d-none");
    } else if (registerInputFieldRepeat.value.length == 0) {
      inputLockRepeat.classList.remove("d-none");
      visibilityInputImageRepeat.classList.add("d-none");
      visibilityRepeat.classList.add("d-none");
    }
  });
}

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
      registerInputFieldFunction(obj["inputLock"], obj["registerInputField"], obj["visibilityInputImage"], obj["visibility"]);
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
