function render() {
  document.getElementById("contactListsContainer").innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    document.getElementById("contactListsContainer").innerHTML += /*html*/ `
    
        <div class="contactLists" id="contactLists">
                  <div class="contactListsNameHead">
                    <div class="contactListsNameBadge">
                      <h1>${contacts[i].initials}</h1>
                    </div>
                    <div class="contactListsName">
                      <h1>${contacts[i].name}</h1>
                      <h3>${contacts[i].email}</h3>
                    </div>
                </div>
              </div>
              <div class="contactUnderline"></div>
    `;
    contacts.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
    });
  }
}

function addContactPopUp() {
  document.getElementById("showAddContactPopUp").classList.remove("d-none");
}

function closeAddContactPopUp() {
  document.getElementById("showAddContactPopUp").classList.add("d-none");
}

function editContactPopUp() {
  document.getElementById("showEditContactPopUp").classList.remove("d-none");
}

function closeEditContactPopUp() {
  document.getElementById("showEditContactPopUp").classList.add("d-none");
}
