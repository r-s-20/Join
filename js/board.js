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
loadTasks();

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
  let filteredTasks = tasks.filter((t) => t.status == status);
  let container = document.getElementById(elementId);
  container.innerHTML = "";
  for (let i = 0; i < filteredTasks.length; i++) {
    const element = filteredTasks[i];
    container.innerHTML += generateTodoHTML(element, globalIndex);
    truncateText(element.description, globalIndex);
    contactNames(element, globalIndex);
    subtaskProgress(element.timestamp, globalIndex);
    document.getElementById(`cardCategory${globalIndex}`).style.backgroundColor = element.category.color;
    globalIndex++;
  }

  if (container.innerHTML == "") {
    container.innerHTML = /*html*/ `<div class="noProgess">${emptyMessage}</div>`;
    container.innerHTML += /*html*/ `<div class="possbleToMove d-none" id="possbleToMove${status}"></div>`;
  } else {
    container.innerHTML += /*html*/ `<div class="possbleToMove d-none" id="possbleToMove${status}"></div>`;
  }
  allStati.push(status);
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
  saveTasks();
}

function generateTodoHTML(element, index) {
  return /*html*/ `
    <div draggable='true' ondragstart='startDragging(${
      element.timestamp
    }, ${index})' class="card" id="card${index}" onclick="boardPopup(${element.timestamp})">
      <div class="cardCategory" id="cardCategory${index}">${element.category.name}</div>
      <div class="cardHeadline">${element.title}</div>
      <div class="cardDescription" id="cardDescription${index}"></div>
      <div class="cardSubtasks" id="cardSubtasks${index}">
        <div class="subtasksBar">
          <div class="subtasksBarProgress" id="subtasksBarProgress${index}"></div>
      </div > 
        <span id="subtasksCompleted">${element.subtasks.completed}/${element.subtasks.subtaskList.length}</span>Subtasks
      </div>
        <div class="cardWorkers"><div id="contactNames${index}"></div><img src=${prios[element.prio]} alt=""></div>
    </div>
   `;
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
  document.getElementById("popup").classList.remove("d-none");
  document.getElementById("popupAddTask").classList.add("d-none");
  document.getElementById("backgroundPopup").classList.remove("d-none");
  let popup = document.getElementById("popup");
  popup.innerHTML = "";
  popup.innerHTML = boardPopupHTML();
  subtasks(timestamp);
  popupPersons(popupElement);
  document.getElementById("categoryColor").style.backgroundColor = popupElement.category.color;
  popup.classList.remove("hide");
  setTimeout(() => {
    popup.classList.add("show");
  }, 10);
  popup.onclick = function (event) {
    event.stopPropagation();
  };
}

function boardPopupHTML() {
  return /*html*/ `
 <div class="popupCategory" id="popupCategory"> 
   <span id="categoryColor">${popupElement.category.name}</span>
   <img src="../img/close.svg" alt="" onclick="closePopup()">
 </div>
 <div class="popupHeadline">${popupElement.title}</div>
 <div class="popupDescription">${popupElement.description}</div>
 <div class="popupDate"><span>Due date:</span> ${popupElement.dueDate} </div>
 <div class="popupPriority"><span>Priority:</span> ${popupElement.prio} <img src="${
    prios[popupElement.prio]
  }" alt=""></div>
 <div class="popupAssigned">
   <div>Assigned To:</div>
   <div class="popupPerson" id="popupPerson">
    </div>
   </div>
 <div class="popupSubtask" id="popupSubtask"> 
   <span>Subtasks</span>
   <div class="popupSingleSubtask" id="popupSingleSubtask"></div>
   </div>
 <div class="popupDeleteAndEdit">
  <div onmouseover="hoverDelete()" onmouseout="leaveDelete()">
    <img id="deleteBlack" src="../img/delete_black.svg" alt="">
    <img id="deleteBlue" src="../img/delete_blue.svg" alt="" class="d-none" onclick="deleteTask(${
      popupElement.timestamp
    })">
  </div>
<div class="line"></div>
  <div onmouseover="hoverEdit()" onmouseout="leaveEdit()">
    <img id="editBlack" src="../img/edit_black.svg" alt="">
    <img id="editBlue" src="../img/edit_blue.svg" alt="" class="d-none" onclick="editPopupTask(${
      popupElement.timestamp
    })">
  </div>
 </div>
`;
}

