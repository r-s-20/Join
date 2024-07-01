let currentTimestamp;
let popupElement;


const prios = {
  low: "./img/prioLow.png",
  medium: "./img/prioMedium.png",
  high: "./img/prioUrgent.png",
};

let globalIndex = 0;
let j = 0;
let deleteHoverTimeout, editHoverTimeout;
let completedSubtask;
let allStati = [];
let editPopup = false;
let searchTask = tasks;

/**
 * Loads data for the board by fetching tasks from the API
 * and updating the HTML.
 * @async
 * @function
 */
async function loadDataForBoard() {
  await loadTasksFromAPI();
  updateHTML();
}

/**
 * Initializes the application by checking user login status,
 * including HTML components, and rendering the user logo.
 * If the user is not logged in, redirects to the login page.
 * @async
 * @function
 */
async function init() {
  if (!checkUserLoginStatus()) {
    window.location.href = "./index.html";
  }
  await includeHTML();
  renderUserlogo();
}

/**
 * Finds and sets the popupElement by searching for a task
 * with the given timestamp.
 * @param {number} timestamp - The timestamp of the task to find.
 * @function
 */
function findPopupElement(timestamp) {
  popupElement = tasks.find((task) => task.timestamp === timestamp);
}

/**
 * Updates the HTML content by resetting the global index
 * and updating the task lists for each status category.
 * @function
 */
function updateHTML() {
  globalIndex = 0;
  updateStatusHTML("toDos", "toDo", "No task To do");
  updateStatusHTML("inProgress", "inProgress", "No In Progress");
  updateStatusHTML("awaitFeedback", "awaitFeedback", "No Await feedback");
  updateStatusHTML("done", "done", "No Done");
}

/**
 * Updates the HTML content for a specific task status by filtering tasks,
 * populating the container, and handling empty containers.
 * @param {string} status - The status of the tasks to update.
 * @param {string} elementId - The ID of the container element.
 * @param {string} emptyMessage - The message to display if no tasks are found.
 * @function
 */
function updateStatusHTML(status, elementId, emptyMessage) {
  let filteredTasks = filterTasksByStatus(status);
  let container = document.getElementById(elementId);
  container.innerHTML = "";

  populateContainerWithTasks(container, filteredTasks);
  handleEmptyContainer(container, emptyMessage, status);
  allStati.push(status);
  // tasks = searchTask;
}

/**
 * Filters tasks by their status.
 * @param {string} status - The status to filter tasks by.
 * @returns {Array} An array of tasks that match the given status.
 * @function
 */
function filterTasksByStatus(status) {
  return tasks.filter((t) => t.status == status);
}

/**
 * Populates a container element with tasks.
 * @param {HTMLElement} container - The container element to populate.
 * @param {Array} filteredTasks - An array of tasks to populate the container with.
 * @function
 */
function populateContainerWithTasks(container, filteredTasks) {
  for (let i = 0; i < filteredTasks.length; i++) {
    const element = filteredTasks[i];
    container.innerHTML += generateTodoHTML(element, globalIndex);
    truncateText(element.description, globalIndex);
    contactNames(element, globalIndex);
    subtaskProgress(element.timestamp, globalIndex);
    setCardCategoryColor(element, globalIndex);
    globalIndex++;
  }
}





/**
 * Sets the background color of a task card category.
 * @param {Object} element - The task element.
 * @param {number} index - The index of the task.
 * @function
 */
function setCardCategoryColor(element, index) {
  document.getElementById(`cardCategory${index}`).style.backgroundColor = element.category.color;
}

/**
 * Handles the empty container case by displaying an empty message
 * and adding a possible move indicator.
 * @param {HTMLElement} container - The container element to check.
 * @param {string} emptyMessage - The message to display if the container is empty.
 * @param {string} status - The status of the tasks.
 * @function
 */
function handleEmptyContainer(container, emptyMessage, status) {
  if (container.innerHTML === "") {
    container.innerHTML = generateEmptyMessageHTML(emptyMessage);
  }
  container.innerHTML += generatePossibleToMoveHTML(status);
}

