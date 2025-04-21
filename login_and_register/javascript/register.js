import {ref, set, createUserWithEmailAndPassword} from "../../core/database.js";
import db from "../../core/database.js";

const auth = db.auth;
const database = db.database;

document.addEventListener('DOMContentLoaded', () => {
  let form = document.getElementById('signUpForm');
  if(form){
    form.addEventListener("submit", signUp);
  }
});

async function registerUser(email, password){
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered: ", userCredential.user);
    return userCredential;
  } catch(error){
    console.log("Error registering user: ", error);
    throw error;
  }
}

async function signUp(event){
  event.preventDefault();
  const name=document.getElementById('name').value; 
  const loginEmail=document.getElementById('loginEmail').value;
  const loginPassword=document.getElementById('loginPassword').value;
  const loginPasswordRepeat=document.getElementById('loginPasswordRepeat').value;
  if(checkIfPasswordInputsCoincide(loginPassword, loginPasswordRepeat)){
    try{
      const userCredential = await registerUser(loginEmail, loginPassword);
      const uid = userCredential.user.uid;
      let userData = createUserData(name, loginEmail);
      await writeData(`users/${uid}`, userData);
      window.location.href="login.html";
    } catch(error){
      console.error("Fehler bei Registrierung:", error.message);
    }
  }
}

function checkIfPasswordInputsCoincide(loginPassword, loginPasswordRepeat){
  return loginPassword === loginPasswordRepeat;
}

function createUserData(name, email){
  const userData = {
    name: name,
    email: email
  }
  return userData;
}

async function writeData(path, userdata){
  const dbref=ref(database, path);
  return set(dbref, userdata);
}