function subtasks(timestamp) {
  let subtasks = document.getElementById("popupSingleSubtask");
  subtasks.innerHTML = "";
  completedSubtask = popupElement.subtasks.completed;
  if (popupElement.subtasks.subtaskList.length > 0) {
    for (let i = 0; i < popupElement.subtasks.subtaskList.length; i++) {
      let singleSubtask = popupElement.subtasks.subtaskList[i].name;
      if (!popupElement.subtasks.subtaskList[i].completed) {
        subtasks.innerHTML += /*html*/ `
      <div> 
        <img id="subtaskOpen${i}" onclick="subtaskDone(${i}, ${timestamp})" src="../img/check_button.svg" alt="">
        <img id="subtaskDone${i}" onclick="subtaskOpen(${i}, ${timestamp})" class="d-none" src="../img/check_button_done.svg" alt="">
        <span id="singleSubtask">${singleSubtask}</span> 
      </div>`;
      } else {
        subtasks.innerHTML += /*html*/ `
      <div> 
        <img id="subtaskOpen${i}" onclick="subtaskDone(${i}, ${timestamp})" class="d-none" src="../img/check_button.svg" alt="">
        <img id="subtaskDone${i}" onclick="subtaskOpen(${i}, ${timestamp})"  src="../img/check_button_done.svg" alt="">
        <span id="singleSubtask">${singleSubtask}</span> 
      </div>`;
      }
    }
  } else {
    document.getElementById("popupSubtask").innerHTML = "";
  }
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

function closePopup() {
  if (editPopup) {
    document.getElementById("editTaskPopup").innerHTML = "";
    editPopup = false;
  }
  resetAddTask();
  let popup = document.getElementById("popup");
  popup.classList.remove("show");
  popup.classList.add("hide");
  setTimeout(() => {
    popup.classList.remove("hide");
    document.getElementById("backgroundPopup").classList.add("d-none");
  }, 125);
  closeAddTask();
}

function closeAddTask() {
  let addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.style.backgroundColor = "rgb(42,54,71)";
  addTaskButton.classList.add("mainDarkBlue");
  let popupAddTask = document.getElementById("popupAddTask");
  popupAddTask.classList.remove("showAddTaskPopup");
  popupAddTask.classList.add("hideAddTaskPopup");

  setTimeout(() => {
    popupAddTask.classList.add("d-none");
    document.getElementById("backgroundPopup").classList.add("d-none");
    document.getElementById("popup").classList.remove("d-none");
  }, 125);
}

function popupPersons(popupElement) {
  let person = document.getElementById(`popupPerson`);
  person.innerHTML = "";
  for (let i = 0; i < popupElement.assigned.length; i++) {
    let assigned = popupElement.assigned[i];
    person.innerHTML += /*html*/ `
    <div class="PopupInitialsandContacts">
    <span class="initalsCircle" id="initalsCircleColorPopup${i}">${assigned.initials} 
    </span> <span>${assigned.name}</span>
    </div>
    `;
    document.getElementById(`initalsCircleColorPopup${i}`).style.backgroundColor = assigned.badgecolor;
  }
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
}

async function editPopupTask(timestamp) {
  let popupEdit = document.getElementById("popup");
  editPopup = true;
  popupEdit.innerHTML = "";
  popupEdit.innerHTML = /*html*/ `
    <div w3-include-html="./templates/addTaskInclude.html" class="editPopupContainer" id="editTaskPopup"></div>
  `;
  await includeHTML();
  loadTaskForEditing(timestamp);
}

function openAddTask(status = "toDos") {
  let addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.classList.remove("mainDarkBlue");
  addTaskButton.style.backgroundColor = "rgb(41,171,226)";
  addTaskButton.style.color = "white";
  document.getElementById("backgroundPopup").classList.remove("d-none");
  document.getElementById("popup").classList.add("d-none");
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
  setPrio("btn-medium");
  document.getElementById("createTaskBtn").setAttribute("onclick", `addNewTask('${status}')`);
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
