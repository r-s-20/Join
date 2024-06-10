// tasks = [
//   {
//     id: 0,
//     category: "User Story",
//     haedline: "Kochwelt",
//     description: "Build Starts",
//     subtask: 2,
//     assigned: "Maria S",
//     status: 'toDos'
//   },

// ];

let currentTimestamp;

// function cards() {
//   let toDo = document.getElementById("toDo");
//   for (let i = 0; i < tasks.length; i++) {
//     toDo.innerHTML += /*html*/ `
//      <div class="card">
//                     <div class="cardCategory">${tasks[i].id}</div>
//                     <div class="cardHeadline">${tasks[i].haedline}</div>
//                     <div class="cardDescription">${tasks[i].description}</div>
//                     <div class="cardSubtasks">
//                         <div class="subtasksBar">
//                             <div class="subtasksBarProgress"></div>
//                         </div> <span>1/${tasks[i].subtask}</span>Subtasks
//                     </div>
//                     <div class="cardWorkers"><div>${tasks[i].assigned} </div><img src="./img/small_burger_menu.svg" alt=""></div>
                 

//                 </div>
//     `;
//   }
// }

function updateHTML(){
    let open = tasks.filter(t => t.status == 'toDos');
    let toDo = document.getElementById("toDo");
    toDo.innerHTML = '';
    for (let i = 0; i < open.length; i++){
        const element = open[i];
        toDo.innerHTML += generateTodoHTML(element, i);
    }

    if (toDo.innerHTML == ''){
        toDo.innerHTML = `<div class="noProgess" >No task To do</div>`;
    }


    let inProgress = tasks.filter(t => t.status == 'inProgress');
    let progress = document.getElementById('inProgress');
    progress.innerHTML = '';
    for (let i = 0; i < inProgress.length; i++){
        const element = inProgress[i];  
        progress.innerHTML += generateTodoHTML(element);
    }
    if (progress.innerHTML == ''){
        progress.innerHTML = /*html*/`<div class="noProgess">No In Progress</div>`;
    }

    let awaitFeedback = tasks.filter(t => t.status == 'awaitFeedback');
    let feedback = document.getElementById('awaitFeedback');
    feedback.innerHTML = '';
    for (let i = 0; i < awaitFeedback.length; i++){
        const element = awaitFeedback[i];  
        feedback.innerHTML += generateTodoHTML(element);
    }
    if (feedback.innerHTML == ''){
        feedback.innerHTML = /*html*/`<div class="noProgess">No Await feedback</div>`;
    }

    let dones = tasks.filter(t => t.status == 'done');
    let done = document.getElementById('done');
    done.innerHTML = '';
    for (let i = 0; i < dones.length; i++){
        const element = dones[i];  
        done.innerHTML += generateTodoHTML(element);
    }
    if (done.innerHTML == ''){
        done.innerHTML = /*html*/`<div class="noProgess">No Done</div>`;
    }
}

function allowDrop(ev){
    ev.preventDefault();
}

function startDragging(timestamp){
    currentTimestamp = timestamp;
}

function moveTo(status){
    const task = tasks.find(task => task.timestamp === currentTimestamp);
    task.status = status;
    updateHTML();

}

function generateTodoHTML(element){
    return /*html*/ `
    <div draggable='true' ondragstart='startDragging(${element.timestamp})' class="card">
                   <div class="cardCategory">${element.category.name}</div>
                   <div class="cardHeadline">${element.title}</div>
                   <div class="cardDescription">${element.description}</div>
                   <div class="cardSubtasks">
                       <div class="subtasksBar">
                           <div class="subtasksBarProgress"></div>
                       </div> <span>1/${element.subtasks.length}</span>Subtasks
                   </div>
                   <div class="cardWorkers"><div>${element.assigned} </div><img src="./img/small_burger_menu.svg" alt=""></div>
                

               </div>
   `;

}