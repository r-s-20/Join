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
    assigned: "Maria S.",
    description: "This will be a description",
    dueDate: "2024-06-12",
    prio: "medium",
    category: "Management",
    subtasks: ["Project structure"],
  },
];

function getValueFromInput(inputId) {
  let container = document.getElementById(inputId);
  return container.value;
}

function parseTextInput(string) {
    return string.trim();
}