/**
 * Allows an element to be dropped by preventing the default behavior and
 * toggling the visibility of elements based on the task status.
 * @param {string} status - The status of the task being dragged.
 * @param {Event} ev - The drag event.
 * @function
 */
function allowDrop(status, ev) {
  ev.preventDefault();

  allStati.forEach((currentStatus) => {
    if (status == currentStatus) {
      document.getElementById(`possbleToMove${currentStatus}`).classList.remove("d-none");
    } else {
      document.getElementById(`possbleToMove${currentStatus}`).classList.add("d-none");
    }
  });
}

/**
 * Starts the drag operation by setting the current timestamp and
 * adding a rotation effect to the dragged task card.
 * @param {number} timestamp - The timestamp of the task being dragged.
 * @param {number} index - The index of the task being dragged.
 * @function
 */
function startDragging(timestamp, index) {
  currentTimestamp = timestamp;
  document.getElementById(`card${index}`).classList.add("rotate3");
}

/**
 * Moves a task to a new status and updates the HTML content.
 * @param {string} status - The new status to move the task to.
 * @function
 */
async function moveTo(status) {
  const task = tasks.find((task) => task.timestamp === currentTimestamp);
  task.status = status;
  await saveTasksToAPI();
  updateHTML();
}

/**
 * Toggles the visibility of a dropdown menu for a task.
 * @param {Event} event - The event triggered by clicking the dropdown toggle.
 * @param {number} timestamp - The timestamp of the task associated with the dropdown.
 * @param {number} index - The index of the task in the task list.
 * @function
 */
function toggleDropdown(event, timestamp, index) {
  event.stopPropagation();
  const task = tasks.find((task) => task.timestamp === timestamp);
  hideDropdown(task.status, index);
  handleToDoDropdown(task.status, index);
  handleDoneDropdown(task.status, index);
  toggleDropdownContainer(event);
}

/**
 * Hides the dropdown menu for a specific task status and index.
 * @param {string} status - The status of the task.
 * @param {number} index - The index of the task in the task list.
 * @function
 */
function hideDropdown(status, index) {
  document.getElementById(`dropdown${status}${index}`).classList.add("d-none");
}

/**
 * Handles the visibility of the "toDos" dropdown menu based on the task status.
 * @param {string} status - The status of the task.
 * @param {number} index - The index of the task in the task list.
 * @function
 */
function handleToDoDropdown(status, index) {
  const dropdown = document.getElementById(`dropdowninProgress${index}`);
  if (status === "toDos") {
    dropdown.classList.add("dropdown-menuToDoHide");
  } else {
    dropdown.classList.remove("dropdown-menuToDoHide");
  }
}

/**
 * Handles the visibility of the "done" dropdown menu based on the task status.
 * @param {string} status - The status of the task.
 * @param {number} index - The index of the task in the task list.
 * @function
 */
function handleDoneDropdown(status, index) {
  const dropdown = document.getElementById(`dropdownawaitFeedback${index}`);
  if (status === "done") {
    dropdown.classList.add("dropdown-menuDoneHide");
  } else {
    dropdown.classList.remove("dropdown-menuDoneHide");
  }
}

/**
 * Toggles the "active" class on the dropdown container element.
 * @param {Event} event - The event triggered by clicking the dropdown toggle.
 * @function
 */
function toggleDropdownContainer(event) {
  const dropdown = event.currentTarget.closest(".dropdown-container");
  dropdown.classList.toggle("active");
}

/**
 * Event listener to close all dropdown menus when clicking outside.
 * @function
 */
document.addEventListener("click", function () {
  const dropdowns = document.querySelectorAll(".dropdown-container");
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("active");
  });
});

/**
 * Sets the status of a task on mobile and updates the UI.
 * @param {number} timestamp - The timestamp of the task.
 * @param {string} status - The new status to set for the task.
 * @param {Event} event - The event triggered by the status change.
 * @returns {Promise<void>} A promise that resolves when the task status is updated.
 * @function
 */
