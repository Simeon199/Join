import {ref, onValue, update, push, remove} from "../../../core/firebase.js";
import * as firebase from "../../../core/firebase.js";
import * as contactsHTML from './contactsHTML.js';
export * from './contacts.js';

const database = firebase.database;

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

async function postNewContact(newUserData){
  let contactsRef = ref(firebase.database, 'kanban/sharedBoard/contacts');
  let newContactKey = push(contactsRef).key;
  let contactWithId = {
    ...newUserData,
    id: newContactKey
  };
  let updates = {};
  updates[`contacts/${newContactKey}`] = contactWithId;
  try {
    await update(ref(firebase.database, 'kanban/sharedBoard'), updates);
    console.log('Kontakt erfolgreich gespeichert');
  } catch(error) {
    console.error('Fehler beim Speichern des Kontakts: ', error);
  }
}

export async function getAllContacts(){
  return new Promise((resolve, reject) => {
    let contactsRef = ref(firebase.database, 'kanban/sharedBoard/contacts');
    onValue(
      contactsRef,
      (snapshot) => {
        let contactsData = snapshot.val();
        resolve(Object.values(contactsData));
        console.log('contacts: ', Object.values(contactsData));
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
    let contactRef = ref(firebase.database, `kanban/sharedBoard/contacts/${contactId}`);
    await remove(contactRef);
    console.log(`Kontakt mit ID ${contactId} wurde erfolgreich gelöscht.`);
  } catch(error){
    console.error('Fehler beim Löschen des Kontakts: ', error);
  }
  // window.location.reload();
}

export async function editContact(contactId, updateData){
  try {
    let contactRef = ref(firebase.database, `kanban/sharedBoard/contacts/${contactId}`);
    await update(contactRef, updateData);
    console.log(`Kontakt mit ID ${contactId} wurde erfolgreich aktualisiert.`);
  } catch(error){
    console.error('Fehler beim Bearbeiten des Kontakts: ', error);
  }
}