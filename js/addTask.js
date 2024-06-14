let assignedContacts = [];
let currentSubtasks = [];
let categories = [
  {
    name: "Management",
    color: "blue",
  },
  {
    name: "Coffebreak",
    color: "yellow",
  },
  {
    name: "Technical task",
    color: "grey",
  },
  { name: "Userstory", color: "pink" },
];

// let colors = ["blue", "orange", "red", "pink", "purple"];

function init() {
  includeHTML();
  loadTasks();
}

function addNewTask() {
  let newTask = createNewTask();
  if (validateTask(newTask)) {
    tasks.push(newTask);
    saveTasks();
  }
  console.log("tasks is now", tasks);
}

function createNewTask() {
  let newTask = {
    title: parseTextInput(getValueFromInput("inputTitle")),
    timestamp: new Date().getTime(),
    // assigned: {
    //   name: getValueFromInput("inputAssigned"),
    // },
    assigned: assignedContacts,
    description: parseTextInput(getValueFromInput("inputDescription")),
    dueDate: getValueFromInput("inputDueDate"),
    prio: getPrio(),
    category: getCategory(),
    subtasks: {
      subtaskList: currentSubtasks,
      completed: 0,
    },
    // subtasks: {
    //   subtaskList: [{ name: "Project structure", completed: false }],
    //   completed: 0,
    // },
    status: "toDos",
  };
  return newTask;
}

function saveTasks() {
  let tasksAsText = JSON.stringify(tasks);
  localStorage.setItem("tasks", tasksAsText);
}

function validateTask(task) {
  // incomplete, more checks needed for date input etc
  return getValueFromInput("inputTitle") != "" && getValueFromInput("inputDueDate");
}

function getCategory() {
  let selection = getValueFromInput("inputCategory");
  let categoryElement = categories.filter((e) => e.name == selection)[0];
  if (categoryElement) {
    return categoryElement;
  } else {
    console.error("not a valid category");
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
    let imgSrc = `../img/${button.id.replace("btn", "prio")}.png`;
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
  let prioButtons = document.getElementsByClassName("prioButton");
  let selection;
  for (button of prioButtons) {
    if (button.classList.contains("prioSelected")) {
      selection = button.id.replace("btn", "").toLowerCase();
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
  renderDropdown(categories, "dropdownCategories");
  renderDropdown(contacts, "dropdownAssigned");
  updateAssignedCheckboxes();
  dropdown.classList.toggle("d-none");
  adjustZIndex(inputField);
  toggleArrowIcons(menuId);
}

function toggleArrowIcons(menuId) {
  let arrowIcons = document.querySelectorAll(`#${menuId} .dropdownIcon`);
  for (arrow of arrowIcons) {
    arrow.classList.toggle("d-none");
  }
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

/** renders dropdown menus for either category or assigned contacts in add task form
 * @param {json-array} array - categories or contacts array
 * @param {string} containerId - ID of the div into which the dropdown content should be rendered
 */
function renderDropdown(array, containerId) {
  let container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (array == categories) {
      container.innerHTML += insertCategoryHTML(element);
    } else if (array == contacts) {
      container.innerHTML += insertAssignedContactsHTML(element, i);
    }
  }
}

function insertCategoryHTML(element) {
  return `
        <div class="dropdownCategoryElement dropdownElement" onclick="setCategory('${element.name}')">${element.name}</div>
      `;
}

function insertAssignedContactsHTML(element, i) {
  return `
        <div class="dropdownAssignedElement dropdownElement flex-start" onclick="toggleAssignedContact(${i})">
          <div class="flex-center">
            <div class="userBadge flex-center" style="background-color: ${element.badgecolor}">${element.initials}</div>
            <span>${element.name}</span>
          </div>
          <img src="../img/check_button.svg" class="button checkContactButton" id="checkContactButton${i}" alt="check this contact">
          <img src="../img/check_button_done.svg" class="button checkContactButton d-none" id="checkContactDoneButton${i}" alt="check this contact">
        </div>
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

/** Toggles between check- and check-done-icons for a row in assigned contacts dropdown-menu
 * @param {integer} i - index of row
 */
function toggleCheckButtons(i) {
  let checkButton = document.getElementById(`checkContactButton${i}`);
  let checkDoneButton = document.getElementById(`checkContactDoneButton${i}`);
  checkButton.classList.toggle("d-none");
  checkDoneButton.classList.toggle("d-none");
}

/** Adds or removes a contact to/from list of assigned contacts
 * in row "i" of the "assgined to" dropdown menu.
 *
 * Also toggles the check icon in that row and updates badges below menu.
 * @param {integer} i - row index
 */
function toggleAssignedContact(i) {
  let contact = contacts[i];
  if (assignedContacts.includes(contact)) {
    let index = assignedContacts.indexOf(contact);
    assignedContacts.splice(index, 1);
  } else {
    assignedContacts.push(contact);
  }
  toggleCheckButtons(i);
  renderAssignedBadges();
}

/** Renders userbadges of assigned contacts as circles below the "assigned to" dropdown menu
 * using badgecolor and initials of each contact
 */
function renderAssignedBadges() {
  let container = document.getElementById("assignedBadgesContainer");
  container.innerHTML = "";
  if (assignedContacts.length > 0) {
    for (contact of assignedContacts) {
      container.innerHTML += `
        <div class="userBadge flex-center" style="background-color:${contact.badgecolor};">${contact.initials}</div>
      `;
    }
  }
}

/**sets checkbox-icon to "check-done" in rows of dropdown-menu for all contacts
 * that are already assigned
 */
function updateAssignedCheckboxes() {
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (assignedContacts.includes(contact)) {
      toggleCheckButtons(i);
    }
  }
}

function openAddSubtask() {
  let addButton = document.getElementById("addSubtask");
  let editContainer = document.getElementById("editSubtasksContainer");
  let input = document.getElementById("inputSubtasks");
  addButton.classList.add("d-none");
  editContainer.classList.remove("d-none");
  input.focus();
}

function closeAddSubtask() {
  let addButton = document.getElementById("addSubtask");
  let editContainer = document.getElementById("editSubtasksContainer");
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
              <img src="../img/editIcon.svg" class="button" alt="edit subtask" title="edit subtask" />
              <div class="separatorSubtasks"></div>
              <img src="../img/deleteIcon.svg" onclick="removeSubtask(${i})" class="button" title="delete Subtask" alt="delete Subtask" />
            </div>
        </div>
      </li>
    `;
}

function toggleEditSubtask(i) {
  let editContainer = document.getElementById(`editSubtaskContainer${i}`);
  editContainer.classList.toggle("d-none");
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
  assignedContacts = [];
  renderAssignedBadges();
  setPrio("btnMedium");
}

function editTask() {
  document.querySelector(".addTask h1").innerHTML = "Edit";
  // WIP: insert values for selected task, change buttons
}
