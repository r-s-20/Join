let currentAssignedList = [];
let currentSubtasks = [];
let contactsSelected = [];

async function init() {
  await includeHTML();
  loadTasks();
  // console.log("loading from API");
  // loadTasksFromAPI();
  document.getElementById("addTaskForm").addEventListener("onkeypress", (e) => {
    let key = e.charCode || e.keyCode || 0;
    if (key == 13) {
      e.preventDefault();
      console.log("enter was pressed");
    }
  });
}

async function addNewTask(status) {
  let newTask = createNewTask(status);
  if (validateTask(newTask)) {
    tasks.push(newTask);
    saveTasks();
    currentAssignedList = [];
    currentSubtasks = [];
    await showConfirmationMessage();
    resetFormInputs();
    // window.location.href = "./board.html";
  }
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

function editTask(timestamp) {
  console.log(tasks);
  let task = tasks.filter((e) => e.timestamp == timestamp)[0];
  console.log(task);
  editedTask = createNewTask(task.status);
  editedTask.timestamp = timestamp;
  let taskIndex = tasks.indexOf(task);
  console.log("index is", taskIndex);
  tasks.splice(taskIndex, 1, editedTask);
  saveTasks();
  alert("edited Task");
  closePopup();
  updateHTML();
  document.getElementById("editTaskPopup").innerHTML = "";
}

function loadTaskForEditing(timestamp) {
  let task = tasks.filter((e) => e.timestamp == timestamp)[0];
  currentAssignedList = [];
  currentSubtasks = [];
  task.assigned.forEach((e) => currentAssignedList.push(e));
  task.subtasks.subtaskList.forEach((e) => currentSubtasks.push(e));
  // document.querySelector("#editTaskPopup h1").innerHTML = "Edit";
  insertValuesToEditTask(task);
  document.getElementById("inputCategory").parentElement.parentElement.classList.add("d-none");
  document.getElementById("clearTaskBtn").classList.add("d-none");
  document.getElementById("createTaskBtn").setAttribute("onclick", `editTask(${timestamp})`);
  document.getElementById("createTaskBtn").firstElementChild.innerHTML = "Ok";
}

function insertValuesToEditTask(task) {
  setValueToInput(task.title, "inputTitle");
  setValueToInput(task.description, "inputDescription");
  renderAssignedBadges();
  setValueToInput(task.dueDate, "inputDueDate");
  setPrio("btn-" + task.prio);
  setValueToInput(task.category.name, "inputCategory");
  renderSubtasks();
}

function showConfirmationMessage() {
  let popup = document.getElementById("popupAddTaskMessage");
  popup.classList.remove("d-none");
  setTimeout(() => {
    popup.classList.add("d-none");
  }, 900);
}

async function saveTasks() {
  let tasksAsText = JSON.stringify(tasks);
  localStorage.setItem("tasks", tasksAsText);
  // uploadStatus = await putData("/joinTasks", data={"tasks": tasksAsText});
  // if (uploadStatus.ok) {
  //   console.log("task was saved to firebase");
  // }
}

function validateTask(task) {
  // incomplete, more checks needed for date input etc
  if (getValueFromInput("inputTitle") != "" && getValueFromInput("inputDueDate") && task.category) {
    return true;
  } else {
    renderErrorMessages(task);
    return false;
  }
}

function renderErrorMessages(task) {
  console.log("task not created, there are errors");
  if (!task.category) {
    renderRequiredError("inputCategory");
  }
  if (task.title=="") {
    renderRequiredError("inputTitle");
  }
  if (task.dueDate == "") {
    renderRequiredError("inputDueDate")
  }
}

function renderRequiredError(inputId) {
  input = document.getElementById(inputId);
  input.classList.add("errorDesign");
  console.log("input with errors is", input.id);
}

function removeErrorMessages() {
  inputs = document.getElementsByClassName('formInput');
  for (input of inputs) {
    console.log("removing for input id", input.id);
    input.classList.remove("errorDesign");
  }
}

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
 * as dropdow content would overlap otherwise.
 *
 * z-Index is decreased again when dropdown closes
 * to prevent conflicts while using other dropdowns.
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

function insertCategoryHTML(element) {
  return `
        <div class="dropdownCategoryElement dropdownElement" onclick="setCategory('${element.name}')">${element.name}</div>
      `;
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

function insertAssignedContactsHTML(element, i) {
  return `
        <div class="dropdownAssignedElement dropdownElement flex-start" onclick="toggleAssignedContact(${i})">
          <div class="flex-center">
            <div class="userBadge flex-center" style="background-color: ${element.badgecolor}">${element.initials}</div>
            <span>${element.name}</span>
          </div>
          <img src="../img/check_button.svg" class="button checkContactButton" id="checkContactButton${i}" alt="check this contact">
          <img src="../img/checkButtonWhite.svg" class="button checkContactButton d-none" id="checkContactDoneButton${i}" alt="check this contact">
        </div>
      `;
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
  console.log(dropdownField);
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

function insertSubtaskHTML(subtask, i) {
  return `
      <li onmouseover="toggleEditSubtask(${i})" onmouseout="toggleEditSubtask(${i})">
        <div>
            <span>${subtask.name}</span>
            <div class="flex-center d-none" id="editSubtaskContainer${i}">
              <img src="../img/editIcon.svg" onclick="toggleEditSubtaskDetail(${i})" class="button" alt="edit subtask" title="edit subtask" />
              <div class="separatorSubtasks"></div>
              <img src="../img/deleteIcon.svg" onclick="removeSubtask(${i})" class="button" title="delete Subtask" alt="delete Subtask" />
            </div>
            <div id="editSubtaskDetailContainer${i}" class="d-none">
                    <input type="text" class="editSubtaskInput width100" onchange="confirmSubtaskEdit(${i})" value="${subtask.name}" id="editSubtaskInput${i}" />
                    <div class="flex-center editSubtaskButtonContainer">
                      <img src="../img/deleteIcon.svg" class="button" onclick="removeSubtask(${i})" title="delete Subtask" alt="delete Subtask" />
                      <div class="separatorSubtasks"></div>
                      <img
                        src="../img/checkDarkIcon.svg"
                        class="button"
                        onclick="confirmSubtaskEdit(${i})"
                        title="confirm edits for subtask"
                        alt="confirm edits for subtask"
                      />
                    </div>
                  </div>
        </div>
      </li>
    `;
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
  // incomplete! still need to add clean reset for dropdown input fields
  // Subtasks also missing
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
