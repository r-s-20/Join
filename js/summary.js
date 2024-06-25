let greetingDone = false;

async function init() {
  renderWelcomeMessage();
  greetingScreen();
  await includeHTML();
  renderUserlogo();
  loadTasks();
  renderShortestDeadline();
  insertCounterValues();
}

function insertCounterValues() {
  document.getElementById("counterBoard").innerHTML = tasks.length;
  insertValue("counterUrgent", "prio", "high");
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

function renderWelcomeMessage() {
  renderGreeting();
  renderUsername();
}

function renderGreeting() {
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

function renderUsername() {
  let user = document.getElementById("welcomeName");
  let currentUser = sessionStorage.getItem("contact");
  user.innerHTML = "Guest";
  if (currentUser) {
    currentUser = JSON.parse(currentUser);
    if (currentUser.name)
    user.innerHTML = currentUser.name;
  }
}

function greetingScreen() {
  checkGreeting();
  if (!greetingDone) {
    let container = document.getElementsByClassName("rightColumn")[0];
    if (window.innerWidth <= 1080) {
      container.classList.add("popupGreeting");
      setInterval(() => {
        container.classList.remove("popupGreeting");
        // container.classList.add("d-none");
      }, 1200);
    }
    greetingDone = true;
    sessionStorage.setItem("greetingDone", "true");
  }
}

function checkGreeting() {
  greetingStored = sessionStorage.getItem("greetingDone");
  if (greetingStored) {
    greetingDone = greetingStored;
  }
}

function renderShortestDeadline() {
  let dateContainer = document.getElementById("urgentDate");
  let sortedTasks = tasks.sort((a, b) => {
    if (a.dueDate > b.dueDate) {
      return 1;
    } else {
      return -1;
    }
  });
  let recentDate = new Date(sortedTasks[0].dueDate);
  dateContainer.innerHTML = recentDate.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
  // dateContainer.innerHTML = recentDate.toLocaleString("de-DE", { month: "long", day: "numeric", year: "numeric" });
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
