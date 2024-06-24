loadUsers();
let contact;
let confirmPasswords = true;

let signUpName = document.getElementById("signUpName");
let signUpEmail = document.getElementById("signUpEmail");
let signUpPassword = document.getElementById("signUpPassword");
let signUpConfirmPassword = document.getElementById("signUpConfirmPassword");

const validateForm = () => {
  let signUpButton = document.getElementById("signUpButton");
  const checkDoneButton = document.getElementById("chechDoneButton");
  if (
    signUpName.value.trim() &&
    signUpEmail.value.trim() &&
    signUpPassword.value.trim() &&
    signUpConfirmPassword.value.trim()
  ) {
    if (window.getComputedStyle(checkDoneButton).display !== "none") {
      signUpButton.disabled = false;
      signUpButton.style.backgroundColor = "rgb(42,54,71)";
    } else {
      signUpButton.disabled = true;
      signUpButton.style.backgroundColor = "#808285";
    }
  } else {
    signUpButton.disabled = true;
    signUpButton.style.backgroundColor = "#808285";
  }
};

signUpName.addEventListener("input", validateForm);
signUpEmail.addEventListener("input", validateForm);
signUpPassword.addEventListener("input", validateForm);
signUpConfirmPassword.addEventListener("input", validateForm);

function signUp() {
  removeErrors();
  comparePassword();
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailPattern.test(signUpEmail.value) && confirmPasswords) {
    let newUser = {
      name: signUpName.value,
      email: signUpEmail.value,
      password: signUpPassword.value,
    };
    document.getElementById("backgroundPopup").innerHTML = /*html*/ `
    <div class="successfullSignedUp" id="successfullSignedUp">
         <span>You Signed Up successfully</span>
    </div>
    `;

    users.push(newUser);
    createContact();

    showAndHidePopup();
    signUpName.value = "";
    signUpEmail.value = "";
    signUpPassword.value = "";
    signUpConfirmPassword.value = "";
    unCheck();
  } else {
    if (emailPattern.test(signUpEmail.value)) {
      alert("Passwords don't match");
      renderError("signUpPassword", "");
      renderError("signUpConfirmPassword", "Your Passwords don't match. Try again.");
    } else {
      alert("Email not correct");
      renderError('signUpEmail', "Please add a valid email address.");
    }
  }
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
    confirmPasswords = true;
    return;
  } else {
    confirmPasswords = false;
    return;
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
  let logIn = document.getElementById("logIn");
  let signUp = document.getElementById("signUp");
  let signUpContainer = document.getElementById("signUpContainer");

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
      logIn.classList.remove("d-none");
      signUp.classList.add("d-none");
      signUpContainer.classList.remove("d-none");
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

function loginToSignUp() {
  let logIn = document.getElementById("logIn");
  let signUp = document.getElementById("signUp");
  let signUpContainer = document.getElementById("signUpContainer");
  logIn.classList.add("d-none");
  signUp.classList.remove("d-none");
  signUpContainer.classList.add("d-none");
}

function checkDone() {
  document.getElementById("checkButton").classList.add("d-none");
  document.getElementById("chechDoneButton").classList.remove("d-none");
  validateForm();
}

function unCheck() {
  document.getElementById("checkButton").classList.remove("d-none");
  document.getElementById("chechDoneButton").classList.add("d-none");
  validateForm();
}

function checkLocalStorageKey() {
  if (localStorage.getItem("users") !== null) {
    localStorageToInput();
  } else {
    return;
  }
}

function localStorageToInput() {
  let inputUsermail = document.getElementById("inputUsermail");
  let inputPassword = document.getElementById("inputPassword");
  inputUsermail.value = users[0].email;
  inputPassword.value = users[0].password;
}

function logIn() {
  let inputUsermail = document.getElementById("inputUsermail");
  let inputPassword = document.getElementById("inputPassword");
  inputUsermail = inputUsermail.value.trim();
  inputPassword = inputPassword.value.trim();
  let user = users.find((user) => user.email === inputUsermail);
  if (user) {
    if (user.password === inputPassword) {
      let contact = contacts.find((contact) => contact.email === inputUsermail);
      checkRememberMe(contact);
      window.location.href = "/summary.html";
    } else {
      alert("E-Mail or Password incorrect");
    }
  } else {
    alert("E-Mail or Password incorrect");
  }
}

function checkRememberMe(contact) {
  let checkDoneButton = document.getElementById("chechDoneButton");
  if (window.getComputedStyle(checkDoneButton).display !== "none") {
    localStorage.clear();
    saveContactToLocalStorage(contact);
    saveToSessionStorage(contact);
  } else {
    saveToSessionStorage(contact);
  }
}

function saveContactToLocalStorage(contact) {
  let contactAsText = JSON.stringify(contact);
  localStorage.setItem("contact", contactAsText);
}

function saveToSessionStorage(contact) {
  let contactAsText = JSON.stringify(contact);
  sessionStorage.setItem("contact", contactAsText);
}

function loadFromSessionStorage() {
  let contactAsString = sessionStorage.getItem(contact);
  if (contactAsString) {
    contact = JSON.parse(contactAsString);
  }
}

function checkDone2() {
  document.getElementById("checkButton2").classList.add("d-none");
  document.getElementById("chechDoneButton2").classList.remove("d-none");
}

function unCheck2() {
  document.getElementById("checkButton2").classList.remove("d-none");
  document.getElementById("chechDoneButton2").classList.add("d-none");
}

function renderError(inputId, message="This field is required") {
  input = document.getElementById(inputId);
  input.classList.add("errorDesign");
  // input.parentElement.innerHTML += `
  //   <span class="errorMessage">${message}</span>
  // `;
}

function removeErrors() {
  removeErrorColors();
  removeErrorMessages();
}

function removeErrorColors() {
  inputs = document.getElementsByClassName("errorDesign");
  for (let i = inputs.length - 1; i >= 0; i--) {
    inputs[i].classList.remove("errorDesign");
  }
}

function removeErrorMessages() {
  messages = document.getElementsByClassName("errorMessage");
  for (let i = messages.length - 1; i >= 0; i--) {
    messages[i].remove();
  }
}

function showVisbilityIcons(inputId) {
  let input = document.getElementById(inputId);
  let lockIcon = document.querySelector(`.${inputId} .lockIcon`);
  let visOffIcon = document.querySelector(`.${inputId} .vis-offIcon`);
  let visOnIcon = document.querySelector(`.${inputId} .vis-onIcon`);
  if (input.value != "") {
    lockIcon.classList.add("d-none");
    visOffIcon.classList.remove("d-none");
  } else {
    lockIcon.classList.remove("d-none");
    visOffIcon.classList.add("d-none");
    visOnIcon.classList.add("d-none");
  }

}

function showPassword(inputId) {
  let input = document.getElementById(inputId);
  console.log("showing password in", input);
  toggleVisibilityIcons(inputId);
}

function hidePassword(inputId) {
  let input = document.getElementById(inputId);
  console.log("hiding password in", input);
  toggleVisibilityIcons(inputId);
}

function toggleVisibilityIcons(inputId) {
  let visOffIcon = document.querySelector(`.${inputId} .vis-offIcon`);
  let visOnIcon = document.querySelector(`.${inputId} .vis-onIcon`);
  visOffIcon.classList.toggle("d-none");
  visOnIcon.classList.toggle("d-none");
}