let currentContactIndex = null;

// function loadContacts() {
//   let savedContacts = JSON.parse(localStorage.getItem("contacts"));
//   if (savedContacts) {
//     contacts = savedContacts;
//   }
//   render();
// }

// function saveContactsToLocalStorage() {
//   localStorage.setItem("contacts", JSON.stringify(contacts));
// }

// function setInitialBadgeColors() {
//   contacts.forEach((contact, index) => {
//     if (!contact.badgecolor) {
//       contact.badgecolor = colors[index % colors.length];
//     }
//   });
// }

async function init() {
  await includeHTML();
  renderUserlogo();
}

function render() {
  document.getElementById("contactListsContainer").innerHTML = "";

  contacts.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
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

  for (let letter in groupedContacts) {
    document.getElementById("contactListsContainer").innerHTML += /*html*/ `
      <div class="contactGroup">
        <h2>${letter}</h2>
        <div class="contactUnderline"></div>
      </div>
    `;

    groupedContacts[letter].forEach((contact, contactIndex) => {
      let contactHTML = /*html*/ `
        <div class="contactLists" data-index="${contacts.indexOf(
          contact
        )}" onclick="event.stopPropagation(), selectContact(${contacts.indexOf(
        contact
      )})" id="contactCard${contacts.indexOf(contact)}">  
          <div class="contactListsNameHead">
            <div class="contactListsNameBadge" style="background-color: ${contact.badgecolor}">
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
    });
  }
}

function showContactDetails(index) {
  let contact = contacts[index];
  let contactDetailsHTML = /*html*/ `
    <div class="contentCardHeader">
      <div class="contentCardBody">
      <div class="cardHeaderLogo" style="background-color: ${contact.badgecolor}">
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
                    <p><h2>Email</h2> <a>${contact.email}</a></p>
                    </div>
            <div class="CardDetailPhoneNumber"><h2>Phone</h2> ${contact.phone}</div>
      </div></div>
  `;

  let contactDetailsContainer = document.getElementById("contactCardMain");
  contactDetailsContainer.innerHTML = contactDetailsHTML;
  contactDetailsContainer.classList.remove("d-none");
  document.querySelector(".contactsContent").classList.add("show");
  document.querySelector(".contactListSide").classList.add("hide-mobile");
}

function selectContact(index) {
  let contact = document.getElementById(`contactCard${index}`);
  let contactDetailsContainer = document.getElementById("contactCardMain");
  if (contact.classList.contains("selectedContact")) {
    contact.classList.remove("selectedContact");
    contactDetailsContainer.innerHTML = "";
    document.querySelector(".contactsContent").classList.remove("show");
    document.querySelector(".contactListSide").classList.remove("hide-mobile");
  } else {
    unselectAllContacts();
    contact.classList.add("selectedContact");
    showContactDetails(index);
  }
}

function unselectAllContacts() {
  let contactCards = document.getElementsByClassName("contactLists");
  let contactDetailsContainer = document.getElementById("contactCardMain");
  for (cards of contactCards) {
    cards.classList.remove("selectedContact");
  }
  contactDetailsContainer.innerHTML = "";
  document.querySelector(".contactsContent").classList.remove("show");
  document.querySelector(".contactListSide").classList.remove("hide-mobile");
}

function addContactPopUp() {
  document.getElementById("showAddContactPopUp").classList.remove("d-none");
  document.querySelector(".popupCurtain").classList.remove("d-none");
}

function closeAddContactPopUp() {
  document.getElementById("showAddContactPopUp").classList.add("d-none");
  document.querySelector(".popupCurtain").classList.add("d-none");
}

function editContactPopUp(index) {
  let contact = contacts[index];
  currentContactIndex = index;
  let editName = document.getElementById("editName");
  let editEmail = document.getElementById("editEmail");
  let editPhone = document.getElementById("editPhone");
  let editInitials = document.getElementById("editInitials");
  let saveEditButton = document.getElementById("saveEditButton");
  let editBadge = document.querySelector(".overlayEditContactRightSideBadge h1");

  if (editName && editEmail && editPhone && editInitials && editBadge) {
    editName.value = contact.name;
    editEmail.value = contact.email;
    editPhone.value = contact.phone;
    editInitials.value = contact.initials;
    editBadge.innerText = contact.initials;
    editBadge.style.backgroundColor = contact.badgecolor;
    saveEditButton.onclick = function () {
      saveContact(index);
    };
    document.querySelector(".popupCurtain").classList.remove("d-none");
    document.getElementById("showEditContactPopUp").classList.remove("d-none");
  }
}

function closeEditContactPopUp() {
  document.getElementById("showEditContactPopUp").classList.add("d-none");
  document.querySelector(".popupCurtain").classList.add("d-none");
}

function getInitials(name) {
  let names = name.split(" ");
  let initials = "";
  if (names.length > 0) {
    initials += names[0][0].toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1][0].toUpperCase();
    }
  }
  return initials;
}

function saveContact(index) {
  let name = document.getElementById("editName").value;
  let email = document.getElementById("editEmail").value;
  let phone = document.getElementById("editPhone").value;

  let contactExists = contacts.some((contact, j) => {
    return j !== index && (contact.name === name || contact.email === email);
  });

  if (contactExists) {
    alert("Ein Kontakt mit diesem Namen oder dieser Email-Adresse existiert bereits.");
    return;
  }

  let initials = getInitials(name);

  contacts[index].name = name;
  contacts[index].email = email;
  contacts[index].phone = phone;
  contacts[index].initials = initials;

  saveContactsToLocalStorage();
  render();
  showContactDetails(index);
  closeEditContactPopUp();
}

function addContact() {
  let name = document.getElementById("addName").value;
  let email = document.getElementById("addEmail").value;
  let phone = document.getElementById("addPhone").value;

  let contactExists = contacts.some((contact) => {
    return contact.name === name || contact.email === email;
  });

  if (contactExists) {
    alert("Ein Kontakt mit diesem Namen oder dieser Email-Adresse existiert bereits.");
    return;
  }

  let initials = getInitials(name);
  let badgecolor = colors[contacts.length % colors.length];

  let newContact = {
    name: name,
    email: email,
    phone: phone,
    initials: initials,
    badgecolor: badgecolor,
  };

  contacts.push(newContact);
  saveContactsToLocalStorage();
  render();
  closeAddContactPopUp();
}

function deleteContact(index) {
  contact = contacts[index];
  removeContactFromTasks(index);
  contacts.splice(index, 1);
  saveContactsToLocalStorage();
  render();
  document.getElementById("contactCardMain").classList.add("d-none");
  closeEditContactPopUp();
}

function removeContactFromTasks(contactIndex) {
  let contact = contacts[contactIndex];
  for (task of tasks) {
    let assignedIndex = task.assigned.findIndex((e) => e.name == contact.name);
    if (assignedIndex != -1) {
      task.assigned.splice(assignedIndex, 1);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadContacts();
});

function toggleCancelIcons() {
  let button = document.querySelector(".cancel img");
  if (button.src.endsWith("cancel_icon.png")) {
    button.src = "./img/cancel_icon_blue.svg";
  } else {
    button.src = "./img/cancel_icon.png";
  }
}

function closeContactContentMobile() {
  content = document.querySelector(".contactsContent");
  console.log(content);
  content.classList.remove("show");
  document.querySelector(".contactListSide").classList.remove("hide-mobile");
  unselectAllContacts();
}
