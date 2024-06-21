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
  },
  {
    "id": 3,
    "task": "Einkaufen",
    "category": "first-in-progress"
  },
  {
    "id": 4,
    "task": "Bügeln",
    "category": "second-in-progress"
  },
  {
    "id": 5,
    "task": "Fahrrad reparieren",
    "category": "done"
  }
]

let elementDraggedOver;

function updateHTML(){
  let todo = document.getElementById("todo-tasks");
  let tasksToDo = tasks.filter(element => element["category"] == "todo-tasks");
  todo.innerHTML = '';
  for(index = 0; index < tasksToDo.length; index++){
    let task = tasksToDo[index];
    // console.log(task);
    todo.innerHTML += createToDoHTML(task);
  }
  let feedback = document.getElementById("feedback-tasks");
  let feedbackTasks = tasks.filter(element => element["category"] == "feedback-tasks");
  feedback.innerHTML = '';
  for(index = 0; index < feedbackTasks.length; index++){
    let feedbackTask = feedbackTasks[index];
    // console.log(feedbackTask);
    feedback.innerHTML += createToDoHTML(feedbackTask);
  }
  let firstInProgress = document.getElementById("first-in-progress");
  let tasksFirstInProgress = tasks.filter(element => element["category"] == "first-in-progress");
  firstInProgress.innerHTML = '';
  for(index = 0; index < tasksFirstInProgress.length; index++){
    let firstInProgressTask = tasksFirstInProgress[index];
    // console.log(firstInProgressTask);
    firstInProgress.innerHTML += createToDoHTML(firstInProgressTask);
  }
  let secondInProgress = document.getElementById("second-in-progress");
  let tasksSecondInProgress = tasks.filter(element => element["category"] == "second-in-progress");
  secondInProgress.innerHTML = '';
  for(index = 0; index < tasksSecondInProgress.length; index++){
    let secondInProgressTask = tasksSecondInProgress[index];
    // console.log(secondInProgressTask);
    secondInProgress.innerHTML += createToDoHTML(secondInProgressTask);
  }
  let done = document.getElementById("done");
  let tasksDone = tasks.filter(element => element["category"] == "done");
  done.innerHTML = '';
  for(index = 0; index < tasksDone.length; index++){
    let doneTask = tasksDone[index];
    // console.log(secondInProgressTask);
    done.innerHTML += createToDoHTML(doneTask);
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
