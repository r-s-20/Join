let greetingDone = false;

async function init() {
  if (!checkUserLoginStatus()) {
    window.location.href = "./index.html";
  }
  renderWelcomeMessage();
  greetingScreen();
  await includeHTML();
  renderUserlogo();
  // await loadTasksFromAPI();
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

/**
 * Inserts a specific count value into a specified container element.
 * @param {string} containerId - The ID of the container element.
 * @param {string} property - The property by which to filter tasks (e.g., "prio", "status").
 * @param {string} selection - The value of the property to match for counting.
 */
function insertValue(containerId, property, selection) {
  let container = document.getElementById(containerId);
  let count = getCount(property, selection);
  container.innerHTML = count;
}

/**
 * Counts the number of tasks that match a specific property and value.
 * @param {string} property - The property by which to filter tasks (e.g., "prio", "status").
 * @param {string} selectedStatus - The value of the property to match for counting.
 * @returns {number} - The count of tasks that match the given property and value.
 */
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
  let container = document.getElementById("welcomeMessage");
  let currentTime = new Date().getHours();
  
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
    if (currentUser.name) user.innerHTML = currentUser.name;
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
}

/**
 * Changes the color of an SVG icon identified by its ID to indicate an active state.
 * @param {string} iconId - The ID of the SVG icon element.
 */
function changeSvgColor(iconId) {
  let circle = document.querySelector(`#${iconId} circle`);
  let path = document.querySelector(`#${iconId} path`);
  circle.style.fill = "white";
  path.style.fill = "#2a3647";
}

/**
 * Restores the normal color of an SVG icon identified by its ID after being changed.
 * @param {string} iconId - The ID of the SVG icon element.
 */
function normalSvgColor(iconId) {
  let circle = document.querySelector(`#${iconId} circle`);
  let path = document.querySelector(`#${iconId} path`);
  circle.style.fill = "#2a3647";
  path.style.fill = "white";
}

/**
 * Changes the color of an SVG icon used to indicate a completed state.
 * @param {string} iconId - The ID of the SVG icon element.
 */
function changeDoneSvgColor(iconId) {
  let circle = document.querySelector(`#${iconId} circle`);
  let path = document.querySelector(`#${iconId} path`);
  circle.style.fill = "white";
  path.style.stroke = "#2a3647";
}

/**
 * Restores the normal color of a completed SVG icon identified by its ID.
 * @param {string} iconId - The ID of the SVG icon element.
 */
function normalDoneSvgColor(iconId) {
  let circle = document.querySelector(`#${iconId} circle`);
  let path = document.querySelector(`#${iconId} path`);
  circle.style.fill = "#2a3647";
  path.style.stroke = "white";
}

