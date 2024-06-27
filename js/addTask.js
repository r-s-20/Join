let currentAssignedList = [];
let currentSubtasks = [];
let contactsSelected = [];

async function init() {
  if (!checkUserLoginStatus()) {
    window.location.href = "./index.html";
  }
  await includeHTML();
  renderUserlogo();
  await loadTasksFromAPI();
  await loadContactsFromAPI();
}

async function addNewTask(status) {
  let newTask = createNewTask(status);
  removeErrors();
  if (validateTask(newTask)) {
    tasks.push(newTask);
    await saveTasksToAPI();
    await showConfirmationMessage();
    resetFormInputs();
    resetAddTask();
    setTimeout(closeAddingTask, 1500);
  }
}

function closeAddingTask() {
  if (window.location.href.endsWith("addTask.html")) {
    window.location.href = "./board.html";
  } else if (window.location.href.endsWith("board.html")) {
    updateHTML();
    closeAddTaskAboutButton();
  }
}

function resetAddTask() {
  currentAssignedList = [];
  currentSubtasks = [];
  contactsSelected = [];
}

function createNewTask(taskStatus) {
  let newTask = {
    title: parseTextInput(getValueFromInput("inputTitle")),
    timestamp: new Date().getTime(),
    assigned: currentAssignedList,
    description: parseTextInput(getValueFromInput("inputDescription")),
    dueDate: getValueFromInput("inputDueDate"),
    prio: getPrio(),
    category: getCategory(),
    subtasks: {
      subtaskList: currentSubtasks,
      completed: currentSubtasks.filter((e) => e.completed == true).length,
    },
    status: taskStatus,
  };
  return newTask;
}

function showConfirmationMessage() {
  let popupAddTaskMessage = document.getElementById("popupAddTaskMessage");
  let popup = document.getElementById("popupAddTaskMessage");
  popup.classList.remove("d-none");
  setTimeout(() => {
    popupAddTaskMessage.classList.add("show");
  }, 10);
  setTimeout(() => {
    popupAddTaskMessage.classList.remove("show");
    popupAddTaskMessage.classList.add("hide");
  }, 2000);
}

function validateTask(task) {
  if (getValueFromInput("inputTitle") != "" && getValueFromInput("inputDueDate") && task.category) {
    return true;
  } else {
    renderErrorMessages(task);
    return false;
  }
}

function renderErrorMessages(task) {
  if (!task.category) {
    renderCategoryError();
  }
  if (task.title == "") {
    renderError("inputTitle");
  }
  if (task.dueDate == "") {
    renderError("inputDueDate");
  }
}

function renderError(inputId) {
  input = document.getElementById(inputId);
  input.classList.add("errorDesign");
  input.parentElement.innerHTML += `
    <span class="errorMessage">This field is required</span>
  `;
}

