/**
 * @constant
 * @type {string}
 * @description The base URL for the Firebase database.
 */
const BASE_URL = "https://rs-testproject01-default-rtdb.europe-west1.firebasedatabase.app/";

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

/**
 * @type {Array<Object>}
 * @description List of user objects containing name, email, password, and initials.
 */
let users = [
  { name: "Anton Mayer", email: "anton@gmail.com", password: "123456", initials: "AM" },
  { name: "Eva Fischer", email: "fischer@gmail.com", password: "7890", initials: "EF" },
  { name: "Anja Schulz", email: "schulz@gmail.com", password: "7890", initials: "AS" },
  { name: "David Eisenberg", email: "eisenberg@gmail.com", password: "7890", initials: "DE" },
  { name: "Benedikt Ziegler", email: "ziegler@gmail.com", password: "7890", initials: "BZ" },
  { name: "Lisa Becker", email: "becker@gmail.com", password: "7890", initials: "LB" },
  { name: "Julia Wolf", email: "wolf@gmail.com", password: "7890", initials: "JW" },
  { name: "Christian Gross", email: "gross@gmail.com", password: "7890", initials: "CG" },
  { name: "Anna Weber", email: "weber@gmail.com", password: "7890", initials: "AW" },
  { name: "Stefan Hoffmann", email: "hoffmann@gmail.com", password: "7890", initials: "SH" },
];

/**
 * @type {Array<string>}
 * @description List of color hex codes.
 */
let colors = [
  "#FF7A00",
  "#FF5EB3",
  "#6E52FF",
  "#FF745E",
  "#00BEE8",
  "#9327FF",
  "#1FD7C1",
  "#FFA35E",
  "#FC71FF",
  "#FFC701",
  "#0038FF",
  "#FF4646",
  "#FFBB2B",
  "#462f8a",
];

/**
 * @type {Array<Object>}
 * @description List of contact objects containing name, email, initials, badge color, and phone number.
 */
let contacts = [
  {
    name: "Anton Mayer",
    email: "anton@gmail.com",
    initials: "AM",
    badgecolor: colors[0],
    phone: 4911134311,
  },
  {
    name: "Anja Schulz",
    email: "schulz@gmail.com",
    initials: "AS",
    badgecolor: colors[1],
    phone: 49123451111,
  },
  {
    name: "Eva Fischer",
    email: "fischer@gmail.com",
    initials: "EF",
    badgecolor: colors[2],
    phone: 49111119999,
  },
  {
    name: "David Eisenberg",
    email: "eisenberg@gmail.com",
    initials: "DE",
    badgecolor: colors[3],
    phone: 49555111111,
  },
  {
    name: "Benedikt Ziegler",
    email: "ziegler@gmail.com",
    initials: "BZ",
    badgecolor: colors[4],
    phone: 4914441111111,
  },
  {
    name: "Lisa Becker",
    email: "becker@gmail.com",
    initials: "LB",
    badgecolor: colors[5],
    phone: 491766789012,
  },
  {
    name: "Julia Wolf",
    email: "wolf@gmail.com",
    initials: "JW",
    badgecolor: colors[6],
    phone: 491777890123,
  },
  {
    name: "Christian Gross",
    email: "gross@gmail.com",
    initials: "CG",
    badgecolor: colors[7],
    phone: 491788901234,
  },
  {
    name: "Anna Weber",
    email: "weber@gmail.com",
    initials: "AW",
    badgecolor: colors[8],
    phone: 491799012345,
  },
  {
    name: "Stefan Hoffmann",
    email: "hoffmann@gmail.com",
    initials: "SH",
    badgecolor: colors[9],
    phone: 491700123456,
  },
];

/**
 * @type {Array<Object>}
 * @description List of category objects containing name and color.
 */
let categories = [
  {
    name: "Management",
    color: colors[0],
  },
  {
    name: "Marketing",
    color: colors[1],
  },
  {
    name: "Technical task",
    color: colors[2],
  },
  { 
    name: "Budget", 
    color: colors[3], 
  },
  { name: "Userstory", color: colors[3] },
];

/**
 * @type {Array<Object>}
 * @description List of task objects containing title, timestamp, assigned contacts, description, due date, priority, category, subtasks, and status.
 */
let tasks = [
  {
    title: "First test title",
    timestamp: 1717999440032,
    assigned: [contacts[0], contacts[1]],
    description: "This will be a description",
    dueDate: "2024-06-30",
    prio: "medium",
    category: categories[0],
    subtasks: {
      subtaskList: [{ name: "Project structure", completed: false }],
      completed: 0,
    },
    status: "toDos",
  },
  {
    title: "Progressing Task",
    timestamp: 1717999440023,
    assigned: [contacts[3]],
    description: "Anna did not describe her task",
    dueDate: "2024-07-13",
    prio: "high",
    category: categories[1],
    subtasks: {
      subtaskList: [
        { name: "Coffeebreak", completed: true },
        { name: "Coffeebreak", completed: false },
      ],
      completed: 1,
    },
    status: "inProgress",
  },
  {
    title: "Await Feedback Task",
    timestamp: 1717999440040,
    assigned: [contacts[3], contacts[2]],
    description: "No description needed",
    dueDate: "2024-07-05",
    prio: "low",
    category: categories[2],
    subtasks: {
      subtaskList: [{ name: "Project structure", completed: false }],
      completed: 0,
    },
    status: "awaitFeedback",
  },
  {
    title: "Done Task",
    timestamp: 1717999440100,
    assigned: [contacts[0]],
    description: "Create a kanban board",
    dueDate: "2024-06-29",
    prio: "low",
    category: categories[3],
    subtasks: {
      subtaskList: [
        { name: "Start project", completed: true },
        { name: "Scrum", completed: true },
      ],
      completed: 2,
    },
    status: "done",
  },
];

