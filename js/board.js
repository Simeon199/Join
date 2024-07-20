let tasks = [];
let categories = [];
let searchedTasks = [];
let allCategories = ["to-do-container", "await-feedback-container", "done-container", "in-progress-container"];
let elementDraggedOver;
let priorityValue = "";
let searchedInput = document.getElementById("search-input");
let isBigTaskPopUpOpen = false;
let assignedToContactsBigContainer = [];
let isSaveIconClicked = false;
let subtaskArray = [];
let checkBoxCheckedJson = {};
let emptyList = [];
let renderCurrentTaskId;
let touchTime;

async function init_task() {
  await getTasksFromDatabase();
  updateHTML();
}

async function loadRelevantData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

async function getTasksFromDatabase() {
  tasks = await loadTasksFromDatabase();
  updateCategories();
  updateHTML();
}

function updateCategories() {
  categories = [...new Set(tasks.map((task) => task.container))];
}

async function loadTasksFromDatabase() {
  let response = await loadRelevantData();
  if (response && response.testRealTasks) {
    for (index = 0; index < response.testRealTasks.length; index++) {
      tasks.push(response.testRealTasks[index]);
    }
    return tasks;
  }
  return [];
}

// function loadTasksFromLocalStorage() {
//   let storagedTasks = localStorage.getItem("tasks");
//   if (storagedTasks) {
//     return JSON.parse(storagedTasks);
//   } else {
//     return null;
//   }
// }

// function saveTasksToLocalStorage() {
//   localStorage.setItem("tasks", JSON.stringify(tasks));
// }

// showLoadScreen
function showBoardLoadScreen() {
  document.getElementById("board-add_task-load-screen").classList.remove("d-none");
}

function hideBoardLoadScreen() {
  document.getElementById("board-add_task-load-screen").classList.add("d-none");
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
  let oppositeCategory = "no-" + element.container;
  let contactsHTML = generateContactsHTML(element);
  let jsonElement = JSON.stringify(element);

  return generateTaskHTML(element, contactsHTML, oppositeCategory, rightIcon, jsonElement);
}

function generateContactsHTML(element) {
  if (!element.assigned || !Array.isArray(element.assigned)) return "";

  let contactsHTML = "";
  let lengthOfAssignedTo = element.assigned.length;

  for (let i = 0; i < lengthOfAssignedTo; i++) {
    contactsHTML += generateContactHTML(element, i, lengthOfAssignedTo);
  }

  return contactsHTML;
}

function generateContactHTML(element, index, lengthOfAssignedTo) {
  if (index < 3) {
    let name = element.assigned[index].name;
    let initials = getInitials(name);
    return /*html*/ `<div class="task-contact" style='background-color: ${element.assigned[index].color}'>${initials}</div>`;
  } else if (index === 3) {
    return /*html*/ `<div class='taskAssignedToNumberContainer'><span>+ ${lengthOfAssignedTo - 3}</span></div>`;
  } else {
    updateTaskContactPlusHTML(element, lengthOfAssignedTo);
    return "";
  }
}

function updateTaskContactPlusHTML(element, lengthOfAssignedTo) {
  let container = document.querySelectorAll("taskAssignedToNumberContainer")[element.tasksIdentity];
  if (container) {
    container.innerHTML = showTaskContactPlusHTML(lengthOfAssignedTo);
  }
}

function updateBigTaskContactsContainerPlus(taskJson, lengthOfAssignedTo) {
  let container = document.querySelectorAll("bigTaskAssignedToNumberContainer")[taskJson.tasksIdentity];
  if (container) {
    container.innerHTML = showTaskContactPlusHTML(lengthOfAssignedTo);
  }
}

function showTaskContactPlusHTML(lengthOfAssignedTo) {
  return /*html*/ `
    <span>+ ${lengthOfAssignedTo - 3}</span>
  `;
}

