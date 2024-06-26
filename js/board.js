let currentTimestamp;
let popupElement;

const prios = {
  low: "../img/prioLow.png",
  medium: "../img/prioMedium.png",
  high: "../img/prioUrgent.png",
};

let globalIndex = 0;
let j = 0;
let deleteHoverTimeout, editHoverTimeout;
let completedSubtask;
let allStati = [];
let editPopup = false;
let searchTask = tasks;

async function loadDataForBoard() {
  await loadTasksFromAPI();
  console.log(tasks);
  updateHTML();
}

async function init() {
  if (!checkUserLoginStatus()) {
    window.location.href = "./index.html";
  }
  await includeHTML();
  renderUserlogo();
}

function findPopupElement(timestamp) {
  popupElement = tasks.find((task) => task.timestamp === timestamp);
}

function updateHTML() {
  globalIndex = 0;
  updateStatusHTML("toDos", "toDo", "No task To do");
  updateStatusHTML("inProgress", "inProgress", "No In Progress");
  updateStatusHTML("awaitFeedback", "awaitFeedback", "No Await feedback");
  updateStatusHTML("done", "done", "No Done");
}

function updateStatusHTML(status, elementId, emptyMessage) {
  let filteredTasks = filterTasksByStatus(status);
  let container = document.getElementById(elementId);
  container.innerHTML = "";

  populateContainerWithTasks(container, filteredTasks);
  handleEmptyContainer(container, emptyMessage, status);
  allStati.push(status);
}

function filterTasksByStatus(status) {
  return tasks.filter((t) => t.status == status);
}

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

function setCardCategoryColor(element, index) {
  document.getElementById(`cardCategory${index}`).style.backgroundColor = element.category.color;
}

function handleEmptyContainer(container, emptyMessage, status) {
  if (container.innerHTML === "") {
    container.innerHTML = generateEmptyMessageHTML(emptyMessage);
  }
  container.innerHTML += generatePossibleToMoveHTML(status);
}



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

function startDragging(timestamp, index) {
  currentTimestamp = timestamp;
  document.getElementById(`card${index}`).classList.add("rotate3");
}

function moveTo(status) {
  const task = tasks.find((task) => task.timestamp === currentTimestamp);
  task.status = status;

  updateHTML();
}



function toggleDropdown(event, timestamp, index) {
  event.stopPropagation();
  const task = tasks.find((task) => task.timestamp === timestamp);
  hideDropdown(task.status, index);
  handleToDoDropdown(task.status, index);
  handleDoneDropdown(task.status, index);
  toggleDropdownContainer(event);
}

function hideDropdown(status, index) {
  document.getElementById(`dropdown${status}${index}`).classList.add("d-none");
}

function handleToDoDropdown(status, index) {
  if (status === "toDos") {
    document.getElementById(`dropdowninProgress${index}`).classList.add("dropdown-menuToDoHide");
  } else {
    document.getElementById(`dropdowninProgress${index}`).classList.remove("dropdown-menuToDoHide");
  }
}

function handleDoneDropdown(status, index) {
  if (status === "done") {
    document.getElementById(`dropdownawaitFeedback${index}`).classList.add("dropdown-menuDoneHide");
  } else {
    document.getElementById(`dropdownawaitFeedback${index}`).classList.remove("dropdown-menuDoneHide");
  }
}

function toggleDropdownContainer(event) {
  const dropdown = event.currentTarget.closest(".dropdown-container");
  dropdown.classList.toggle("active");
}

document.addEventListener("click", function () {
  const dropdowns = document.querySelectorAll(".dropdown-container");
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("active");
  });
});

async function mobileSetStatusTo(timestamp, status, event) {
  const task = tasks.find((task) => task.timestamp === timestamp);
  task.status = status;
  event.preventDefault();
  event.stopPropagation();
  await saveTasksToAPI();
  updateHTML();
}

function contactNames(element, index) {
  let contactNames = document.getElementById(`contactNames${index}`);
  contactNames.innerHTML = "";
  for (let i = 0; i < element.assigned.length; i++) {
    let assigned = element.assigned[i];
    j = j + i;
    contactNames.innerHTML += /*html*/ `<span class="initalsCircle" id="initalsCircleColor${j}">${assigned.initials}</span>`;
    document.getElementById(`initalsCircleColor${j}`).style.backgroundColor = assigned.badgecolor;
  }
  j = j + 1;
}

