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
    let userLink = document.querySelector('a[href="user.html"]')
    let logInLink = null
    if (currentUser == null) {
        userLink.innerText = 'Create New Account'
        userLink.classList.replace('nav-link', 'btn')
        userLink.classList.add('btn-primary')
        userLink.href = 'register.html'

        logInLink.innerText = 'Sign In'
        logInLink.innerText = 'Sign In'
        logInLink.classList.replace('nav-link', 'btn')
        logInLink.classList.add('btn-success')
        logInLink.href = 'signIn.html'
        userLink.parentElement.parentElement.style.display = 'none'
    } else {
        userLink.innerText = currentUser.firstName
        welcome.innerText = 'Welcome ' + currentUser.firstName
        userLink.classList.replace('btn', 'nav-link')
        userLink.classList.add('btn-primary')
        userLink.href = '#'

        logInLink.innerText = 'Sign Out'
        logInLink.classList.replace('btn', 'nav-link')
        logInLink.classList.add('btn-success')
        document.getElementById('signOut').onclick = signOutUser
    }
}
