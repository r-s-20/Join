let currentTimestamp;

function updateHTML() {
  let open = tasks.filter((t) => t.status == "toDos");
  let toDo = document.getElementById("toDo");
  toDo.innerHTML = "";
  for (let i = 0; i < open.length; i++) {
    const element = open[i];
    toDo.innerHTML += generateTodoHTML(element, i);
  }

  if (toDo.innerHTML == "") {
    toDo.innerHTML = `<div class="noProgess" >No task To do</div>`;
  }

  let inProgress = tasks.filter((t) => t.status == "inProgress");
  let progress = document.getElementById("inProgress");
  progress.innerHTML = "";
  for (let i = 0; i < inProgress.length; i++) {
    const element = inProgress[i];
    progress.innerHTML += generateTodoHTML(element);
  }
  if (progress.innerHTML == "") {
    progress.innerHTML = /*html*/ `<div class="noProgess">No In Progress</div>`;
  }

  let awaitFeedback = tasks.filter((t) => t.status == "awaitFeedback");
  let feedback = document.getElementById("awaitFeedback");
  feedback.innerHTML = "";
  for (let i = 0; i < awaitFeedback.length; i++) {
    const element = awaitFeedback[i];
    feedback.innerHTML += generateTodoHTML(element);
  }
  if (feedback.innerHTML == "") {
    feedback.innerHTML = /*html*/ `<div class="noProgess">No Await feedback</div>`;
  }

  let dones = tasks.filter((t) => t.status == "done");
  let done = document.getElementById("done");
  done.innerHTML = "";
  for (let i = 0; i < dones.length; i++) {
    const element = dones[i];
    done.innerHTML += generateTodoHTML(element);
  }
  if (done.innerHTML == "") {
    done.innerHTML = /*html*/ `<div class="noProgess">No Done</div>`;
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

const prios = {
  low: "../img/prioLow.png",
  medium: "../img/prioMedium.png",
  high: "../img/prioUrgent.png",
};

let popupElement;

function generateTodoHTML(element) {
    popupElement = element;
  return /*html*/ `
    <div draggable='true' ondragstart='startDragging(${element.timestamp})' class="card" onclick="boardPopup()">
                   <div class="cardCategory">${element.category.name}</div>
                   <div class="cardHeadline">${element.title}</div>
                   <div class="cardDescription">${element.description}</div>
                   <div class="cardSubtasks">
                       <div class="subtasksBar">
                           <div class="subtasksBarProgress"></div>
                       </div> <span>1/${element.subtasks.length}</span>Subtasks
                   </div>
                   <div class="cardWorkers"><div>${element.assigned} </div><img src=${prios[element.prio]} alt=""></div>
                

               </div>
   `;
}

function boardPopup() {
  document.getElementById("backgroundPopup").classList.remove("d-none");
  document.getElementById("popup").innerHTML = /*html*/ `
         <div class="popupCategory"> 
            <span>${popupElement.category.name}</span>
            <div></div>
        </div>
        <div class="popupHeadline">${popupElement.title}</div>
        <div class="popupDescription">${popupElement.description}</div>
        <div class="popupDate">Due date: ${popupElement.dueDate} </div>
        <div class="popupPriority">Priority: Medium <img src="${prios[popupElement.prio]}" alt=""></div>
        <div class="popupAssigned">
            <div>Assigend To:</div>
            <div class="popupPerson">
                <div></div><img src="" alt=""> <span>${popupElement.assigned}</span></div>
            </div>
        <div class="popupSubtask">
            <span>Subtasks</span>
            <div class="popupSingleSubtask">
            <div><img src="" alt="">${popupElement.subtasks}</div>
    
            </div>
        </div>
        <div class="popupDeleteAndEdit">
                <img src="../img/delete.png" alt=""> Delete | <img src="../img/edit.png" alt=""> Edit
        </div>
    `;
}
