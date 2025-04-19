import * as contacts from './contacts.js';
import * as core from '../../../core/templateLoader.js';
export * from './contactsHTML.js';

let basePath = '../contacts/templates/';

let allTemplates = [
  'add-contact-pop-up-logo.template.html', 
  'add-contact-pop-up-form.template.html', 
  'add-contact-pop-up-headline.template.html',
  'big-contact-icon-container.template.html',
  'contact-letter-container.template.html',
  'contact-template.template.html'
];

let colors = [
  "#4B3C99",
  "#FF4646",
  "#FF8C1A",
  "#AA4FFF",
  "#6464FF",
  "#DE1AFF",
  "#FFC61A",
  "#32D4C3",
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A8",
  "#A833FF",
  "#33FFDD",
  "#FFDD33",
  "#DD33FF",
  "#FF336B",
  "#6BFF33",
  "#1E3A55",
  "#FFA500",
  "#00CED1",
  "#8A2BE2",
  "#A52A2A",
  "#7FFF00",
  "#D2691E",
  "#FF7F50",
  "#DC143C",
  "#008B8B",
];

let allTemplatesIds = [];
let activeContactIndex = null;
let allContacts = [];
let firstContactsNameLetter = [];

export {allContacts, firstContactsNameLetter};

document.addEventListener('DOMContentLoaded', async () => {
  initFunctionsForContacts();
  triggerAllClickEventFunctions();
  observeForForm();
});

function observeForForm(){
  let observer = new MutationObserver(() => {
    let form = document.querySelector('#add-contact-form');
    if(form && form.dataset.listenerAttached){
      form.addEventListener('submit', (event) => {
        contacts.submitNewUser(event);
      });
      form.dataset.listenerAttached = 'true'; // Verhindert doppelte Listener
      observer.disconnect(); // observer nur einmal auslösen
    }
  });
  observer.observe(document.getElementById('pop-up-inputs-container'), {
    childList: true,
    subtree: true
  });
}

async function initFunctionsForContacts(){
  allTemplatesIds = await core.loadTemplates(allTemplates, basePath);
  initContact();
  initSidebar();
}

function triggerAllClickEventFunctions(){
  document.getElementById('body').addEventListener('click', () => {
    hideAllSmallPopUps();
  });
  document.getElementById('big-contact-arrow').addEventListener('click', () => {
    deselectContact();
  });
  manageRemainingClickEvents();
}

function manageRemainingClickEvents(){
  manageClickEventOnIconContainerButton();
  manageClickEventOnAddTaskPopUp();
  manageClickEventOnAddNewContactsButton();
}

function manageClickEventOnIconContainerButton(){
  document.getElementById('show-icon-container-button').addEventListener('click', (event) => {
    stopEvent(event),
    showIconContainer();
  });
  document.getElementById('icon-container').addEventListener('click', (event) => {
    stopEvent(event);
  });
}

function manageClickEventOnAddNewContactsButton(){
  document.getElementById('add-new-contacts-button').addEventListener('click', () => {
    showPopUp(), 
    renderAddContactPopUp()
  });
  document.getElementById('add-new-contacts-mobile-button').addEventListener('click', () => {
    showPopUp(), 
    renderAddContactPopUp()
  });
}

function manageClickEventOnAddTaskPopUp(){
  document.getElementById('add-task-pop-up-bg').addEventListener('click', () => {
    hidePopUp();
  });
  document.getElementById('add-task-pop-up').addEventListener('click', (event) => {
    stopEvent(event);
  });
  document.getElementById('close-add-task-pop-up').addEventListener('click', () => {
    hidePopUp();
  });
}

/**
 * Shows the add task popup and hides all small popups.
 *
 */

function showPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("add-task-pop-up").classList.remove("translate-100");
  hideAllSmallPopUps();
}

/**
 * Initializes contact-related variables and functions when the website loads.
 *
 */