function boardPopup(timestamp) {
  findPopupElement(timestamp);
  showPopupElements();
  initializePopup();
  setupPopupContent(timestamp);
  handlePopupClick();
}

function showPopupElements() {
  document.getElementById("popup").classList.remove("d-none");
  document.getElementById("popupAddTask").classList.add("d-none");
  document.getElementById("backgroundPopup").classList.remove("d-none");
}

function initializePopup() {
  let popup = document.getElementById("popup");
  popup.innerHTML = "";
  popup.innerHTML = boardPopupHTML();
}

function setupPopupContent(timestamp) {
  subtasks(timestamp);
  popupPersons(popupElement);
  document.getElementById("categoryColor").style.backgroundColor = popupElement.category.color;
  showPopupWithAnimation();
}

function showPopupWithAnimation() {
  let popup = document.getElementById("popup");
  popup.classList.remove("hide");
  setTimeout(() => {
    popup.classList.add("show");
  }, 10);
}

function handlePopupClick() {
  let popup = document.getElementById("popup");
  popup.onclick = function (event) {
    event.stopPropagation();
  };
}



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

function renderAllSubtasks(container, timestamp) {
  for (let i = 0; i < popupElement.subtasks.subtaskList.length; i++) {
    let subtask = popupElement.subtasks.subtaskList[i];
    container.innerHTML += generateSubtaskHTML(subtask, i, timestamp);
  }
}

function generateSubtaskHTML(subtask, index, timestamp) {
  let singleSubtask = subtask.name;
  let subtaskOpenClass = subtask.completed ? "d-none" : "";
  let subtaskDoneClass = subtask.completed ? "" : "d-none";

  return /*html*/ `
    <div> 
      <img id="subtaskOpen${index}" onclick="subtaskDone(${index}, ${timestamp})" class="${subtaskOpenClass}" src="../img/check_button.svg" alt="">
      <img id="subtaskDone${index}" onclick="subtaskOpen(${index}, ${timestamp})" class="${subtaskDoneClass}" src="../img/check_button_done.svg" alt="">
      <span id="singleSubtask">${singleSubtask}</span> 
    </div>`;
}

function clearSubtasks() {
  document.getElementById("popupSubtask").innerHTML = "";
}

function subtaskDone(i, timestamp) {
  findPopupElement(timestamp);
  document.getElementById(`subtaskDone${i}`).classList.remove("d-none");
  document.getElementById(`subtaskOpen${i}`).classList.add("d-none");
  let completedSubtask = popupElement.subtasks.completed;
  completedSubtask = completedSubtask + 1;
  popupElement.subtasks.completed = completedSubtask;
  popupElement.subtasks.subtaskList[i].completed = true;
  updateHTML();
}

function subtaskOpen(i, timestamp) {
  findPopupElement(timestamp);
  document.getElementById(`subtaskDone${i}`).classList.add("d-none");
  document.getElementById(`subtaskOpen${i}`).classList.remove("d-none");
  let completedSubtask = popupElement.subtasks.completed;
  completedSubtask = completedSubtask - 1;
  popupElement.subtasks.completed = completedSubtask;
  popupElement.subtasks.subtaskList[i].completed = false;
  updateHTML();
}

// function closePopup() {
//   if (editPopup) {
//     editPopup = false;
//   }
//   let closeCross = document.getElementById("closeCross");
//   closeCross.classList.add("d-none");
//   closeCross.classList.remove("closeCross");
//   resetAddTask();
//   resetFormInputs();
//   let popup = document.getElementById("popup");
//   popup.classList.remove("show");
//   popup.classList.add("hide");
//   setTimeout(() => {
//     popup.classList.remove("hide");
//     document.getElementById("backgroundPopup").classList.add("d-none");
//   }, 125);
//   closeAddTask();
// }

// function closeAddTask() {
//   let addTaskButton = document.getElementById("addTaskButton");
//   addTaskButton.style.backgroundColor = "rgb(42,54,71)";
//   addTaskButton.classList.add("mainDarkBlue");
//   let popupAddTask = document.getElementById("popupAddTask");
//   popupAddTask.classList.remove("showAddTaskPopup");
//   popupAddTask.classList.add("hideAddTaskPopup");

//   setTimeout(() => {
//     popupAddTask.classList.add("d-none");
//     document.getElementById("backgroundPopup").classList.add("d-none");
//     document.getElementById("popup").classList.remove("d-none");
//   }, 125);
// }