async function mobileSetStatusTo(timestamp, status, event) {
  const task = tasks.find((task) => task.timestamp === timestamp);
  task.status = status;
  event.preventDefault();
  event.stopPropagation();
  await saveTasksToAPI();
  updateHTML();
}

/**
 * Renders the contact names for a task and updates the UI with their badges.
 * @param {Object} element - The task element containing assigned contacts.
 * @param {number} index - The index of the task in the task list.
 * @function
 */
function contactNames(element, index) {

  let lengthAssigned;
  if(element.assigned.length <= 6){
    lengthAssigned = element.assigned.length;
  } else {
    lengthAssigned = 5
  }
  
  let contactNames = document.getElementById(`contactNames${index}`);
  contactNames.innerHTML = "";
  for (let i = 0; i < lengthAssigned; i++) {
    let assigned = element.assigned[i];
    j = j + i;
    contactNames.innerHTML += /*html*/ `<span class="initalsCircle" id="initalsCircleColor${j}">${assigned.initials}</span>`;
    document.getElementById(`initalsCircleColor${j}`).style.backgroundColor = assigned.badgecolor;
  }
  
  j = j + 1;

  if (element.assigned.length >= 6){
  
    let assignedMaxLength = element.assigned.length - 6 ;
    contactNames.innerHTML += /*html*/ `<span class="assignedMaxLength">+ ${assignedMaxLength}</span>
  `;
  }
}

/**
 * Displays the board popup with the details of a task.
 * @param {number} timestamp - The timestamp of the task to display.
 * @function
 */
function boardPopup(timestamp) {
  let outerContent = document.querySelector(".outerContent");
  outerContent.classList.add("popup-open");
  findPopupElement(timestamp);
  showPopupElements();
  initializePopup();
  setupPopupContent(timestamp);
  handlePopupClick();
}

/**
 * Shows the necessary popup elements.
 * @function
 */
function showPopupElements() {
  document.getElementById("popup").classList.remove("d-none");
  document.getElementById("popupAddTask").classList.add("d-none");
  document.getElementById("backgroundPopup").classList.remove("d-none");
}

/**
 * Initializes the popup content by setting up the HTML structure.
 * @function
 */
function initializePopup() {
  let popup = document.getElementById("popup");
  popup.innerHTML = "";
  popup.innerHTML = boardPopupHTML();
}

/**
 * Sets up the content of the popup including subtasks and persons.
 * @param {number} timestamp - The timestamp of the task to display.
 * @function
 */
function setupPopupContent(timestamp) {
  subtasks(timestamp);
  popupPersons(popupElement);
  document.getElementById("categoryColor").style.backgroundColor = popupElement.category.color;
  showPopupWithAnimation();
}

/**
 * Shows the popup with a fade-in animation.
 * @function
 */
function showPopupWithAnimation() {
  let popup = document.getElementById("popup");
  popup.classList.remove("hide");
  setTimeout(() => {
    popup.classList.add("show");
  }, 10);
}

/**
 * Handles the click event on the popup to prevent propagation.
 * @function
 */
function handlePopupClick() {
  let popup = document.getElementById("popup");
  popup.onclick = function (event) {
    event.stopPropagation();
  };
}

/**
 * Handles the rendering of subtasks in the popup.
 * @param {number} timestamp - The timestamp of the task.
 * @function
 */
function subtasks(timestamp) {
  let subtasksContainer = document.getElementById("popupSingleSubtask");
  subtasksContainer.innerHTML = "";
  completedSubtask = popupElement.subtasks.completed;

  if (popupElement.subtasks.subtaskList.length > 0) {
    renderAllSubtasks(subtasksContainer, timestamp);
  } else {
    clearSubtasks();
  }
}

/**
 * Renders all subtasks within the provided container.
 * @param {HTMLElement} container - The HTML container to render subtasks into.
 * @param {number} timestamp - The timestamp of the task.
 * @function
 */
function renderAllSubtasks(container, timestamp) {
  for (let i = 0; i < popupElement.subtasks.subtaskList.length; i++) {
    let subtask = popupElement.subtasks.subtaskList[i];
    container.innerHTML += generateSubtaskHTML(subtask, i, timestamp);
  }
}
