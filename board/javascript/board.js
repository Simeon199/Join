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
    svgElement = feedbackAndUrgency.generateHTMLUrgencyUrgent();
  } else if (element["priority"] == "low") {
    svgElement = feedbackAndUrgency.generateHTMLUrgencyLow();
  } else if (element["priority"] == "medium") {
    svgElement = feedbackAndUrgency.generateHTMLUrgencyMedium();
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

function generateTaskHTML(element, contactsHTML, oppositeCategory, rightIcon, jsonElement) {
  let jsonTextElement = encodeURIComponent(jsonElement);
  if (element["subtask"] && element["subtask"].length > 0) {
    let numberOfTasksChecked = 0;
    for (let index = 0; index < element["subtask"].length; index++) {
      if (element["subtask"][index]["is-tasked-checked"] == true) {
        numberOfTasksChecked += 1;
      }
    }
    let taskbarWidth = Math.round((numberOfTasksChecked / element["subtask"].length) * 100);
    returnTaskHtmlWithSubtask();
    // return returnTaskHtmlWithSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskbarWidth, numberOfTasksChecked);
  } else if (element["subtask"] && element["subtask"].length == 0) {
    return returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement);
  } else {
    return returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement);
  }
}

function returnTaskHtmlWithSubtask(){
  shared.initHTMLContent('../../board/templates/big_task_pop_up_templates/big-task-pop-up-priority-container.tpl', 'big-task-pop-up-priority-container');
}

function iterateThroughSubArray(taskArray, htmlElement) {
  if(taskArray){
    for (let i = 0; i < taskArray.length; i++) {
      let task = taskArray[i];
      htmlElement.innerHTML += createToDoHTML(task);
    }
  }
  return null;
}

function checkIfEmpty(tasksDiv, divWithoutTasks) {
  let tasksDivContainer = document.getElementById(tasksDiv);
  let divWithoutTasksContainer = document.getElementById(divWithoutTasks);
  if (tasksDivContainer.innerHTML == "") {
    divWithoutTasksContainer.classList.remove("d-none");
  }
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
        iterateThroughSubArray(filteredTasks, element);
      } else {
        element.innerHTML = oppositeElement;
      }
    }
  });
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