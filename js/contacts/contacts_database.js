/**
 * Fetches and returns JSON data from a specified URL.
 *
 * @param {string} path - The path to the JSON file.
 */

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

/**
 * Fetches contacts from the base URL and updates the user list.
 *
 * @param {string} path - The path for the API request.
 */

// async function getAllContacts(path = "") {
//   let response = await fetch(BASE_URL + path + ".json");
//   let responseJson = await response.json();
//   let userData = responseJson["contacts"];
//   for (const key in userData) {
//     const userD = userData[key];
//     let newUser = {
//       id: key,
//       name: userD.name,
//       email: userD.email,
//       phone: userD.number,
//       color: userD.color,
//     };
//     allUsers.push(newUser);
//     sortContacts();
//   }
//   await sortAllUserLetters();
// }

/**
 * Posts new contact data to the specified path.
 *
 * @param {string} path - The path for the API request.
 * @param {Object} data - The contact data to be posted.
 */
async function postNewContact(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * Deletes data from the specified path and returns the response.
 *
 * @param {string} path - The path for the data to be deleted.
 */
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

/**
 * Edits a contact by deleting and re-adding it with updated details.
 *
 * @param {string} userID - The ID of the user to edit.
 * @param {number} i - Index or position in the list (not used in the function).
 * @param {string} userColor - The color associated with the user.
 */
async function editContact(userID, i, userColor) {
  showLoadScreen();
  await deleteData("/contacts/" + userID);

  addNewContact(userColor, "edited");
  hideLoadScreen();
}

/**
 * Deletes a contact and updates the contact list.
 *
 * @param {string} userID - The ID of the contact to be deleted.
 */
async function deleteContact(userID) {
  showLoadScreen();
  await deleteData("/contacts/" + userID);
  deselectContact();
  await initContact();
  hideLoadScreen();
}

/**
 * Adds a new contact and shows a success message.
 *
 * @param {string} bgColor - Background color for the contact.
 * @param {string} action - Action message to display.
 */
async function addNewContact(bgColor = randomColor(), action) {
  showLoadScreen();
  document.getElementById("contact-successfully-created-pop-up").innerHTML = "Contact successfully " + action;
  await hidePopUp();
  let nameInputValue = document.getElementById("pop-up-name-input").value;
  let emailInputValue = document.getElementById("pop-up-email-input").value;
  let phoneInputValue = document.getElementById("pop-up-phone-input").value;
  await postNewContact("/contacts", {
    name: nameInputValue,
    email: emailInputValue,
    number: phoneInputValue,
    color: bgColor,
  });
  await initContact();
  afterAddingNewContactShowBigContact(nameInputValue);
  hideLoadScreen();
  await showContactSuccessfullyCreatedPopUp();
  hideContactSuccessfullyCreatedPopUp();
}

/**
 * Updates the UI to show the selected contact and highlights it.
 *
 * @param {string} userName - The name of the user.
 * @param {string} userEmail - The email of the user.
 * @param {string} userNumber - The phone number of the user.
 * @param {string} userID - The ID of the user.
 * @param {number} i - The index of the user in the list.
 * @param {string} userColor - The color associated with the user.
 * @param {Element} bigContact - The element showing the big contact view.
 * @param {Element} contactEl - The element representing the contact.
 */
async function selectContact(userName, userEmail, userNumber, userID, i, userColor, bigContact, contactEl) {
  await renderBigContact(userName, userEmail, userNumber, userID, i, userColor);
  if (activeContactIndex !== null) {
    document.querySelectorAll(".contact")[activeContactIndex].classList.remove("contact-aktiv");
  }
  contactEl.classList.add("contact-aktiv");
  bigContact.classList.remove("hide-big-contact");
  document.getElementById("right-site-container").classList.remove("right-site-container-translate-100");
  document.getElementById("show-icon-container-button").classList.remove("show-icon-container-button-translate-100");
  document.getElementById("show-icon-container-button").classList.add("animation");
  document.getElementById("add-new-contacts-mobile-button").classList.add("d-none");
  activeContactIndex = i;

  contactEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}