/**
 * Generates the HTML for a single subtask.
 * @param {Object} subtask - The subtask object containing its details.
 * @param {number} index - The index of the subtask in the list.
 * @param {number} timestamp - The timestamp of the task.
 * @returns {string} - The HTML string for the subtask.
 * @function
 */
function generateSubtaskHTML(subtask, index, timestamp) {
  let singleSubtask = subtask.name;
  let subtaskOpenClass = subtask.completed ? "d-none" : "";
  let subtaskDoneClass = subtask.completed ? "" : "d-none";

  return /*html*/ `
      <div> 
        <img id="subtaskOpen${index}" onclick="subtaskDone(${index}, ${timestamp})" class="${subtaskOpenClass}" src="./img/check_button.svg" alt="">
        <img id="subtaskDone${index}" onclick="subtaskOpen(${index}, ${timestamp})" class="${subtaskDoneClass}" src="./img/check_button_done.svg" alt="">
        <span id="singleSubtask">${singleSubtask}</span> 
      </div>`;
}

/**
 * Clears the subtasks container if no subtasks are present.
 * @function
 */
function clearSubtasks() {
  document.getElementById("popupSubtask").innerHTML = "";
}

/**
 * Marks a subtask as done and updates the corresponding HTML.
 * @param {number} i - The index of the subtask.
 * @param {number} timestamp - The timestamp of the task.
 * @function
 */
async function subtaskDone(i, timestamp) {
  findPopupElement(timestamp);
  document.getElementById(`subtaskDone${i}`).classList.remove("d-none");
  document.getElementById(`subtaskOpen${i}`).classList.add("d-none");
  let completedSubtask = popupElement.subtasks.completed;
  completedSubtask += 1;
  popupElement.subtasks.completed = completedSubtask;
  popupElement.subtasks.subtaskList[i].completed = true;
  await saveTasksToAPI();
  updateHTML();

}

/**
 * Marks a subtask as open and updates the corresponding HTML.
 * @param {number} i - The index of the subtask.
 * @param {number} timestamp - The timestamp of the task.
 * @function
 */
async function subtaskOpen(i, timestamp) {
  findPopupElement(timestamp);
  document.getElementById(`subtaskDone${i}`).classList.add("d-none");
  document.getElementById(`subtaskOpen${i}`).classList.remove("d-none");
  let completedSubtask = popupElement.subtasks.completed;
  completedSubtask -= 1;
  popupElement.subtasks.completed = completedSubtask;
  popupElement.subtasks.subtaskList[i].completed = false;
  await saveTasksToAPI();
  updateHTML();
}

function closePopup() {
  let body = document.querySelector("body");
  body.classList.remove("popup-open");
  handleEditPopup();
  hideCloseCross();
  resetAddTask();
  resetFormInputs();
  animatePopupClose();
  closeAddTask();
}

function handleEditPopup() {
  if (editPopup) {
    editPopup = false;
  }
}

function hideCloseCross() {
  let closeCross = document.getElementById("closeCross");
  closeCross.classList.add("d-none");
  closeCross.classList.remove("closeCross");
}

function animatePopupClose() {
  let popup = document.getElementById("popup");
  popup.classList.remove("show");
  popup.classList.add("hide");

  setTimeout(() => {
    popup.classList.remove("hide");
    document.getElementById("backgroundPopup").classList.add("d-none");
  }, 125);
}

function closeAddTask() {
  styleAddTaskButton();
  hideAddTaskPopup();
}

function styleAddTaskButton() {
  let addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.style.backgroundColor = "rgb(42,54,71)";
  addTaskButton.classList.add("mainDarkBlue");
}

function hideAddTaskPopup() {
  let popupAddTask = document.getElementById("popupAddTask");
  popupAddTask.classList.remove("showAddTaskPopup");
  popupAddTask.classList.add("hideAddTaskPopup");

  setTimeout(() => {
    popupAddTask.classList.add("d-none");
    document.getElementById("backgroundPopup").classList.add("d-none");
    document.getElementById("popup").classList.remove("d-none");
  }, 125);
}

function closeAddTaskAboutButton() {
  let closeCross = document.getElementById("closeCross");
  closeCross.classList.add("d-none");
  closeCross.classList.remove("closeCross");

  let popupAddTask = document.getElementById("popupAddTask");
  popupAddTask.classList.add("d-none");

  let backgroundPopup = document.getElementById("backgroundPopup");
  backgroundPopup.classList.add("d-none");

  let addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.style.backgroundColor = "rgb(42,54,71)";
  addTaskButton.classList.add("mainDarkBlue");
}