async function initContact() {
  allContacts = [];
  firstContactsNameLetter = [];
  contacts.getAllContacts();
  // renderContactList();
}

/**
 * Returns the HTML for a contact letter container.
 *
 * @param {string} letter - The letter to be displayed.
 */

export function returnContactLetterContainerHTML(letter) {
  let template = core.getTemplateClone('contact-letter-container');
  let heading = template.querySelector('.letter');
  heading.textContent = letter.toUpperCase();
  return template;
}

/**
 * Generates HTML for a contact card with user details.
 *
 * @param {number} j - Index of the contact.
 * @param {Object} user - The user object containing details.
 */

export function returnContactHTML(j, user) {
  let template = core.getTemplateClone('contact-template');
  template.querySelector('.contact').addEventListener('click', ()=> {
    toggleBigContact(j, user.name, user.email, user.phone, user.id, user.color);
  });
  template.querySelector('.profile-badge').style.backgroundColor = user.color;
  template.querySelector('.initials').textContent = firstLetterFirstTwoWords(user.name);
  template.querySelector('.name').textContent = user.name;
  template.querySelector('.email').textContent = user.email;
  return template;
}

/**
 * Generates HTML for big contact icon containers.
 *
 * @param {string} userName - The name of the user.
 * @param {string} userEmail - The email of the user.
 * @param {string} userNumber - The contact number of the user.
 * @param {string} userID - The unique ID of the user.
 * @param {number} index - An index or identifier for the user.
 * @param {string} userColor - The color associated with the user.
 */

// export function returnBigContactIconContainerHTML(createdUserObject, index) {
//   let template = core.getTemplateClone('big-contact-icon-container');
//   template.querySelector('.edit-contact').addEventListener('click', () => {
//     showPopUp();
//     renderEditContactPopUp(createdUserObject, index);
//   });
//   template.querySelector('.delete-contact').addEventListener('click', () =>{
//     deleteContact(createdUserObject.userID)
//   });
//   return template;
// }

function renderAddContactPopUp(){
  // observeFalseCloningProcess();
  insertTemplateIntoExistingParentContainer('add-new-contact-form', 'pop-up-inputs-container');  
  // insertTemplateIntoExistingParentContainer('contact-pop-up-headline', 'pop-up-headline-container');
  // insertTemplateIntoExistingParentContainer('add-contact-pop-up-logo','pop-up-contact-logo');
  document.getElementById("pop-up-contact-logo").style.backgroundColor = "#d1d1d1"
}

function observeFalseCloningProcess(){
  const observer = new MutationObserver((mutationsList) => {
    for(let mutation of mutationsList){
      console.log('[MutationObserver] Mutation detected: ', mutation);

      // Direkt prüfen, ob Buttons hinzugefügt wurden
      const buttons = document.querySelector('.pop-up-buttons-container');
      console.log('[MutationObserver] Buttons vorhanden? ', !!buttons, buttons);
      if(buttons){
        console.log('[Observer] Buttons korrekt erkannt. Beobachtung wird gestoppt.');
        observer.disconnect();
      }
    }
  }); 

  observer.observe(document.getElementById('pop-up-inputs-container') ?? document.body, {
    childList: true,
    subtree: true
  });
}

function insertTemplateIntoExistingParentContainer(idTemplate, idParentContainer){
  let parentContainer = document.getElementById(idParentContainer);
  try {
    parentContainer.appendChild(buildTemplateModel(idTemplate, returnTemplate(idTemplate)));
  } catch(error) {
    console.warn('Fehler beim Hinzufügen des Templates:', error);
  }
}

function buildTemplateModel(id, renderMethod){
  let wrapper = document.createElement('div');
  wrapper.appendChild(renderMethod);
  // const found = wrapper.querySelector('.pop-up-buttons-container');
  // console.log('[buildTemplateModel] Buttons vorhanden?', !!found, found);
  return wrapper;
}

