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
    "task": "Bügeln",
    "category": "inprogress"
  },
  {
    "id": 4,
    "task": "Fahrrad reparieren",
    "category": "done"
  }
]

let categories = [];
let elementDraggedOver;

returnCategoryArray();

function iterateThroughSubArray(taskArray, htmlElement){
  for(let index = 0; index < taskArray.length; index++){
    htmlElement.innerHTML += createToDoHTML(taskArray[index]);
  }
}

function returnCategoryArray(){
  for(let index = 0; index < tasks.length; index++){
    let category = tasks[index]["category"];
    if(!categories.includes(category)){
      categories.push(category);
    }
  }
  return categories;
}

function updateHTML() {
  for (let i = 0; i < categories.length; i++) {
    let element = document.getElementById(categories[i]);
    let filteredTasks = tasks.filter(task => task.category == categories[i]);
    element.innerHTML = '';
    iterateThroughSubArray(filteredTasks, element);
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
