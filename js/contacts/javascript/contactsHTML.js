import * as contacts from './contacts.js';
import * as core from '../../../core/templateLoader.js';
export * from './contactsHTML.js';

let basePath = '../js/contacts/templates/';

let allTemplates = [
  'add-contact-pop-up-contact-logo.html', 
  'add-contact-pop-up-form.html', 
  'add-contact-pop-up-headline.html',
  'big-contact-icon-container.html',
  'contact-letter-container.html',
  'contact-template.html'
];

let allTemplatesIds = [];

document.addEventListener('DOMContentLoaded', async () => {
  allTemplatesIds = await core.loadTemplates(allTemplates, basePath);
});

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

/**
 * Returns HTML for the add contact popup headline.
 *
 */

export function returnAddContactPopUpHeadlineHTML() {
  let template = core.getTemplateClone('contact-pop-up-headline');
  return template;
}

/**
 * Returns HTML string for an SVG logo in the contact popup.
 *
 */

export function returnAddContactPopUpContactLogoHTML() {
  let template = core.getTemplateClone('add-contact-pop-up-contact');
  return template;
}

/**
 * Generates HTML for a contact addition pop-up form.
 *
 */

export function returnAddContactPopUpFormHTML() {
  // let template = core.getTemplateClone('add-new-contact-form');
  let template = getContentFromTemplate('add-new-contact-form');
  document.body.appendChild(template);
  template.querySelector('.pop-up-cancel-button').addEventListener('click', () => {
    hidePopUp()
  });
  // return template;
}

// Pattern für dynamisches Template

export function getContentFromTemplate(id){
  let clone = document.importNode(document.getElementById(id), true);
  let wrapper = document.createElement('div');
  wrapper.appendChild(clone);
  return wrapper;
}

// Wie man es später benutzen kann

// let formWrapper = getFormFromTemplate('add-new-contact-form');
// document.body.appendChild(formWrapper);
// formWrapper.querySelector('#pop-up-cancel-button').addEventListener('click', hidePopUp);