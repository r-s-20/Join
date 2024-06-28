
loadContactsFromAPI();
loadUsersFromAPI();



function logIn() {
  let inputUsermail = getInputValue("inputUsermail");
  let inputPassword = getInputValue("inputPassword");
  let user = users.find((user) => user.email === inputUsermail);
  validateUser(user, inputPassword, inputUsermail);
}

/**
 * Retrieves the trimmed value of an input element by its ID.
 * @param {string} inputValue - The ID of the input element.
 * @returns {string} - The trimmed value of the input element.
 */
function getInputValue(inputValue){
  let element = document.getElementById(inputValue);
  return element.value.trim();
}

/**
 * Validates the user's credentials and redirects to the summary page if valid.
 * Alerts the user if the email or password is incorrect.
 * @param {Object} user - The user object retrieved from the `users` array.
 * @param {string} inputPassword - The password entered by the user.
 * @param {string} inputUsermail - The email entered by the user.
 */
function validateUser(user, inputPassword, inputUsermail){
  if (user) {
    if (user.password === inputPassword) {
      let contact = contacts.find((contact) => contact.email === inputUsermail);
      checkRememberMe(user, contact);
      window.location.href = "./summary.html";
    } else {
      renderError("inputPassword", "E-Mail or Password incorrect");
      renderError("inputUsermail", "");
    }
  } else {
    renderError("inputPassword", "E-Mail or Password incorrect");
    renderError("inputUsermail", "");
  }
}

/**
 * Checks if the "chechDoneButton" is displayed. If yes, clears local storage,
 * saves the contact to local storage, and saves it to session storage.
 * If "chechDoneButton" is not displayed, only saves the contact to session storage.
 * @param {Object} contact - The contact object to be saved.
 */
function checkRememberMe(user, contact) {
  let checkDoneButton = document.getElementById("chechDoneButton2");
  if (window.getComputedStyle(checkDoneButton).display !== "none") {
    localStorage.clear();
    saveContactToLocalStorage(user);
    saveToSessionStorage(contact);
  } else {
    saveToSessionStorage(contact);
  }
}

function guestLogin() {
  let guestUser = {
    name: "Guest",
    email: "",
    initials: "G",
    badgecolor: colors[0],
    phone: "",
  };
  let contact = [];
  contact.push(guestUser);
  saveToSessionStorage(contact);
  window.location.href = "./summary.html";
}

/**
 * Saves the provided contact object to local storage.
 * @param {Object} contact - The contact object to be saved to local storage.
 */
function saveContactToLocalStorage(contact) {
  let contactAsText = JSON.stringify(contact);
  localStorage.setItem("contact", contactAsText);
}

/**
 * Saves the provided contact object to session storage.
 * @param {Object} contact - The contact object to be saved to session storage.
 */
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

/**
 * Renders an error message for the specified input field.
 * @param {string} inputId - The ID of the input field to render the error for.
 * @param {string} [message="This field is required"] - The error message to display (default: "This field is required").
 */
function renderError(inputId, message = "This field is required") {
  let input = document.getElementById(inputId);
  input.classList.add("errorDesign");
  let errorSpan = document.createElement("span");
  errorSpan.className = "errorMessage";
  errorSpan.textContent = message;
  input.parentElement.appendChild(errorSpan);
}

/**
 * Removes the error styling and error message for the specified input field.
 * @param {string} inputId - The ID of the input field to remove the error from.
 */
function removeErrorForInput(inputId) {
  let input = document.getElementById(inputId);

  if (input) {
    input.classList.remove("errorDesign");
    
    // Entferne die Fehlermeldung, falls vorhanden
    let errorMessage = input.parentElement.querySelector(".errorMessage");
    if (errorMessage) {
      errorMessage.remove();
    }
  }
}

/**
 * Manages the visibility icons for a password input field based on its value.
 * @param {string} inputId - The ID of the password input field.
 */
function showVisbilityIcons(inputId) {
  let input = document.getElementById(inputId);
  let lockIcon = document.querySelector(`.${inputId} .lockIcon`);
  let visOffIcon = document.querySelector(`.${inputId} .vis-offIcon`);
  let visOnIcon = document.querySelector(`.${inputId} .vis-onIcon`);
  if (input.value != "") {
    showPasswordIcons(lockIcon, visOffIcon);
  } else {
    hidePassword(inputId);
    resetIcons(lockIcon, visOffIcon, visOnIcon);
  }
}

/**
 * Displays the visibility icons for a password input field.
 * @param {HTMLElement} lockIcon - The lock icon element to hide.
 * @param {HTMLElement} visOffIcon - The visibility off icon element to show.
 */
function showPasswordIcons(lockIcon, visOffIcon){
  lockIcon.classList.add("d-none");
  visOffIcon.classList.remove("d-none");
}

/**
 * Resets the visibility icons for a password input field to their default state.
 * @param {HTMLElement} lockIcon - The lock icon element to show.
 * @param {HTMLElement} visOffIcon - The visibility off icon element to hide.
 * @param {HTMLElement} visOnIcon - The visibility on icon element to hide.
 */
function resetIcons(lockIcon, visOffIcon, visOnIcon){
  lockIcon.classList.remove("d-none");
  visOffIcon.classList.add("d-none");
  visOnIcon.classList.add("d-none");

}

/**
 * Displays the password in plain text and toggles visibility icons.
 * @param {string} inputId - The ID of the password input field.
 */
function showPassword(inputId) {
  let input = document.getElementById(inputId);
  input.type = "text";
  toggleVisibilityIcons(inputId);
}

/**
 * Hides the password and toggles visibility icons.
 * @param {string} inputId - The ID of the password input field.
 */
function hidePassword(inputId) {
  let input = document.getElementById(inputId);
  input.type = "password";
  toggleVisibilityIcons(inputId);
}

/**
 * Toggles visibility icons for password input fields.
 * @param {string} inputId - The ID of the password input field.
 */
function toggleVisibilityIcons(inputId) {
  let visOffIcon = document.querySelector(`.${inputId} .vis-offIcon`);
  let visOnIcon = document.querySelector(`.${inputId} .vis-onIcon`);
  visOffIcon.classList.toggle("d-none");
  visOnIcon.classList.toggle("d-none");
}

function checkLocalStorageKey() {
  let contactAsString = localStorage.getItem('contact');
  if (contactAsString) {
  
    let contact = JSON.parse(contactAsString);

    let inputUsermail = document.getElementById("inputUsermail");
    let inputPassword = document.getElementById("inputPassword");

    let email = contact.email;
    let password = contact.password;
    inputUsermail.value = email;
    inputPassword.value = password;

  } else {
    return;
  }
}


