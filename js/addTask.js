let contactDummies = [
  {
    firstName: "Maria",
    lastName: "Müller",
  },
  {
    firstName: "Peter",
    lastName: "Müller",
  },
  {
    firstName: "Anna",
    lastName: "Schneider",
  },
  {
    firstName: "Thomas",
    lastName: "Becher",
  },
  {
    firstName: "Christian",
    lastName: "König",
  },
];

let cateogryDummies = [
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
    assigned: getValueFromInput("inputAssigned"),
    description: parseTextInput(getValueFromInput("inputDescription")),
    dueDate: getValueFromInput("inputDueDate"),
    prio: getPrio(),
    category: {
      name: getValueFromInput("inputCategory"),
      color: "blue",
    },
    subtasks: parseTextInput(getValueFromInput("inputSubtasks")),
    status: "toDo",
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
  }
  selected.classList.add("prioSelected");
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
  for (arrow of arrowIcons) {
    arrow.classList.toggle("d-none");
  }
}

function createContactList() {}

function resetFormInputs() {
  let inputFields = document.getElementsByClassName("formInput");
  for (inputField of inputFields) {
    inputField.value = "";
  }
  setPrio("btnMedium");
}
