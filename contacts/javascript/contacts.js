import {ref, onValue, update, push} from "../../../core/database.js";
import db from "../../../core/database.js";
import * as contactsHTML from './contactsHTML.js';

const database = db.database;

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

export function submitNewUser(){
  let bgColor = randomColor();
  addNewContact(bgColor, "create");
}

async function invokeDatabankChangesRelatedToNewContact(newUserData){
  await postNewContact(newUserData);
  await initContact();
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

export async function getAllContacts(){
  let contactsRef = ref(database, 'kanban/sharedBoard/contacts');
  onValue(contactsRef, (snapshot) => {
    let contactsData = snapshot.val();
    // contactsHTML.allContacts = Object.values(contactsData);
    // renderContactList(Object.values(contactsData));
    return Object.values(contactsData);
  });
}