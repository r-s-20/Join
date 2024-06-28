loadContactsFromAPI();
loadUsersFromAPI();
let contact;
let confirmPasswords = true;
let confirmMail = false;

let signUpName = document.getElementById("signUpName");
let signUpEmail = document.getElementById("signUpEmail");
let signUpPassword = document.getElementById("signUpPassword");
let signUpConfirmPassword = document.getElementById("signUpConfirmPassword");

signUpEmail.addEventListener("blur", function () {
  validateEmail();
});

function welcomeScreen() {
    let welcomeBackground = document.querySelector(".welcomeBackground");
    setTimeout(() => {
      welcomeBackground.classList.add("d-none");
    }, 900);
  }

function validateEmail() {
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(signUpEmail.value.trim()) && signUpEmail.value !== "") {
    renderError("signUpEmail", "Please add a valid email address.");
    confirmMail = false;
  } else {
    removeErrorForInput("signUpEmail");
    confirmMail = true;
    validateForm();
  }
}

signUpPassword.addEventListener("blur", function () {
  validatePassword();
});

signUpConfirmPassword.addEventListener("blur", function () {
  validatePassword();
});

function validatePassword() {
  if (signUpPassword.value !== "" && signUpConfirmPassword.value !== "") {
    comparePassword();
  }

  validateForm();

}

signUpName.addEventListener("blur", function () {
  validateName();
});

function validateName() {
  let user = users.find((users) => users.name === signUpName.value);

  if (user) {
    renderError("signUpName", "Name is already taken.");
  } else {
    removeErrorForInput("signUpName");
    validateForm();
  }
}

const validateForm = () => {
  let signUpButton = document.getElementById("signUpButton");
  const checkDoneButton = document.getElementById("chechDoneButton");

  if ( areInputsValid() && confirmPasswords == true && confirmMail == true) {
    if (window.getComputedStyle(checkDoneButton).display !== "none") {
      enableButton(signUpButton);
    } else {
      disableButton(signUpButton);
    }
  } else {
    disableButton(signUpButton);
  }
};

/**
 * Checks if all required inputs in the sign-up form are valid.
 * @returns {boolean} True if all required inputs are valid, otherwise false.
 */
function areInputsValid(){
  return (
    signUpName.value.trim() &&
    signUpEmail.value.trim() &&
    signUpPassword.value.trim() &&
    signUpConfirmPassword.value.trim() 
  );
}

/**
 * Enables the specified button by removing the 'disabled' attribute and setting its background color.
 * @param {HTMLButtonElement} signUpButton - The button element to enable.
 */
function enableButton(signUpButton){
  signUpButton.disabled = false;
  signUpButton.style.backgroundColor = "rgb(42,54,71)";
}

/**
 * Disables the specified button by adding the 'disabled' attribute and setting its background color.
 * @param {HTMLButtonElement} signUpButton - The button element to disable.
 */
function disableButton(signUpButton){
  signUpButton.disabled = true;
  signUpButton.style.backgroundColor = "#808285";
}


signUpName.addEventListener("input", validateForm);
signUpEmail.addEventListener("input", validateForm);
signUpPassword.addEventListener("input", validateForm);
signUpConfirmPassword.addEventListener("input", validateForm);

function signUp() {
  let newUser = createUser();
  displaySuccessMessage();
  users.push(newUser);
  createContact();
  showAndHidePopup();
  clearForm();
  unCheck();
}

/**
 * Creates a user object using the values from the sign-up form fields.
 * @returns {object} The created user object with name, email, and password properties.
 */
function createUser(){
  return {
    name: signUpName.value,
    email: signUpEmail.value,
    password: signUpPassword.value,
  };
}

function displaySuccessMessage(){
  document.getElementById("backgroundPopup").innerHTML = /*html*/ `
  <div class="successfullSignedUp" id="successfullSignedUp">
       <span>You Signed Up successfully</span>
  </div>
  `;
}

function clearForm(){
  signUpName.value = "";
  signUpEmail.value = "";
  signUpPassword.value = "";
  signUpConfirmPassword.value = "";
}

async function createContact() {
  let newContact = {
    name: signUpName.value,
    email: signUpEmail.value,
    initials: createInitials(),
    badgecolor: colors[contacts.length % colors.length],
    phone: "",
  };

  contacts.push(newContact);

  await saveUsersToAPI();
  await saveContactsToAPI();
}

function comparePassword() {
  if (signUpPassword.value == signUpConfirmPassword.value) {
    confirmPasswords = true;
    removeErrorForInput("signUpPassword");
    removeErrorForInput("signUpConfirmPassword");
    return;
  } else {
    confirmPasswords = false;
    renderError("signUpPassword", "");
    renderError("signUpConfirmPassword", "Your Passwords don't match. Try again.");
    return;
  }
}

/**
 * Creates initials from the first and last names extracted from the signUpName input value.
 * If only one name is provided, it uses the first character of that name.
 * @returns {string} The initials generated from the first and last names, or the first name if only one name is provided.
 */
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

  showPopup(backgroundPopup, successfullSignedUp);
  setTimeout(() => {
    hidePopup(backgroundPopup, successfullSignedUp);
  }, 2000);
}

/**
 * Shows the success message popup.
 * @param {HTMLElement} backgroundPopup - The background popup element.
 * @param {HTMLElement} successfullSignedUp - The success message popup element.
 */
function showPopup(backgroundPopup, successfullSignedUp){

  backgroundPopup.classList.remove("d-none");
  successfullSignedUp.classList.remove("hide");

  setTimeout(() => {
    successfullSignedUp.classList.add("show");
  }, 10);
}

/**
 * Hides the success message popup and resets the login/signup elements.
 * @param {HTMLElement} backgroundPopup - The background popup element.
 * @param {HTMLElement} successfullSignedUp - The success message popup element.
 */
function hidePopup(backgroundPopup, successfullSignedUp){
  let logIn = document.getElementById("logIn");
  let signUp = document.getElementById("signUp");
  let signUpContainer = document.getElementById("signUpContainer");
  successfullSignedUp.classList.remove("show");
  successfullSignedUp.classList.add("hide");

    setTimeout(() => {
      backgroundPopup.classList.add("d-none");
      logIn.classList.remove("d-none");
      signUp.classList.add("d-none");
      signUpContainer.classList.remove("d-none");
    }, 125);
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
    contact = JSON.parse(contactsAsString);
  }
}

function loginToSignUp() {
  let logIn = document.getElementById("logIn");
  let signUp = document.getElementById("signUp");
  let signUpContainer = document.getElementById("signUpContainer");
  let signUpContainerResponsive = document.getElementById("signUpContainerResponsive");
  logIn.classList.add("d-none");
  signUp.classList.remove("d-none");
  signUpContainer.classList.add("d-none");
  signUpContainerResponsive.classList.add("d-none");
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