export function returnTemplate(id){
  let template = core.getTemplateClone(id);
  let fragment = document.createDocumentFragment();
  fragment.append(...template.childNodes);
  // console.log('fragment value: ', fragment);
  if(!template){
    console.warn(`Template mit ID "${id}" nicht gefunden.`);
  }
  return template;
}

// <!--- Hier kommen die ganzen veralteten Funktionen -->

/**
 * Edits a contact by deleting and re-adding it with updated details.
 *
 * @param {string} userID - The ID of the user to edit.
 * @param {number} i - Index or position in the list (not used in the function).
 * @param {string} userColor - The color associated with the user.
 */

// async function editContact(userID, i, userColor) {
//   showLoadScreen();
//   await deleteData("/contacts/" + userID);
//   addNewContact(userColor, "edited");
//   hideLoadScreen();
// }

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

// async function selectContact(userName, userEmail, userNumber, userID, i, userColor, bigContact, contactEl) {
//   renderBigContact(userName, userEmail, userNumber, userID, i, userColor);
//   if (activeContactIndex !== null) {
//     document.querySelectorAll(".contact")[activeContactIndex].classList.remove("contact-aktiv");
//   }
//   contactEl.classList.add("contact-aktiv");
//   bigContact.classList.remove("hide-big-contact");
//   document.getElementById("right-site-container").classList.remove("right-site-container-translate-100");
//   document.getElementById("show-icon-container-button").classList.remove("show-icon-container-button-translate-100");
//   document.getElementById("show-icon-container-button").classList.add("animation");
//   document.getElementById("add-new-contacts-mobile-button").classList.add("d-none");
//   activeContactIndex = i;
//   contactEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
// }

/**
 * Returns the HTML form for editing a contact.
 *
 * @param {string} userID - The unique identifier of the user.
 * @param {number} i - Index of the contact in the list.
 * @param {string} userColor - The color associated with the user.
 */

// function returnEditContactPopUpFormHTML(userID, i, userColor) {
//   console.log('Hier muss noch die eigentliche Funktion rein!');
// }

/**
 * Returns the HTML for the edit contact pop-up headline.
 *
 */

// function returnEditContactPopUpHeadlineHTML() {
//   return  `<h1 id="pop-up-headline">Edit contact</h1>`;
// }

/**
* Returns HTML string for contact popup logo with user's initials.
*
* @param {string} userName - The name of the user.
*/

// function returnEditContactPopUpLogoHTML(userName) {
//   return  `${firstLetterFirstTwoWords(userName)}`;
// }

/**
 * Hides all small pop-ups by adding a CSS class.
 *
 */

function hideAllSmallPopUps(){
  document.getElementById("icon-container").classList.add("icon-container-translate-100");
}

/**
 * Deselects the currently active contact and updates the UI.
 *
 */

async function deselectContact() {
  document.getElementById("big-contact").classList.add("hide-big-contact");
  document.querySelectorAll(".contact")[activeContactIndex].classList.remove("contact-aktiv");
  document.getElementById("right-site-container").classList.add("right-site-container-translate-100");
  document.getElementById("show-icon-container-button").classList.add("show-icon-container-button-translate-100");
  document.getElementById("show-icon-container-button").classList.remove("animation");
  document.getElementById("add-new-contacts-mobile-button").classList.remove("d-none");
  activeContactIndex = null;
}

/**
 * Toggles the display of a contact's details.
 *
 * @param {number} i - The index of the contact.
 * @param {string} userName - The name of the contact.
 * @param {string} userEmail - The email of the contact.
 * @param {string} userNumber - The phone number of the contact.
 * @param {string} userID - The ID of the contact.
 * @param {string} userColor - The color associated with the contact.
 */

function toggleBigContact(i, userName, userEmail, userNumber, userID, userColor) {
  let bigContact = document.getElementById("big-contact");
  let contactEl = document.querySelectorAll(".contact")[i];
  if (activeContactIndex === i) {
    deselectContact();
  } else {
    selectContact(userName, userEmail, userNumber, userID, i, userColor, bigContact, contactEl);
  }
}

