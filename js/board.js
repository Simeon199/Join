let tasks = [];
let categories = [];
let searchedTasks = [];
let allCategories = ["to-do-container", "await-feedback-container", "done-container", "in-progress-container"];
let elementDraggedOver;
console.log(document.getElementById("search-input"));
let searchedInput = document.getElementById("search-input");

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

  let jsonElement = JSON.stringify(element);

  return generateTaskHTML(
    element["tasksIdentity"],
    variableClass,
    element["category"],
    element["title"],
    element["description"],
    contactsHTML,
    element["container"],
    oppositeCategory,
    rightIcon,
    jsonElement
  );
}

function startDragging(elementId) {
  elementDraggedOver = elementId;
}

async function moveTo(container) {
  let oppositeContainer = "no-" + container;
  let task = tasks.find((task) => task.tasksIdentity == elementDraggedOver);
  if (task) {
    task.container = container;
    saveTasksToLocalStorage();
    updateHTML();
    removeEmptyMessage(container, oppositeContainer);
  }
  try {
    await saveTaskToFirebase(task);
  } catch(error){
    console.error("Fehler beim Speichern der tasks in der Firebase-Datenbank:", error);
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

async function saveTaskToFirebase(task) {
  const taskPath = `/tasksList/${task.tasksIdentity}`;
  const response = await fetch(`${BASE_URL1}${taskPath}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });

  if (!response.ok) {
    console.error('Fehler beim Speichern der Task in Firebase:', response.statusText);
  } else {
    console.log('Task erfolgreich in Firebase gespeichert');
  }
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

function showBigTaskPopUp(jsonTextElement) {
  document.getElementById("big-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("big-task-pop-up").classList.remove("translate-100");

  renderBigTask(jsonTextElement);
}

function hideBigTaskPopUp() {
  document.getElementById("big-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("big-task-pop-up").classList.add("translate-100");
}

function renderBigTask(jsonTextElement) {
  let taskJson = JSON.parse(decodeURIComponent(jsonTextElement));
  console.log(taskJson);

  document.getElementById("big-task-pop-up-title").innerHTML = taskJson.title;
  document.getElementById("big-task-pop-up-description").innerHTML = taskJson.description;
  document.getElementById("big-task-pop-up-date").innerHTML = taskJson.date;
  document.getElementById("big-task-pop-up-category").innerHTML = taskJson.category;
  document.getElementById("big-task-pop-up-category").style.backgroundColor = checkCategoryColor(taskJson.category);
  document.getElementById("big-task-pop-up-priority-text").innerHTML = taskJson.priority;
  document.getElementById("big-task-pop-up-priority-icon").innerHTML = rightPriorityIcon(taskJson.priority);

  document.getElementById("big-task-pop-up-delete-edit-buttons-container").innerHTML = returnDeleteEditHTML();

  document.getElementById("big-task-pop-up-contact-container").innerHTML = "";
  document.getElementById("big-task-pop-up-subtasks-container").innerHTML = "";

  renderContact(taskJson);
  renderSubtask(taskJson);
}

function renderSubtask(taskJson) {
  if (taskJson.subtask) {
    taskJson.subtask.forEach((subtask) => {
      document.getElementById("big-task-pop-up-subtasks-container").innerHTML += returnSubtaskHTML(subtask);
    });
  } else {
    document.getElementById("big-task-pop-up-subtasks-container").innerHTML = /*html*/ `  
    <p class='big-task-pop-up-value-text'>No Subtasks</p>
    `;
  }
}

function renderContact(taskJson) {
  if (taskJson.assigned) {
    taskJson.assigned.forEach((contact) => {
      document.getElementById("big-task-pop-up-contact-container").innerHTML += returnAssignedContactHTML(contact);
    });
  } else {
    document.getElementById("big-task-pop-up-contact-container").innerHTML = /*html*/ `  
    <p class='big-task-pop-up-value-text'>No One Assigned</p>
    `;
  }
}

function deleteTask() {
  // deleteData('')
}

async function deleteData(path = "") {
  let response = await fetch(BASE_URL1 + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

function checkCategoryColor(category) {
  if (category === "User Story") {
    return "#0038FF";
  } else if (category === "Technical Task") {
    return "#1FD7C1";
  } else {
    return "#42526e";
  }
}

function rightPriorityIcon(priorityText) {
  if (priorityText === "urgent") {
    return generateHTMLUrgencyUrgent();
  } else if (priorityText === "medium") {
    return generateHTMLUrgencyMedium();
  } else if (priorityText === "low") {
    return generateHTMLUrgencyLow();
  }
}

searchedInput.addEventListener("input", function () {
  let searchedValue = this.value.trim().toLowerCase();
  checkIfTitleContainsSearchedInput(searchedValue);
});

function checkIfTitleContainsSearchedInput(searchedValue) {
  // let tasks = localStorage.getItem('tasks');
  // console.log(tasks);
  for (index = 0; index < tasks.length; index++) {
    let taskTitle = tasks[index]["title"];
    if (taskTitle.toLowerCase().includes(searchedValue) & (taskTitle.length > 2)) {
      console.log(taskTitle);
      searchedTasks.push(taskTitle);
    }
  }
  console.log(searchedTasks);
}

function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}
