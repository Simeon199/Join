 /**
  * Redirects the user to the login site.
  * 
  */
 
 function redirectToLogin() {
   window.location.href = "login.html";
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
  * This function adjusts the visibility of icons for showing or hiding passwords based on the specified
  * password input fields and its associated icons. It handles cases for both the login password and
  * the repeat password fields.
  * 
  * @param {string} variable - A string indicating which password field to process ("loginPassword" or "loginPasswordRepeat").
  * @param {HTMLElement} visibilityInputImage - The element representing the visibility input image for the login password.
  * @param {HTMLElement} visibilityInputImageRepeat - The element representing the visibility input image for the repeat password.
  * @param {HTMLElement} visibility - The element representing the visibility control for the login password.
  * @param {HTMLElement} visibilityRepeat - The element representing the visibility control for the repeat password.
  */
 
 function checkAllCasesForShowPassword(variable, visibilityInputImage, visibilityInputImageRepeat, visibility, visibilityRepeat) {
   if (variable == "loginPassword" && visibilityInputImage.classList.contains("d-none")) {
     visibilityInputImage.classList.remove("d-none");
     visibility.classList.add("d-none");
   } else if (variable == "loginPassword" && inputLock.classList.contains("d-none")) {
     visibility.classList.remove("d-none");
     visibilityInputImage.classList.add("d-none");
   } else if (variable == "loginPasswordRepeat" && visibilityInputImageRepeat.classList.contains("d-none")) {
     visibilityInputImageRepeat.classList.remove("d-none");
     visibilityRepeat.classList.add("d-none");
   } else if (variable == "loginPasswordRepeat" && inputLockRepeat.classList.contains("d-none")) {
     visibilityRepeat.classList.remove("d-none");
     visibilityInputImageRepeat.classList.add("d-none");
   }
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
  * The function retrieves several HTML elements by their IDs and organizes them into an object.
  * The returned object includes references to elements related to visibility controls and input fields
  * for login and registration purposes.
  * 
  * @returns {Object} An object containing references to the DOM elements.
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

