// import {ref, set, get} from "../../../core/database.js";
// import db from "../../../core/database.js";

import * as contacts from './contacts.js';
import * as core from '../../../core/templateLoader.js';
export * from './contactsHTML.js';

// let database = db.database;

let basePath = '../contacts/templates/';

let allTemplates = [
  'add-contact-pop-up-logo.html', 
  'add-contact-pop-up-form.html', 
  'add-contact-pop-up-headline.html',
  'big-contact-icon-container.html',
  'contact-letter-container.html',
  'contact-template.html'
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
let allContacts = []; // ehemals allUsers
let firstContactsNameLetter = []; // ehemals firstUsersNameLetter 

document.addEventListener('DOMContentLoaded', async () => {
  initFunctionsForContacts();
  triggerAllClickEventFunctions();
});

async function initFunctionsForContacts(){
  allTemplatesIds = await core.loadTemplates(allTemplates, basePath);
  initContact();
  initSidebar();
}

function triggerAllClickEventFunctions(){
  document.getElementById('body').addEventListener('click', () => {
    hideAllSmallPopUps();
  });

  document.getElementById('add-new-contacts-button').addEventListener('click', () => {
    showPopUp(), 
    renderAddContactPopUp()
  });

  document.getElementById('add-new-contacts-mobile-button').addEventListener('click', () => {
    showPopUp(), 
    renderAddContactPopUp()
  });

  document.getElementById('big-contact-arrow').addEventListener('click', () => {
    deselectContact();
  });

  document.getElementById('show-icon-container-button').addEventListener('click', (event) => {
    stopEvent(event),
    showIconContainer();
  });

  document.getElementById('icon-container').addEventListener('click', (event) => {
    stopEvent(event);
  });

  document.getElementById('add-task-pop-up-bg').addEventListener('click', () => {
    hidePopUp();
  })

  document.getElementById('add-task-pop-up').addEventListener('click', (event) => {
    stopEvent(event);
  })

  document.getElementById('close-add-task-pop-up').addEventListener('click', () => {
    hidePopUp();
  })
}

// <!-- <button id="add-new-contacts-button" data-action="showPopUp, renderAddContactPopUp"> -->

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

window.renderEditContactPopUp = contacts.renderEditContactPopUp;

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

export function returnBigContactIconContainerHTML(createdUserObject, index) {
  let template = core.getTemplateClone('big-contact-icon-container');
  template.querySelector('.edit-contact').addEventListener('click', () => {
    showPopUp(),
    contacts.renderEditContactPopUp(createdUserObject, index)
  });
  template.querySelector('.delete-contact').addEventListener('click', () =>{
    deleteContact(createdUserObject.userID)
  });
  return template;
}

export function returnTemplate(id){
  let template = core.getTemplateClone(id);
  return template;
}

function renderAddContactPopUp(){
  buildTemplateModel('add-new-contact-form', returnTemplate('add-new-contact-form'));
  buildTemplateModel('contact-pop-up-headline', returnTemplate('contact-pop-up-headline'));
  buildTemplateModel('add-contact-pop-up-logo', returnTemplate('add-contact-pop-up-logo'));
  // document.getElementById("pop-up-contact-logo").style.backgroundColor = "#d1d1d1"
}

function buildTemplateModel(id, renderMethod){
  let wrapper = document.createElement(id);
  wrapper.id = id;
  wrapper.appendChild(renderMethod);
  return wrapper;
}

// <!--- Hier kommen die ganzen veralteten Funktionen -->

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

/**
 * Returns the HTML form for editing a contact.
 *
 * @param {string} userID - The unique identifier of the user.
 * @param {number} i - Index of the contact in the list.
 * @param {string} userColor - The color associated with the user.
 */

function returnEditContactPopUpFormHTML(userID, i, userColor) {
  console.log('Hier muss noch die eigentliche Funktion rein!');
}

/**
 * Returns the HTML for the edit contact pop-up headline.
 *
 */

function returnEditContactPopUpHeadlineHTML() {
  return  `<h1 id="pop-up-headline">Edit contact</h1>`;
}

/**
* Returns HTML string for contact popup logo with user's initials.
*
* @param {string} userName - The name of the user.
*/

function returnEditContactPopUpLogoHTML(userName) {
  return  `${firstLetterFirstTwoWords(userName)}`;
}

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

function randomColor() {
  let randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

/**
 * Toggles the translation class for the icon container.
 *
 */

function showIconContainer() {
  document.getElementById("icon-container").classList.toggle("icon-container-translate-100");
}

// <!--- Hier enden die ganzen veralteten Funktionen -->