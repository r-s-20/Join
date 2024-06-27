function editTask(timestamp) {
  removeErrors();
  let task = tasks.filter((e) => e.timestamp == timestamp)[0];
  editedTask = createNewTask(task.status);
  showCloseCross();
  if (validateTask(editedTask)) {
    editedTask.timestamp = timestamp;
    let taskIndex = tasks.indexOf(task);
    tasks.splice(taskIndex, 1, editedTask);
    saveTasksToAPI();
    boardPopup(timestamp);
    updateHTML();
  }
}

function showCloseCross() {
  let closeCross = document.getElementById("closeCross");
  closeCross.classList.add("d-none");
  closeCross.classList.remove("closeCross");
}

function hideCloseCross() {
  let closeCross = document.getElementById("closeCross");
  closeCross.classList.add("closeCross");
  closeCross.classList.remove("d-none");
}

function loadTaskForEditing(timestamp) {
  let task = tasks.filter((e) => e.timestamp == timestamp)[0];
  currentAssignedList = [];
  currentSubtasks = [];
  task.assigned.forEach((e) => currentAssignedList.push(e));
  task.subtasks.subtaskList.forEach((e) => currentSubtasks.push(e));
  document.querySelector("#editTaskPopup h1").innerHTML = "";
  insertValuesToEditTask(task);
  document.getElementById("inputCategory").parentElement.parentElement.classList.add("d-none");
  document.getElementById("clearTaskBtn").classList.add("d-none");
  document.getElementById("createTaskBtn").setAttribute("onclick", `editTask(${timestamp})`);
  document.getElementById("createTaskBtn").firstElementChild.innerHTML = "Ok";
  hideCloseCross();
}

function insertValuesToEditTask(task) {
  setValueToInput(task.title, "inputTitle");
  setValueToInput(task.description, "inputDescription");
  renderAssignedBadges();
  setValueToInput(task.dueDate, "inputDueDate");
  setPrio("btn-" + task.prio);
  addNewTask;
  setValueToInput(task.category.name, "inputCategory");
  renderSubtasks();
}
