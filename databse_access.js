// const BASE_URL = "https://join-9bbb0-default-rtdb.europe-west1.firebasedatabase.app/";

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCHiavJkxxh1bRR4vzCUArY4mqkfHrMqxU",
    authDomain: "join-safe.firebaseapp.com",
    databaseURL: "https://join-safe-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "join-safe",
    storageBucket: "join-safe.firebasestorage.app",
    messagingSenderId: "647121810639",
    appId: "1:647121810639:web:d180956c6bf160800cf3ba"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);