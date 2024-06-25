async function init() {
  await includeHTML();
  renderUserlogo();
}

function checkLoginStatus() {
  let sidebar = document.getElementById("sidebarPrivacyLegal");
  let footer = document.getElementsByClassName("footerContainer")[0];
  if (!checkUserLoginStatus()) {
    console.log("user not logged in");
    sidebar.classList.add("no-menu");
    footer.classList.add("d-none");
  } else {
    console.log("user logged in");
  }
}