function closePopup() {
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
  document.getElementById("popupAddTask").classList.add("d-none");
  document.getElementById("backgroundPopup").classList.add("d-none");
  let addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.style.backgroundColor = "rgb(42,54,71)";
  addTaskButton.classList.add("mainDarkBlue");
}

// function popupPersons(popupElement) {
//   let person = document.getElementById(`popupPerson`);
//   person.innerHTML = "";
//   for (let i = 0; i < popupElement.assigned.length; i++) {
//     let assigned = popupElement.assigned[i];
//     person.innerHTML += /*html*/ `
//     <div class="PopupInitialsandContacts">
//     <span class="initalsCircle" id="initalsCircleColorPopup${i}">${assigned.initials}
//     </span> <span>${assigned.name}</span>
//     </div>
//     `;
//     document.getElementById(`initalsCircleColorPopup${i}`).style.backgroundColor = assigned.badgecolor;
//   }
// }

function popupPersons(popupElement) {
  let person = document.getElementById("popupPerson");
  person.innerHTML = "";
  popupElement.assigned.forEach((assigned, i) => {
    person.innerHTML += generatePersonHTML(assigned, i);
    setPersonBadgeColor(assigned, i);
  });
}



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

function hoverPlusButton(number) {
  clearTimeout(deleteHoverTimeout);
  document.getElementById(`plusButtondark${number}`).classList.add("d-none");
  document.getElementById(`plusButtonblue${number}`).classList.remove("d-none");
}

function leavePlusButton(number) {
  deleteHoverTimeout = setTimeout(() => {
    document.getElementById(`plusButtondark${number}`).classList.remove("d-none");
    document.getElementById(`plusButtonblue${number}`).classList.add("d-none");
  }, 50);
}

function subtaskProgress(timestamp, index) {
  findPopupElement(timestamp);
  if (popupElement.subtasks.subtaskList.length != 0) {
    let progressPercentage = (popupElement.subtasks.completed / popupElement.subtasks.subtaskList.length) * 100;
    progressPercentage = progressPercentage + "%";
    document.getElementById(`subtasksBarProgress${index}`).style.width = progressPercentage;
  } else {
    document.getElementById(`cardSubtasks${index}`).classList.add("d-none");
  }
}

function deleteTask(timestamp) {
  document.getElementById("backgroundPopup").classList.add("d-none");
  const index = tasks.findIndex((task) => task.timestamp === timestamp);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
  updateHTML();
  saveTasks();
  saveTasksToAPI();
}

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
  loadTaskForEditing(timestamp);
}

// function openAddTask(status = "toDos") {
//   let closeCross = document.getElementById("closeCross");
//   closeCross.classList.add("closeCross2");
//   closeCross.classList.remove("d-none");
//   let addTaskButton = document.getElementById("addTaskButton");
//   addTaskButton.classList.remove("mainDarkBlue");
//   addTaskButton.style.backgroundColor = "rgb(41,171,226)";
//   addTaskButton.style.color = "white";
//   document.getElementById("backgroundPopup").classList.remove("d-none");
//   document.getElementById("popup").classList.add("d-none");
//   let popupAddTask = document.getElementById("popupAddTask");
//   popupAddTask.classList.remove("d-none");
//   popupAddTask.classList.remove("hideAddTaskPopup");
//   popupAddTask.offsetWidth;
//   setTimeout(() => {
//     popupAddTask.classList.add("showAddTaskPopup");
//   }, 10);
//   popupAddTask.onclick = function (event) {
//     event.stopPropagation();
//   };
//   setPrio("btn-medium");
//   document.getElementById("createTaskBtn").setAttribute("onclick", `addNewTask('${status}')`);
// }

function openAddTask(status = "toDos") {
  configureCloseCross();
  configureAddTaskButton();
  showBackgroundPopup();
  hideMainPopup();
  showAddTaskPopup();
  setPrio("btn-medium");
  setCreateTaskButtonOnClick(status);
}

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

function setPrio(className) {
  let addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.classList.add(className);
}

function setCreateTaskButtonOnClick(status) {
  let createTaskBtn = document.getElementById("createTaskBtn");
  createTaskBtn.setAttribute("onclick", `addNewTask('${status}')`);
}

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
  searchTask.forEach((task) => {
    if (!searchTerm) {
      matchingTasks.push(task);
    } else {
      if (task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm)) {
        matchingTasks.push(task);
      }
    }
  });
  console.log("Ergebnisse Match:", matchingTasks);
  tasks = matchingTasks;
  console.log("Ergebnisse Tasks:", tasks);
  updateHTML();
}
