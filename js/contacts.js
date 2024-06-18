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

  let groupedContacts = {};

  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let firstLetter = contact.name[0].toUpperCase();
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }
    groupedContacts[firstLetter].push(contact);
  }

  let contactIndex = 0;

  for (let letter in groupedContacts) {
    document.getElementById("contactListsContainer").innerHTML += /*html*/ `
      <div class="contactGroup">
        <h2>${letter}</h2>
        <div class="contactUnderline"></div>
      </div>
    `;

    for (let i = 0; i < groupedContacts[letter].length; i++) {
      let contact = groupedContacts[letter][i];
      let colorIndex = contactIndex % colors.length;
      let badgeColor = colors[colorIndex];

      contact.badgeColor = badgeColor;

      let contactHTML = /*html*/ `
        <div class="contactLists" data-index="${contactIndex}" onclick="showContactDetails(${contactIndex})">  
          <div class="contactListsNameHead">
            <div class="contactListsNameBadge" style="background-color: ${badgeColor}">
              <h1>${contact.initials}</h1>
            </div>
            <div class="contactListsName">
              <h1>${contact.name}</h1>
              <h3>${contact.email}</h3>
            </div>
          </div>
        </div>
      `;

      document.getElementById("contactListsContainer").innerHTML += contactHTML;
      contactIndex++;
    }
  }
}

function showContactDetails(index) {
  let contact = contacts[index];
  let contactDetailsHTML = /*html*/ `
    <div class="contentCardHeader">
      <div class="contentCardBody">
      <div class="cardHeaderLogo" style="background-color: ${contact.badgeColor}">
        <h1>${contact.initials}</h1>
      </div>

      <div class="cardHeaderNameDetails">
          <h1>${contact.name}</h1>
            <div class="cardHeaderNameEditDelete">
             <div class="cardHeaderNameEdit button" onclick="editContactPopUp(${index})">
                  <img src="img/edit.png" alt="edit Contact Name"/>Edit
                    </div>
                  <div class="cardHeaderNameDelete button" onclick="deleteContact(${index})">
                       <img src="img/delete.png"alt="delete Contact Name"/>Delete
                     </div>
                   </div>
                  </div>
                  </div>
                  <div class="contactCardInfo">
                  <h4>Contact Information</h4>
                </div>
                <div class="contactCardDetails">
                
                    <div class="cardDetailEmailName">
                    <p><h2>Email</h2> <a href="mailto:${contact.email}">${contact.email}</a></p>
                    </div>
                    <div class="CardDetailPhoneNumber"><h2>Phone</h2> ${contact.phone}</div>
                  </div>
  `;

  let contactDetailsContainer = document.getElementById("contactCardMain");
  contactDetailsContainer.innerHTML = contactDetailsHTML;
  contactDetailsContainer.classList.remove("d-none");
}

function addContactPopUp() {
  document.getElementById("showAddContactPopUp").classList.remove("d-none");
}

function closeAddContactPopUp() {
  document.getElementById("showAddContactPopUp").classList.add("d-none");
}

function editContactPopUp(index) {
  document.getElementById("showEditContactPopUp").classList.remove("d-none");
}

function closeEditContactPopUp() {
  document.getElementById("showEditContactPopUp").classList.add("d-none");
}

function addContact() {
  let name = document.getElementById("addName").value;
  let email = document.getElementById("addEmail").value;
  let phone = document.getElementById("addPhone").value;

  let names = name.split(" ");
  let initials = "";
  if (names.length > 0) {
    initials += names[0][0].toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1][0].toUpperCase();
    }
  }

  let newContact = {
    name: name,
    email: email,
    phone: phone,
    initials: initials,
    badgeColor: colors[contacts.length % colors.length],
  };

  contacts.push(newContact);
  render();
  closeAddContactPopUp();
}
