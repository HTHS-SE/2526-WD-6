/*
Name: Addison Vincelli and Alex Mazurczyk
Date: 20 Jan 2026

File: data.js
Purpose: Retrieves and downloads data from Firebase RTDB, displays for user
*/

import { showChart } from './makeChart.js'

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js'

import { getAuth } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js'

import { getDatabase, ref, update, child, get, remove } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js'

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

// ----------------------- Get User's Name ------------------------------
let currentUser = null
function getUsername() {
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
function addName() {
  console.log('running addName')
  let header = document.getElementById('readingLog')
  header.innerHTML = currentUser.firstname + "'s Reading Log"
}

// -------------------------Update data in database --------------------------
function updateData(userID, year, month, day, book) {
  //Structure: userID -> Data -> Book Title -> day, month, and year
  update(ref(db, 'users/' + userID + '/data/' + book), {
    ['day']: day,
    ['month']: month,
    ['year']: year,
  })
    .then(() => {
      alert('Data stored successfully :D')
    })
    .catch((error) => {
      alert('There was an error. Error: ' + error)
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
        alert('You haven\'t read this book yet! Make sure to put it on your TBR :)')
      }
    })
    .catch((err) => alert('Unsuccessful' + err))
}

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph
async function getDataSet(userID, filterYear, filterMonth) {
  const tbodyEl = document.getElementById('getDataSetTable').getElementsByTagName('tbody')[0] // Select child <tbody> element

  const dbref = ref(db) //Firebase parameter to access database

  //Wait for all data to be pulled from FRD
  //Must provide correct path through nodes to the data
  let data = []
  await get(child(dbref, 'users/' + userID + '/data'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          console.log(child.key, child.val())
          let { year, month, day } = child.val()
          // Only count data if it corresponds with the chosen month & year
          if (year == filterYear && month == filterMonth) {
            data.push([child.key, child.val()])
          }
        })
      } else {
        alert("You didn't read anything this month :(")
      }
    })
    .catch((error) => {
      alert('unsuccessful, error: ' + error)
    })

  // Sort books by date ascending; all of them are same month and year
  data.sort((a, b) => a[1].day - b[1].day)

  //Dynamically add table rows to HTML using string interpolation
  tbodyEl.innerHTML = '' //Clear any existing table
  for (let i = 0; i < data.length; i++) {
    let { year, month, day } = data[i][1]
    addItemToTable(data[i][0], `${day} ${month} ${year}`, tbodyEl)
    console.log(data[i])
  }
}

// Add a item to the table of data
function addItemToTable(book, day, tbody) {
  //Creates row and cells for new data
  let tRow = document.createElement('tr')
  let td1 = document.createElement('td')
  let td2 = document.createElement('td')

  td1.innerHTML = book
  td2.innerHTML = day

  tRow.appendChild(td1)
  tRow.appendChild(td2)

  tbody.appendChild(tRow)
}

// -------------------------Delete a book from FRD ---------------------
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

// Get a datum function call (When Did I Read This Book?)
document.getElementById('getButton').onclick = function () {
  const book = document.getElementById('getBook').value
  const userID = currentUser.uid

  getData(userID, book)
}

// Get a data set function call (What Did I Read This Month?)
document.getElementById('getDataSetButton').onclick = function () {
  const year = document.getElementById('getDataSetYear').value
  const month = document.getElementById('getDataSetMonth').value
  const userID = currentUser.uid

  getDataSet(userID, year, month)
}

//Chart a data set using chartJS (Chart My Reads)
document.getElementById('chartButton').onclick = function () {
  const year = document.getElementById('chartYear').value
  const userID = currentUser.uid
  showChart(userID, year)
  document.getElementById('chart-container').style.display = 'block'
}

// Delete a single day's data function call (Delete A Read)
document.getElementById('delete').onclick = function(){
    const book = document.getElementById('delBook').value
    const userID = currentUser.uid

    deleteData(userID, book)
}

//call getUsername() and addName() when the page loads 
window.addEventListener('load', getUsername(), addName())