function renderCategoryError() {
  input = document.getElementById("inputCategory");
  input.classList.add("errorDesign");
  input.parentElement.parentElement.innerHTML += `
    <span class="errorMessage">This field is required</span>
  `;
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

/**reads selected category from form input field and stores  */
function getCategory() {
  let selection = getValueFromInput("inputCategory");
  let categoryElement = categories.filter((e) => e.name == selection)[0];
  if (categoryElement) {
    return categoryElement;
  } else {
    return false;
  }
}

/** will mark a priority button based on provided ID of the button,
 * remove selection from the other buttons and adjust colors and icons for all of them
 */
function setPrio(btnId) {
  prioButtons = document.getElementsByClassName("prioButton");
  selected = document.getElementById(btnId);
  for (button of prioButtons) {
    button.classList.remove("prioSelected");
    let imgSrc = `../img/${button.id.replace("btn-", "prio-")}.png`;
    button.lastElementChild.src = imgSrc;
  }
  selected.classList.add("prioSelected");
  selected.lastElementChild.src = selected.lastElementChild.src.replace(".png", "White.png");
}

/**Checks which priority button is currently checked
 * and returns the priority (high, medium or low) as a string.
 *
 * Is based on ID of the buttons, so don't mess with those IDs.
 */
function getPrio() {
  let prioButtons = document.querySelectorAll(".prioContainer .prioButton");
  let selection;
  for (button of prioButtons) {
    if (button.classList.contains("prioSelected")) {
      selection = button.id.replace("btn-", "").toLowerCase();
      return selection;
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

function toggleArrowIcons(menuId) {
  let arrowIcons = document.querySelectorAll(`#${menuId} .dropdownIcon`);
  for (arrow of arrowIcons) {
    arrow.classList.toggle("d-none");
  }
}

function toggleCurtain(menuId) {
  let curtain = document.getElementById("addTaskPopupContainer");
  curtain.classList.toggle("d-none");
  curtain.setAttribute("onclick", `toggleDropdownMenu("${menuId}")`);
}

function closeAddTaskPopup() {
  let curtain = document.getElementById("addTaskPopupContainer");
  curtain.classList.add("d-none");
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

/** Writes provided category into input field of the dropdown
 * and closes the category dropdown menu
 * @param {string} category - name of a category
 */
function setCategory(category) {
  let container = document.getElementById("inputCategory");
  container.value = category;
  toggleDropdownMenu("inputCategoryContainer");
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

function startSearchAssigned() {
  let input = document.getElementById("inputAssigned");
  if (input.value == "Select contacts to assign") {
    toggleDropdownMenu("inputAssignedContainer");
    input.value = "";
    input.focus();
  }
}

function searchContacts() {
  contactsSelected = [];
  let input = getValueFromInput("inputAssigned");
  input = input.toLowerCase();
  contactsSelected = contacts.filter((e) => e.name.toLowerCase().includes(input));
  renderAssignedDropdown("dropdownAssigned", contactsSelected);
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

function checkButtonDone(i) {
  let checkButton = document.getElementById(`checkContactButton${i}`);
  let checkDoneButton = document.getElementById(`checkContactDoneButton${i}`);
  checkButton.classList.add("d-none");
  checkDoneButton.classList.remove("d-none");
}

function checkButtonEmpty(i) {
  let checkButton = document.getElementById(`checkContactButton${i}`);
  let checkDoneButton = document.getElementById(`checkContactDoneButton${i}`);
  checkButton.classList.remove("d-none");
  checkDoneButton.classList.add("d-none");
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

/** Renders userbadges of assigned contacts as circles below the "assigned to" dropdown menu
 * using badgecolor and initials of each contact
 */
function renderAssignedBadges() {
  let container = document.getElementById("assignedBadgesContainer");
  container.innerHTML = "";
  if (currentAssignedList.length > 0) {
    for (contact of currentAssignedList) {
      container.innerHTML += `
        <div class="userBadge flex-center" style="background-color:${contact.badgecolor};">${contact.initials}</div>
      `;
    }
  }
}

function openAddSubtask() {
  let addButton = document.getElementById("addSubtask");
  let editContainer = document.getElementById("editSubtaskButtons");
  let input = document.getElementById("inputSubtasks");
  addButton.classList.add("d-none");
  editContainer.classList.remove("d-none");
  input.focus();
}

function closeAddSubtask() {
  let addButton = document.getElementById("addSubtask");
  let editContainer = document.getElementById("editSubtaskButtons");
  document.getElementById("inputSubtasks").value = "";
  addButton.classList.remove("d-none");
  editContainer.classList.add("d-none");
}

function addNewSubtask() {
  let newSubtask = getValueFromInput("inputSubtasks");
  currentSubtasks.push({
    name: `${newSubtask}`,
    completed: false,
  });
  renderSubtasks();
  closeAddSubtask();
}

function renderSubtasks() {
  let container = document.getElementById("subtaskList");
  container.innerHTML = "";
  for (let i = 0; i < currentSubtasks.length; i++) {
    const subtask = currentSubtasks[i];
    container.innerHTML += insertSubtaskHTML(subtask, i);
  }
}

function toggleEditSubtask(i) {
  let editContainer = document.getElementById(`editSubtaskContainer${i}`);
  editContainer.classList.toggle("d-none");
}

function toggleEditSubtaskDetail(i) {
  document.getElementById(`editSubtaskDetailContainer${i}`).classList.toggle("d-none");
  document.getElementById(`editSubtaskInput${i}`).focus();
}

function confirmSubtaskEdit(i) {
  result = getValueFromInput(`editSubtaskInput${i}`);
  currentSubtasks[i].name = result;
  renderSubtasks();
}

function removeSubtask(i) {
  currentSubtasks.splice(i, 1);
  renderSubtasks();
}

/**Resets all input fields to default entries and empties arrays for assigned contacts
 * and subtasks
 */
function resetFormInputs() {
  let inputFields = document.getElementsByClassName("formInput");
  for (inputField of inputFields) {
    inputField.value = "";
  }
  currentAssignedList = [];
  renderAssignedBadges();
  setValueToInput("Select contacts to assign", "inputAssigned");
  setPrio("btn-medium");
  setValueToInput("Select task category", "inputCategory");
  currentSubtasks = [];
  renderSubtasks();
}

function toggleIconColor() {
  let icon = document.querySelector("#clearTaskBtn img");
  src = icon.src;
  if (src.endsWith("close_darkblue.svg")) {
    icon.src = "./img/close_blue.svg";
  } else {
    icon.src = "./img/close_darkblue.svg";
  }
}