/**
 * Renders assigned persons to the popup element.
 * Clears existing content and appends HTML generated for each assigned person.
 * Sets badge colors for each person based on assigned data.
 *
 * @param {Object} popupElement The popup element containing assigned persons.
 */
function popupPersons(popupElement) {
  let person = document.getElementById("popupPerson");
  person.innerHTML = "";
  popupElement.assigned.forEach((assigned, i) => {
    person.innerHTML += generatePersonHTML(assigned, i);
    setPersonBadgeColor(assigned, i);
  });
}

/**
 * Sets the badge color for a person element based on assigned data.
 *
 * @param {Object} assigned The assigned person object.
 * @param {number} index The index of the person element.
 */
function setPersonBadgeColor(assigned, index) {
  document.getElementById(`initalsCircleColorPopup${index}`).style.backgroundColor = assigned.badgecolor;
}

function hoverDelete() {
  clearTimeout(deleteHoverTimeout);
  document.getElementById("deleteBlack").classList.add("d-none");
  document.getElementById("deleteBlue").classList.remove("d-none");
}

function leaveDelete() {
  deleteHoverTimeout = setTimeout(() => {
    document.getElementById("deleteBlack").classList.remove("d-none");
    document.getElementById("deleteBlue").classList.add("d-none");
  }, 50);
}

function hoverEdit() {
  clearTimeout(editHoverTimeout);
  document.getElementById("editBlack").classList.add("d-none");
  document.getElementById("editBlue").classList.remove("d-none");
}

function leaveEdit() {
  editHoverTimeout = setTimeout(() => {
    document.getElementById("editBlack").classList.remove("d-none");
    document.getElementById("editBlue").classList.add("d-none");
  }, 50);
}

/**
 * Handles hover event for the plus button with a specified number.
 * Shows the blue plus button and hides the dark plus button.
 *
 * @param {number} number The number identifying the plus button.
 */
function hoverPlusButton(number) {
  clearTimeout(deleteHoverTimeout);
  document.getElementById(`plusButtondark${number}`).classList.add("d-none");
  document.getElementById(`plusButtonblue${number}`).classList.remove("d-none");
}

/**
 * Handles leave event for the plus button with a specified number.
 * Shows the dark plus button after a short delay and hides the blue plus button.
 *
 * @param {number} number The number identifying the plus button.
 */
function leavePlusButton(number) {
  deleteHoverTimeout = setTimeout(() => {
    document.getElementById(`plusButtondark${number}`).classList.remove("d-none");
    document.getElementById(`plusButtonblue${number}`).classList.add("d-none");
  }, 50);
}

/**
 * Updates the progress bar for subtasks based on completion status.
 * If there are subtasks, calculates the completion percentage and updates the progress bar width.
 * If there are no subtasks, hides the subtasks section.
 *
 * @param {number} timestamp The timestamp of the task to update.
 * @param {number} index The index of the task to update.
 */
function subtaskProgress(timestamp, index) {
  findPopupElement(timestamp);
  if (popupElement.subtasks.subtaskList.length !== 0) {
    let progressPercentage = (popupElement.subtasks.completed / popupElement.subtasks.subtaskList.length) * 100;
    progressPercentage = progressPercentage + "%";
    document.getElementById(`subtasksBarProgress${index}`).style.width = progressPercentage;
  } else {
    document.getElementById(`cardSubtasks${index}`).classList.add("d-none");
  }
}

/**
 * Deletes a task from the tasks array and updates the UI.
 * Also saves the updated tasks to local storage and the API.
 *
 * @param {number} timestamp The timestamp of the task to delete.
 */
async function deleteTask(timestamp) {
  let body = document.querySelector("body");
  body.classList.remove("popup-open");
  document.getElementById("backgroundPopup").classList.add("d-none");
  const index = tasks.findIndex((task) => task.timestamp === timestamp);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
  updateHTML();
  await saveTasksToAPI();
}

/**
 * Sets up the popup for editing a task.
 * Loads the HTML for the edit task popup, initializes it, and loads the task data for editing.
 *
 * @param {number} timestamp The timestamp of the task to edit.
 */
async function editPopupTask(timestamp) {
  let closeCross = document.getElementById("closeCross");
  closeCross.classList.remove("d-none");
  closeCross.classList.add("closeCross");
  let popupEdit = document.getElementById("popup");
  editPopup = true;
  popupEdit.innerHTML = "";
  popupEdit.innerHTML = /*html*/ `
      <div w3-include-html="./templates/addTaskInclude.html" class="editPopupContainer" id="editTaskPopup"></div>
    `;
  await includeHTML();
  renderUserlogo();
  loadTaskForEditing(timestamp);
}

