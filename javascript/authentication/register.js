/**
 * Manages the sign-up process through validating user input, creating a user object, and sending it to the server in the case of a successfull validation.
 *
 * @param {Event} event - The event object from the form submission.
 */

async function signUp(event) {
    showBoardLoadScreen();
    event.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;
    let passwordRepeat = document.getElementById("loginPasswordRepeat").value;
    let privacyPolicity = document.getElementById("privacyPolicity");
    let signUpValid = await checkSignInRequirements(name, email, password, passwordRepeat, privacyPolicity);
    if (!signUpValid) {
      hideBoardLoadScreen();
      return;
    }
    let user = buildUserFunction(name, email, password);
    await createUserAndShowPopup((path = "/users"), user);
    hideBoardLoadScreen();
}

/**
 * This function displays an error message when the password syntax is incorrect during sign-up.
 * This function removes existing error messages and toggles the visibility of the error messages
 * related to weak passwords. It furthermore updates the CSS classes to show or hide the error messages.
 * 
 */

function throwSignUpErrorWhenWrongPasswordSyntax() {
    removeErrorMessageIfPresent();
    let allErrorMessages = document.getElementById("allErrorMessages");
    let reportFailedSignUp = document.getElementById("reportFailedSignUpWhenWeakPassword");
    if (reportFailedSignUp.classList.contains("d-none") && allErrorMessages.classList.contains("d-none")) {
      allErrorMessages.classList.remove("d-none");
      allErrorMessages.classList.add("d-flex");
      reportFailedSignUp.classList.remove("d-none");
    } else {
      allErrorMessages.classList.remove("d-flex");
      allErrorMessages.classList.add("d-none");
      reportFailedSignUp.classList.add("d-none");
    }
  }

  /**
 * This function chekcks a password to ensure it meets the necessary password criteria (minimum length, at least one uppercase, one lowercase and one digit) 
 * If the password is too short, it returns an error message. If the password does not meet
 * the required pattern, it triggers a signup error function. If the password is valid, null is returned.
 * 
 * @param {string} password - The password to be validated.
 * @returns {string|null} - Returns an error message if the password is invalid, otherwise returns null.
 */

function checkIfPasswordIsValid(password) {
    let minLength = 6;
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    if (password.length < minLength) {
      return `Das Passwort muss mindestens ${minLength} Zeichen lang sein.`;
    }
    if (!regex.test(password)) {
      throwSignUpErrorWhenWrongPasswordSyntax();
      return true;
    }
    return null;
  }

/** 
 * This function checks whether the password meets the necessary criteria, by calling the function `checkIfPasswordIsValid`.
 * If the password is invalid, registration is marked as failed.
 * 
 * @param {string} password - The password to check.
 * @returns {boolean} - Returns true if the password is valid, otherwise false.
 */

function checkPasswordWhenSignUp(password) {
    let passwordError = checkIfPasswordIsValid(password);
    if (passwordError) {
      return false;
    }
    return true;
}

  /**
 * This async function sends the user data a specified path, shows a registration popup in the case of success,
 * and redirects to the login page after a short delay. If an error occurs, it logs an error message to the console.
 * 
 * @param {string} path - The path to which the user data should be posted.
 * @param {Object} user - The user data to be sent to the database.
 * @returns {Promise<Object>} - Returns a promise that resolves to the server's response in JSON format.
 */

