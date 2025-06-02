import * as shared from '../../shared/javascript/shared.js';
import * as feedbackAndUrgency from './feedbackAndUrgencyTemplate.js';
import * as firebase from '../../core/firebase.js';
import * as boardEdit from './board_edit.js';

let tasks = [];
let categories = [];
// let searchedTasks = [];

let allCategories = [
  "to-do-container", 
  "await-feedback-container", 
  "done-container", 
  "in-progress-container"
];

let elementDraggedOver;
// let priorityValue = "";
// let searchedInput = document.getElementById("search-input");
// let isBigTaskPopUpOpen = false;
// let assignedToContactsBigContainer = [];
// let isSaveIconClicked = false;
// let subtaskArray = [];
// let checkBoxCheckedJson = {};
// let emptyList = [];
// let renderCurrentTaskId;
// let touchTime;
// let currentOpenDropdown = null;

document.addEventListener('DOMContentLoaded', async () => {
  shared.bundleLoadingHTMLTemplates();
  init_task();
});

async function init_task() {
  await getTasksFromDatabase();
}

async function getTasksFromDatabase() {
  tasks = await loadTasksFromDatabase();
}

function updateCategories() {
  categories = [...new Set(tasks.map((task) => task.container))];
}

async function loadTasksFromDatabase() {
  tasks = await getAllTasks()
  updateCategories();
  updateHTML();
}

// Diese Funktion sollte in eine zentrale Datei reinkommen:

async function getAllTasks(){
  return new Promise((resolve, reject) => {
    let taskRef = firebase.ref(firebase.database, 'kanban/sharedBoard/tasks');
    firebase.onValue(
      taskRef,
      (snapshot) => {
        let taskData = snapshot.val();
        resolve(Object.values(taskData));
        console.log('contacts: ', Object.values(taskData));
      },
    ),
    (error) => {
      console.error('Fehler beim Laden der Kontakte: ', error);
      reject(error);
    }
  });
} 

export function updateHTML() {
  allCategories.forEach((container) => {
    let element = document.getElementById(container);
    let oppositeElementName = "no-" + container;
    let oppositeElement = getRightOppositeElement(oppositeElementName);
    if (element) {
      let filteredTasks = tasks.filter((task) => task.container === container);
      element.innerHTML = "";
      if (filteredTasks.length > 0) {
        iterateThroughSubArray(filteredTasks, container);
      } else {
        element.innerHTML = oppositeElement;
      }
    }
  });
}

function iterateThroughSubArray(taskArray, containerName) {
  let htmlElement = document.getElementById(containerName);
  if(taskArray){
    for (let i = 0; i < taskArray.length; i++) {
      let task = taskArray[i];
      htmlElement.innerHTML += createToDoHTML(task);
    }
  }
  return null;
}

function createToDoHTML(taskElement) {
  let rightIcon = insertCorrectUrgencyIcon(taskElement);
  let oppositeCategory = "no-" + taskElement.container;
  let contactsHTML = generateContactsHTML(taskElement);
  let jsonElement = JSON.stringify(taskElement);
  return generateTaskHTML(taskElement, contactsHTML, oppositeCategory, rightIcon, jsonElement);
}

