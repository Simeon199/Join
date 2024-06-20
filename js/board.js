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

function updateHTML(){
  let todo = document.getElementById("no-to-do-container");
  let inprogress = document.getElementById("tasks");
  // todo.innerHTML = '';
  // inprogress.innerHTML = '';
  let tasksToDo = tasks.filter(element => element["category"] == "todo");
  let inProgressTasks = tasks.filter(element => element["category"] == "inprogress");
  console.log(tasksToDo, inProgressTasks);
  for(index = 0; index < tasksToDo.length; index++){
    let task = tasksToDo[index]["task"];
    todo.innerHTML += `<div class="todo">${task}</div>`;
  }
  for(index = 0; index < inProgressTasks.length; index++){
    let taskInProgress = inProgressTasks[index]["task"];
    inprogress.innerHTML += `<div class="inProgress">${taskInProgress}</div>`;
  }
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
