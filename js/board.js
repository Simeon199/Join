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

// function updateHTML(){
//   let todo = document.getElementById("todo-tasks");
//   let tasksToDo = tasks.filter(element => element["category"] == "todo-tasks");
//   todo.innerHTML = '';
//   for(index = 0; index < tasksToDo.length; index++){
//     let task = tasksToDo[index];
//     todo.innerHTML += createToDoHTML(task);
//   }
//   let feedback = document.getElementById("feedback-tasks");
//   let feedbackTasks = tasks.filter(element => element["category"] == "feedback-tasks");
//   feedback.innerHTML = '';
//   for(index = 0; index < feedbackTasks.length; index++){
//     let feedbackTask = feedbackTasks[index];
//     feedback.innerHTML += createToDoHTML(feedbackTask);
//   }
//   let firstInProgress = document.getElementById("first-in-progress");
//   let tasksFirstInProgress = tasks.filter(element => element["category"] == "first-in-progress");
//   firstInProgress.innerHTML = '';
//   for(index = 0; index < tasksFirstInProgress.length; index++){
//     let firstInProgressTask = tasksFirstInProgress[index];
//     firstInProgress.innerHTML += createToDoHTML(firstInProgressTask);
//   }
//   let secondInProgress = document.getElementById("second-in-progress");
//   let tasksSecondInProgress = tasks.filter(element => element["category"] == "second-in-progress");
//   secondInProgress.innerHTML = '';
//   for(index = 0; index < tasksSecondInProgress.length; index++){
//     let secondInProgressTask = tasksSecondInProgress[index];
//     secondInProgress.innerHTML += createToDoHTML(secondInProgressTask);
//   }
//   let done = document.getElementById("done");
//   let tasksDone = tasks.filter(element => element["category"] == "done");
//   done.innerHTML = '';
//   for(index = 0; index < tasksDone.length; index++){
//     let doneTask = tasksDone[index];
//     done.innerHTML += createToDoHTML(doneTask);
//   }
// }

function iterateThroughSubArray(subArray, htmlElement){
  for(index = 0; index < subArray.length; index++){
    let item = subArray[index];
    htmlElement.innerHTML += createToDoHTML(item);
  }
}

function newUpdateHTML(){
  for(index = 0; index < tasks.length; index++){
    let category = tasks[index]["category"];
    let htmlElement = document.getElementById(category);
    let subArray = tasks.filter(element => element["category"] == category);
    iterateThroughSubArray(subArray, htmlElement);
  }
}

function updateHTML(){
  let todo = document.getElementById("todo-tasks");
  let tasksToDo = tasks.filter(element => element["category"] == "todo-tasks");
  todo.innerHTML = '';
  iterateThroughSubArray(tasksToDo, todo);
  let feedback = document.getElementById("feedback-tasks");
  let feedbackTasks = tasks.filter(element => element["category"] == "feedback-tasks");
  feedback.innerHTML = '';
  iterateThroughSubArray(feedbackTasks, feedback);
  let firstInProgress = document.getElementById("first-in-progress");
  let tasksFirstInProgress = tasks.filter(element => element["category"] == "first-in-progress");
  firstInProgress.innerHTML = '';
  iterateThroughSubArray(tasksFirstInProgress, firstInProgress);
  let secondInProgress = document.getElementById("second-in-progress");
  let tasksSecondInProgress = tasks.filter(element => element["category"] == "second-in-progress");
  secondInProgress.innerHTML = '';
  iterateThroughSubArray(tasksSecondInProgress, secondInProgress);
  let done = document.getElementById("done");
  let tasksDone = tasks.filter(element => element["category"] == "done");
  done.innerHTML = '';
  iterateThroughSubArray(tasksDone, done);
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
