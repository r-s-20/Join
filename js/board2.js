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

//Closes the popup, handles related UI changes, and resets the form inputs.
function closePopup() {
  let outerContent = document.querySelector(".outerContent");
  outerContent.classList.remove("popup-open");
  handleEditPopup();
  hideCloseCross();
  resetAddTask();
  resetFormInputs();
  animatePopupClose();
  closeAddTask();
}

//Resets the edit popup flag if it's set to true.
function handleEditPopup() {
  if (editPopup) {
    editPopup = false;
  }
}

//Hides the close cross element.
function hideCloseCross() {
  let closeCross = document.getElementById("closeCross");
  closeCross.classList.add("d-none");
  closeCross.classList.remove("closeCross");
}

// Animates the popup closing and hides the background after the animation.
function animatePopupClose() {
  let popup = document.getElementById("popup");
  popup.classList.remove("show");
  popup.classList.add("hide");

  setTimeout(() => {
    popup.classList.remove("hide");
    document.getElementById("backgroundPopup").classList.add("d-none");
  }, 125);
}

//Closes the "Add Task" popup and styles the "Add Task" button.
function closeAddTask() {
  styleAddTaskButton();
  hideAddTaskPopup();
}

//Styles the "Add Task" button by changing its background color and adding a class.
function styleAddTaskButton() {
  let addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.style.backgroundColor = "rgb(42,54,71)";
  addTaskButton.classList.add("mainDarkBlue");
}

//Hides the "Add Task" popup with an animation and updates the visibility of related elements.
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

//Closes the "Add Task" popup and hides the close button.
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

/**
 * Handles the hover event for the delete button.
 * Clears any existing timeout and changes the delete button icon to blue.
 */
function hoverDelete() {
  clearTimeout(deleteHoverTimeout);
  document.getElementById("deleteBlack").classList.add("d-none");
  document.getElementById("deleteBlue").classList.remove("d-none");
}

/**
 * Handles the mouse leave event for the delete button.
 * Sets a timeout to revert the delete button icon to black after a short delay.
 */
function leaveDelete() {
  deleteHoverTimeout = setTimeout(() => {
    document.getElementById("deleteBlack").classList.remove("d-none");
    document.getElementById("deleteBlue").classList.add("d-none");
  }, 50);
}

/**
 * Handles the hover event for the edit button.
 * Clears any existing timeout and changes the edit button icon to blue.
 */
function hoverEdit() {
  clearTimeout(editHoverTimeout);
  document.getElementById("editBlack").classList.add("d-none");
  document.getElementById("editBlue").classList.remove("d-none");
}

/**
 * Handles the mouse leave event for the edit button.
 * Sets a timeout to revert the edit button icon to black after a short delay.
 */
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
  let outerContent = document.querySelector(".outerContent");
  outerContent.classList.remove("popup-open");
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
  let outerContent = document.querySelector(".outerContent");
  outerContent.classList.add("popup-open");

  configureAddTaskButton();
  showBackgroundPopup();
  hideMainPopup();
  showAddTaskPopup();
  setPrio("btn-medium");
  setCreateTaskButtonOnClick(status);
  configureCloseCross();
}

/**
 * Configures the close cross element.
 * Adds the "closeCross2" class and removes the "d-none" class to make it visible.
 */
function configureCloseCross() {
  let closeCross = document.getElementById("closeCross");
  closeCross.classList.add("closeCross2");
  closeCross.classList.remove("d-none");
}

/**
 * Configures the add task button.
 * Changes its background color to a specific blue and text color to white.
 * Removes the "mainDarkBlue" class.
 */
function configureAddTaskButton() {
  let addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.classList.remove("mainDarkBlue");
  addTaskButton.style.backgroundColor = "rgb(41,171,226)";
  addTaskButton.style.color = "white";
}

//Shows the background popup by removing the "d-none" class.
function showBackgroundPopup() {
  let backgroundPopup = document.getElementById("backgroundPopup");
  backgroundPopup.classList.remove("d-none");
}

//Hides the main popup by adding the "d-none" class.
function hideMainPopup() {
  let popup = document.getElementById("popup");
  popup.classList.add("d-none");
}

/**
 * Shows the add task popup.
 * Removes the "d-none" and "hideAddTaskPopup" classes, and then adds the "showAddTaskPopup" class after a short delay.
 * Stops event propagation when the popup is clicked.
 * */
function showAddTaskPopup() {
  let popupAddTask = document.getElementById("popupAddTask");
  popupAddTask.classList.remove("d-none");
  popupAddTask.classList.remove("hideAddTaskPopup");
  popupAddTask.offsetWidth;
  setTimeout(() => {
    popupAddTask.classList.add("showAddTaskPopup");
  }, 10);
  popupAddTask.onclick = function (event) {
    event.stopPropagation();
  };
}

/**
 * Sets a CSS class on the "Add Task" button.
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

/**
 * Filters and displays tasks based on the search term input.
 * If no search term is provided, all tasks are displayed.
 * If a search term is provided, only tasks whose title or description includes the search term are displayed.
 * Updates the tasks array and calls updateHTML to reflect the filtered tasks.
 */
function searchAndDisplay() {
  tasks = searchTask;
  let searchTerm = document.getElementById("searchInput").value.toLowerCase();
  let matchingTasks = [];
  tasks.forEach((task) => {
    if (!searchTerm) {
      matchingTasks.push(task);
    } else {
      if (task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm)) {
        matchingTasks.push(task);
      }
    }
  });
  tasks = matchingTasks;
  updateHTML();
}
