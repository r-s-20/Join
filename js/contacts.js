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
  }
}
