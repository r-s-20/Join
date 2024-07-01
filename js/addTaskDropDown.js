/** renders dropdown menu for categories in add task form
 * @param {string} containerId - ID of the div into which the dropdown content should be rendered
 */
function renderCategoriesDropdown(containerId) {
  let container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    container.innerHTML += insertCategoryHTML(category);
  }
}

/** renders dropdown menu for assigned contacts in add task form
 * @param {string} containerId - ID of the div into which the dropdown content should be rendered
 */
function renderAssignedDropdown(containerId, contactArray = contacts) {
  let container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 0; i < contactArray.length; i++) {
    const element = contactArray[i];
    container.innerHTML += insertAssignedContactsHTML(element, i);
    if (currentAssignedList.filter((assigned) => assigned.name == element.name).length > 0) {
      toggleCheckDesign(i);
    }
  }
}

/**Will open or close the categories or assigned-contacts-dropdown menu
 * based on provided menuId. Will also toggle the arrow Icon in that input field.
 *
 * z-Index for input field is increased while dropdown is open, as dropdown element overlaps.
 * @param {string} menuId - ID of the input field to which the dropdown is opening
 */
function toggleDropdownMenu(menuId) {
  let inputField = document.getElementById(menuId);
  let dropdown = document.getElementById(menuId).nextElementSibling;
  toggleCurtain(menuId);
  renderCategoriesDropdown("dropdownCategories");
  renderAssignedDropdown("dropdownAssigned");
  dropdown.classList.toggle("d-none");
  document.getElementById("inputAssigned").value = "Select contacts to assign";
  contactsSelected = [];
  adjustZIndex(inputField);
  toggleArrowIcons(menuId);
}

/**toggles between arrow up and arrow down for dropdown-Element
 * @param {string} menuId - ID of the input field that opens the dropdown menu
 */
function toggleArrowIcons(menuId) {
  let arrowIcons = document.querySelectorAll(`#${menuId} .dropdownIcon`);
  for (arrow of arrowIcons) {
    arrow.classList.toggle("d-none");
  }
}

/**Applies error-css and renders an error-message below an inputCategory-html-Element.
 * Special case as category has a dropdown-menu and therefore html structure is different. *
 */
function renderCategoryError() {
  input = document.getElementById("inputCategory");
  input.classList.add("errorDesign");
  input.parentElement.parentElement.innerHTML += insertErrorMessageHTML();
}

/**toggles a background for popups that allows to darken background
 * and to close popup with onclick-method.
 */
function toggleCurtain(menuId) {
  let curtain = document.getElementById("addTaskPopupContainer");
  curtain.classList.toggle("d-none");
  curtain.setAttribute("onclick", `toggleDropdownMenu("${menuId}")`);
}

/**z-Index for the input field belonging to a dropdown menu is increased,
 *
 * z-Index is decreased back to normal when dropdown closes.
 * @param {html-Element} inputField
 */
function adjustZIndex(inputField) {
  if (inputField.style.zIndex == 50) {
    inputField.style.zIndex = 0;
  } else {
    inputField.style.zIndex = 50;
  }
}

/** Writes provided category into input field of the dropdown
 * and closes the category dropdown menu
 * @param {string} category - name of a category
 */
function setCategory(category) {
  let container = document.getElementById("inputCategory");
  container.value = category;
  toggleDropdownMenu("inputCategoryContainer");
}

/** Sets the focus to the input field for assigned contacts and opens the dropdown menu */
function startSearchAssigned() {
  let input = document.getElementById("inputAssigned");
  if (input.value == "Select contacts to assign") {
    toggleDropdownMenu("inputAssignedContainer");
    input.value = "";
    input.focus();
  }
}

/** Toggles between check- and check-done-icons for a row in assigned contacts dropdown-menu
 * @param {integer} i - index of row
 */
function toggleCheckDesign(i) {
  let checkButton = document.getElementById(`checkContactButton${i}`);
  let checkDoneButton = document.getElementById(`checkContactDoneButton${i}`);
  let dropdownField = document.getElementsByClassName("dropdownAssignedElement")[i];
  checkButton.classList.toggle("d-none");
  checkDoneButton.classList.toggle("d-none");
  dropdownField.classList.toggle("mainDarkBlue");
}

/** Adds or removes a contact to/from list of assigned contacts
 * in row "i" of the "assgined to" dropdown menu.
 *
 * Also toggles the check icon in that row and updates badges below menu.
 * @param {integer} i - row index
 */
function toggleAssignedContact(i) {
  let contact;
  if (contactsSelected.length > 0) {
    contact = contactsSelected[i];
  } else {
    contact = contacts[i];
  }
  if (currentAssignedList.filter((assigned) => assigned.name == contact.name).length > 0) {
    let index = currentAssignedList.indexOf(contact);
    currentAssignedList.splice(index, 1);
  } else {
    currentAssignedList.push(contact);
  }
  toggleCheckDesign(i);
  renderAssignedBadges();
}
