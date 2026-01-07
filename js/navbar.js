// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js'

import {
    getAuth,
    signOut,
} from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js'

import {
    getDatabase,
    ref,
    set,
    update,
    child,
    get,
} from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

let currentUser = null

// ----------------------- Get User's Name'Name ------------------------------
function getUserFromCookies() {
    // Grab value for the `keep logged in` switch
    let keepLoggedIn = localStorage.getItem('keepLoggedIn')

    // Grab user information passed from signIn.js
    if (keepLoggedIn == 'yes') {
        currentUser = JSON.parse(localStorage.getItem('user'))
    } else {
        currentUser = JSON.parse(sessionStorage.getItem('user'))
    }
    console.log(currentUser)
}
// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function signOutUser() {
    sessionStorage.removeItem('user')
    localStorage.removeItem('user')
    localStorage.removeItem('keepLoggedIn')

    signOut(auth).catch((err) => alert(err))
    if (window.location.pathname == 'user.html') {
        window.location = 'index.html'
    } else {
        window.location.reload()
    }
}

window.onload = function () {
    getUserFromCookies()
    let userLink = document.getElementById('reading-log-link')
    let logInLink = document.getElementById('sign-in-out-link')
    if (currentUser == null) {
        userLink.parentElement.parentElement.style.display = 'none'
    } else {
        logInLink.innerText = 'Log Out'
        logInLink.onclick = signOutUser
    }
}
