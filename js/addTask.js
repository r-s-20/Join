let assignedContacts = [];
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

let colors = ["blue", "orange", "red", "pink", "purple"];

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
    assigned: assignedContacts,
    description: parseTextInput(getValueFromInput("inputDescription")),
    dueDate: getValueFromInput("inputDueDate"),
    prio: getPrio(),
    category: getCategory(),
    subtasks: {
      subtaskList: [],
      completed: 0,
    },
    // subtasks: {
    //   subtaskList: [{ name: "Project structure", completed: false }],
    //   completed: 0,
    // },
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

function getCategory() {
  let selection = getValueFromInput("inputCategory");
  let categoryElement = categories.filter((e) => e.name == selection)[0];
  if (categoryElement) {
    return categoryElement;
  } else {
    console.error("not a valid category");
  }
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
  let inputField = document.getElementById(menuId);
  let dropdown = document.getElementById(menuId).nextElementSibling;
  toggleArrowIcons(menuId);
  dropdown.classList.toggle("d-none");
  adjustZIndex(inputField);
  renderCategories();
  renderContacts();
}

function toggleArrowIcons(menuId) {
  let arrowIcons = document.querySelectorAll(`#${menuId} .dropdownIcon`);
  for (arrow of arrowIcons) {
    arrow.classList.toggle("d-none");
  }
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
  assignedContacts = [];
  renderAssignedBadges();
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

function renderContacts() {
  renderDropdown(contacts, "dropdownAssigned", "name");
  updateCheckboxes();
}

function renderDropdown(array, containerId, arrayLevel) {
  let container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (array == categories) {
      container.innerHTML += `
        <div class="dropdownCategoryElement dropdownElement" onclick="setCategory('${element.name}')">${element[arrayLevel]}</div>
      `;
    } else if (array == contacts) {
      container.innerHTML += insertAssignedContactsHTML(element, i);
    }
  }
}

function insertAssignedContactsHTML(element, i) {
  return `
        <div class="dropdownAssignedElement dropdownElement flex-start">
          <div class="flex-center">
            <div class="userBadge flex-center" style="background-color: ${element.badgecolor}">${element.initials}</div>
            <span>${element.name}</span>
          </div>
          <img src="../img/check_button.svg" onclick="addAssignedContact(${i})" class="button checkContactButton" id="checkContactButton${i}" alt="check this contact">
          <img src="../img/check_button_done.svg" onclick="removeAssignedContact(${i})" class="button checkContactButton d-none" id="checkContactDoneButton${i}" alt="check this contact">
        </div>
      `;
}

function setCategory(category) {
  let container = document.getElementById("inputCategory");
  container.value = category;
  toggleDropdownMenu("inputCategoryContainer");
}

function checkAssigned(contact) {
  let container = document.getElementById("inputAssigned");
  container.value = contact;
}

function toggleCheckButtons(i) {
  let checkButton = document.getElementById(`checkContactButton${i}`);
  let checkDoneButton = document.getElementById(`checkContactDoneButton${i}`);
  checkButton.classList.toggle("d-none");
  checkDoneButton.classList.toggle("d-none");
}

function addAssignedContact(i) {
  let contact = contacts[i];
  toggleCheckButtons(i);
  assignedContacts.push(contact);
  renderAssignedBadges();
}

function removeAssignedContact(i) {
  let index = assignedContacts.indexOf(contacts[i]);
  toggleCheckButtons(i);
  assignedContacts.splice(index, 1);
  renderAssignedBadges();
}

function renderAssignedBadges() {
  let container = document.getElementById("assignedBadgesContainer");
  container.innerHTML = "";
  if (assignedContacts.length > 0) {
    for (contact of assignedContacts) {
      container.innerHTML += `
        <div class="userBadge flex-center" style="background-color:${contact.badgecolor};">${contact.initials}</div>
      `;
    }
  }
}

function updateCheckboxes() {
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (assignedContacts.includes(contact)) {
      toggleCheckButtons(i);
    }
  }
}