async function saveTaskToFirebase(task) {
  const taskPath = `/testRealTasks/${task.tasksIdentity}`;
  const response = await fetch(`${BASE_URL}${taskPath}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    console.error("Fehler beim Speichern der Task in Firebase:", response.statusText);
  } else {
    console.log("Task erfolgreich in Firebase gespeichert");
  }
  console.log(response);
}

function rotateFunction(id) {
  document.getElementById(`task${id}`).style.transform = "rotate(3deg)";
}

// showAddTaskPopUp
function showAddTaskPopUp(container = "to-do-container") {
  const screenWidth = window.screen.width;
  if (screenWidth <= 600) {
    window.location = "add_task.html";
  } else {
    document.body.style.overflow = "hidden";
    document.getElementById("add-task-pop-up-bg").classList.remove("bg-op-0");
    document.getElementById("add-task-pop-up").classList.remove("translate-100");
    standardContainer = container;
  }
}

// hideAddTaskPopUp
function hideAddTaskPopUp() {
  document.body.style.overflow = "unset";
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
  // clearTask();
}

// showBigTaskPopUp
function showBigTaskPopUp(jsonTextElement) {
  isBigTaskPopUpOpen = true;
  document.getElementById("big-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("big-task-pop-up").classList.remove("translate-100");
  document.body.style.overflow = "hidden";
  renderBigTask(jsonTextElement);
}

// hideBigTaskPopUp
function hideBigTaskPopUp() {
  isBigTaskPopUpOpen = false;
  document.getElementById("big-task-pop-up-title").classList.remove("big-task-pop-up-input-error");
  document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-task-pop-up-input-error");
  document.getElementById("big-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("big-task-pop-up").classList.add("translate-100");
  document.body.style.overflow = "unset";
  if (document.getElementById("big-task-pop-up-title-text")) {
    let title = document.getElementById("big-task-pop-up-title-text").innerHTML;
    let id = tasks.findIndex((task) => task.title === title);
    saveSubtaskChanges(id);
  }
}

// renderBigTask
function renderBigTask(jsonTextElement) {
  let taskJson = JSON.parse(decodeURIComponent(jsonTextElement));
  document.getElementById("big-task-pop-up-priority-container").classList.remove("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-title").innerHTML = /*html*/ `<h1 id='big-task-pop-up-title-text'>${taskJson.title}</h1>`;
  document.getElementById("big-task-pop-up-description").innerHTML = taskJson.description;
  returnHTMLBigTaskPopUpDueDateContainerContent(taskJson.date);
  document.getElementById("big-task-pop-up-category").innerHTML = taskJson.category;
  document.getElementById("big-task-pop-up-category").style.backgroundColor = checkCategoryColor(taskJson.category);
  returnHTMLBigTaskPopUpPriorityContainer(taskJson.priority);
  document.getElementById("big-task-pop-up-priority-icon").innerHTML = checkPriorityIcon(taskJson.priority);
  document.getElementById("big-task-pop-up-bottom-buttons-container").innerHTML = returnDeleteEditHTML(taskJson.tasksIdentity, jsonTextElement);
  renderCorrectAssignedNamesIntoBigTask(taskJson);
  returnHTMLBigTaskPopUpSubtaskAll();
  renderTaskContact(taskJson);
  renderSubtask(taskJson);
}

function renderAllBigPopUp(oldTitle, oldDescription, oldDate, oldPriority, taskJson, id) {
  setupSubtaskArray(taskJson, id);
  renderPopUpElements(oldTitle, oldDescription, oldDate, oldPriority, id);
  renderBigTaskDetails(taskJson, oldPriority, id);
}

function setupSubtaskArray(taskJson) {
  subtaskArray = taskJson.subtask || [];
  taskJson.subtask = subtaskArray;
}

function renderPopUpElements(oldTitle, oldDescription, oldDate, oldPriority, id) {
  returnBigTaskPopUpTitle(oldTitle);
  returnBigTaskPopUpDescription(oldDescription);
  renderBigTaskPopUpSection("big-task-pop-up-due-date-container", oldDate, returnBigTaskPopUpDueDateContainer);
  renderBigTaskPopUpSection("big-task-pop-up-priority-container", oldPriority, returnBigTaskPopUpPriorityContainer);
  priorityValue = oldPriority;
  document
    .getElementById("big-edit-task-" + oldPriority.toLowerCase() + "-priority")
    .classList.add("big-edit-task-" + oldPriority.toLowerCase() + "-priority-aktiv");
}

function renderBigTaskPopUpSection(containerId, value, renderFunction) {
  document.getElementById(containerId).classList.add("big-edit-task-pop-up-section-container");
  renderFunction(value);
}

function renderBigTaskDetails(taskJson, oldPriority, id) {
  returnBigTaskPopUpContactAll(id);
  returnBigTaskPopUpSubtasksAll();
  renderBigTaskAssignedContactContainer(taskJson);
  renderBigEditTaskAssignedToPopUp(taskJson);
  returnBigPopUpEditButtons(id);
}

function closeAllDropDownPopUps() {
  let AllMobileDropdownPopUps = document.querySelectorAll(".mobileDropdown");
  for (let i = 0; i < AllMobileDropdownPopUps.length; i++) {
    let dropdown = document.getElementById(`mobileDropdown${i}`);
    dropdown.classList.add("mobileDropdown-translate-100");
  }
}

function generateTaskHTML(element, contactsHTML, oppositeCategory, rightIcon, jsonElement) {
  let jsonTextElement = encodeURIComponent(jsonElement);
  if (element["subtask"] && element["subtask"].length > 0) {
    let numberOfTasksChecked = 0;
    for (index = 0; index < element["subtask"].length; index++) {
      if (element["subtask"][index]["is-tasked-checked"] == true) {
        numberOfTasksChecked += 1;
      }
    }
    let taskbarWidth = Math.round((numberOfTasksChecked / element["subtask"].length) * 100);
    return returnTaskHtmlWithSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskbarWidth, numberOfTasksChecked);
  } else if (element["subtask"] && element["subtask"].length == 0) {
    return returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement);
  } else {
    return returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement);
  }
}

function bigEditTaskSubtaskInputCheckEnter(event) {
  if (event.key === "Enter") {
    buildSubtaskArrayForUpload();
  }
}
