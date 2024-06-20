let tasks = [
  {
    "id": 0,
    "task": "Putzen",
    "category": "todo"
  },
  {
    "id": 1,
    "task": "Aufräumen",
    "category": "todo"
  },
  {
    "id": 2,
    "task": "Kochen",
    "category": "inprogress"
  }
]

let elementDraggedOver;

function updateHTML(){
  let todo = document.getElementById("no-to-do-container");
  let tasksToDo = tasks.filter(element => element["category"] == "todo");
  tasksToDo.innerHTML = '';
  for(index = 0; index < tasksToDo.length; index++){
    let task = tasksToDo[index];
    todo.innerHTML += createToDoHTML(task);
  }
  let inprogress = document.getElementById("no-await-feedback-container");
  let inProgressTasks = tasks.filter(element => element["category"] == "inprogress");
  inprogress.innerHTML = '';
  for(index = 0; index < inProgressTasks.length; index++){
    let taskInProgress = inProgressTasks[index];
    inprogress.innerHTML += createToDoHTML(taskInProgress);
  }
}

function createToDoHTML(element){
  return `<div class="todo" draggable="true" ondragstart="startDragging(${element['id']})">${element['task']}</div>`;
}

function startDragging(element){
  elementDraggedOver = element;
}

function moveTo(category){
  tasks[elementDraggedOver]["category"] = category;
  updateHTML();
}

function allowDrop(event){
  event.preventDefault();
}

function showAddTaskPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("add-task-pop-up").classList.remove("translate-100");
}

function hideAddTaskPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}
