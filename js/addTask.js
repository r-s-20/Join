let currentAssignedList = [];
let currentSubtasks = [];
let contactsSelected = [];

/** Initial actions when body is loaded. Redirects user to login-page if nobody is
 * logged in, otherwise renders the task form and loads tasks and contacts stored on API.*/
async function init() {
  if (!checkUserLoginStatus()) {
    window.location.href = "./index.html";
  }
  await includeHTML();
  renderUserlogo();
  disablePastCalendarDates();
  // await loadTasksFromAPI();
  loadTasks();
  await loadContactsFromAPI();
}

/**Disables all past dates (before today) in calendar input html element */
function disablePastCalendarDates() {
  let inputDate = document.getElementById("inputDueDate");
  let dtToday = new Date();
  let dtTodayISO = dtToday.toISOString().split("T")[0];
  inputDate.setAttribute("min", dtTodayISO);
}

/** Adds a new task from task form to the tasks-array
 * if validation is successful for required input fields */
async function addNewTask(status) {
  let newTask = createNewTask(status);
  removeErrors();
  if (validateTask(newTask)) {
    tasks.push(newTask);
    // await saveTasksToAPI();
    saveTasksToLocalStorage();
    await showConfirmationMessage();
    resetFormInputs();
    resetAddTask();
    setTimeout(closeAddingTask, 1500);
    resetScrollOnBoard();
  }
}

/** If task was created in addTask.html, this will refer to created task on board.html.
 * If task was created using the popup in board.html, this updates the board before closing.
 */
function closeAddingTask() {
  if (window.location.href.endsWith("addTask.html")) {
    window.location.href = "./board.html";
  } else if (window.location.href.endsWith("board.html")) {
    updateHTML();
    closeAddTaskAboutButton();
  }
}

/**Reads values from add task form into a task object and returns that task
 * @param {string} taskStatus - options are: "toDos", "inProgress", "awaitFeedback"
 */
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

/** Shows a confirmation message after a new task is saved. Has a slide-in-effect.*/
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
    popup.classList.add("d-none");
  }, 2000);
}

/** Validates that title, dueDate and category have correct inputs and
 * renders error messages for input fields with missing or wrong inputs.
 */
function validateTask(task) {
  if (getValueFromInput("inputTitle") != "" && getValueFromInput("inputDueDate") && task.category) {
    return true;
  } else {
    renderErrorMessages(task);
    return false;
  }
}

function checkValidation() {
  let newTask = createNewTask("toDos");
  removeErrors();
  validateTask(newTask);
}

/** Checks if the input values of category, title and dueDate are valid and renders
 * an error if validation fails.
 * @param {json object} task  - task that was created from according input fields
 * */
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

/** Applies error-css (red border) to an input html element with title.
 * Also renders an error message below the input html element.*/
function renderError(inputId) {
  input = document.getElementById(inputId);
  input.classList.add("errorDesign");
  input.parentElement.innerHTML += insertErrorMessageHTML();
}

/**Removes all error colors and error messages */
function removeErrors() {
  removeErrorColors();
  removeErrorMessages();
}

/** Removes error-design (red border) from all elements */
function removeErrorColors() {
  inputs = document.getElementsByClassName("errorDesign");
  for (let i = inputs.length - 1; i >= 0; i--) {
    inputs[i].classList.remove("errorDesign");
  }
}

/**Removes all error-message html-elements */
function removeErrorMessages() {
  messages = document.getElementsByClassName("errorMessage");
  for (let i = messages.length - 1; i >= 0; i--) {
    messages[i].remove();
  }
}

/**reads selected category from form input field and stores according
 * category json from categories
 */
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
    let imgSrc = `./img/${button.id.replace("btn-", "prio-")}.png`;
    button.lastElementChild.src = imgSrc;
  }
  selected.classList.add("prioSelected");
  selected.lastElementChild.src = selected.lastElementChild.src.replace(".png", "White.png");
}

