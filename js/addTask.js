function createNewTask() {
  let newTask = {
    title: parseTextInput(getValueFromInput("inputTitle")),
    timestamp: new Date().getTime(),
    assigned: getValueFromInput("inputAssigned"),
    description: parseTextInput(getValueFromInput("inputDescription")),
    dueDate: getValueFromInput("inputDueDate"),
    prio: getPrio(),
    category: getValueFromInput("inputCategory"),
    subtasks: parseTextInput(getValueFromInput("inputSubtasks")),
    taskStatus: "toDo",
  };
  console.log(newTask);
  // newTask.title = ;
  // newTask.description = ;
  // newTask.
}

function addTask() {
  let newTask = createNewTask();
  if (validateTask(newTask)) {
    tasks.push(newTask);
  }
}
 function validateTask(task) {
    return true;
 }

 function getPrio() {
  return "medium";
 }