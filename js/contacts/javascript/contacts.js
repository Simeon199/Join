import {ref, set, child, onValue, get, update, push} from "../../../config/database.js";
import db from "../../../config/database.js";
import * as contactsHTML from './contactsHTML.js';
export {renderEditContactPopUp};
export {allTemplates};

let allTemplates = [
  'add-contact-pop-up-contact-logo.html', 
  'add-contact-pop-up-form.html', 
  'add-contact-pop-up-headline.html',
  'big-contact-icon-container.html',
  'contact-letter-container.html',
  'contact-template.html'
]

const database = db.database;

let allUsers = [];
let firstUsersNameLetter = [];
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

let activeContactIndex = null;
let actions = {
  testFunction: () => testFunction(),
  showPopUp: () => showPopUp(),
  renderAddContactPopUp: () => renderAddContactPopUp(),
  hideAllSmallPopUps: () => hideAllSmallPopUps(),
  deselectContact: () => deselectContact(),
  showIconContainer: () => showIconContainer(),
  hidePopUp: () => hidePopUp(),
  stopEvent: (event) => stopEvent(event),
  submitNewUser: (event) => submitNewUser(event)
};

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (event) => {
    let actionElement = event.target.closest("[data-action]");
    if(!actionElement){
      return;
    }
    let actionString = actionElement.dataset.action;
    let actionList = actionString.split(",").map(element => element.trim());
    actionList.forEach(action => {
      if(typeof actions[action] === 'function'){
        actions[action](event);
      } else {
        console.warn(`Aktion '${action}' ist nicht definiert.`);
      }
    });
  });
  initContact();
  observeForForm();
  initSidebar();
});

