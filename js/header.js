function toggleUserMenu() {
  popup = document.getElementById("header-popup-curtain");
  popup.classList.toggle("d-none");
}

function logoutUser() {
  console.log("logging out");
  sessionStorage.clear();
}

function renderUserlogo() {
    userLogo = document.getElementById("userLogo");
    currentUser = sessionStorage.getItem(contact);
    if (currentUser) {
      // hier später contact.initials auslesen
      userLogo.innerHTML = "AS";
    } else {
      userLogo.innerHTML = "G";
    }
  }