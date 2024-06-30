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

/**
 * Initializes the application, loads necessary data, and renders the user interface.
 * @async
 * @function
 */
async function init() {
  await includeHTML();
  renderUserlogo();
  await loadTasksFromAPI();
  await loadContactsFromAPI();
  render();
}

/**
 * Renders the contact list in the contact list container.
 * @function
 */

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

/**
 * Displays contact details in the main contact card container.
 * @function
 * @param {number} index - The index of the contact to display.
 */

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
                    <p><h3>Email</h3> <a>${contact.email}</a></p>
                    </div>
            <div class="CardDetailPhoneNumber"><h3>Phone</h3> ${contact.phone}</div>
      </div>
        <div class="mobileEditBtn d-none" id="mobileEditPopup" onclick="openMobileEditPopup(${index})">  <!--menü contactedit popup-->
          <img src="img/moreVert.png" alt="" />
        </div>
    </div>
  `;

  let contactDetailsContainer = document.getElementById("contactCardMain");
  contactDetailsContainer.innerHTML = contactDetailsHTML;
  contactDetailsContainer.classList.remove("d-none");
  document.querySelector(".contactsContent").classList.add("show");
  document.querySelector(".contactListSide").classList.add("hide-mobile");
}

/**
 * Selects a contact and displays its details.
 * @function
 * @param {number} index - The index of the contact to select.
 */

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

/**
 * Unselects contacts.
 * @function
 */

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

/**
 * Displays the popup to add a new contact.
 * @function
 */

function addContactPopUp() {
  let showAddContactPopUp = document.getElementById("showAddContactPopUp");
  document.querySelector(".popupCurtain").classList.remove("d-none");
  showAddContactPopUp.classList.remove("d-none");
  showPopupWithAnimation("showAddContactPopUp");
}

/**
 * Displays a popup with animation.
 * @function
 * @param {HTMLElement} popID - The popup element to display.
 */

function showPopupWithAnimation(popID) {
  popup = document.getElementById(popID);
  popup.classList.remove("hideContactPopup");
  setTimeout(() => {
    popup.classList.add("showContactPopup");
  }, 10);
}

/**
 * Closes the popup for adding a new contact.
 * @function
 */

function closeAddContactPopUp() {
  let showAddContactPopUp = document.getElementById("showAddContactPopUp");
  showAddContactPopUp.classList.remove("showContactPopup");
  showAddContactPopUp.classList.add("hideContactPopup");
  setTimeout(() => {
    document.querySelector(".popupCurtain").classList.add("d-none");
    showAddContactPopUp.classList.add("d-none");
  }, 125);
  clearAddContactInputFields();
}

function clearAddContactInputFields() {
  setValueToInput("", "addName");
  setValueToInput("", "addEmail");
  setValueToInput("", "addPhone");
}

/**
 * Displays the popup to edit an existing contact.
 * @function
 * @param {number} index - The index of the contact to edit.
 */

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
    showEditPopup();
  }
}

function showEditPopup() {
  let popupCurtain = document.querySelector(".popupCurtain");
  let showEditContactPopUp = document.getElementById("showEditContactPopUp");
  showEditContactPopUp.classList.remove("d-none");
  popupCurtain.classList.remove("d-none");
  showPopupWithAnimation("showEditContactPopUp");
}

/**
 * Closes the popup for editing a contact.
 * @function
 */

function closeEditContactPopUp() {
  let showEditContactPopUp = document.getElementById("showEditContactPopUp");
  let popupCurtain = document.querySelector(".popupCurtain");
  showEditContactPopUp.classList.remove("showContactPopup");
  showEditContactPopUp.classList.add("hideContactPopup");
  setTimeout(() => {
    showEditContactPopUp.classList.add("d-none");
    popupCurtain.classList.add("d-none");
  }, 125);
}

/**
 * Generates initials from a given name.
 * @function
 * @param {string} name - The name to generate initials from.
 * @returns {string} The generated initials.
 */

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

/**
 * Saves the edited contact information.
 * @async
 * @function
 * @param {number} index - The index of the contact to save.
 */

async function saveContact(index) {
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

  // saveContactsToLocalStorage();
  await saveContactsToAPI();
  render();
  showContactDetails(index);
  closeEditContactPopUp();
}

/**
 * Adds a new contact.
 * @async
 * @function
 */

async function addContact() {
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
  // saveContactsToLocalStorage();
  await saveContactsToAPI();
  render();
  closeAddContactPopUp();
}

/**
 * Deletes a contact.
 * @async
 * @function
 * @param {number} index - The index of the contact to delete.
 */

async function deleteContact(index) {
  contact = contacts[index];
  removeContactFromTasks(index);
  await saveTasksToAPI();
  contacts.splice(index, 1);
  // saveContactsToLocalStorage();
  await saveContactsToAPI();
  render();

  document.getElementById("contactCardMain").classList.add("d-none");
  closeContactContentMobile();
  closeEditContactPopUp();
}

/**
 * Removes a contact from all tasks.
 * @function
 * @param {number} contactIndex - The index of the contact to remove from tasks.
 */

function removeContactFromTasks(contactIndex) {
  let contact = contacts[contactIndex];
  for (task of tasks) {
    let assignedIndex = task.assigned.findIndex((e) => e.name == contact.name);
    if (assignedIndex != -1) {
      task.assigned.splice(assignedIndex, 1);
    }
  }
}

// document.addEventListener("DOMContentLoaded", function () {
//   loadContacts();
// });

/**
 * Toggles the visibility of the cancel icons.
 * @function
 */

function toggleCancelIcons() {
  let button = document.querySelector(".cancel img");
  if (button.src.endsWith("cancel_icon.png")) {
    button.src = "./img/cancel_icon_blue.svg";
  } else {
    button.src = "./img/cancel_icon.png";
  }
}

/**
 * Closes the contact content view on mobile devices.
 * @function
 */

function closeContactContentMobile() {
  content = document.querySelector(".contactsContent");
  content.classList.remove("show");
  document.querySelector(".contactListSide").classList.remove("hide-mobile");
  unselectAllContacts();
}

function openMobileEditPopup(index) {
  let popupMenu = document.getElementById("editDeletePopup");
  let curtain = document.getElementById("mobilePopupCurtain");
  curtain.classList.remove("d-none");

  if (!popupMenu) {
    popupMenu = document.createElement("div");
    popupMenu.id = "editDeletePopup";
    popupMenu.classList.add("mobileEditMenu");
    document.body.appendChild(popupMenu);
  }

  let openEditMenuHTML = /*html*/ `
     <div class="mobileEditMenuContent">
      <div class="mobileNameEdit button" onclick="editContactPopUp(${index}),closeMobileEditPopup()">
        <img src="img/edit.png" alt="edit Contact Name"/><span>Edit</span>
      </div>
      <div class="mobileNameDelete button" onclick="deleteContact(${index}),closeMobileEditPopup()">
        <img src="img/delete.png" alt="delete Contact Name"/><span>Delete</span>
      </div>
    </div>
  `;
  popupMenu.innerHTML = openEditMenuHTML;

  popupMenu.style.transform = "translateX(100%)";
  setTimeout(() => {
    popupMenu.style.transform = "translateX(0)";
  }, 10);
}

function closeMobileEditPopup() {
  let popUp = document.getElementById("editDeletePopup");
  let curtain = document.getElementById("mobilePopupCurtain");
  curtain.classList.add("d-none");
  popUp.remove();
}
