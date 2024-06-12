function init() {
  loadTasks();
  insertCounterValues();
  updateWelcomeMessage();
}

function insertCounterValues() {
  document.getElementById("counterBoard").innerHTML = tasks.length;
  insertValue("counterUrgent", "prio", "urgent");
  insertValue("counterToDo", "status", "toDos");
  insertValue("counterDone", "status", "done");
  insertValue("counterProgress", "status", "inProgress");
  insertValue("counterFeedback", "status", "awaitFeedback");
}

function insertValue(containerId, property, selection) {
  let container = document.getElementById(containerId);
  let count = getCount(property, selection);
  container.innerHTML = count;
}

function getCount(property, selectedStatus) {
  let selected = tasks.filter((e) => {
    return e[property] == selectedStatus;
  });
  return selected.length;
}

function updateWelcomeMessage() {
  container = document.getElementById("welcomeMessage");
  currentTime = new Date().getHours();
  if (currentTime > 2 && currentTime < 12) {
    container.innerHTML = "Good morning,";
  } else if (currentTime >= 12 && currentTime < 16) {
    container.innerHTML = "Good day,";
  } else if (currentTime >= 16 && currentTime < 19) {
    container.innerHTML = "Good afternoon,";
  } else {
    container.innerHTML = "Good evening,";
  }
}

function changeSvgColor(iconId) {
  circle = document.querySelector(`#${iconId} circle`);
  path = document.querySelector(`#${iconId} path`);
  circle.style.fill = "white";
  path.style.fill = "#2a3647";
}

function normalSvgColor(iconId) {
  circle = document.querySelector(`#${iconId} circle`);
  path = document.querySelector(`#${iconId} path`);
  circle.style.fill = "#2a3647";
  path.style.fill = "white";
}

function changeDoneSvgColor(iconId) {
  circle = document.querySelector(`#${iconId} circle`);
  path = document.querySelector(`#${iconId} path`);
  circle.style.fill = "white";
  path.style.stroke = "#2a3647";
}

function normalDoneSvgColor(iconId) {
  circle = document.querySelector(`#${iconId} circle`);
  path = document.querySelector(`#${iconId} path`);
  circle.style.fill = "#2a3647";
  path.style.stroke = "white";
}