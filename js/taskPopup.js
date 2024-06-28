/** will select a task by provided timestamp and write values from
 * edit form into task properties. Edited task is saved to API.
 * @param {number} timestamp - timestamp property of a task
  */
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

/**If task form is used as popup in board, this adds a cross to close the popup */
function showCloseCross() {
  let closeCross = document.getElementById("closeCross");
  closeCross.classList.add("d-none");
  closeCross.classList.remove("closeCross");
}

/**If task form is used as popup in board, this removes the cross for closing */
function hideCloseCross() {
  let closeCross = document.getElementById("closeCross");
  closeCross.classList.add("closeCross");
  closeCross.classList.remove("d-none");
}

/** Selects a task for editing by provided timestamp of that task, 
 * prepares form for editing the task and inserts values into according fields
 * @param {number} timestamp - timestamp property of a task
 */
function loadTaskForEditing(timestamp) {
  let task = tasks.filter((e) => e.timestamp == timestamp)[0];
  resetAddTask();
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

/** inserts values from provided task into input fields for editing
 * @param {task object} task 
 */
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

/**Reset global arrays used to add and edit tasks, so popups are clean when opened */
function resetAddTask() {
  currentAssignedList = [];
  currentSubtasks = [];
  contactsSelected = [];
}