import { onValue, ref } from "./database.js";
import database from './database.js';

let allContacts = await getAllContacts();

export async function getAllContacts(){
    return new Promise((resolve, reject) => {
        let contactsRef = ref(database, 'kanban/sharedBoard/contacts');
        onValue(
            contactsRef,
            (snapshot) => {
                let contactsData = snapshot.val();
                resolve(Object.values(contactsData));
                console.log('contacts: ', Object.values(contactsData));
            }
        ),
        (error) => {
            console.errpr('Fehler beim Laden der Kontakte: ', error);
            reject(error);
        }
    });
}

export {allContacts};