/**
 * @type {Array<Object>}
 * @description Demo contacts/ tasks / users for resetting demo content.
 */
let demoContacts = contacts;
let demoTasks = tasks;
let demoUsers = users;

/**
 * Resets the demo content to its initial state and saves it to the API.
 */
async function resetDemoContent() {
  contacts = demoContacts;
  await saveContactsToAPI();
  tasks = demoTasks;
  // await saveTasksToAPI();
  saveTasksToLocalStorage();
  users = demoUsers;
  await saveUsersToAPI();
}

async function resetDemo() {
  if (confirm("This will delete all new contents and reset users, contacts and tasks to demo content.\nAre you sure?")) {
    await resetDemoContent();
    logoutUser();
    window.location.href = "./index.html";
  }
}

/** Writes a given value into the value of an html-input-element
 * @param {string} value - value to write into the input element
 * @param {string} inputId - ID of the html-input-element/container
 */
function setValueToInput(value, inputId) {
  let container = document.getElementById(inputId);
  container.value = value;
}

/**
 * Retrieves the value from an HTML input element.
 * @param {string} inputId - The ID of the HTML input element/container.
 * @returns {string} The value of the input element.
 */
function getValueFromInput(inputId) {
  let container = document.getElementById(inputId);
  return container.value;
}

/**
 * Parses a string by trimming leading and trailing whitespace.
 * @param {string} string - The string to parse.
 * @returns {string} The trimmed string.
 */
function parseTextInput(string) {
  return string.trim();
}

/**
 * Sends a PUT request to the Firebase database with the given data.
 * @param {string} path - The path for the Firebase database.
 * @param {Object} data - The data to send.
 */
async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}

/**
 * Loads data from the Firebase database at the given path.
 * @param {string} path - The path for the Firebase database.
 * @returns {Promise<Object>} The response data from the fetch request.
 */
async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseJson = await response.json();
  return responseJson;
}

/** Saves the tasks to the Firebase database. */
async function saveTasksToAPI() {
  let tasksAsText = JSON.stringify(tasks);
  uploadStatus = await putData("/joinTasks", (data = { "tasks": tasksAsText }));
}

/** Saves the users to the Firebase database. */
async function saveUsersToAPI() {
  let usersAsText = JSON.stringify(users);
  uploadStatus = await putData("/joinUsers", (data = { "users": usersAsText }));
}

/** Saves the contacts to the Firebase database. */
async function saveContactsToAPI() {
  let contactsAsText = JSON.stringify(contacts);
  uploadStatus = await putData("/joinContacts", (data = { "contacts": contactsAsText }));
}

/** Loads tasks from the Firebase database. */
async function loadTasksFromAPI() {
  let tasksRaw = await loadData("joinTasks");
  let tasksAsString = tasksRaw.tasks;
  if (tasksAsString) {
    tasks = JSON.parse(tasksAsString);
  }
}

/** Loads users from the Firebase database. */
async function loadUsersFromAPI() {
  let usersRaw = await loadData("joinUsers");
  let arrayAsString = usersRaw.users;
  if (arrayAsString) {
    users = JSON.parse(arrayAsString);
  }
}

/** Loads contacts from the Firebase database.*/
async function loadContactsFromAPI() {
  let contactsRaw = await loadData("joinContacts");
  let arrayAsString = contactsRaw.contacts;
  if (arrayAsString) {
    contacts = JSON.parse(arrayAsString);
  }
}

/** Saves tasks to localStorage. */
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * Loads tasks from localStorage.
 */
function loadTasks() {
  let tasksAsString = localStorage.getItem("tasks");
  if (tasksAsString) {
    tasks = JSON.parse(tasksAsString);
  }
}

/** Loads contacts from localStorage.*/
function loadContacts() {
  let savedContacts = JSON.parse(localStorage.getItem("contacts"));
  if (savedContacts) {
    contacts = savedContacts;
  }
}

/** Saves the contacts to localStorage. */
function saveContactsToLocalStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

/** Toggles menu in header */
function toggleUserMenu() {
  popup = document.getElementById("header-popup-curtain");
  popup.classList.toggle("d-none");
}

function logoutUser() {
  sessionStorage.clear();
}

/** reders userlogo in header based on initials */
function renderUserlogo() {
  let userLogo = document.getElementById("userLogoHeader");
  let currentUser = sessionStorage.getItem("contact");
  currentUser = JSON.parse(currentUser);
  userLogo.innerHTML = "G";
  if (currentUser) {
    if (currentUser.initials) {
      userLogo.innerHTML = currentUser.initials;
    }
  }
}

/**
 * Checks if a user is logged in by verifying the presence of user data in session storage.
 */
function checkUserLoginStatus() {
  let userAsText = sessionStorage.getItem("contact");
  if (userAsText) {
    return true;
  } else {
    return false;
  }
}