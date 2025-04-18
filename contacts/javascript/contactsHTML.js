import * as contacts from './contacts.js';
import * as core from '../../../core/templateLoader.js';
export * from './contactsHTML.js';

let basePath = '../contacts/templates/';

let allTemplates = [
  'add-contact-pop-up-logo.html', 
  'add-contact-pop-up-form.html', 
  'add-contact-pop-up-headline.html',
  'big-contact-icon-container.html',
  'contact-letter-container.html',
  'contact-template.html'
];

let allTemplatesIds = [];
let allContacts = [];

document.addEventListener('DOMContentLoaded', async () => {
  initFunctionsForContacts();
  document.getElementById('add-new-contacts-button').addEventListener('click', () => {
    showPopUp();
  })
});

/**
 * Shows the add task popup and hides all small popups.
 *
 */

function showPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("add-task-pop-up").classList.remove("translate-100");
  hideAllSmallPopUps();
}

window.renderEditContactPopUp = contacts.renderEditContactPopUp;

async function initFunctionsForContacts(){
  allTemplatesIds = await core.loadTemplates(allTemplates, basePath);
  allContacts = contacts.getAllContacts();
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
}

function buildTemplateModel(id, renderMethod){
  let wrapper = document.createElement(id);
  wrapper.id = id;
  wrapper.appendChild(renderMethod);
  return wrapper;
}