function observeForForm(){
  let observer = new MutationObserver(() => {
    let form = document.getElementById('form');
    if(form){
      form.addEventListener('submit', function(event){
        event.preventDefault();
        let actionElement = event.submitter.closest("[data-action]");
        let action = actionElement?.dataset.action;
        if(action && typeof actions[action] === 'function'){
          actions[action](event); 
        }
      });
      observer.disconnect();
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function submitNewUser(){
  let bgColor = randomColor();
  addNewContact(bgColor, "create");
}

/**
 * Adds a new contact and shows a success message.
 *
 * @param {string} bgColor - Background color for the contact.
 * @param {string} action - Action message to display.
 */
async function addNewContact(bgColor=randomColor(), action) {
  let newUserData = createUserData(bgColor);
  showLoadScreen();
  returnContactSuccessfullyCreatetPopUp(action);
  hidePopUp();
  invokeDatabankChangesRelatedToNewContact(newUserData);
  readNewContactsFromDatabase();
  hideLoadScreen();
  showContactSuccessfullyCreatedPopUp();
  hideContactSuccessfullyCreatedPopUp();
  setTimeout(() => {
    afterAddingNewContactShowBigContact(newUserData.name);
  }, 500);
}

async function invokeDatabankChangesRelatedToNewContact(newUserData){
  await postNewContact(newUserData);
  await initContact();
}

function returnContactSuccessfullyCreatetPopUp(action){
  document.getElementById("contact-successfully-created-pop-up").innerHTML = "Contact successfully " + action; 
}

function createUserData(bgColor=randomColor()){
  return {
    name: document.getElementById("pop-up-name-input").value,
    email: document.getElementById("pop-up-email-input").value,
    number: document.getElementById("pop-up-phone-input").value,
    color: bgColor
  }
}

/**
 * Posts new contact data to the specified path.
 *
 * @param {string} path - The path for the API request.
 * @param {Object} data - The contact data to be posted.
 */

async function postNewContact(newUserData){
  let contactsRef = ref(database, 'kanban/sharedBoard/contacts');
  let newContactKey = push(contactsRef).key;
  let contactWithId = {
    ...newUserData,
    id: newContactKey
  };
  let updates = {};
  updates[`contacts/${newContactKey}`] = contactWithId;
  try {
    await update(ref(database, 'kanban/sharedBoard'), updates);
    console.log('Kontakt erfolgreich gespeichert');
  } catch(error) {
    console.error('Fehler beim Speichern des Kontakts: ', error);
  }
}

function readNewContactsFromDatabase(){
  let contactsRef = ref(database, 'kanban/sharedBoard/contacts');
  onValue(contactsRef, (snapshot) => {
    let contactData = snapshot.val();
    allUsers = Object.values(contactData);
    return allUsers;
  })
}

function getAllContacts(){
  let contactsRef = ref(database, 'kanban/sharedBoard/contacts');
  onValue(contactsRef, (snapshot) => {
    let contactsData = snapshot.val();
    renderContactList(Object.values(contactsData));
    return Object.values(contactsData);
  })
}

/**
 * Initializes contact-related variables and functions when the website loads.
 *
 */

async function initContact() {
  allUsers = [];
  firstUsersNameLetter = [];
  getAllContacts();
  // renderContactList();
}


/**
 * Sorts the contacts in alphabetical order by name.
 *
 */

function sortContacts() {
  allUsers.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

/**
 * Sorts the first letters of the contact names and updates the list.
 *
 */

function sortAllUserLetters() {
  for (let i = 0; i < allUsers.length; i++) {
    let userLetter = allUsers[i]["name"].charAt(0).toLowerCase();
    if (!firstUsersNameLetter.includes(userLetter)) {
      firstUsersNameLetter.push(userLetter);
    }
  }
  firstUsersNameLetter.sort();
}

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
 * Returns a random color from the colors array.
 *
 */

function randomColor() {
  let randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
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
 * Hides the add task popup.
 *
 */

function hidePopUp() {
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

/**
 * Shows the contact creation success popup.
 *
 */

function showContactSuccessfullyCreatedPopUp() {
  document.getElementById("contact-successfully-created-pop-up-bg").classList.remove("hide-pop-up-translate-100");
}

/**
 * Hides the success popup after 3 seconds.
 *
 */

function hideContactSuccessfullyCreatedPopUp() {
  setTimeout(() => {
    document.getElementById("contact-successfully-created-pop-up-bg").classList.add("hide-pop-up-translate-100");
  }, 3000);
}

/**
 * Shows the loading screen by removing the "d-none" class.
 *
 */

function showLoadScreen() {
  document.getElementById("load-screen").classList.remove("d-none");
}

/**
 * Hides the loading screen by adding the "d-none" class..
 *
 */

function hideLoadScreen() {
  document.getElementById("load-screen").classList.add("d-none");
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
 * Toggles the translation class for the icon container.
 *
 */

function showIconContainer() {
  document.getElementById("icon-container").classList.toggle("icon-container-translate-100");
}

/**
 * Hides all small pop-ups by adding a CSS class.
 *
 */

function hideAllSmallPopUps(){
  document.getElementById("icon-container").classList.add("icon-container-translate-100");
}

/**
 * Marks the "contacts" section as the current section.
 *
 */

function taskMarker() {
  document.getElementById("contacts").classList.add("currentSection");
}

/**
 * Renders the contact list by creating containers for each letter.
 *
 */

function renderContactList(array) {
  let contactListContainer = document.getElementById("contact-list");
  contactListContainer.innerHTML = "";
  array.forEach((element) => {
    contactListContainer.innerHTML += `${element.name}`;
    // contactListContainer.innerHTML += `${firstLetterFirstTwoWords(element.name)}`;
  });
  // for (let i = 0; i < firstUsersNameLetter.length; i++) {
  //   renderContactLetterContainer(i, contactListContainer);
  // }
}


/**
 * Renders contact letter container and updates contact list.
 *
 * @param {number} i - Index of the letter in the list.
 * @param {HTMLElement} contactListContainer - Container for the contact list.
 */

function renderContactLetterContainer(i, contactListContainer) {
  const letter = firstUsersNameLetter[i];
  contactListContainer.innerHTML += returnContactLetterContainerHTML(letter);
  document.querySelectorAll(".letter-list-contact-container")[i].innerHTML = "";
  for (let j = 0; j < allUsers.length; j++) {
    renderContact(i, j, letter);
  }
}

/**
 * Renders contact if the name starts with the given letter.
 *
 * @param {number} i - Index for letter list container.
 * @param {number} j - Index for the user in allUsers array.
 * @param {string} letter - The starting letter to filter contacts.
 */

function renderContact(i, j, letter) {
  const user = allUsers[j];
  if (user["name"].toLowerCase().startsWith(letter)) {
    document.querySelectorAll(".letter-list-contact-container")[i].innerHTML += contactsHTML.returnContactHTML(j, user);
  }
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

function renderEditContactPopUp(createdUserObject, index) {
  document.getElementById("pop-up-inputs-container").innerHTML = returnEditContactPopUpFormHTML(createdUserObject.userID, index, createdUserObject.userColor);
  document.getElementById("pop-up-headline-container").innerHTML = returnEditContactPopUpHeadlineHTML();
  document.getElementById("pop-up-contact-logo").innerHTML = returnEditContactPopUpLogoHTML(createdUserObject.userName);
  document.getElementById("pop-up-contact-logo").style.backgroundColor = createdUserObject.userColor;
  document.getElementById("pop-up-name-input").value = createdUserObject.userName;
  document.getElementById("pop-up-email-input").value = createdUserObject.userEmail;
  document.getElementById("pop-up-phone-input").value = createdUserObject.userNumber;
}

/**
 * Renders the add contact popup with form, headline, and logo.
 *
 */

function renderAddContactPopUp() {
  document.getElementById("pop-up-inputs-container").innerHTML = contactsHTML.returnAddContactPopUpFormHTML();
  document.getElementById("pop-up-headline-container").innerHTML = contactsHTML.returnAddContactPopUpHeadlineHTML();
  document.getElementById("pop-up-contact-logo").innerHTML = contactsHTML.returnAddContactPopUpContactLogoHTML();
  document.getElementById("pop-up-contact-logo").style.backgroundColor = "#d1d1d1";
}

/**
 * Displays the big contact view for the newly added contact.
 *
 * @param {string} nameInputValue - The name of the contact to display.
 */

function afterAddingNewContactShowBigContact(nameInputValue) {
  let index = allUsers.findIndex((user) => user.name === nameInputValue);
  let createdUserObject = getCreatedUsersValue(index);
  activeContactIndex = index;
  renderBigContact(createdUserObject, index);
  toggleClasses();
}

function toggleClasses(){
  document.getElementById("big-contact").classList.remove("hide-big-contact");
  document.getElementById("right-site-container").classList.remove("right-site-container-translate-100");
  document.getElementById("show-icon-container-button").classList.remove("show-icon-container-button-translate-100");
  document.getElementById("show-icon-container-button").classList.add("animation");
}

function getCreatedUsersValue(index){
  return {
    userName: allUsers[index]["name"],
    userEmail:allUsers[index]["email"],
    userNumber: allUsers[index]["number"],
    userID: allUsers[index]["id"],
    userColor: allUsers[index]["color"]
  }
}

/**
 * Renders the contact's details on the big profile display.
 *
 */

function renderBigContact(createdUserObject, index) {
  document.getElementById("big-profile-badge").innerHTML = firstLetterFirstTwoWords(createdUserObject.userName);
  document.getElementById("big-profile-badge").style.backgroundColor = createdUserObject.userColor;
  document.getElementById("big-name").innerHTML = createdUserObject.userName;
  document.getElementById("big-email").innerHTML = createdUserObject.userEmail;
  document.getElementById("big-number").innerHTML = createdUserObject.userNumber;
  document.getElementById("icon-container").innerHTML = contactsHTML.returnBigContactIconContainerHTML(createdUserObject, index);
}

// All functions used in contactsHTML.js

// returnContactLetterContainerHTML
// returnContactHTML
// returnBigContactIconContainerHTML
// returnAddContactPopUpHeadlineHTML
// returnAddContactPopUpContactLogoHTML
// returnAddContactPopUpFormHTML