/**
 * Opens the "Add Task" popup with the specified status.
 * Configures various elements and styles to show the popup correctly.
 *
 * @param {string} [status="toDos"] The status of the task to be added.
 */
function openAddTask(status = "toDos") {
  let body = document.querySelector("body");
  body.classList.add("popup-open");

  configureAddTaskButton();
  showBackgroundPopup();
  hideMainPopup();
  showAddTaskPopup();
  setPrio("btn-medium");
  setCreateTaskButtonOnClick(status);
  // insertCloseCross();
  configureCloseCross();
}

// function insertCloseCross() {
//   // Erstelle ein neues div-Element für das Schließen-Symbol
//   let closeDiv = document.createElement('div');
//   closeDiv.id = 'closeCross';

//   // Erstelle das Bild-Element für das Schließen-Symbol
//   let img = document.createElement('img');
//   img.src = './img/close.svg';
//   img.alt = '';
//   img.onclick = closePopup; // Füge die Funktion closePopup als Klick-Event hinzu

//   // Füge das Bild-Element zum div hinzu
//   closeDiv.appendChild(img);

//   // Finde das übergeordnete div mit der Klasse innerContent flex-col width100
//   let innerContentDiv = document.querySelector('.innerContent.flex-col.width100');

//   // Füge das erstellte div mit dem Schließen-Symbol direkt ein
//   if (innerContentDiv) {
//     innerContentDiv.insertBefore(closeDiv, innerContentDiv.firstChild);
//   }
//   configureCloseCross()
// }

function configureCloseCross() {
  let closeCross = document.getElementById("closeCross");
  closeCross.classList.add("closeCross2");
  closeCross.classList.remove("d-none");
}

function configureAddTaskButton() {
  let addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.classList.remove("mainDarkBlue");
  addTaskButton.style.backgroundColor = "rgb(41,171,226)";
  addTaskButton.style.color = "white";
}

function showBackgroundPopup() {
  let backgroundPopup = document.getElementById("backgroundPopup");
  backgroundPopup.classList.remove("d-none");
}

function hideMainPopup() {
  let popup = document.getElementById("popup");
  popup.classList.add("d-none");
}

function showAddTaskPopup() {
  let popupAddTask = document.getElementById("popupAddTask");
  popupAddTask.classList.remove("d-none");
  popupAddTask.classList.remove("hideAddTaskPopup");
  popupAddTask.offsetWidth; // Force reflow to ensure CSS transitions work
  setTimeout(() => {
    popupAddTask.classList.add("showAddTaskPopup");
  }, 10);
  popupAddTask.onclick = function (event) {
    event.stopPropagation();
  };
}

/**
 * Sets a CSS class on the "Add Task" button.
 *
 * @param {string} className The class name to be added to the button.
 */
function setPrio(className) {
  let addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.classList.add(className);
}

/**
 * Sets the onclick event handler for the create task button in the "Add Task" popup.
 * Executes the addNewTask function with the specified status parameter when clicked.
 *
 * @param {string} status The status of the task to be added when the button is clicked.
 */
function setCreateTaskButtonOnClick(status) {
  let createTaskBtn = document.getElementById("createTaskBtn");
  createTaskBtn.setAttribute("onclick", `addNewTask('${status}')`);
}

/**
 * Truncates the given description text if it exceeds the maximum length,
 * and updates the corresponding card's description element.
 *
 * @param {string} description The original description text to truncate.
 * @param {number} index The index of the card where the description is displayed.
 */
function truncateText(description, index) {
  let maxLength = 48;
  let cardDescription = document.getElementById(`cardDescription${index}`);

  if (description.length <= maxLength) {
    cardDescription.innerHTML = description;
  } else {
    description = description.slice(0, maxLength);
    let lastSpaceIndex = description.lastIndexOf(" ");

    if (lastSpaceIndex === -1) {
      description = description + "...";
      cardDescription.innerHTML = description;
    } else {
      description = description.slice(0, lastSpaceIndex) + "...";
      cardDescription.innerHTML = description;
    }
  }
}

function searchAndDisplay() {
  let searchTerm = document.getElementById("searchInput").value.toLowerCase();
  let matchingTasks = [];

  // Filter tasks based on search term
  tasks.forEach((task) => {
    if (!searchTerm) {
      matchingTasks.push(task);
    } else {
      if (task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm)) {
        matchingTasks.push(task);
      }
    }
  });

  tasks = matchingTasks; // Update tasks array with filtered tasks
  updateHTML(); // Update HTML to reflect filtered tasks
}
