import {ref, set, createUserWithEmailAndPassword} from "../../config/database.js";
import db from "../../config/database.js";

const auth = db.auth;
const database = db.database;

/**
 * Manages the sign-up process through validating user input, creating a user object, and sending it to the server in the case of a successfull validation.
 *
 * @param {Event} event - The event object from the form submission.
 */

// async function signUp(event) {
//     showBoardLoadScreen();
//     event.preventDefault();
//     let name = document.getElementById("name").value;
//     let email = document.getElementById("loginEmail").value;
//     let password = document.getElementById("loginPassword").value;
//     let passwordRepeat = document.getElementById("loginPasswordRepeat").value;
//     let privacyPolicity = document.getElementById("privacyPolicity");
//     let signUpValid = await checkSignInRequirements(name, email, password, passwordRepeat, privacyPolicity);
//     if (!signUpValid) {
//       hideBoardLoadScreen();
//       return;
//     }
//     let user = buildUserFunction(name, email, password);
//     await createUserAndShowPopup((path = "/users"), user);
//     hideBoardLoadScreen();
// }

/**
 * This function displays an error message when the password syntax is incorrect during sign-up.
 * This function removes existing error messages and toggles the visibility of the error messages
 * related to weak passwords. It furthermore updates the CSS classes to show or hide the error messages.
 * 
 */

// function throwSignUpErrorWhenWrongPasswordSyntax() {
//     removeErrorMessageIfPresent();
//     let allErrorMessages = document.getElementById("allErrorMessages");
//     let reportFailedSignUp = document.getElementById("reportFailedSignUpWhenWeakPassword");
//     if (reportFailedSignUp.classList.contains("d-none") && allErrorMessages.classList.contains("d-none")) {
//       allErrorMessages.classList.remove("d-none");
//       allErrorMessages.classList.add("d-flex");
//       reportFailedSignUp.classList.remove("d-none");
//     } else {
//       allErrorMessages.classList.remove("d-flex");
//       allErrorMessages.classList.add("d-none");
//       reportFailedSignUp.classList.add("d-none");
//     }
//   }

  /**
 * This function chekcks a password to ensure it meets the necessary password criteria (minimum length, at least one uppercase, one lowercase and one digit) 
 * If the password is too short, it returns an error message. If the password does not meet
 * the required pattern, it triggers a signup error function. If the password is valid, null is returned.
 * 
 * @param {string} password - The password to be validated.
 * @returns {string|null} - Returns an error message if the password is invalid, otherwise returns null.
 */

// function checkIfPasswordIsValid(password) {
//     let minLength = 6;
//     let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
//     if (password.length < minLength) {
//       return `Das Passwort muss mindestens ${minLength} Zeichen lang sein.`;
//     }
//     if (!regex.test(password)) {
//       throwSignUpErrorWhenWrongPasswordSyntax();
//       return true;
//     }
//     return null;
//   }

/** 
 * This function checks whether the password meets the necessary criteria, by calling the function `checkIfPasswordIsValid`.
 * If the password is invalid, registration is marked as failed.
 * 
 * @param {string} password - The password to check.
 * @returns {boolean} - Returns true if the password is valid, otherwise false.
 */

// function checkPasswordWhenSignUp(password) {
//     let passwordError = checkIfPasswordIsValid(password);
//     if (passwordError) {
//       return false;
//     }
//     return true;
// }

  /**
 * This async function sends the user data a specified path, shows a registration popup in the case of success,
 * and redirects to the login page after a short delay. If an error occurs, it logs an error message to the console.
 * 
 * @param {string} path - The path to which the user data should be posted.
 * @param {Object} user - The user data to be sent to the database.
 * @returns {Promise<Object>} - Returns a promise that resolves to the server's response in JSON format.
 */

// async function createUserAndShowPopup(path, user) {
//     try {
//       let responseToJson = await postDataToDatabase(path, user);
//       showRegisterPopup();
//       setTimeout(() => {
//         window.location.href = "login.html";
//       }, 1000);
//       return responseToJson;
//     } catch (error) {
//       console.error("Es gab ein Problem bei der Registrierung. Bitte versuchen Sie es später erneut");
//     }
// }

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

// function checkAllCasesForShowPassword(variable, visibilityInputImage, visibilityInputImageRepeat, visibility, visibilityRepeat) {
//     if (variable == "loginPassword" && visibilityInputImage.classList.contains("d-none")) {
//       visibilityInputImage.classList.remove("d-none");
//       visibility.classList.add("d-none");
//     } else if (variable == "loginPassword" && inputLock.classList.contains("d-none")) {
//       visibility.classList.remove("d-none");
//       visibilityInputImage.classList.add("d-none");
//     } else if (variable == "loginPasswordRepeat" && visibilityInputImageRepeat.classList.contains("d-none")) {
//       visibilityInputImageRepeat.classList.remove("d-none");
//       visibilityRepeat.classList.add("d-none");
//     } else if (variable == "loginPasswordRepeat" && inputLockRepeat.classList.contains("d-none")) {
//       visibilityRepeat.classList.remove("d-none");
//       visibilityInputImageRepeat.classList.add("d-none");
//     }
// }

