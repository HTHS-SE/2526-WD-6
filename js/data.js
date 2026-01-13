// This JS file is for viewing and logging data after Sign-In -----------------//

 // ----------------- Firebase Setup & Initialization ------------------------//

 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

 import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
 from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {getDatabase, ref, set, update, child, get, remove}
 from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

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
// ---------------------// Get reference values -----------------------------
let userLink = document.getElementById('userLink');
let signOutLink = document.getElementById('signOut');
let welcome = document.getElementById('welcome');
let currentUser = null;


// ----------------------- Get User's Name ------------------------------
function getUsername(){
    //Grab value for the 'keep logged in' switch
    let keepLoggedIn = localStorage.getItem('keepLoggedIn')

    //Grab user info passed from signIn.js
    if (keepLoggedIn == 'yes') {
        currentUser = JSON.parse(localStorage.getItem('user'))
    } else {
        currentUser = JSON.parse(sessionStorage.getItem('user'))
    }
}

//Add the user's name to their reading log
function addName(){
  console.log('running addName')
  let header = document.getElementById('readingLog')
  header.innerHTML = currentUser.firstname + "'s Reading Log"
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function SignOutUser(){
  sessionStorage.removeItem('user'); //Clear session storage
  localStorage.removeItem('user'); //Clear local storage 
  localStorage.removeItem('keepLoggedIn');

  signOut(auth).then(()=> {
    //Sign out successful
  }).catch((error)=>{
    //Error occurred 
  });

  window.location = 'user.html'
}


// -------------------------Update data in database --------------------------
function updateData(userID, year, month, day, book){
  //Must use brackets around variable names to use as a key
  update(ref(db, 'users/' + userID + '/data/' + book),{
    ['day']: day, ['month']:month, ['year']:year
  } )
  .then(()=>{
    alert("Data stored successfully :D");
  })
  .catch((error)=>{
    alert("There was an error. Error: " +error);
  })
}
// ----------------------Get a datum from FRD (single data point)---------------
function getData(userID, book) {
  let getOutput = document.getElementById('getOutput')

  const dbref = ref(db)
  get(child(dbref, `users/${userID}/data/${book}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let { year, month, day } = snapshot.val()
        getOutput.textContent = `Last read: ${day} ${month} ${year}`
        getOutput.style.display = 'block'
      } else {
        alert('No data found for this book')
      }
    })
    .catch((err) => alert('Unsuccessful' + err))
}

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph
async function getDataSet(userID, filterYear, filterMonth) {
  const days = []
  const books = []
  const tbodyEl = document
    .getElementById('getDataSetTable')
    .getElementsByTagName('tbody')[0] // Select child <tbody> element

  const dbref = ref(db) //Firebase parameter to access database

  //Wait for all data to be pulled from FRD
  //Must provide correct path through nodes to the data
  await get(child(dbref, 'users/' + userID + '/data'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          console.log(child.key, child.val())
          let { year, month, day } = child.val()
          if (year == filterYear && month == filterMonth) {
            //Push values to corresponding arrays
            books.push(child.key)
            days.push(`${day} ${month} ${year}`)
          }
        })
      } else {
        alert('No data found :(')
      }
    })
    .catch((error) => {
      alert('unsuccessful, error: ' + error)
    })

  //Dynamically add table rows to HTML using string interpolation
  tbodyEl.innerHTML = '' //Clear any existing table
  for (let i = 0; i < books.length; i++) {
    addItemToTable(books[i], days[i], tbodyEl)
  }
}

// Add a item to the table of data
function addItemToTable(day, book, tbody) {
  let tRow = document.createElement('tr')
  let td1 = document.createElement('td')
  let td2 = document.createElement('td')

  td1.innerHTML = day
  td2.innerHTML = book

  tRow.appendChild(td1)
  tRow.appendChild(td2)

  tbody.appendChild(tRow)
}

// -------------------------Delete a day's data from FRD ---------------------
function deleteData(userID, book) {
  remove(ref(db, 'users/' + userID + '/data/' + book))
    .then(() => {
      alert('data removed successfully :D')
    })
    .catch((error) => {
      alert('unsuccessful, error: ' + error)
    })
}

// Update data function call (Log A Read)
document.getElementById('updateButton').onclick = function () {
  const month = document.getElementById('updateMonth').value
  const day = document.getElementById('updateDay').value
  const year = document.getElementById('updateYear').value
  const book = document.getElementById('updateBook').value
  const userID = currentUser.uid

  updateData(userID, year, month, day, book)
}

// Get a datum function call
document.getElementById('getButton').onclick = function () {
  const book = document.getElementById('getBook').value
  const userID = currentUser.uid

  getData(userID, book)
}

// Get a data set function call
document.getElementById('getDataSetButton').onclick = function () {
  const year = document.getElementById('getDataSetYear').value
  const month = document.getElementById('getDataSetMonth').value
  const userID = currentUser.uid

  getDataSet(userID, year, month)
}

// Delete a single day's data function call
document.getElementById('delete').onclick = function(){
    const book = document.getElementById('delBook').value
    const userID = currentUser.uid

    deleteData(userID, book)
}

window.addEventListener('load', getUsername(), addName())