// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js'

import {
  getDatabase,
  ref,
  set,
  update,
  child,
  get,
} from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCptQUzhXL4nLiRxvEuhuINLKRRfuKK4zY',
  authDomain: 'sci-fi-showcase.firebaseapp.com',
  databaseURL: 'https://sci-fi-showcase-default-rtdb.firebaseio.com',
  projectId: 'sci-fi-showcase',
  storageBucket: 'sci-fi-showcase.firebasestorage.app',
  messagingSenderId: '794618128894',
  appId: '1:794618128894:web:216c3d0b1fee81e4b538af',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

//Initialize Firebase Authentication
const auth = getAuth()

//Return instance of your app's Firebase Realtime Database (FRD)
const db = getDatabase(app)

// ---------------- Register New User --------------------------------//
function register() {
  const firstName = document.getElementById('firstName').value
  const lastName = document.getElementById('lastName').value
  const email = document.getElementById('userEmail').value

  const password = document.getElementById('userPass').value

  //Validate user inputs
  if (!validation(firstName, lastName, email, password)) {
    return
  }

  //Create new app user using email/password authentication
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User account created and signed in successfully
      const user = userCredential.user

      // Add user account into to realtime database
      // 'set' function creates a new reference or completely replaces an existing one
      //Each new user will be placed under the 'users' node
      set(ref(db, 'users/' + user.uid + '/accountInfo'), {
        uid: user.uid, //Save the userID for home.js reference
        email: email,
        firstname: firstName,
        lastname: lastName,
      })
        .then(() => {
          alert('User created successfully :D') //Alert for successful creation
        })
        .catch((error) => {
          alert(error) //User creation failed
        })
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      alert(errorMessage)
    })
}

document.getElementById('submitData').onclick = register
function handleKeyPress(key) {
  if (key.code == 'Enter') {
    register()
  }
}

document.getElementById('firstName').addEventListener('keypress', handleKeyPress)
document.getElementById('lastName').addEventListener('keypress', handleKeyPress)
document.getElementById('userEmail').addEventListener('keypress', handleKeyPress)
document.getElementById('userPassword').addEventListener('keypress', handleKeyPress)

// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str) {
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//
function validation(firstName, lastName, email, password) {
  let fNameRegex = /^[a-zA-Z]+$/
  let lNameRegex = /^[a-zA-Z]+$/
  let emailRegex = /^[a-zA-Z0-9]+@ctemc\.org$/

  if (
    isEmptyorSpaces(firstName) ||
    isEmptyorSpaces(lastName) ||
    isEmptyorSpaces(email) ||
    isEmptyorSpaces(password)
  ) {
    alert('Please complete all fields.')
    return false
  }

  if (!fNameRegex.test(firstName)) {
    alert('The first name should only contain letters')
    return false
  }

  if (!lNameRegex.test(lastName)) {
    alert('The last name should only contain letters')
    return false
  }

  if (!emailRegex.test(email)) {
    alert('Please enter a valid email')
    console.log(emailRegex)
    return false
  }
  return true
}
