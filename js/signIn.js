/*
Name: Addison Vincelli and Alex Mazurczyk
Date: 20 Jan 2026

File: data.js
Purpose: Interacts with Firebase API to log in user,
         stores login info in session/local storage
*/

// ----------------- Firebase Setup & Initialization ------------------------//

 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

 import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js'

import { getDatabase, ref, update, get } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js'


 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyCptQUzhXL4nLiRxvEuhuINLKRRfuKK4zY",
   authDomain: "sci-fi-showcase.firebaseapp.com",
   databaseURL: "https://sci-fi-showcase-default-rtdb.firebaseio.com",
   projectId: "sci-fi-showcase",
   storageBucket: "sci-fi-showcase.firebasestorage.app",
   messagingSenderId: "794618128894",
   appId: "1:794618128894:web:216c3d0b1fee81e4b538af"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 //Initialize Firebase Authentication
const auth = getAuth();

//Return instance of your app's Firebase Realtime Database (FRD)
const db = getDatabase(app);

// ---------------------- Sign-In User ---------------------------------------//
document.getElementById('signIn').onclick = signIn

function signIn() {
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value
    console.log(email, password)

    //Attempt to sign in the user
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            //Create user credential and store the user ID
            const user = userCredential.user
            console.log(user.uid)
            //Log sign in date in DB
            // 'update' method will only add last login info and won't overwrite everything else
            //using 'set' would overwrite everything in the node
            let logDate = new Date()
            update(ref(db, 'users/' + user.uid + '/accountInfo'), {
                last_login: logDate,
            })
                .then(() => {
                    //User signed in successfully
                    alert('User signed in successfully :D')

                    //Get snapshot of all user info passed to login() and stored in session or local storage
                    //a snapshot - copy of a system's state at a specific point in time
                    //allows the "stay logged in" button
                    get(ref(db, 'users/' + user.uid + '/accountInfo'))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                console.log(snapshot.val())
                                logIn(snapshot.val())
                            } else {
                                console.log('User does not exist :(')
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })
                .catch((error) => {
                    alert(error)
                })
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            alert(errorMessage)
        })
}

// ---------------- Keep User Logged In ----------------------------------//
function logIn(user) {
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').checked

    //Session storage is temporary (only while browser is open)
    //Info saved as a string (must convert JS object to string)
    //Session storage will be cleared with a signOut() function in home.js
    if (!keepLoggedIn) {
        sessionStorage.setItem('user', JSON.stringify(user))
        window.location = 'user.html' //Redirect browser to user.html
    }

    //Local storage is permanent (keep user logged in even if browser is closed)
    //Local storage will be cleared with signOut() function in home.js
    else {
        localStorage.setItem('keepLoggedIn', 'yes')
        localStorage.setItem('user', JSON.stringify(user))
        window.location = 'user.html'
    }
}

//Allows user to submit fields using the enter key 
    //(rather than having to hit the Sign In button)
function handleKeyPress(key) {
    if (key.code == 'Enter') {
        signIn()
    }
}

//Applies handleKeyPress to email and password fields
document.getElementById('loginEmail').addEventListener('keypress', handleKeyPress)
document.getElementById('loginPassword').addEventListener('keypress', handleKeyPress)