let tasks = [
  {
    "id": 0,
    "task": "Putzen",
    "category": "todo-tasks"
  },
  {
    "id": 1,
    "task": "Aufräumen",
    "category": "todo-tasks"
  },
  {
    "id": 2,
    "task": "Kochen",
    "category": "feedback-tasks"
  }
]

let elementDraggedOver;

function updateHTML(){
  let todo = document.getElementById("todo-tasks");
  let tasksToDo = tasks.filter(element => element["category"] == "todo-tasks");
  todo.innerHTML = '';
  for(index = 0; index < tasksToDo.length; index++){
    let task = tasksToDo[index];
    todo.innerHTML += createToDoHTML(task);
  }
  let feedback = document.getElementById("feedback-tasks");
  let feedbackTasks = tasks.filter(element => element["category"] == "feedback-tasks");
  feedback.innerHTML = '';
  for(index = 0; index < feedbackTasks.length; index++){
    let feedbackTask = feedbackTasks[index];
    feedback.innerHTML += createToDoHTML(feedbackTask);
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
