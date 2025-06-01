import * as contacts from './contacts.js';
import * as shared from '../../shared/javascript/shared.js';
export * from './contactsHTML.js';

const templateParentDivs = [
  'pop-up-inputs-container', 
  'pop-up-headline-container', 
  'pop-up-contact-logo'
];

const templatePaths = [
  '/contacts/templates/add-contact-pop-up-form.tpl', 
  '/contacts/templates/add-contact-pop-up-headline.tpl', 
  '/contacts/templates/add-contact-pop-up-logo.tpl'
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

let activeContactIndex = null;
let allContacts = [];
let firstContactsNameLetter = [];

document.addEventListener('DOMContentLoaded', async () => {
  if(window.location.pathname.endsWith('/contacts/contacts.html')){
    shared.bundleLoadingHTMLTemplates();
    await getAllContactsAndRenderThem();
    loadAllContactsTemplateFunctions();
    triggerAllClickEventFunctions();
    triggerSubmitEventFunction();
  }
});

export async function getAllContactsAndRenderThem(){
  allContacts = await contacts.getAllContacts();
  allContacts.forEach((element) => {
    firstContactsNameLetter.push(element.initials);
  });
  sortContacts();
  sortAllUserLetters();
  renderContactList();
}

function triggerSubmitEventFunction(){
  document.body.addEventListener('submit', (event) => {
    if(event.target && event.target.matches('#form')){
      event.preventDefault();
      contacts.submitNewUser(event);
    }
  });
}

async function loadAllContactsTemplateFunctions(){
  for(let j = 0; j < templatePaths.length; j++){
    await shared.initHTMLContent(templatePaths[j], templateParentDivs[j]);
  }
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
    shared.stopEvent(event),
    showIconContainer();
  });
  document.getElementById('icon-container').addEventListener('click', (event) => {
    shared.stopEvent(event);
  });
}

function manageClickEventOnAddNewContactsButton(){
  let emptyUser = {};
  document.getElementById('add-new-contacts-button').addEventListener('click', () => {
    showPopUp(); 
    fillInputValuesDependingOnFormCall(emptyUser);
  });
  document.getElementById('add-new-contacts-mobile-button').addEventListener('click', () => {
    showPopUp();
    fillInputValuesDependingOnFormCall(emptyUser);
  });
}

