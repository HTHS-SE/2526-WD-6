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

async function getData(userID, filterYear) {
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
          let { year, month, day } = child.val()
          if (year == filterYear) {
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

  return [books, days]
}

const plotData = async (data) => {
  const states = data[0]
  const positive = data[1]
  const lineChart = document.getElementById('line-chart')

  const myChart = new Chart(lineChart, {
    // Construct the chart
    type: 'line',
    data: {
      // Define data
      labels: states, // x-axis labels
      datasets: [
        // Each object describes one dataset of y-values
        //  including display properties.  To add more datasets,
        //  place a comma after the closing curly brace of the last
        //  data set object and add another dataset object.
        {
          label: `Positive Cases`, // Dataset label for legend
          data: positive, // Reference to array of y-values
          fill: false, // Fill area under the linechart (true = yes, false = no)
          backgroundColor: '#ea4335', // Color for data marker
          borderColor: 'a#ea4335', // Color for data marker border
          tension: 0.1,
        },
      ],
    },
    options: {
      // Define display chart display options
      responsive: true, // Re-size based on screen size
      maintainAspectRatio: false,
      scales: {
        // Display options for x & y axes
        x: {
          // x-axis properties
          title: {
            display: false,
          },
        },
        y: {
          // y-axis properties
          title: {
            display: false,
          },
          ticks: {
            // y-axis tick mark properties
            min: 0, // starting value
            max: 400000,
            font: {
              size: 14,
            },
          },
          // grid: {
          //     // y-axis gridlines
          //     color: '#6c767e',
          // },
        },
      },
      plugins: {
        // Display options for title and legend
        title: {
          display: true,
          text: 'COVID-19 Cases by State',
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
          align: 'right',
          position: 'top',
        },
      },
    },
  })
}

const makeCaption = async (data) => {
  table = document.getElementById('caption')
  let positive = data[1]
  let avg_positive = Math.round(positive.reduce((x, sum) => x + sum) / positive.length)
  let hospitalized = data[2]
  let avg_hospital = Math.round(hospitalized.reduce((x, sum) => x + sum) / hospitalized.length)

  table.innerHTML = `
    <tr>
        <td>Average of Positive Cases: <strong>${avg_positive}</strong></td>
        <td>Average of Currently Hospitalized: <strong>${avg_hospital}</strong></td>

    `
}

const main = async () => {
  data = await getData()
  console.log(data)
  await Promise.all([plotData(data), makeCaption(data)])
}

main()
