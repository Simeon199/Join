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
  let userName = user["name"];
  let userEmail = user["email"];
  let userNumber = user["phone"];
  let userID = user["id"];
  let userColor = user["color"];
  let template = core.getTemplateClone('contact-template');
  return template;
}

/**
 * Generates HTML for big contact icon containers.
 *
 * @param {string} userName - The name of the user.
 * @param {string} userEmail - The email of the user.
 * @param {string} userNumber - The contact number of the user.
 * @param {string} userID - The unique ID of the user.
 * @param {number} i - An index or identifier for the user.
 * @param {string} userColor - The color associated with the user.
 */
export function returnBigContactIconContainerHTML(createdUserObject, index) {
  let template = core.getTemplateClone('contact-template');
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
  let template = core.getTemplateClone('add-new-contact-form');
  return template;
}