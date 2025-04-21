import {signInWithEmailAndPassword, signInAnonymously } from "../../core/database.js"; // database.js
import db from "../../core/database.js"; // database.js

const auth = db.auth;
const database = db.database;

/**
 * This function updates the visibility of the password field identified by the provided variable.
 * It also manages the display of the visibility and lock icons based on the current state.
 * 
 * @param {string} variable - The ID of the password field whose visibility is being toggled.
 */

function showLoginPassword(variable) {
  let passwordContent = document.getElementById(variable);
  let loginLock = document.getElementById("loginLock");
  let visibility = document.getElementById("visibility");
  let visibilityInputImage = document.getElementById("visibilityInputImage");
  if (visibility.classList.contains("d-none")) {
    visibility.classList.remove("d-none");
    visibilityInputImage.classList.add("d-none");
    loginLock.classList.add("d-none");
  } else if (visibilityInputImage.classList.contains("d-none")) {
    visibility.classList.add("d-none");
    visibilityInputImage.classList.remove("d-none");
  }
  checkPasswordContentType(passwordContent);
}

// Login-Funktionalität

document.addEventListener('DOMContentLoaded', () => {
  let loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener("submit", loginFunction);
  }
});

document.getElementById('guestLogIn').addEventListener('click', () => {
  signInAnonymously(auth).then(result => {
    const user = result.user;
    console.log(`Als Gast eingeloggt! UID: ${user.uid}`);
    window.location.href="../summary/summary.html";
  }).catch(error => {
    console.error(error);
    console.log("Fehler beim Login: " + error.message);
  });
});

function loginFunction(event){
  event.preventDefault();
  let email = document.getElementById('loginEmail').value;
  let password = document.getElementById('loginPassword').value;
  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    const user = userCredential.user;
    console.log("Login erfolgreich: ", user.email);
    window.location.href="summary.html";
  }).catch((error) => {
    console.log("Fehler beim Login: ", error.message);
  });
}

// Optionaler Code, um zusätzliche Informationen aus der Datenbank zu laden

// const userRef = ref(db, "users/" + user.uid);
// get(userRef).then((snapshot) => {
//   if(snapshot.exists()){
//     console.log("Benutzerdaten: ", snapshot.val());
//   } else {
//     console.log("Keine zusätzlichen Benutzerdaten gefunden");
//   }
// });