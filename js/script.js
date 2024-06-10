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

let tasks = [
  {
    title: "First test title",
    timestamp: 1717999440032,
    assigned: ["Maria S."],
    description: "This will be a description",
    dueDate: "2024-06-12",
    prio: "medium",
    category: "Management",
    subtasks: ["Project structure"],
    status: "toDo",
  },
  {
    title: "Progressing Task",
    timestamp: 1717999440023,
    assigned: ["Anna M."],
    description: "Anna did not describe her task",
    dueDate: "2024-06-13",
    prio: "high",
    category: "Management",
    subtasks: ["Project structure"],
    status: "inProgress",
  },
  {
    title: "Await Feedback Task",
    timestamp: 1717999440040,
    assigned: ["Anna M.", "Peter B."],
    description: "No description needed",
    dueDate: "2024-06-15",
    prio: "low",
    category: "Management",
    subtasks: ["Project structure"],
    status: "awaitFeedback",
  },
  {
    title: "Done Task",
    timestamp: 1717999440100,
    assigned: ["Peter B."],
    description: "Create a kanban board",
    dueDate: "2024-06-15",
    prio: "low",
    category: "Scrum",
    subtasks: ["Start project"],
    status: "done",
  },
];

function getValueFromInput(inputId) {
  let container = document.getElementById(inputId);
  return container.value;
}

function parseTextInput(string) {
    return string.trim();
}

