let currentTimestamp;
let popupElement;

const prios = {
  low: "../img/prioLow.png",
  medium: "../img/prioMedium.png",
  high: "../img/prioUrgent.png",
};

function updateHTML() {
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
    container.innerHTML += generateTodoHTML(element);
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

function generateTodoHTML(element) {
  return /*html*/ `
    <div draggable='true' ondragstart='startDragging(${element.timestamp})' class="card" onclick="boardPopup(${element.timestamp}, event)">
      <div class="cardCategory">${element.category.name}</div>
      <div class="cardHeadline">${element.title}</div>
      <div class="cardDescription">${element.description}</div>
      <div class="cardSubtasks">
        <div class="subtasksBar">
          <div class="subtasksBarProgress"></div>
      </div> 
        <span>1/${element.subtasks.length}</span>Subtasks
      </div>
        <div class="cardWorkers"><div>${element.assigned} </div><img src=${prios[element.prio]} alt=""></div>
    </div>
   `;
}

function boardPopup(timestamp, event) {
  popupElement = tasks.find((task) => task.timestamp === timestamp);
  document.getElementById("backgroundPopup").classList.remove("d-none");
  let popup = document.getElementById("popup");
  popup.innerHTML = "";
  popup.innerHTML = boardPopupHTML();
  subtasks();
  document.getElementById("popupCategory").style.backgroundColor = popupElement.category.color;
setTimeout(() => {
  popup.classList.add('show'); // Add the class to trigger the animation
}, 10); // Small delay to ensure the class addition triggers the animation
 popup.onclick = function (event) {
    event.stopPropagation();
  };
}

function boardPopupHTML(){
 return /*html*/ `
 <div class="popupCategory" id="popupCategory"> 
   <span>${popupElement.category.name}</span>
   <img src="../img/close.svg" alt="" onclick="closePopup()">
 </div>
 <div class="popupHeadline">${popupElement.title}</div>
 <div class="popupDescription">${popupElement.description}</div>
 <div class="popupDate">Due date: ${popupElement.dueDate} </div>
 <div class="popupPriority">Priority: ${popupElement.prio} <img src="${prios[popupElement.prio]}" alt=""></div>
 <div class="popupAssigned">
   <div>Assigned To:</div>
   <div class="popupPerson">
     <div></div><img src="" alt=""> <span>${popupElement.assigned}</span></div>
   </div>
 <div class="popupSubtask">
   <span>Subtasks</span>
   <div class="popupSingleSubtask" id="popupSingleSubtask"></div>
 <div class="popupDeleteAndEdit">
   <img src="../img/delete.png" alt=""> Delete <div class="line"></div> <img src="../img/edit.png" alt=""> Edit
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
