async function init() {
  await includeHTML();
  renderUserlogo();
}

function checkLoginStatus() {
  let sidebar = document.getElementById("sidebarPrivacyLegal");
  let footer = document.getElementsByClassName("footerContainer")[0];
  if (!checkUserLoginStatus()) {
    sidebar.classList.add("no-menu");
    footer.classList.add("d-none");
  }
}
