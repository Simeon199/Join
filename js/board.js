let tasks = [];
let categories = [];
let searchedTasks = [];
let allCategories = [
  "to-do-container",
  "await-feedback-container",
  "done-container",
  "in-progress-container",
];
let elementDraggedOver;
console.log(document.getElementById('search-input'));
let searchedInput = document.getElementById('search-input');

/* Bemerkung: Die Ausführung von deleteCertainElements(), deren Aufgabe es wäre ausgewählte Datenbankeinträge wieder zu entfernen
funktioniert noch nicht, da die Firebase-Datenbank in diesem Fall den Zugriff verweigert ('Probleme mit der CORS policy') */

document.addEventListener("DOMContentLoaded", async function () {
  await getTasksFromDatabase();
  updateHTML();
});

async function loadData(path = "") {
  let response = await fetch(BASE_URL1 + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

async function getTasksFromDatabase() {
  tasks = loadTasksFromLocalStorage() || (await loadTasksFromDatabase());
  updateCategories();
  updateHTML();
}

function loadTasksFromLocalStorage() {
  let storagedTasks = localStorage.getItem("tasks");
  if (storagedTasks) {
    return JSON.parse(storagedTasks);
  } else {
    return null;
  }
}

function updateCategories() {
  categories = [...new Set(tasks.map((task) => task.container))];
}

async function loadTasksFromDatabase() {
  let response = await loadData();
  console.log(response.tasksList);
  if (response && response.tasksList) {
    for (index = 0; index < response.tasksList.length; index++) {
      tasks.push(response.tasksList[index]);
    }
    return tasks;
  }
  return [];
}

function iterateThroughSubArray(taskArray, htmlElement) {
  for (i = 0; i < taskArray.length; i++) {
    let task = taskArray[i];
    htmlElement.innerHTML += createToDoHTML(task);
  }
}

function checkIfEmpty(tasksDiv, divWithoutTasks) {
  let tasksDivContainer = document.getElementById(tasksDiv);
  let divWithoutTasksContainer = document.getElementById(divWithoutTasks);
  if (tasksDivContainer.innerHTML == "") {
    divWithoutTasksContainer.classList.remove("d-none");
  }
}

function updateHTML() {
  allCategories.forEach((container) => {
    let element = document.getElementById(container);
    let oppositeElementName = "no-" + container;
    let oppositeElement = getRightOppositeElement(oppositeElementName);
    if (element) {
      let filteredTasks = tasks.filter((task) => task.container === container);
      element.innerHTML = "";
      if (filteredTasks.length > 0) {
        iterateThroughSubArray(filteredTasks, element);
      } else {
        element.innerHTML = oppositeElement;
      }
    }
  });
}

function setVariableClass(element) {
  let variableClass = "";
  if (element["category"] == "user story") {
    variableClass = "task-category";
  } else if (element["category"] == "technical task") {
    variableClass = "technical-task-category";
  }
  return variableClass;
}

function insertCorrectUrgencyIcon(element) {
  let svgElement;
  if (element["priority"] == "urgent") {
    svgElement = generateHTMLUrgencyUrgent();
  } else if (element["priority"] == "low") {
    svgElement = generateHTMLUrgencyLow();
  } else if (element["priority"] == "medium") {
    svgElement = generateHTMLUrgencyMedium();
  }
  return svgElement;
}

function createToDoHTML(element) {
  let rightIcon = insertCorrectUrgencyIcon(element);
  let variableClass = setVariableClass(element);
  let oppositeCategory = "no-" + element["container"];
  let contactsHTML = "";
  if (element["assigned"] || typeof element["assigned"] == Array) {
    for (let i = 0; i < element["assigned"].length; i++) {
      contactsHTML += `<div class="task-contact">${element["assigned"][i]}</div>`;
    }
  }

  return generateTaskHTML(
    element["tasksIdentity"],
    variableClass,
    element["category"],
    element["title"],
    element["description"],
    contactsHTML,
    element["container"],
    oppositeCategory,
    rightIcon
  );
}

function startDragging(elementId) {
  elementDraggedOver = elementId;
}

function moveTo(container) {
  let oppositeContainer = "no-" + container;
  let task = tasks.find((task) => task.tasksIdentity == elementDraggedOver);
  if (task) {
    task.container = container;
    saveTasksToLocalStorage();
    updateHTML();
    removeEmptyMessage(container, oppositeContainer);
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeEmptyMessage(container, oppositeContainer) {
  let categoryContainer = document.getElementById(container);
  let oppositeCategoryContainer = document.getElementById(oppositeContainer);
  if (oppositeCategoryContainer) {
    categoryContainer.removeChild(oppositeCategoryContainer);
  }
}

function getRightOppositeElement(oppositeElementName) {
  if (oppositeElementName == "no-await-feedback-container") {
    return returnHtmlNoFeedbackContainer();
  } else if (oppositeElementName == "no-in-progress-container") {
    return returnHtmlNoProgressContainer();
  } else if (oppositeElementName == "no-to-do-container") {
    return returnHtmlNoToDoContainer();
  } else if (oppositeElementName == "no-done-container") {
    return returnHtmlNoDoneContainer();
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function showAddTaskPopUp(container = "to-do-container") {
  document.getElementById("add-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("add-task-pop-up").classList.remove("translate-100");
  standardContainer = container;
}

function hideAddTaskPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

function showBigTaskPopUp() {
  document.getElementById("big-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("big-task-pop-up").classList.remove("translate-100");
}

function hideBigTaskPopUp() {
  document.getElementById("big-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("big-task-pop-up").classList.add("translate-100");
}

function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}

searchedInput.addEventListener('input', function(){
  let searchedValue = this.value.trim().toLowerCase();
  checkIfTitleContainsSearchedInput(searchedValue);
})

function checkIfTitleContainsSearchedInput(searchedValue){
  // let tasks = localStorage.getItem('tasks');
  // console.log(tasks);
  for(index = 0; index < tasks.length; index++){
    let taskTitle = tasks[index]['title'];
    if(taskTitle.toLowerCase().includes(searchedValue) & taskTitle.length > 2){
      console.log(taskTitle);
      searchedTasks.push(taskTitle);
    }
  }
  console.log(searchedTasks);
}