async function createUserAndShowPopup(path, user) {
    try {
      let responseToJson = await postDataToDatabase(path, user);
      showRegisterPopup();
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
      return responseToJson;
    } catch (error) {
      console.error("Es gab ein Problem bei der Registrierung. Bitte versuchen Sie es später erneut");
    }
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
 * This async function sends a POST request to the specified path with the provided data.
 * It handles the response and checks for errors. If the response is not ok, it an error is thrown.
 * 
 * @param {string} path - The path in the database where the data should be posted.
 * @param {Object} data - The data to be sent to the database.
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
 * This function displays a registration error message if the passwords don't match. It removes the existing error messages, highlights the password repeat input in red and shows a notification.
 * 
 */

function throwSignUpError() {
    removeErrorMessageIfPresent();
    let signUpInput = document.getElementById("signUpInput");
    let signUpPasswordRepeat = document.getElementById("signUpPasswordRepeat");
    signUpPasswordRepeat.style.border = "1px solid red";
    let notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = `<p>Ups! Your passwords don't match</p>`;
    signUpInput.appendChild(notification);
}

/**
 * This function toggles the visibility of the error messages in the case of a failed registration.
 * 
 */

function createReportDueToFailedRegistration() {
    removeErrorMessageIfPresent();
    let allErrorMessages = document.getElementById("allErrorMessages");
    let reportFailedSignUp = document.getElementById("reportFailedSignUp");
    if (reportFailedSignUp.classList.contains("d-none") && allErrorMessages.classList.contains("d-none")) {
      allErrorMessages.classList.remove("d-none");
      allErrorMessages.classList.add("d-flex");
      reportFailedSignUp.classList.remove("d-none");
    } else {
      allErrorMessages.classList.remove("d-flex");
      allErrorMessages.classList.add("d-none");
      reportFailedSignUp.classList.add("d-none");
    }
}

/**
* Removes an existing error message and resets the border of the password repeat input field.
* 
*/

function removeErrorMessageIfPresent() {
    document.getElementById("signUpPasswordRepeat").style.border = "1px solid #d1d1d1";
    let existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }
}

/**
 * This function takes the user data from the server checks if the given nickname or email is already in use. 
 * If a match is found, a failed registration attempt is thrown as an error message.
 *
 * @param {string} name - The user's name to check.
 * @param {string} email - The user's email to check.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the nickname or email already exists, otherwise false.
 */

async function nicknameAlreadyExists(name, email) {
    let response = await loadData((path = "/users"));
    for (let key in response) {
      let user = response[key];
      let availabelNickname = user["name"];
      let availabelEmail = user["email"];
      if (availabelNickname == name || availabelEmail == email) {
        createReportDueToFailedRegistration();
        return true;
      }
    }
    return false;
}

/**
 * Checks all the the sign-up requirements including password strength, uniqueness of the nickname, password match, and acceptance of privacy policy.
 *
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} passwordRepeat - The repeated password for confirmation.
 * @param {HTMLInputElement} privacyPolicity - The checkbox element for the privacy policy agreement.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if all sign-up requirements are met, otherwise false.
 */

async function checkSignInRequirements(name, email, password, passwordRepeat, privacyPolicity) {
    if (!checkPasswordWhenSignUp(password)) {
      return false;
    }
    if ((await nicknameAlreadyExists(name, email)) == true) {
      return false;
    }
    if (password !== passwordRepeat) {
      throwSignUpError();
      return false;
    }
    if (!privacyPolicity.checked) {
      return false;
    }
    return true;
}

/**
 * Checks if an error message notification already exists in the sign-up input section. 
 * 
 * @returns {boolean} - Returns true if an error message is found, otherwise false.
 */

function proveIfErrorMessageAlreadyExists() {
    let childrenElements = Array.from(document.getElementById("signUpInput").children);
    let messageExists = childrenElements.some((child) => child.classList.contains("notification") && child.classList.contains("error"));
    return messageExists;
}

/**
 * This function makes the board load screen visible by removing the "d-none" class 
 * from the element with the ID "board-add_task-load-screen".
 * 
 */

function showBoardLoadScreen() {
    document.getElementById("board-add_task-load-screen").classList.remove("d-none");
}
  
/**
* This function hides the board load screen by adding the "d-none" class to the element with the ID "board-add_task-load-screen".
* 
*/
  
function hideBoardLoadScreen() {
    document.getElementById("board-add_task-load-screen").classList.add("d-none");
}

// const signUp = document.getElementById('submitSignUp');

/**
 * This function takes the username, the email address and a password and creates a user object with this information.
 * 
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - the password of the user.
 * @returns {Object} - The user object containing the name, email, and password.
 */

function buildUserFunction(name, email, password) {
  let user = {
    name: name,
    email: email,
    password: password,
  };
  return user;
}