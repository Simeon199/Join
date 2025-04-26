import {ref, onValue, update, push, remove} from "../../../core/database.js";
import db from "../../../core/database.js";
import * as contactsHTML from './contactsHTML.js';
export * from './contacts.js';

const database = db.database;

/**
 * Adds a new contact and shows a success message.
 *
 * @param {string} bgColor - Background color for the contact.
 * @param {string} action - Action message to display.
 */

async function addNewContact(action) { // bgColor=randomColor()
  let newUserData = createUserData();
  contactsHTML.showLoadScreen();
  contactsHTML.returnContactSuccessfullyCreatetPopUp(action);
  contactsHTML.hidePopUp();
  invokeDatabankChangesRelatedToNewContact(newUserData);
  contactsHTML.hideLoadScreen();
  contactsHTML.showContactSuccessfullyCreatedPopUp();
  contactsHTML.hideContactSuccessfullyCreatedPopUp();
  setTimeout(() => {
    window.location.reload();
  }, 3100); // provisorische Lösung
  // contactsHTML.afterAddingNewContactShowBigContact(newUserData.name);
}

export function submitNewUser(){
  addNewContact("create");
}

async function invokeDatabankChangesRelatedToNewContact(newUserData){
  await postNewContact(newUserData);
  await contactsHTML.initContact();
}

function createUserData(){
  let name = document.getElementById("pop-up-name-input").value;
  let initials = contactsHTML.getContactInitials(name);
  let email = document.getElementById("pop-up-email-input").value;
  let number = document.getElementById("pop-up-phone-input").value;
  let color = contactsHTML.randomColor();
  let userObject = {
    name: name,
    initials: initials,
    email: email,
    number: number,
    color: color
  }
  return userObject;
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
  return new Promise((resolve, reject) => {
    let contactsRef = ref(database, 'kanban/sharedBoard/contacts');
    onValue(
      contactsRef,
      (snapshot) => {
        let contactsData = snapshot.val();
        console.log('contacts data: ', Object.values(contactsData));
        resolve(Object.values(contactsData));
      },
    ),
    (error) => {
      console.error('Fehler beim Laden der Kontakte: ', error);
      reject(error);
    }
  });
} 

export async function deleteContact(contactId){
  try {
    let contactRef = ref(database, `kanban/sharedBoard/contacts/${contactId}`);
    await remove(contactRef);
    console.log(`Kontakt mit ID ${contactId} wurde erfolgreich gelöscht.`);
  } catch(error){
    console.error('Fehler beim Löschen des Kontakts: ', error);
  }
  window.location.reload();
}

export async function editContact(contactId, updateData){
  try {
    let contactRef = ref(database, `kanban/sharedBoard/contacts/${contactId}`);
    await update(contactRef, updateData);
    console.log(`Kontakt mit ID ${contactId} wurde erfolgreich aktualisiert.`);
  } catch(error){
    console.error('Fehler beim Bearbeiten des Kontakts: ', error);
  }
}