/**
 * Hides the add task popup.
 *
 */

function hidePopUp() {
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

/**
 * Returns a random color from the colors array.
 *
 */

// function randomColor() {
//   let randomIndex = Math.floor(Math.random() * colors.length);
//   return colors[randomIndex];
// }

/**
 * Toggles the translation class for the icon container.
 *
 */

function showIconContainer() {
  document.getElementById("icon-container").classList.toggle("icon-container-translate-100");
}

/**
 * Renders the contact list by creating containers for each letter.
 *
 */

// function renderContactList(array) {
//   let contactListContainer = document.getElementById("contact-list");
//   contactListContainer.innerHTML = "";
//   array.forEach((element) => {
//     contactListContainer.innerHTML += `${element.name}`;
//     contactListContainer.innerHTML += `${firstLetterFirstTwoWords(element.name)}`;
//   });
//   for (let i = 0; i < firstContactsNameLetter.length; i++) {
//     renderContactLetterContainer(i, contactListContainer);
//   }
// }

/**
 * Renders contact letter container and updates contact list.
 *
 * @param {number} i - Index of the letter in the list.
 * @param {HTMLElement} contactListContainer - Container for the contact list.
 */

// function renderContactLetterContainer(i, contactListContainer) {
//   const letter = firstContactsNameLetter[i];
//   contactListContainer.innerHTML += returnContactLetterContainerHTML(letter);
//   document.querySelectorAll(".letter-list-contact-container")[i].innerHTML = "";
//   for (let j = 0; j < allContacts.length; j++) {
//     renderContact(i, j, letter);
//   }
// }

/**
 * Renders contact if the name starts with the given letter.
 *
 * @param {number} i - Index for letter list container.
 * @param {number} j - Index for the user in allUsers array.
 * @param {string} letter - The starting letter to filter contacts.
 */

// function renderContact(i, j, letter) {
//   const user = allContacts[j];
//   if (user["name"].toLowerCase().startsWith(letter)) {
//     document.querySelectorAll(".letter-list-contact-container")[i].innerHTML += contactsHTML.returnContactHTML(j, user);
//   }
// }

/**
 * Sorts the contacts in alphabetical order by name.
 *
 */

// function sortContacts() {
//   allContacts.sort((a, b) => {
//     const nameA = a.name.toUpperCase();
//     const nameB = b.name.toUpperCase();
//     if (nameA < nameB) {
//       return -1;
//     }
//     if (nameA > nameB) {
//       return 1;
//     }
//     return 0;
//   });
// }

/**
 * Sorts the first letters of the contact names and updates the list.
 *
 */

// function sortAllUserLetters() {
//   for (let i = 0; i < allContacts.length; i++) {
//     let userLetter = allContacts[i]["name"].charAt(0).toLowerCase();
//     if (!firstContactsNameLetter.includes(userLetter)) {
//       firstContactsNameLetter.push(userLetter);
//     }
//   }
//   firstContactsNameLetter.sort();
// }

/**
 * Shows the contact creation success popup.
 *
 */

// function showContactSuccessfullyCreatedPopUp() {
//   document.getElementById("contact-successfully-created-pop-up-bg").classList.remove("hide-pop-up-translate-100");
// }

/**
 * Marks the "contacts" section as the current section.
 *
 */

// function taskMarker() {
//   document.getElementById("contacts").classList.add("currentSection");
// }

/**
 * Hides the loading screen by adding the "d-none" class..
 *
 */

function hideLoadScreen() {
  document.getElementById("load-screen").classList.add("d-none");
}

/**
 * Renders the edit contact popup with provided user details.
 *
 * @param {string} userID - The ID of the user.
 * @param {string} userName - The name of the user.
 * @param {string} userEmail - The email of the user.
 * @param {string} userNumber - The phone number of the user.
 * @param {number} i - Index or additional identifier for the user.
 * @param {string} userColor - The color associated with the user.
 */

// function renderEditContactPopUp(createdUserObject, index) {
//   document.getElementById("pop-up-inputs-container").innerHTML = returnEditContactPopUpFormHTML(createdUserObject.userID, index, createdUserObject.userColor);
//   document.getElementById("pop-up-headline-container").innerHTML = returnEditContactPopUpHeadlineHTML();
//   document.getElementById("pop-up-contact-logo").innerHTML = returnEditContactPopUpLogoHTML(createdUserObject.userName);
//   document.getElementById("pop-up-contact-logo").style.backgroundColor = createdUserObject.userColor;
//   document.getElementById("pop-up-name-input").value = createdUserObject.userName;
//   document.getElementById("pop-up-email-input").value = createdUserObject.userEmail;
//   document.getElementById("pop-up-phone-input").value = createdUserObject.userNumber;
// }

/**
 * Renders the contact's details on the big profile display.
 *
 */

// function renderBigContact(createdUserObject, index) {
//   document.getElementById("big-profile-badge").innerHTML = firstLetterFirstTwoWords(createdUserObject.userName);
//   document.getElementById("big-profile-badge").style.backgroundColor = createdUserObject.userColor;
//   document.getElementById("big-name").innerHTML = createdUserObject.userName;
//   document.getElementById("big-email").innerHTML = createdUserObject.userEmail;
//   document.getElementById("big-number").innerHTML = createdUserObject.userNumber;
//   document.getElementById("icon-container").innerHTML = returnBigContactIconContainerHTML(createdUserObject, index);
// }

// function toggleClasses(){
//   document.getElementById("big-contact").classList.remove("hide-big-contact");
//   document.getElementById("right-site-container").classList.remove("right-site-container-translate-100");
//   document.getElementById("show-icon-container-button").classList.remove("show-icon-container-button-translate-100");
//   document.getElementById("show-icon-container-button").classList.add("animation");
// }

/**
 * Extracts and concatenates the first letters of the first two words in the name.
 *
 * @param {string} name - The name from which to extract the letters.
 */

function firstLetterFirstTwoWords(name) {
  const words = name.split(" ");
  const firstLetters = words.map((word) => word.charAt(0));
  const result = firstLetters.slice(0, 2).join("");
  return result.toUpperCase();
}

/**
 * Hides the success popup after 3 seconds.
 *
 */

// function hideContactSuccessfullyCreatedPopUp() {
//   setTimeout(() => {
//     document.getElementById("contact-successfully-created-pop-up-bg").classList.add("hide-pop-up-translate-100");
//   }, 3000);
// }

/**
 * Shows the loading screen by removing the "d-none" class.
 *
 */

function showLoadScreen() {
  document.getElementById("load-screen").classList.remove("d-none");
}

/**
 * Displays the big contact view for the newly added contact.
 *
 * @param {string} nameInputValue - The name of the contact to display.
 */

// function afterAddingNewContactShowBigContact(nameInputValue) {
//   let index = allContacts.findIndex((user) => user.name === nameInputValue);
//   let createdUserObject = getCreatedUsersValue(index);
//   activeContactIndex = index;
//   renderBigContact(createdUserObject, index);
//   toggleClasses();
// }

// function getCreatedUsersValue(index){
//   return {
//     userName: allContacts[index]["name"],
//     userEmail:allContacts[index]["email"],
//     userNumber: allContacts[index]["number"],
//     userID: allContacts[index]["id"],
//     userColor: allContacts[index]["color"]
//   }
// }

// function returnContactSuccessfullyCreatetPopUp(action){
//   document.getElementById("contact-successfully-created-pop-up").innerHTML = "Contact successfully " + action; 
// }

// <!--- Hier enden die ganzen veralteten Funktionen -->