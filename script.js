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
 */

function isGuestLoggedIn(obj) {
  return obj["guestLoginStatus"] == "true" && obj["currentPath"] !== "summary.html";
}

/**
 * This function determines if the user is logged in by evaluating either the localStorage or
 * sessionStorage status and user details.
 * 
 * @param {Object} obj - An object containing login status and user information.
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
 * @param {boolean} boolean - A flag indicating whether the redirect condition is met.
 */

function shouldRedirect(obj, bolean) {
  return (obj["currentPath"] !== "register.html" && obj["currentPath"] !== "login.html" &&
    obj["currentPath"] !== "legal_notice.html" && obj["currentPath"] !== "privacy_policy_en.html") && bolean;
}

/**
 * Checks if the user is logged in and manages redirection and session attributes accordingly and thereby performing the following actions:
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

/**
 * Checks if all properties of the given object are null except for `currentPath`.
 *
 * @param {Object} obj - The object to be checked.
 */

function proveIfEverythingIsNullExceptCurrentPath(obj) {
  if (obj["currentPath"] && obj["currentUser"] == null && obj["guestLoginStatus"] == null && obj["sessionUser"] == null) {
    return true;
  } else {
    return false;
  }
}

/**
 * Saves the logged-in status of the user in either localStorage or sessionStorage.
 *
 * @param {string} name - The nickname of the user.
 * @param {string} email - The email of the user.
 * @param {boolean} remember - A flag indicating whether to remember the user across sessions (true) or only for the current session (false).
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
 * Tests and updates the login status by setting it in sessionStorage if it is not already set in localStorage or sessionStorage.
 * 
 */

function testLoginStatus() {
  if (!localStorage.getItem("isLoggedIn") || !sessionStorage.getItem("isLoggedIn")) {
    sessionStorage.setItem("isLoggedIn", "true");
  }
}

/**
 * This function posts data to a specified database path using a POST request and throws an error if the network response is not ok or if there is a problem with the registration.
 *
 * @param {string} path - The path in the database where the data will be posted.
 * @param {Object} data - The data to be posted to the database.
 */

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

/**
 * This function displays the registration popup by removing the "d-none" class from its element.
 * 
 */

function showRegisterPopup() {
  let registerPopup = document.getElementById("registerPopup");
  registerPopup.classList.remove("d-none");
}

/**
 * This function toggles the visibility of the password input field and updates the visibility icons accordingly.
 *
 * @param {string} variable - The ID of the password input field to be toggled.
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
 * This function toggles the visibility of the login password input field and updates the visibility and lock icons accordingly.
 *
 * @param {string} variable - The ID of the password input field to be toggled.
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
 * This function registers an event listener on an input field to handle visibility changes based on input type and content. Specifically, it concerns the following cases:
 * - When the input field has content and is of type "password", it shows the `visibilityInputImage` and hides the `visibility` element.
 * - When the input field has content and is of type "text", it hides the `visibilityInputImage` and shows the `visibility` element.
 * - When the input field is empty, it shows the `inputLock` element and hides both `visibilityInputImage` and `visibility` elements.
 *
 * @param {HTMLElement} inputLock - The HTML element that represents the lock icon or indicator for the input field.
 * @param {HTMLInputElement} registerInputField - The input field element to which the event listener is attached.
 * @param {HTMLElement} visibilityInputImage - The HTML element representing the image used for visibility control (e.g., eye icon).
 * @param {HTMLElement} visibility - The HTML element that shows or hides based on input field type and content.
 */

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

/**
 * This function registers an event listener on an input field to handle visibility changes based on input type and content. Specifically, it concerns the following cases:
 * - When the input field has content and is of type "password", it shows the `visibilityInputImageRepeat` element and hides the `visibility` element.
 * - When the input field has content and is of type "text", it hides the `visibilityInputImageRepeat` element and shows the `visibilityRepeat` element.
 * - When the input field is empty, it shows the `inputLockRepeat` element and hides both `visibilityInputImageRepeat` and `visibilityRepeat` elements.
 *
 * @param {HTMLInputElement} registerInputFieldRepeat - The input field element to which the event listener is attached.
 * @param {HTMLElement} inputLockRepeat - The HTML element representing the lock icon or indicator for the input field.
 * @param {HTMLElement} visibilityInputImageRepeat - The HTML element representing the image used for visibility control (e.g., eye icon) specific to the repeat input field.
 * @param {HTMLElement} visibility - The HTML element that shows or hides based on the input field's type and content for general use.
 * @param {HTMLElement} visibilityRepeat - The HTML element that shows or hides based on the input field's type and content specifically for the repeat input field.
 */

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

/**
 * This function determines the current URL and executes specific orders based on the cases if the page is either 
 * "login.html" or "register.html". If neither of these pages is detected, it calls `checkIfUserIsLoggedIn`.
 * 
 */

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

/**
 * The function retrieves several HTML elements by their IDs and organizes them into an object.
 * The returned object includes references to elements related to visibility controls and input fields
 * for login and registration purposes.
 * 
 */

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
