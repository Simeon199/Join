import { initializeApp} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously  } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase, ref, set, get, child, push, remove, update, onValue} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHiavJkxxh1bRR4vzCUArY4mqkfHrMqxU",
  authDomain: "join-safe.firebaseapp.com",
  databaseURL: "https://join-safe-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-safe",
  storageBucket: "join-safe.firebasestorage.app",
  messagingSenderId: "647121810639",
  appId: "1:647121810639:web:d180956c6bf160800cf3ba"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export default {
  auth, 
  database
}

export {
  ref,
  onValue,
  remove,
  push,
  update,
  child,
  get, 
  set, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInAnonymously
}