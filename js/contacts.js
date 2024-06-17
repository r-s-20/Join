function render() {
  document.getElementById("contactListsContainer").innerHTML = "";
  contacts.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
  });
  for (let i = 0; i < contacts.length; i++) {
    document.getElementById("contactListsContainer").innerHTML += /*html*/ `
        <div class="contactLists" id="contactLists">  
                  <div class="contactListsNameHead">
                    <div class="contactListsNameBadge" style="background-color: ${contacts[i].badgecolor}">
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


function addContact() {
  let name = document.getElementById('addName').value;
  let email = document.getElementById('addEmail').value;
  let phone = document.getElementById('addPhone').value;
  let badgeColor = document.getElementById('addInitials');

  let names = name.split(' ');
  let initials ='';
  if (names.length > 0) {
    initials += names[0][0].toUpperCase();
    if (names.length > 1 ) {
      initials += names[names.length - 1][0].toUpperCase();
    }
       
  }
 
 let newContact = {
   name: name,
   email: email,
   phone: phone,
   initials: initials,
   badgeColor: badgeColor
   
 };
 contacts.push(newContact);
 render();
 closeAddContactPopUp();
}