function insertCorrectUrgencyIcon(element) {
  let svgElement;
  if (element["priority"] == "urgent") {
    svgElement = feedbackAndUrgency.generateHTMLUrgencyUrgent();
  } else if (element["priority"] == "low") {
    svgElement = feedbackAndUrgency.generateHTMLUrgencyLow();
  } else if (element["priority"] == "medium") {
    svgElement = feedbackAndUrgency.generateHTMLUrgencyMedium();
  }
  console.log('svg element: ', svgElement);
  return svgElement;
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

function generateTaskHTML(taskElement, contactsHTML, oppositeCategory, rightIcon, jsonElement) {
  let jsonTextElement = encodeURIComponent(jsonElement);
  if (taskElement["subtask"] && taskElement["subtask"].length > 0) {
    let numberOfTasksChecked = 0;
    for (let index = 0; index < taskElement["subtask"].length; index++) {
      if (taskElement["subtask"][index]["is-tasked-checked"] == true) {
        numberOfTasksChecked += 1;
      }
    }
    let taskbarWidth = Math.round((numberOfTasksChecked / taskElement["subtask"].length) * 100);
    returnTaskHtmlWithSubtask(taskElement, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskbarWidth, numberOfTasksChecked);
  } else if (taskElement["subtask"] && taskElement["subtask"].length == 0) {
    return returnTaskHtmlWithoutSubtask(taskElement, contactsHTML, oppositeCategory, rightIcon, jsonTextElement);
  } else {
    return returnTaskHtmlWithoutSubtask(taskElement, contactsHTML, oppositeCategory, rightIcon, jsonTextElement);
  }
}

async function returnTaskHtmlWithSubtask(
  taskElement, 
  contactsHTML, 
  oppositeCategory, 
  rightIcon, 
  jsonTextElement, 
  taskbarWidth, 
  numberOfTasksChecked
){
  let taskIndex = taskElement.id;
  let taskDescription = taskElement.description;
  if (taskDescription.length > 40) {
    taskDescription = taskDescription.substring(0, 40) + "...";
  }
  let template = await shared.initHTMLContent('../../board/templates/board_subtask_templates/taskHtmlWithSubtask.tpl', taskElement['container']);
  template.id = `task${taskIndex}`;
  let task = document.getElementById(`task${taskIndex}`); 
  template.querySelector('.task-category').style.backgroundColor = boardEdit.checkCategoryColor(taskElement["category"]);
  template.querySelector('.task-category').innerHTML =  taskElement["category"];
  template.querySelector('.mobileDropdown').id = `mobileDropdown${taskIndex}`;
  console.log(template.querySelector('.mobileDropdown'));
  document.getElementById(`mobileDropdown${taskIndex}`).querySelector('a').addEventListener('click', (event) => {
    if(event.target.tagName === 'To Do'){
      shared.stopEvent(event);
      moveTasksToCategory(taskIndex, 'to-do-container');
    } else if(event.target.tagName === 'In Progress'){
      shared.stopEvent(event);
      moveTasksToCategory(taskIndex, 'in-progress-container');
    } else if(event.target.tagName === 'Await Feedback'){
      shared.stopEvent(event);
      moveTasksToCategory(taskIndex, 'await-feedback-container');
    } else if(event.target.tagName === 'Done'){
      shared.stopEvent(event);
      moveTasksToCategory(taskIndex, 'done-container');
    }
  });
  template.querySelector('.task-title').innerHTML = taskElement["title"];
  template.querySelector('.task-description').innerHTML = taskDescription;
  template.querySelector('.task-bar-content').style.width = `${taskbarWidth}%`;
  template.querySelector('.task-bar-text').innerHTML = `${numberOfTasksChecked}/${taskElement["subtask"].length} Subtasks`;
  template.querySelector('.task-contacts').innerHTML = contactsHTML;
  template.querySelector('.task-contacts-container').innerHTML += rightIcon;
  template.querySelectorAll('div')[3].id = oppositeCategory;
  console.log('taskElement container: ', taskElement.container);
  document.getElementById(oppositeCategory).innerHTML = `No tasks in ${taskElement['container']}`;

  console.log('complete template: ', template);
  template.querySelector('.dropdownSVG').addEventListener('click', (event) => {
    shared.stopEvent(event);
    openMobileDropdown(taskIndex);
  });
  task.addEventListener('click', () => {
    showBigTaskPopUp(jsonTextElement);
  });
  task.addEventListener('dragstart', () => {
    startDragging(element["tasksIdentity"]);
    rotateFunction(taskIndex);
  });
  task.addEventListener('dragend', () => {
    checkIfEmpty(element["container"], oppositeCategory);
  });
  task.addEventListener('dragover', (event) => {
    event.preventDefault();
    allowDrop(event);
  });
  task.addEventListener('drop', () => {
    moveTo(element["container"]);
  });
}

async function returnTaskHtmlWithoutSubtask(taskElement, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskbarWidth, numberOfTasksChecked){
  let template = await shared.initHTMLContent('../../board/templates/board_subtask_templates/taskHtmlWithoutSubtask.tpl', taskElement['container']);
  template.id = `task${taskElement['id']}`;
}

function generateContactHTML(element, index, lengthOfAssignedTo) {
  if (index < 3) {
    let name = element.assigned[index].name;
    let initials = boardEdit.getInitials(name);
    return `<div class="task-contact" style='background-color: ${element.assigned[index].color}'>${initials}</div>`;
  } else if (index === 3) {
    return `<div class='taskAssignedToNumberContainer'><span>+ ${lengthOfAssignedTo - 3}</span></div>`;
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
  return `
    <span>+ ${lengthOfAssignedTo - 3}</span>
  `;
}

function rotateFunction(id) {
  document.getElementById(`task${id}`).style.transform = "rotate(3deg)";
}

function closeAllDropDownPopUps() {
  let AllMobileDropdownPopUps = document.querySelectorAll(".mobileDropdown");
  for (let i = 0; i < AllMobileDropdownPopUps.length; i++) {
    let dropdown = document.getElementById(`mobileDropdown${i}`);
    dropdown.classList.add("mobileDropdown-translate-100");
  }
}

function checkIfEmpty(tasksDiv, divWithoutTasks) {
  let tasksDivContainer = document.getElementById(tasksDiv);
  let divWithoutTasksContainer = document.getElementById(divWithoutTasks);
  if (tasksDivContainer.innerHTML == "") {
    divWithoutTasksContainer.classList.remove("d-none");
  }
}

function startDragging(elementId) {
  elementDraggedOver = elementId;
}

async function moveTo(container) {
  let oppositeContainer = "no-" + container;
  let task = tasks.find((task) => task.tasksIdentity == elementDraggedOver);
  if (task) {
    task.container = container;
    updateHTML();
    removeEmptyMessage(container, oppositeContainer);
  }
  try {
    await saveTaskToFirebase(task);
  } catch (error) {
    console.error("Fehler beim Speichern der tasks in der Firebase-Datenbank:", error);
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
  if (oppositeElementName === "no-await-feedback-container") {
    feedbackAndUrgency.returnHtmlNoFeedbackContainer();
  } else if (oppositeElementName === "no-in-progress-container") {
    feedbackAndUrgency.returnHtmlNoProgressContainer();
  } else if (oppositeElementName === "no-to-do-container") {
    feedbackAndUrgency.returnHtmlNoToDoContainer();
  } else if (oppositeElementName === "no-done-container") {
    feedbackAndUrgency.returnHtmlNoDoneContainer();
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function replaceSpacesWithDashes(str) {
  return str.replace(/ /g, "-");
}

function openMobileDropdown(taskIndex) {
  let dropdown = document.getElementById(`mobileDropdown${taskIndex}`);
  dropdown.classList.toggle("mobileDropdown-translate-100");
  let task = tasks.find((task) => task.tasksIdentity == taskIndex);
  let currentCategory = task.container;
  let dropdownItems = dropdown.querySelectorAll("a");
  if (!dropdown.classList.contains("mobileDropdown-translate-100")) {
    currentOpenDropdown = dropdown;
  } else {
    currentOpenDropdown = null;
  }
  for (i = 0; i < dropdownItems.length; i++) {
    let category = replaceSpacesWithDashes(dropdownItems[i].textContent.trim().toLowerCase() + "-container");
    if (category === currentCategory.toLowerCase()) {
      dropdownItems[i].style.display = "none";
    } else {
      dropdownItems[i].style.display = "block";
    }
  }
}

async function moveTasksToCategory(taskIndex, newCategory) {
  let task = tasks.find((task) => task.tasksIdentity == taskIndex);
  if (task) {
    task.container = newCategory;
    updateHTML();
    let taskElement = document.getElementById("task" + taskIndex);
    taskElement.scrollIntoView({ behavior: "smooth", block: "center" });
    try {
      await saveTaskToFirebase(task);
    } catch (error) {
      console.error("Fehler beim Speichern der tasks in der Firebase-Datenbank:", error);
    }
  }
}

function hideBoardLoadScreen() {
  document.getElementById("board-add_task-load-screen").classList.add("d-none");
}

function showBoardLoadScreen() {
  document.getElementById("board-add_task-load-screen").classList.remove("d-none");
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