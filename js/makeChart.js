// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js'

import { getDatabase, ref, set, update, child, get } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js'

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

// ----------------- Data Processing  ------------------------//
async function getDataSet(userID, filterYear) {
  const days = []
  const books = []

  const dbref = ref(db) //Firebase parameter to access database

  //Wait for all data to be pulled from FRD
  //Must provide correct path through nodes to the data
  await get(child(dbref, 'users/' + userID + '/data'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          console.log(child.key, child.val())
          let { year } = child.val()
          if (year == filterYear) {
            //Push values to corresponding arrays
            books.push(child.key)
            days.push(child.val())
          }
        })
      } else {
        alert('No data found :(')
      }
    })
    .catch((error) => {
      alert('unsuccessful, error: ' + error)
    })
  return [books, days]
}

//Function to count how many books were read per month
async function countByMonth(data) {
  const books = data[0]
  const days = data[1]

  let output = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  }
  for (let i = 0; i < books.length; i++) {
    let key = days[i]['month']
    output[key]++
  }
  console.log(output)
  return output
}


//----------Creating the bar chart ------------//
let myChart = null
const plotData = async (counts) => {
  const barChart = document.getElementById('bar-chart')
  //If nothing is present, get rid of the chart
  if (myChart != null) {
    myChart.destroy()
  }
  Chart.defaults.font.family = '"League Spartan", Arial, Helvetica, sans-serif'
  myChart = new Chart(barChart, {
    // Construct the chart
    type: 'bar',
    data: {
      // Define data
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // x series label
      datasets: [
        {
          // label: `Positive Cases`, // Dataset label for legend
          data: counts, // Reference to array of y-values
          // fill: false, // Fill area under the linechart (true = yes, false = no)
          backgroundColor: '#455d7a', // Color for data marker
          borderColor: '#455d7a', // Color for data marker border
        },
      ],
    },
    options: {
      // Define display chart display options
      responsive: true, // Re-size based on screen size
      maintainAspectRatio: false,
      scales: {
        y: {
          // y-axis properties
          title: {
            display: false,
          },
          ticks: {
            callback: function (value) {
              // return only integer steps
              if (value % 1 === 0) {
                return this.getLabelForValue(value)
              }
            },
          },
          //     // grid: {
          //     //     // y-axis gridlines
          //     //     color: '#6c767e',
          //     // },
        },
      },
      plugins: {
        // Display options for title and legend
        title: {
          display: true,
          text: 'Books Finished by Month',
          font: {
            size: 24,
          },
          color: '#black',
          padding: {
            top: 10,
            bottom: 30,
          },
        },
        legend: {
          display: false,
        },
      },
    },
  })
}

export async function showChart(uid, year) {
  let data = await getDataSet(uid, year)
  let counts = Object.values(await countByMonth(data))
  await plotData(counts)
}