/**
 * This function toggles the visibility of the password input field and updates the visibility icons accordingly.
 *
 * @param {string} variable - The ID of the password input field to be toggled.
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
 * This async function sends a POST request to the specified path with the provided data.
 * It handles the response and checks for errors. If the response is not ok, it an error is thrown.
 * 
 * @param {string} path - The path in the database where the data should be posted.
 * @param {Object} data - The data to be sent to the database.
 */

// async function postDataToDatabase(path, data) {
//     try {
//       let response = await fetch(BASE_URL + path + ".json", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       if (!response.ok) {
//         throw new Error("Network response was not ok: " + response.statusText);
//       }
//       return await response.json();
//     } catch (error) {
//       console.error("Es gab ein Problem mit der Registrierung:", error);
//       throw error;
//     }
// }

  /**
 * This function displays a registration error message if the passwords don't match. It removes the existing error messages, highlights the password repeat input in red and shows a notification.
 * 
 */

// function throwSignUpError() {
//     removeErrorMessageIfPresent();
//     let signUpInput = document.getElementById("signUpInput");
//     let signUpPasswordRepeat = document.getElementById("signUpPasswordRepeat");
//     signUpPasswordRepeat.style.border = "1px solid red";
//     let notification = document.createElement("div");
//     notification.classList.add("notification");
//     notification.innerHTML = `<p>Ups! Your passwords don't match</p>`;
//     signUpInput.appendChild(notification);
// }

/**
 * This function toggles the visibility of the error messages in the case of a failed registration.
 * 
 */

// function createReportDueToFailedRegistration() {
//     removeErrorMessageIfPresent();
//     let allErrorMessages = document.getElementById("allErrorMessages");
//     let reportFailedSignUp = document.getElementById("reportFailedSignUp");
//     if (reportFailedSignUp.classList.contains("d-none") && allErrorMessages.classList.contains("d-none")) {
//       allErrorMessages.classList.remove("d-none");
//       allErrorMessages.classList.add("d-flex");
//       reportFailedSignUp.classList.remove("d-none");
//     } else {
//       allErrorMessages.classList.remove("d-flex");
//       allErrorMessages.classList.add("d-none");
//       reportFailedSignUp.classList.add("d-none");
//     }
// }

/**
* Removes an existing error message and resets the border of the password repeat input field.
* 
*/

// function removeErrorMessageIfPresent() {
//     document.getElementById("signUpPasswordRepeat").style.border = "1px solid #d1d1d1";
//     let existingNotification = document.querySelector(".notification");
//     if (existingNotification) {
//       existingNotification.remove();
//     }
// }

/**
 * Checks if an error message notification already exists in the sign-up input section. 
 * 
 * @returns {boolean} - Returns true if an error message is found, otherwise false.
 */

// function proveIfErrorMessageAlreadyExists() {
//     let childrenElements = Array.from(document.getElementById("signUpInput").children);
//     let messageExists = childrenElements.some((child) => child.classList.contains("notification") && child.classList.contains("error"));
//     return messageExists;
// }

/**
 * This function makes the board load screen visible by removing the "d-none" class 
 * from the element with the ID "board-add_task-load-screen".
 * 
 */

// function showBoardLoadScreen() {
//     document.getElementById("board-add_task-load-screen").classList.remove("d-none");
// }
  
/**
* This function hides the board load screen by adding the "d-none" class to the element with the ID "board-add_task-load-screen".
* 
*/
  
// function hideBoardLoadScreen() {
//     document.getElementById("board-add_task-load-screen").classList.add("d-none");
// }

document.addEventListener('DOMContentLoaded', () => {
  let form = document.getElementById('signUpForm');
  if(form){
    form.addEventListener("submit", signUp);
  }
});

async function registerUser(email, password){
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered: ", userCredential.user);
    return userCredential;
  } catch(error){
    console.log("Error registering user: ", error);
    throw error;
  }
}

async function signUp(event){
  event.preventDefault();
  const name=document.getElementById('name').value; 
  const loginEmail=document.getElementById('loginEmail').value;
  const loginPassword=document.getElementById('loginPassword').value;
  const loginPasswordRepeat=document.getElementById('loginPasswordRepeat').value;
  if(checkIfPasswordInputsCoincide(loginPassword, loginPasswordRepeat)){
    try{
      const userCredential = await registerUser(loginEmail, loginPassword);
      const uid = userCredential.user.uid;
      let userData = createUserData(name, loginEmail);
      await writeData(`users/${uid}`, userData);
      window.location.href="login.html";
    } catch(error){
      console.error("Fehler bei Registrierung:", error.message);
    }
  }
}

function checkIfPasswordInputsCoincide(loginPassword, loginPasswordRepeat){
  return loginPassword === loginPasswordRepeat;
}

function createUserData(name, email){
  const userData = {
    name: name,
    email: email
  }
  return userData;
}

async function writeData(path, userdata){
  const dbref=ref(database, path);
  return set(dbref, userdata);
}