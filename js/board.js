let currentTimestamp;
let popupElement;

const prios = {
  low: "../img/prioLow.png",
  medium: "../img/prioMedium.png",
  high: "../img/prioUrgent.png",
};

let globalIndex = 0;
let j = 0;

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
    contactNames(element, globalIndex);
    document.getElementById(`cardCategory${globalIndex}`).style.backgroundColor = element.category.color;
    globalIndex++;
  }

  if (container.innerHTML == "") {
    container.innerHTML = `<div class="noProgess">${emptyMessage}</div>`;
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function startDragging(timestamp) {
  currentTimestamp = timestamp;
}

function moveTo(status) {
  const task = tasks.find((task) => task.timestamp === currentTimestamp);
  task.status = status;
  updateHTML();
}

function generateTodoHTML(element, index) {
  return /*html*/ `
    <div draggable='true' ondragstart='startDragging(${element.timestamp})' class="card" onclick="boardPopup(${element.timestamp})">
      <div class="cardCategory" id="cardCategory${index}">${element.category.name}</div>
      <div class="cardHeadline">${element.title}</div>
      <div class="cardDescription">${element.description}</div>
      <div class="cardSubtasks">
        <div class="subtasksBar">
          <div class="subtasksBarProgress"></div>
      </div> 
        <span>1/${element.subtasks.length}</span>Subtasks
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
    document.getElementById(`initalsCircleColor${j}`).style.backgroundColor = assigned.bagdecolor;
  }
  j = j + 1;
}

function boardPopup(timestamp) {
  popupElement = tasks.find((task) => task.timestamp === timestamp);
  document.getElementById("backgroundPopup").classList.remove("d-none");
  let popup = document.getElementById("popup");
  popup.innerHTML = "";
  popup.innerHTML = boardPopupHTML();
  subtasks();
  popupPersons(popupElement);
  document.getElementById("categoryColor").style.backgroundColor = popupElement.category.color;
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
 <div class="popupDate">Due date: ${popupElement.dueDate} </div>
 <div class="popupPriority">Priority: ${popupElement.prio} <img src="${prios[popupElement.prio]}" alt=""></div>
 <div class="popupAssigned">
   <div>Assigned To:</div>
   <div class="popupPerson" id="popupPerson">
    </div>
   </div>
 <div class="popupSubtask">
   <span>Subtasks</span>
   <div class="popupSingleSubtask" id="popupSingleSubtask"></div>
 <div class="popupDeleteAndEdit">
  <div onmouseover="hoverDelete()" onmouseout="leaveDelete()">
    <img id="deleteBlack" src="../img/delete_black.svg" alt="">
    <img id="deleteBlue" src="../img/delete_blue.svg" alt="" class="d-none">
  </div>
<div class="line"></div>
  <div onmouseover="hoverEdit()" onmouseout="leaveEdit()">
    <img id="editBlack" src="../img/edit_black.svg" alt="">
    <img id="editBlue" src="../img/edit_blue.svg" alt="" class="d-none">
  </div>
 </div>
`;
}

function subtasks() {
  let subtasks = document.getElementById("popupSingleSubtask");
  subtasks.innerHTML = "";
  for (let i = 0; i < popupElement.subtasks.length; i++) {
    let singleSubtask = popupElement.subtasks[i];
    subtasks.innerHTML += /*html*/ `
    <div> 
      <img id="subtaskOpen${i}" onclick="subtaskDone(${i})" src="../img/check_button.svg" alt="">
      <img id="subtaskDone${i}" onclick="subtaskOpen(${i})" class="d-none" src="../img/check_button_done.svg" alt="">
      <span id="singleSubtask">${singleSubtask}</span> 
    </div>`;
  }
}

function subtaskDone(i) {
  document.getElementById(`subtaskDone${i}`).classList.remove("d-none");
  document.getElementById(`subtaskOpen${i}`).classList.add("d-none");
}

function subtaskOpen(i) {
  document.getElementById(`subtaskDone${i}`).classList.add("d-none");
  document.getElementById(`subtaskOpen${i}`).classList.remove("d-none");
}

function closePopup() {
  document.getElementById("backgroundPopup").classList.add("d-none");
  document.getElementById("popup").classList.remove("show");
}

function popupPersons(popupElement) {
  let person = document.getElementById(`popupPerson`);
  person.innerHTML = "";
  for (let i = 0; i < popupElement.assigned.length; i++) {
    let assigned = popupElement.assigned[i];
    person.innerHTML += /*html*/ `<img src="" alt=""> <span>${assigned.name}</span>`;
  }
}

let deleteHoverTimeout, editHoverTimeout;

function hoverDelete() {
  clearTimeout(deleteHoverTimeout);
  document.getElementById('deleteBlack').classList.add('d-none');
  document.getElementById('deleteBlue').classList.remove('d-none');
}

function leaveDelete() {
  deleteHoverTimeout = setTimeout(() => {
    document.getElementById('deleteBlack').classList.remove('d-none');
    document.getElementById('deleteBlue').classList.add('d-none');
  }, 50); // Verzögerung von 200ms
}

function hoverEdit() {
  clearTimeout(editHoverTimeout);
  document.getElementById('editBlack').classList.add('d-none');
  document.getElementById('editBlue').classList.remove('d-none');
}

function leaveEdit() {
  editHoverTimeout = setTimeout(() => {
    document.getElementById('editBlack').classList.remove('d-none');
    document.getElementById('editBlue').classList.add('d-none');
  }, 50); // Verzögerung von 200ms
}
