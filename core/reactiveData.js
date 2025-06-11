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
            console.log('current data: ', getCurrentData);
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