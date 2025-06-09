import { onValue, ref } from "./firebase.js";
import * as firebase from "./firebase.js";

export function createReactiveDataSource(path){
    let currentData = null;
    let listeners = [];
    let dbRef = ref(firebase.database, path);
    onValue(dbRef, (snapshot) => {
        const val = snapshot.val() || {};
        currentData = val;
        notify(listeners, currentData);
    }, (error) => {
        console.error(`Fehler beim Hören auf ${path}`, error);
    });
    return returnReactiveDataObject(listeners, () => currentData);
}

export function notify(listeners, currentData){
    for(const callback of listeners){
        callback(currentData);
    }
}

export function returnReactiveDataObject(listeners, getCurrentData){
    return {
        get(){
            return getCurrentData();
        }, 
        onChange(callback){
            listeners.push(callback);
            const data = getCurrentData();
            if(data !== null){
                callback(data);
            }
        },
        offChange(callback){
            const index = listeners.indexOf(callback);
            if(index !== -1) {
                listeners.splice(index, 1);
            }
        }
    };
}

// Diese Funktion ist noch nicht perfekt => Provisorische Lösung

export async function getAllTasks(){
  return new Promise((resolve, reject) => {
    let taskRef = firebase.ref(firebase.database, 'kanban/sharedBoard/tasks');
    firebase.onValue(
      taskRef,
      (snapshot) => {
        let taskData = snapshot.val();
        resolve(Object.values(taskData));
        console.log('tasks: ', Object.values(taskData));
      },
    ),
    (error) => {
      console.error('Fehler beim Laden der Kontakte: ', error);
      reject(error);
    }
  });
} 