function manageClickEventOnAddTaskPopUp(){
  document.getElementById('add-task-pop-up-bg').addEventListener('click', () => {
    hidePopUp();
  });
  document.getElementById('add-task-pop-up').addEventListener('click', (event) => {
    shared.stopEvent(event);
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
 * Hides all small pop-ups by adding a CSS class.
 *
 */

function hideAllSmallPopUps(){
  document.getElementById("icon-container").classList.add("icon-container-translate-100");
}

/**
 * Hides the add task popup.
 *
 */

export function hidePopUp() {
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

/**
 * Returns a random color from the colors array.
 *
 */

export function randomColor() {
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

/**
 * Renders the contact list by creating containers for each letter.
 *
 */

async function renderContactList() {
  let contactListContainer = document.getElementById("contact-list");
  contactListContainer.innerHTML = "";
  for (let i = 0; i < firstContactsNameLetter.length; i++) {
    let letter = firstContactsNameLetter[i];
    await shared.initHTMLContent('/contacts/templates/contact-letter-container.tpl', "contact-list"); 
    document.querySelectorAll(".letter-list-contact-container")[i].innerHTML = "";
    for (let j = 0; j < allContacts.length; j++) { 
      let user = allContacts[j];
      if (areUserInitialsEqual(user, letter)) {
        document.querySelectorAll('.letter')[i].innerHTML += letter.charAt(0).toUpperCase();
        let contactHTML = await returnContactHTML(j, user);
        document.querySelectorAll(".letter-list-contact-container")[i].appendChild(contactHTML);
      }
    }
  }
}

function areUserInitialsEqual(user, existingInitials){
  let userInitials = getContactInitials(user.name).toLowerCase();
  return userInitials == existingInitials.toLowerCase();
}

/**
 * Generates HTML for a contact card with user details.
 *
 * @param {number} j - Index of the contact.
 * @param {Object} user - The user object containing details.
 */

export async function returnContactHTML(j, user) {
  let clone = await shared.initHTMLContent('/contacts/templates/contact-template.tpl','contact-list');
  let contactList = document.getElementById('contact-list');
  let contactElement = contactList.querySelectorAll('.contact')[j];
  contactElement.querySelector('.profile-badge').style.backgroundColor = user.color;
  contactElement.querySelector('.initials').textContent = getContactInitials(user.name);
  contactElement.querySelector('.name').textContent = user.name;
  contactElement.querySelector('.email').textContent = user.email;
  contactElement.addEventListener('click', () => {
    toggleBigContact(j, user);
  });
  return clone;
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

function toggleBigContact(j, user) { // i, userName, userEmail, userNumber, userID, userColor
  let contactEl = document.querySelectorAll(".contact")[j]; // let contactEl = document.querySelectorAll(".contact")[i]
  if (activeContactIndex === j) { // activeContactIndex === i
    deselectContact();
  } else {
    selectContact(user, j, contactEl); // userName, userEmail, userNumber, userID, i, userColor,
  }
}

/**
 * Deselects the currently active contact and updates the UI.
 *
 */

async function deselectContact() {
  let bigContactIconWrapper = document.getElementById('big-contact-icon-wrapper');
  if(bigContactIconWrapper){
    bigContactIconWrapper.innerHTML = '';
  }
  document.getElementById("big-contact").classList.add("hide-big-contact");
  document.querySelectorAll(".contact")[activeContactIndex].classList.remove("contact-aktiv");
  document.getElementById("right-site-container").classList.add("right-site-container-translate-100");
  document.getElementById("show-icon-container-button").classList.add("show-icon-container-button-translate-100");
  document.getElementById("show-icon-container-button").classList.remove("animation");
  document.getElementById("add-new-contacts-mobile-button").classList.remove("d-none");
  activeContactIndex = null;
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

async function selectContact(user, j, contactEl) { 
  renderBigContact(user, j); 
  if (activeContactIndex !== null) {
    document.querySelectorAll(".contact")[activeContactIndex].classList.remove("contact-aktiv");
  }
  contactEl.classList.add("contact-aktiv");
  document.getElementById('big-contact').classList.remove("hide-big-contact");
  document.getElementById("right-site-container").classList.remove("right-site-container-translate-100");
  document.getElementById("show-icon-container-button").classList.remove("show-icon-container-button-translate-100");
  document.getElementById("show-icon-container-button").classList.add("animation");
  document.getElementById("add-new-contacts-mobile-button").classList.add("d-none");
  activeContactIndex = j; 
  contactEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Renders the contact's details on the big profile display.
 *
 */

function renderBigContact(user, index) {
  insertInformationIntoBigContact(user);
  insertIconsIntoIconContainer(user, index);
}

function insertInformationIntoBigContact(user){
  document.getElementById("big-profile-badge").innerHTML = getContactInitials(user.name);
  document.getElementById("big-profile-badge").style.backgroundColor = user.color;
  document.getElementById("big-name").innerHTML = user.name;
  document.getElementById("big-email").innerHTML = user.email;
  document.getElementById("big-number").innerHTML = user.number;
}

async function insertIconsIntoIconContainer(user, index){
  let iconContainer = document.getElementById('icon-container');
  if(iconContainer){
    iconContainer.innerHTML = '';
  }
  let contactDataHTML = await returnBigContactIconContainerHTML(user, index);
  iconContainer.appendChild(contactDataHTML);
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

export async function returnBigContactIconContainerHTML(user, index) {
  let template = await shared.initHTMLContent('/contacts/templates/big-contact-icon-container.tpl', 'big-contact');
  template.querySelector('.edit-contact').addEventListener('click', () => {
    showPopUp();
    renderEditContactPopUp(user, index);
  });
  template.querySelector('.delete-contact').addEventListener('click', () =>{
    contacts.deleteContact(user.id);
  });
  return template;
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

async function renderEditContactPopUp(user, index) {
  await prepareRenderEditContactTemplate(index);
  prepareRenderEditPopUpForm(user);
  fillInputValuesDependingOnFormCall(user);
  listenForSubmitOnRenderEditContact(user);
}

function listenForSubmitOnRenderEditContact(user){
  document.getElementById('edit-contact-form').addEventListener('submit', () => {
    contacts.editContact(user.id, {
      name: document.getElementById('pop-up-name-input').value,
      email: document.getElementById('pop-up-email-input').value,
      number: document.getElementById('pop-up-phone-input').value
    });
  });
}

async function prepareRenderEditContactTemplate(index){
  let editContactPopUp = await returnEditContactPopUpFormHTML(index);
  let popUpInputsContainer = document.getElementById("pop-up-inputs-container");
  if(popUpInputsContainer){
    popUpInputsContainer.innerHTML = '';
  }
  popUpInputsContainer.appendChild(editContactPopUp); 
} 

function prepareRenderEditPopUpForm(user){
  document.getElementById("pop-up-headline-container").innerHTML = returnEditContactPopUpHeadlineHTML();
  document.getElementById("pop-up-contact-logo").innerHTML = returnEditContactPopUpLogoHTML(user.name);
  document.getElementById("pop-up-contact-logo").style.backgroundColor = user.color;
}

function fillInputValuesDependingOnFormCall(user){
  if(Object.keys(user).length > 0){
    assignUserPropertiesToInputs(user);
  } else {
    assignEmptyContentToInputs();
  }
}

function assignUserPropertiesToInputs(user){
  document.getElementById("pop-up-name-input").value = user.name;
  document.getElementById("pop-up-email-input").value = user.email;
  document.getElementById("pop-up-phone-input").value = user.number;
}

function assignEmptyContentToInputs(){
  document.getElementById("pop-up-name-input").value = '';
  document.getElementById("pop-up-email-input").value = '';
  document.getElementById("pop-up-phone-input").value = '';
}


/**
 * Returns the HTML form for editing a contact.
 *
 * @param {string} userID - The unique identifier of the user.
 * @param {number} i - Index of the contact in the list.
 * @param {string} userColor - The color associated with the user.
 */

async function returnEditContactPopUpFormHTML(index) { // userID, i, userColor
  console.log('index: ', index);
  let template = await shared.initHTMLContent('/contacts/templates/edit-contact-pop-up-form.tpl', 'add-task-pop-up');
  return template;
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
  return  `${getContactInitials(userName)}`;
}

/**
 * Sorts the contacts in alphabetical order by name.
 *
 */

function sortContacts() {
  allContacts.sort((a, b) => {
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
  for (let i = 0; i < allContacts.length; i++) {
    let userLetter = allContacts[i]["name"].charAt(0).toLowerCase();
    if (!firstContactsNameLetter.includes(userLetter)) {
      firstContactsNameLetter.push(userLetter);
    }
  }
  firstContactsNameLetter.sort();
}

/**
 * Shows the contact creation success popup.
 *
 */

export function showContactSuccessfullyCreatedPopUp() {
  document.getElementById("contact-successfully-created-pop-up-bg").classList.remove("hide-pop-up-translate-100");
}

/**
 * Hides the loading screen by adding the "d-none" class..
 *
 */

export function hideLoadScreen() {
  document.getElementById("load-screen").classList.add("d-none");
}

export function toggleClasses(){
  document.getElementById("big-contact").classList.remove("hide-big-contact");
  document.getElementById("right-site-container").classList.remove("right-site-container-translate-100");
  document.getElementById("show-icon-container-button").classList.remove("show-icon-container-button-translate-100");
  document.getElementById("show-icon-container-button").classList.add("animation");
}

/**
 * Extracts and concatenates the first letters of the first two words in the name.
 *
 * @param {string} name - The name from which to extract the letters.
 */

export function getContactInitials(name) {
  let words = name.split(" ");
  let firstLetters = words.map((word) => word.charAt(0));
  let result = firstLetters.slice(0, 2).join("");
  return result.toUpperCase();
}

/**
 * Hides the success popup after 3 seconds.
 *
 */

export function hideContactSuccessfullyCreatedPopUp() {
  setTimeout(() => {
    document.getElementById("contact-successfully-created-pop-up-bg").classList.add("hide-pop-up-translate-100");
  }, 3000);
}

/**
 * Shows the loading screen by removing the "d-none" class.
 *
 */

export function showLoadScreen() {
  document.getElementById("load-screen").classList.remove("d-none");
}

/**
 * Displays the big contact view for the newly added contact.
 *
 * @param {string} nameInputValue - The name of the contact to display.
 */

// export function afterAddingNewContactShowBigContact(userName) {
//   let index = allContacts.findIndex((user) => user.name === userName);
//   let createdUserObject = getCreatedUsersValue(index);
//   activeContactIndex = index;
//   renderBigContact(createdUserObject, index); // user, j
//   toggleClasses();
// }

export function returnContactSuccessfullyCreatetPopUp(action){
  document.getElementById("contact-successfully-created-pop-up").innerHTML = "Contact successfully " + action; 
}

export {allContacts, firstContactsNameLetter};