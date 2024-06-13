let categories = [
  {
    name: "Management",
    color: "blue",
  },
  {
    name: "Coffebreak",
    color: "yellow",
  },
  {
    name: "Technical task",
    color: "grey",
  },
  { name: "Userstory", color: "pink" },
];

function init() {
  includeHTML();
  loadTasks();
}

function createNewTask() {
  let newTask = {
    title: parseTextInput(getValueFromInput("inputTitle")),
    timestamp: new Date().getTime(),
    // assigned: {
    //   name: getValueFromInput("inputAssigned"),
    // },
    assigned: [contacts[0]],
    description: parseTextInput(getValueFromInput("inputDescription")),
    dueDate: getValueFromInput("inputDueDate"),
    prio: getPrio(),
    category: categories[0],
    // subtasks: [parseTextInput(getValueFromInput("inputSubtasks"))],
    subtasks: [],
    status: "toDos",
  };
  return newTask;
}

function addNewTask() {
  let newTask = createNewTask();
  if (validateTask(newTask)) {
    tasks.push(newTask);
    saveTasks();
  }
  console.log("tasks is now", tasks);
}

function saveTasks() {
  let tasksAsText = JSON.stringify(tasks);
  localStorage.setItem("tasks", tasksAsText);
}

function validateTask(task) {
  return getValueFromInput("inputTitle") != "" && getValueFromInput("inputDueDate");
  // return true;
}

function setPrio(btnId) {
  prioButtons = document.getElementsByClassName("prioButton");
  selected = document.getElementById(btnId);
  for (button of prioButtons) {
    button.classList.remove("prioSelected");
    let imgSrc = `../img/${button.id.replace("btn", "prio")}.png`;
    button.lastElementChild.src = imgSrc;
  }
  selected.classList.add("prioSelected");
  selected.lastElementChild.src = selected.lastElementChild.src.replace(".png", "White.png");
}

function getPrio() {
  let prioButtons = document.getElementsByClassName("prioButton");
  let selection;
  for (button of prioButtons) {
    if (button.classList.contains("prioSelected")) {
      selection = button.id.replace("btn", "").toLowerCase();
      return selection;
    }
  }
}

function toggleDropdownMenu(menuId) {
  let arrowIcons = document.querySelectorAll(`#${menuId} .dropdownIcon`);
  let inputField = document.getElementById(menuId);
  let dropdown = document.getElementById(menuId).nextElementSibling;
  for (arrow of arrowIcons) {
    arrow.classList.toggle("d-none");
  }
  dropdown.classList.toggle("d-none");
  adjustZIndex(inputField);
  renderCategories();
}

function adjustZIndex(inputField) {
  if (inputField.style.zIndex == 20) {
    inputField.style.zIndex = 0;
  } else {
    inputField.style.zIndex = 20;
  }
}

function openDropdownMenu(menuId) {
  let arrowIcons = document.querySelectorAll(`#${menuId} .dropdownIcon`);
  for (arrow of arrowIcons) {
    arrow.classList.remove("d-none");
  }
}

function closeDropdownMenu(menuId) {
  let arrowIcons = document.querySelectorAll(`#${menuId} .dropdownIcon`);
  for (arrow of arrowIcons) {
    arrow.classList.add("d-none");
  }
}

function resetFormInputs() {
  let inputFields = document.getElementsByClassName("formInput");
  for (inputField of inputFields) {
    inputField.value = "";
  }
  setPrio("btnMedium");
}

function useAsEdit() {
  document.querySelector(".addTask h1").innerHTML = "Edit";
}

function openAddSubtask() {
  let addButton = document.getElementById("addSubtask");
  let editContainer = document.getElementById("editSubtasksContainer");
  let input = document.getElementById("inputSubtasks");
  addButton.classList.toggle("d-none");
  editContainer.classList.toggle("d-none");
  input.focus();
}

function closeAddSubtask() {
  let addButton = document.getElementById("addSubtask");
  let editContainer = document.getElementById("editSubtasksContainer");
  addButton.classList.toggle("d-none");
  editContainer.classList.toggle("d-none");
}

function renderCategories() {
  renderDropdown(categories, "dropdownCategories", "name");
}

function renderDropdown(array, containerId, arrayLevel) {
  let container = document.getElementById(containerId);
  container.innerHTML = "";
  for (element of array) {
    container.innerHTML += `
      <div class="dropdownCategoryElement dropdownElement">${element[arrayLevel]}</div>
    `;
  }
}
