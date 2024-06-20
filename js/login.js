
loadUsers();


let signUpName = document.getElementById("signUpName");
let signUpEmail = document.getElementById("signUpEmail");
let signUpPassword = document.getElementById("signUpPassword");
let signUpConfirmPassword = document.getElementById("signUpConfirmPassword");



function validateForm(){
    let signUpButton = document.getElementById('signUpButton');
    if (signUpName.value.trim() && signUpEmail.value.trim() && signUpPassword.value.trim() && signUpConfirmPassword.value.trim()) {
        signUpButton.disabled = false;
        signUpButton.style.backgroundColor = "rgb(42,54,71)";
     
    } else {
        signUpButton.disabled = true;
        signUpButton.style.backgroundColor = "#808285";
    }
};



function signUp() {
    comparePassword();
  let newUser = {
    name: signUpName,
    email: signUpEmail,
    password: signUpPassword.value,
  };
  let backgroundPopup = (document.getElementById("backgroundPopup").innerHTML = /*html*/ `
    <div class="successfullSignedUp" id="successfullSignedUp">
         <span>You Signed Up successfully</span>
    </div>
    `);
  

  users.push(newUser);
  createContact();
  showAndHidePopup();
}

function createContact() {
 
  let newContact = {
    name: signUpName.value,
    email: signUpEmail.value,
    initials: createInitials(),
    badgecolor: colors[contacts.length % colors.length],
    phone: "",
  };

  contacts.push(newContact);

  saveUsers();
  saveContacts();
}

function comparePassword() {
  if (signUpPassword.value == signUpConfirmPassword.value) {
    return
  } else {
  }
}

function createInitials() {
  let names = signUpName.value.split(" ");
  let initials = "";
  if (names.length > 0) {
    initials += names[0][0].toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1][0].toUpperCase();
    }
  }
  return initials;
}

function showAndHidePopup() {
  let backgroundPopup = document.getElementById("backgroundPopup");
  let successfullSignedUp = document.getElementById("successfullSignedUp");
  let logIn = document.getElementById('logIn');
  let signUp = document.getElementById('signUp');
      let signUpContainer = document.getElementById('signUpContainer')

  backgroundPopup.classList.remove("d-none");
  successfullSignedUp.classList.remove("hide");

  setTimeout(() => {
    successfullSignedUp.classList.add("show");
  }, 10);
  setTimeout(() => {
    successfullSignedUp.classList.remove("show");
    successfullSignedUp.classList.add("hide");

    setTimeout(() => {
      backgroundPopup.classList.add("d-none");
      logIn.classList.remove('d-none')
      signUp.classList.add('d-none')
      signUpContainer.classList.remove('d-none')
    }, 125);
  }, 2000);
}


function saveUsers() {
    let usersAsText = JSON.stringify(users);
    localStorage.setItem("users", usersAsText);
}

function saveContacts() {
    let contactsAsText = JSON.stringify(contacts);
    localStorage.setItem("contacts", contactsAsText);
}


function loadUsers() {
    let usersAsString = localStorage.getItem("users");
    if (usersAsString) {
        users = JSON.parse(usersAsString);
    }
  }

  function loadContacts() {
    let contactsAsString = localStorage.getItem("contacts");
    if (contactsAsString) {
        contacts = JSON.parse(contactsAsString);
    }
  }

  function loginToSignUp(){
    let logIn = document.getElementById('logIn');
    let signUp = document.getElementById('signUp');
    let signUpContainer = document.getElementById('signUpContainer')
    logIn.classList.add('d-none')
    signUp.classList.remove('d-none')
    signUpContainer.classList.add('d-none')
  }