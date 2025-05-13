import { onValue, ref } from "./database";
import database from "./database";

export function createReactiveDataSource(path){
    let currentData = null;
    let listeners = [];

    // Firebase ref für Pfad erstellen

    let dbRef = ref(database, path);

    // Echtzeitlistener setzen

    onValue(dbRef, (snapshot) => {
        const val = snapshot.val() || {};
        currentData = val;
        notify();
    }, (error) => {
        console.error(`Fehler beim Hören auf ${path}`, error);
    });

    function notify(){
        for(const callback of listeners){
            callback(currentData);
        }
    }

    return {
        get(){
            return currentData;
        }, 
        onChange(callback){
            listeners.push(callback);
            if(currentData !== null){
                callback(currentData)
            }
        },
        // Optional: Callback wieder entfernen
        offChange(callback){
            const index = listeners.indexOf(callback);
            if(index !== -1) listeners.splice(index, 1);
        }
    }
}