/**Checks which priority button is currently checked
 * and returns the priority (high, medium or low) as a string.
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

/**Searches for contacts that include letters written in the input field for assigned contacts */
function searchContacts() {
  contactsSelected = [];
  let input = getValueFromInput("inputAssigned");
  input = input.toLowerCase();
  contactsSelected = contacts.filter((e) => e.name.toLowerCase().includes(input));
  renderAssignedDropdown("dropdownAssigned", contactsSelected);
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

/** Renders userbadges of assigned contacts as circles below the "assigned to" dropdown menu
 * using badgecolor and initials of each contact
 */
function renderAssignedBadges() {
  let container = document.getElementById("assignedBadgesContainer");
  container.innerHTML = "";
  if (currentAssignedList.length > 0) {
    if (currentAssignedList.length <= 6) {
      for (contact of currentAssignedList) {
        container.innerHTML += insertAssignedBadgeHTML(contact);
      }
    } else {
      for (let i = 0; i < 5; i++) {
        const contact = currentAssignedList[i];
        container.innerHTML += insertAssignedBadgeHTML(contact);
      }
      renderCountBadge(container);
    }
  }
}

function renderCountBadge(container) {
  let namesList = "";
  let diff = currentAssignedList.length - 5;
  for (let i = 5; i < currentAssignedList.length - 1; i++) {
    const contact = currentAssignedList[i];
    namesList += contact.name + ", ";
  }
  namesList += currentAssignedList[currentAssignedList.length - 1].name;
  container.innerHTML += insertCountBadgeHTML(diff, namesList);
}

/**Replaces the add-icon in subtask input field with x- and check-icons */
function openAddSubtask() {
  let addButton = document.getElementById("addSubtask");
  let editContainer = document.getElementById("editSubtaskButtons");
  let input = document.getElementById("inputSubtasks");
  addButton.classList.add("d-none");
  editContainer.classList.remove("d-none");
  input.focus();
}

/** Replaces x- und check-icons in subtask input field with a plus-icon */
function closeAddSubtask() {
  let addButton = document.getElementById("addSubtask");
  let editContainer = document.getElementById("editSubtaskButtons");
  document.getElementById("inputSubtasks").value = "";
  addButton.classList.remove("d-none");
  editContainer.classList.add("d-none");
}

/** Adds a new subtask to currentSubtasks-array, renders updated subtasks
 * and resets the subtask input field.
 */
function addNewSubtask() {
  let newSubtask = getValueFromInput("inputSubtasks");
  currentSubtasks.push({
    name: `${newSubtask}`,
    completed: false,
  });
  renderSubtasks();
  closeAddSubtask();
}

/**Renders all subtasks from global currentSubtasks-array into the 'subtaskList' html-container */
function renderSubtasks() {
  let container = document.getElementById("subtaskList");
  container.innerHTML = "";
  for (let i = 0; i < currentSubtasks.length; i++) {
    const subtask = currentSubtasks[i];
    container.innerHTML += insertSubtaskHTML(subtask, i);
  }
}

/**Toggles between showing and hiding edit-icons for rendered subtasks in subtask-list */
function toggleEditSubtask(i) {
  let editContainer = document.getElementById(`editSubtaskContainer${i}`);
  editContainer.classList.toggle("d-none");
}

/**Toggles between showing a subtask in editable line vs. as non-editable
 * list element in subtask list */
function toggleEditSubtaskDetail(i) {
  document.getElementById(`editSubtaskDetailContainer${i}`).classList.toggle("d-none");
  document.getElementById(`editSubtaskInput${i}`).focus();
}

/**Edits a subtask in currentSubtasks-array and renders the updated currentSubtasks. */
function confirmSubtaskEdit(i) {
  result = getValueFromInput(`editSubtaskInput${i}`);
  currentSubtasks[i].name = result;
  renderSubtasks();
}

/** Removes a subtask from currentSubtasks-array */
function removeSubtask(i) {
  currentSubtasks.splice(i, 1);
  renderSubtasks();
}

/**Resets all input fields of the Add Task-form to default entries
 * and empties arrays for assigned contacts and subtasks
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

/** Toggles the icon color for "clear"-Button in Add-Task-Form */
function toggleIconColor() {
  let icon = document.querySelector("#clearTaskBtn img");
  src = icon.src;
  if (src.endsWith("close_darkblue.svg")) {
    icon.src = "./img/close_blue.svg";
  } else {
    icon.src = "./img/close_darkblue.svg";
  }
}

/**A new subtask is added from inputSubtask-html-field
 * on pressing enter while that field is active */
document.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    if (
      document.activeElement == document.getElementById("inputSubtasks") &&
      getValueFromInput("inputSubtasks") !== ""
    ) {
      addNewSubtask();
    }
  }
});
