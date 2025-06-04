import * as shared from '../../shared/javascript/shared.js';
import * as feedbackAndUrgency from './feedbackAndUrgencyTemplate.js';
import * as firebase from '../../core/firebase.js';

let tasks = [];
let categories = [];
let searchedTasks = [];
let isBigTaskPopUpOpen = false;

let allCategories = [
  "to-do-container", 
  "await-feedback-container", 
  "done-container", 
  "in-progress-container"
];

let elementDraggedOver;
let priorityValue = "";
let searchedInput = document.getElementById("search-input");
let assignedToContactsBigContainer = [];
let isSaveIconClicked = false;
let subtaskArray = [];
let checkBoxCheckedJson = {};
let emptyList = [];
let renderCurrentTaskId;
let touchTime;
let currentOpenDropdown = null;

document.addEventListener('DOMContentLoaded', async () => {
  shared.bundleLoadingHTMLTemplates();
  init_task();

  // All Event Listeners
  document.getElementById('big-task-pop-up-bg').addEventListener('mousedown', () => {
    hideBigTaskPopUp();
  });
  document.getElementById('big-task-pop-up').addEventListener('mousedown', (event) => {
    shared.stopEvent(event);
  });
  document.getElementById('big-task-pop-up').addEventListener('click', () => {
    closeAllSmallPopUpPopUps();
  });
  document.getElementById('big-task-pop-up-close-icon').addEventListener('click', () => {
    hideBigTaskPopUp();
  });
  document.getElementById('add-task-button-mobile').addEventListener('click', () => {
    showAddTaskPopUp(container='to-do-container');
  });
  document.getElementById('add-task-button').addEventListener('click', () => {
    showAddTaskPopUp(container='to-do-container');
  })
  document.getElementById('search-input').addEventListener('input', () => {
    searchForTasks();
  });
  document.querySelectorAll('.plus-icon-container')[0].addEventListener('click', () => {
    showAddTaskPopUp('to-do-container');
  });
  document.querySelectorAll('.plus-icon-container')[1].addEventListener('click', () => {
    showAddTaskPopUp('in-progress-container');  
  });
  document.querySelectorAll('.plus-icon-container')[2].addEventListener('click', () => {
    showAddTaskPopUp('await-feedback-container');
  });
  document.getElementById('to-do-container').addEventListener('dragover', (event) => {
    allowDrop(event);
  });
  document.getElementById('to-do-container').addEventListener('drop', (event) => {
    allowDrop(event);
  });
  document.getElementById('in-progress-container').addEventListener('drop', () => {
    moveTo('in-progress-container');
  });
  document.getElementById('in-progress-container').addEventListener('dragover', (event) => {
    allowDrop(event);
  });
  document.getElementById('await-feedback-container').addEventListener('dragover', (event) => {
    allowDrop(event);
  });
  document.getElementById('await-feedback-container').addEventListener('drop', () => {
    moveTo('await-feedback-container');
  });
  document.getElementById('done-container').addEventListener('dragover', (event) => {
    allowDrop(event);
  });
  document.getElementById('done-container').addEventListener('drop', () => {
    moveTo('done-container');
  });
  document.getElementById('add-task-pop-up-bg').addEventListener('click', () => {
    hideAddTaskPopUp();
  });
  document.getElementById('add-task-pop-up').addEventListener('click', (event) => {
    hideAllAddTaskPopups();
    shared.stopEvent(event);
  });
  document.getElementById('close-add-task-pop-up').addEventListener('click', () => {
    hideAddTaskPopUp();
  });
  document.getElementById('section99').addEventListener('submit', () => {
    checkRequiredFields('board');
    return false;
  });
  document.getElementById('changeTo').addEventListener('click', () => {
    changeToInputfield();
  });
  document.getElementById('searchField').addEventListener('input', () => {
    searchContacts();
  });
  document.getElementById('assignedToDropDown').addEventListener('click', (event) => {
    shared.stopEvent(event);
  });
  document.getElementById('urgent').addEventListener('click', () => {
    changePriority(urgent);
  });
  document.getElementById('medium').addEventListener('click', () => {
    changePriority(medium);
  });
  document.getElementById('low').addEventListener('click', () => {
    changePriority(low);
  });
  document.getElementById('category').addEventListener('click', (event) => {
    checkDropDown('arrowb');
    shared.stopEvent(event);
  });
  document.getElementById('subtask').addEventListener('click', (event) => {
    hideOrShowEditButtons();
    shared.stopEvent(event);
  });
  document.getElementById('clear-subtask-svg').addEventListener('click', () => {
    clearSubtaskInput();
  });
  document.getElementById('add-subtask-svg').addEventListener('click', () => {
    addSubtask();
  });
  document.getElementById('cleartask-div').addEventListener('click', () => {
    clearTask();
  });
});

async function init_task() {
  await getTasksFromDatabase();
}

async function getTasksFromDatabase() {
  await loadTasksFromDatabase();
}

function updateCategories() {
  categories = [...new Set(tasks.map((task) => task.container))];
}

async function loadTasksFromDatabase() {
  tasks = await getAllTasks();
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

async function returnTaskHtmlWithSubtask(taskElement, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskbarWidth, numberOfTasksChecked){
  let taskIndex = taskElement.id;
  let taskDescription = taskElement.description;
  if (taskDescription.length > 40) {
    taskDescription = taskDescription.substring(0, 40) + "...";
  }
  let template = await shared.initHTMLContent('../../board/templates/board_subtask_templates/taskHtmlWithSubtask.tpl', taskElement['container']);
  template.id = `task${taskIndex}`;
  let task = document.getElementById(`task${taskIndex}`); 
  template.querySelector('.task-category').style.backgroundColor = checkCategoryColor(taskElement["category"]);
  template.querySelector('.task-category').innerHTML =  taskElement["category"];
  template.querySelector('.mobileDropdown').id = `mobileDropdown${taskIndex}`;
  template.querySelector('.task-title').innerHTML = taskElement["title"];
  template.querySelector('.task-description').innerHTML = taskDescription;
  template.querySelector('.task-bar-content').style.width = `${taskbarWidth}%`;
  template.querySelector('.task-bar-text').innerHTML = `${numberOfTasksChecked}/${taskElement["subtask"].length} Subtasks`;
  template.querySelector('.task-contacts').innerHTML = contactsHTML;
  // template.querySelector('.task-contacts-container').innerHTML += rightIcon;
  // template.querySelectorAll('div')[3].id = oppositeCategory;
  // document.getElementById(oppositeCategory).innerHTML = `No tasks in ${taskElement['container']}`;
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
  template.querySelector('.dropdownSVG').addEventListener('click', (event) => {
    shared.stopEvent(event);
    openMobileDropdown(taskIndex);
  });
  task.addEventListener('click', () => {
    showBigTaskPopUp(jsonTextElement);
  });
  task.addEventListener('dragstart', () => {
    startDragging(taskIndex);
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

function openMobileDropdown(taskIndex) {
  let dropdown = document.getElementById(`mobileDropdown${taskIndex}`);
  dropdown.classList.toggle("mobileDropdown-translate-100");
  let task = tasks.find((task) => task.id === taskIndex);
  let currentCategory = task.container;
  let dropdownItems = dropdown.querySelectorAll("a");
  if (!dropdown.classList.contains("mobileDropdown-translate-100")) {
    currentOpenDropdown = dropdown;
  } else {
    currentOpenDropdown = null;
  }
  console.log('dropdownItems', dropdownItems);
  for (let i = 0; i < dropdownItems.length; i++) {
    let category = replaceSpacesWithDashes(dropdownItems[i].textContent.trim().toLowerCase() + "-container");
    if (category === currentCategory.toLowerCase()) {
      dropdownItems[i].style.display = "none";
    } else {
      dropdownItems[i].style.display = "block";
    }
  }
}

async function returnTaskHtmlWithoutSubtask(
  taskElement, 
  contactsHTML, 
  oppositeCategory, 
  rightIcon, 
  jsonTextElement, 
  taskbarWidth, 
  numberOfTasksChecked
){
  let template = await shared.initHTMLContent('../../board/templates/board_subtask_templates/taskHtmlWithoutSubtask.tpl', taskElement['container']);
  template.id = `task${taskElement['id']}`;
}

function generateContactHTML(element, index, lengthOfAssignedTo) {
  if (index < 3) {
    let name = element.assigned[index].name;
    let initials = getInitials(name);
    return `<div class="task-contact" style='background-color: ${element.assigned[index].color}'>${initials}</div>`;
  } else if (index === 3) {
    return `<div class='taskAssignedToNumberContainer'><span>+ ${lengthOfAssignedTo - 3}</span></div>`;
  } else {
    updateTaskContactPlusHTML(element, lengthOfAssignedTo);
    return "";
  }
}

function updateTaskContactPlusHTML(element, lengthOfAssignedTo) {
  let container = document.querySelectorAll("taskAssignedToNumberContainer")[element.id];
  if (container) {
    container.innerHTML = showTaskContactPlusHTML(lengthOfAssignedTo);
  }
}

function updateBigTaskContactsContainerPlus(taskJson, lengthOfAssignedTo) {
  let container = document.querySelectorAll("bigTaskAssignedToNumberContainer")[taskJson.id];
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
  let task = tasks.find((task) => task.id == elementDraggedOver);
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

async function moveTasksToCategory(taskIndex, newCategory) {
  let task = tasks.find((task) => task.id === taskIndex);
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

// board_assigned_to.js

function renderCorrectAssignedNamesIntoBigTask(taskJson) {
  let contactsHTML = "";
  let initials = "";
  if (taskJson["assigned"] || typeof taskJson["assigned"] == Array) {
    for (let index = 0; index < taskJson["assigned"].length; index++) {
      let name = taskJson["assigned"][index]["name"];
      let nameArray = name.trim().split(" ");
      initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
    }
  }
  returnHTMLBigTaskPopUpContactAll(contactsHTML);
}

async function addCheckedStatus(i, correctTaskId) {
  let subtasks = tasks[correctTaskId]["subtask"];
  let checkBoxChecked = toggleCheckboxIcons(i);
  updateCheckboxStatus(i, checkBoxChecked);
  depositSubtaskChanges(correctTaskId, subtasks);
}

function toggleCheckboxIcons(i) {
  let checkBoxIconUnchecked = document.getElementById(`checkBoxIconUnchecked${i}`);
  let checkBoxIconChecked = document.getElementById(`checkBoxIconChecked${i}`);
  if (!checkBoxIconUnchecked.classList.contains("d-none") && checkBoxIconChecked.classList.contains("d-none")) {
    checkBoxIconUnchecked.classList.add("d-none");
    checkBoxIconChecked.classList.remove("d-none");
    return true;
  } else if (!checkBoxIconChecked.classList.contains("d-none") && checkBoxIconUnchecked.classList.contains("d-none")) {
    checkBoxIconUnchecked.classList.remove("d-none");
    checkBoxIconChecked.classList.add("d-none");
    return false;
  }
}

function updateCheckboxStatus(i, checkBoxChecked) {
  checkBoxCheckedJson[i] = checkBoxChecked;
}

function renderTaskContact(taskJson) {
  assignedToContactsBigContainer = taskJson.assigned;
  if (taskJson.assigned && taskJson.assigned.length > 0) {
    taskJson.assigned.forEach((contact) => {
      document.getElementById("big-task-pop-up-contact-container").innerHTML += returnAssignedContactHTML(contact);
    });
  } else if (taskJson.assigned && taskJson.assigned.length == 0) {
    document.getElementById("big-task-pop-up-contact-container").innerHTML = /*html*/ `  
    <p class='big-task-pop-up-value-text'>No One Assigned</p>
    `;
  } else {
    document.getElementById("big-task-pop-up-contact-container").innerHTML = /*html*/ `  
    <p class='big-task-pop-up-value-text'>No One Assigned</p>
    `;
  }
}

function renderEditTask(jsonTextElement, id) {
  let taskJson = JSON.parse(decodeURIComponent(jsonTextElement));
  let oldPriority = taskJson.priority;
  let oldTitle = document.getElementById("big-task-pop-up-title-text").innerHTML;
  let oldDescription = document.getElementById("big-task-pop-up-description").innerHTML;
  let oldDate = document.getElementById("big-task-pop-up-date").innerHTML;
  document.getElementById("big-task-pop-up-category").innerHTML = "";
  document.getElementById("big-task-pop-up-category").style = "background-color: white;";
  renderCurrentTaskId = id;
  renderAllBigPopUp(oldTitle, oldDescription, oldDate, oldPriority, taskJson, id);
}

function toggleEditTaskAssignedToPopUp() {
  document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.toggle("height-0");
  document.getElementById("big-edit-task-assigned-to-pop-up").classList.toggle("box-shadow-none");
  document.getElementById("big-edit-task-assigned-to-input-arrow").classList.toggle("rotate-90");
  toggleFocusAssignedToInput();
}

function closeAllSmallPopUpPopUps() {
  if (document.getElementById("big-edit-task-title-input")) {
    document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.add("height-0");
    document.getElementById("big-edit-task-assigned-to-pop-up").classList.add("box-shadow-none");
    document.getElementById("big-edit-task-assigned-to-input-arrow").classList.remove("rotate-90");
    insertSubtasksIntoContainer();
  }
}

function toggleFocusAssignedToInput() {
  if (document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.contains("height-0")) {
    document.getElementById("big-edit-task-assigned-to-input").blur();
  } else {
    document.getElementById("big-edit-task-assigned-to-input").focus();
  }
}

function renderBigTaskAssignedContactContainer(taskJson) {
  let lengthOfAssignedTo = taskJson.assigned.length;
  document.getElementById("big-edit-task-assigned-to-contact-container").innerHTML = "";
  if (taskJson.assigned) {
    for (let i = 0; i < taskJson.assigned.length; i++) {
      const contact = taskJson.assigned[i];
      returnColorAndAssignedToContacts(contact, i, lengthOfAssignedTo, taskJson);
    }
  } else {
    taskJson.assigned = [];
    returnNoOneIsAssignedHTML();
  }
}

function renderBigEditTaskAssignedToPopUp(taskJson) {
  for (let i = 0; i < allUsers.length; i++) {
    let taskIndex = taskJson.tasksIdentity;
    const contact = allUsers[i];
    let allNames = [];
    for (let j = 0; j < taskJson.assigned.length; j++) {
      const assignedContact = taskJson.assigned[j];
      if (contact.name === taskJson.assigned[j].name) {
        let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: true });
        renderOnlyActiveAssignedToPopUp(contact, contactObject, i, taskIndex);
        allNames.push(contact.name);
      }
    }
    if (!allNames.includes(contact.name)) {
      let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: false });
      renderOnlyAssignedToPopUp(contact, contactObject, i, taskIndex);
      allNames.push(contact.name);
    }
    renderOnlySubtaskContainerPopUp(taskJson);
  }
}

function checkBigEditTaskContact(i, contactObject, taskIndex) {
  if (tasks[taskIndex].assigned) {
    assignedToContactsBigContainer = tasks[taskIndex].assigned;
  } else {
    assignedToContactsBigContainer = [];
  }
  HTMLContactContainer = document.querySelectorAll(".big-edit-task-assigned-to-pop-up-contact-container")[i];
  HTMLContactContainer.classList.toggle("big-edit-task-assigned-to-pop-up-active-contact");
  if (HTMLContactContainer.classList.contains("big-edit-task-assigned-to-pop-up-active-contact")) {
    contactObject["isSelected"] = true;
    addContactToAssigned(contactObject, taskIndex);
    returnBigEditTaskAssignedToPopUpContactCheckboxIconHTML(i);
  } else {
    contactObject["isSelected"] = false;
    deleteContactToAssigned(contactObject, taskIndex);
    returnBigEditTaskAssignedToPopUpContactCheckboxSecondIconHTML(i);
  }
}

function addContactToAssigned(contactObject, taskIndex) {
  let taskJson = tasks[taskIndex];
  assignedToContactsBigContainer.push(contactObject);
  taskJson.assigned = assignedToContactsBigContainer;
  renderBigTaskAssignedContactContainer(taskJson);
}

function deleteContactToAssigned(contactObject, taskIndex) {
  let taskJson = tasks[taskIndex];
  let contactObjectIndex = assignedToContactsBigContainer.findIndex((jsonObject) => jsonObject.name === contactObject.name);
  assignedToContactsBigContainer.splice(contactObjectIndex, 1);
  renderBigTaskAssignedContactContainer(taskJson);
}

function changeSaveIconClickedOnStatus() {
  if (isSaveIconClicked == false) {
    isSaveIconClicked = true;
  }
}

function insertSubtasksIntoContainer() {
  document.getElementById("big-edit-task-subtask-container").innerHTML = "";
  document.getElementById("big-edit-task-subtask-container").innerHTML = "";
  if (subtaskArray && subtaskArray.length >= 1) {
    for (let i = 0; i < subtaskArray.length; i++) {
      let subtask = subtaskArray[i];
      document.getElementById("big-edit-task-subtask-container").innerHTML += renderSubtaskInPopUpContainer(i, subtask);
    }
  } else if (subtaskArray && subtaskArray.length == 0 && tasks[renderCurrentTaskId]["subtask"]) {
  } else if (!subtaskArray && !tasks[renderCurrentTaskId]["subtask"]) {
    document.getElementById("big-edit-task-subtask-container").innerHTML += "";
  }
}

// board_big_task_related.js

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

function hideAddTaskPopUp() {
  document.body.style.overflow = "unset";
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

async function showBigTaskPopUp(jsonTextElement) {
  isBigTaskPopUpOpen = true;
  await shared.initHTMLContent('../../board/templates/big_task_pop_up_templates/big_task-pop-up-template.tpl', 'big-task-pop-up-bg');
  document.getElementById("big-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("big-task-pop-up").classList.remove("translate-100");
  document.body.style.overflow = "hidden";
  renderBigTask(jsonTextElement);
}

async function renderBigTask(jsonTextElement) {
  let taskJson = JSON.parse(decodeURIComponent(jsonTextElement));
  console.log('taskJson', taskJson);
  document.getElementById("big-task-pop-up-priority-container").classList.remove("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-title").innerHTML = `<h1 id='big-task-pop-up-title-text'>${taskJson.title}</h1>`;
  document.getElementById("big-task-pop-up-description").innerHTML = taskJson.description;
  document.getElementById('big-task-pop-up-priority-text').innerHTML = `${taskJson.priority}`;
  document.getElementById("big-task-pop-up-category").innerHTML = taskJson.category;
  document.getElementById("big-task-pop-up-category").style.backgroundColor = checkCategoryColor(taskJson.category);
  document.getElementById("big-task-pop-up-priority-icon").innerHTML = checkPriorityIcon(taskJson.priority);
  document.getElementById("big-task-pop-up-bottom-buttons-container").innerHTML = returnDeleteEditHTML(taskJson.tasksIdentity, jsonTextElement);
  renderCorrectAssignedNamesIntoBigTask(taskJson);
  returnHTMLBigTaskPopUpSubtaskAll();
  renderTaskContact(taskJson);
  renderSubtask(taskJson);
}

function hideBigTaskPopUp() {
  isBigTaskPopUpOpen = false;
  document.getElementById("big-task-pop-up-title").classList.remove("big-task-pop-up-input-error");
  document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-task-pop-up-input-error");
  document.getElementById("big-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("big-task-pop-up").classList.add("translate-100");
  document.body.style.overflow = "unset";
  // if (document.getElementById("big-task-pop-up-title-text")) {
  //   let title = document.getElementById("big-task-pop-up-title-text").innerHTML;
  //   let id = tasks.findIndex((task) => task.title === title);
  //   saveSubtaskChanges(id);
  // }
}

function checkPriorityIcon(priorityText) {
  if (priorityText === "urgent") {
    return feedbackAndUrgency.generateHTMLUrgencyUrgent();
  } else if (priorityText === "medium") {
    return feedbackAndUrgency.generateHTMLUrgencyMedium();
  } else if (priorityText === "low") {
    return feedbackAndUrgency.generateHTMLUrgencyLow();
  }
}

function renderAllBigPopUp(oldTitle, oldDescription, oldDate, oldPriority, taskJson, id) {
  setupSubtaskArray(taskJson, id);
  renderPopUpElements(oldTitle, oldDescription, oldDate, oldPriority, id);
  renderBigTaskDetails(taskJson, oldPriority, id);
}

function renderPopUpElements(oldTitle, oldDescription, oldDate, oldPriority, id) {
  returnBigTaskPopUpTitle(oldTitle);
  returnBigTaskPopUpDescription(oldDescription);
  renderBigTaskPopUpSection("big-task-pop-up-due-date-container", oldDate, returnBigTaskPopUpDueDateContainer);
  renderBigTaskPopUpSection("big-task-pop-up-priority-container", oldPriority, returnBigTaskPopUpPriorityContainer);
  priorityValue = oldPriority;
  document.getElementById("big-edit-task-" + oldPriority.toLowerCase() + "-priority").classList.add("big-edit-task-" + oldPriority.toLowerCase() + "-priority-aktiv");
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

function renderTasksInCategory(tasks, categoryContainer) {
  tasks.forEach((task) => {
    if (categoryContainer === task.container) {
      let jsonElement = JSON.stringify(task);
      let rightIcon = insertCorrectUrgencyIcon(task);
      let variableClass = setVariableClass(task);
      let oppositeCategory = "no-" + task.container;
      let contactsHTML = generateContactsHTML(task);
      document.getElementById(categoryContainer).innerHTML += generateTaskHTML(task, contactsHTML, oppositeCategory, rightIcon, jsonElement);
    }
  });
}

// board_edit.js file


function clearPopUp() {
  document.getElementById("big-edit-task-assigned-to-pop-up").innerHTML = "";
}

function checkIfAssigned(contact, taskIndex) {
  return tasks[taskIndex].assigned.some((assignedContact) => assignedContact.name === contact.name);
}

function renderContact(contact, contactIndex, taskIndex, isAssigned) {
  let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: isAssigned });
  if (isAssigned) {
    renderOnlyActiveAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
  } else {
    renderOnlyAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
  }
}

// async function saveTaskChanges(id) {
//   let newTitle = getInputValue("big-edit-task-title-input");
//   let newDescription = getInputValue("big-edit-task-description-input");
//   let newDate = getInputValue("big-edit-task-due-date-input");
//   if (validateInputs(newTitle, newDate)) {
//     showBoardLoadScreen();
//     removeInputErrors();
//     let taskForEditing = createTaskObject(newTitle, newDescription, newDate);
//     try {
//       await processTaskEditing(id, taskForEditing);
//     } catch (error) {
//       console.error("Fehler beim Speichern der Änderungen: ", error);
//     }
//     resetSubtasks();
//     updateHTML();
//     hideBoardLoadScreen();
//   }
// }

function getInputValue(elementId) {
  return document.getElementById(elementId).value;
}

function validateInputs(title, date) {
  if (title === "" && date === "") {
    addInputError("big-task-pop-up-title");
    addInputError("big-task-pop-up-due-date-container");
    return false;
  } else if (title === "") {
    addInputError("big-task-pop-up-title");
    removeInputError("big-task-pop-up-due-date-container");
    return false;
  } else if (date === "") {
    addInputError("big-task-pop-up-due-date-container");
    removeInputError("big-task-pop-up-title");
    return false;
  }
  return true;
}

function addInputError(elementId) {
  document.getElementById(elementId).classList.add("big-task-pop-up-input-error");
}

function removeInputError(elementId) {
  document.getElementById(elementId).classList.remove("big-task-pop-up-input-error");
}

function removeInputErrors() {
  removeInputError("big-task-pop-up-title");
  removeInputError("big-task-pop-up-due-date-container");
}

function createTaskObject(title, description, date) {
  return {
    newTitle: title,
    newDescription: description,
    newDate: date,
    newPriority: priorityValue,
    newAssignedTo: assignedToContactsBigContainer,
    newSubtaskArray: subtaskArray,
  };
}

function createTaskForEditing(task) {
  let { title, description, date, priority, subtask, assigned } = task;
  let taskForEditing = {
    newTitle: title,
    newDescription: description,
    newDate: date,
    newPriority: priority,
    newSubtaskArray: subtask,
  };
  if (assigned) {
    taskForEditing.newAssignedTo = assigned;
  }
  return taskForEditing;
}

// async function processTaskEditing(id, taskForEditing) {
//   let newTaskReady = await updateTasksThroughEditing(id, taskForEditing);
//   let newJsonElement = JSON.stringify(newTaskReady);
//   let newJsontextElement = encodeURIComponent(newJsonElement);
//   renderBigTask(newJsontextElement);
// }

function checkBigEditTaskPriority(priority) {
  if (priority == "urgent") {
    document.getElementById("big-edit-task-urgent-priority").classList.add("big-edit-task-urgent-priority-aktiv");
    document.getElementById("big-edit-task-medium-priority").classList.remove("big-edit-task-medium-priority-aktiv");
    document.getElementById("big-edit-task-low-priority").classList.remove("big-edit-task-low-priority-aktiv");
  } else if (priority == "medium") {
    document.getElementById("big-edit-task-medium-priority").classList.add("big-edit-task-medium-priority-aktiv");
    document.getElementById("big-edit-task-low-priority").classList.remove("big-edit-task-low-priority-aktiv");
    document.getElementById("big-edit-task-urgent-priority").classList.remove("big-edit-task-urgent-priority-aktiv");
  } else if (priority == "low") {
    document.getElementById("big-edit-task-low-priority").classList.add("big-edit-task-low-priority-aktiv");
    document.getElementById("big-edit-task-medium-priority").classList.remove("big-edit-task-medium-priority-aktiv");
    document.getElementById("big-edit-task-urgent-priority").classList.remove("big-edit-task-urgent-priority-aktiv");
  }
  return savePriorityValue(priority);
}

function savePriorityValue(priority) {
  priorityValue = priority;
  return priorityValue;
}

// async function updateTasksThroughEditing(taskId, objectForEditing) {
//   let task = tasks[taskId];
//   let updatedTask = await updateTask(task, taskId, objectForEditing);
//   checkBoxCheckedJson = {};
//   return updatedTask;
// }

// async function updateTask(task, taskId, objectForEditing) {
//   let container = task.container;
//   let category = task.category;
//   tasks[taskId] =
//     task.subtask || subtaskArray != null
//       ? saveChangesWithSubtask(taskId, objectForEditing, container, category)
//       : saveChangesWithoutSubtask(taskId, objectForEditing, container, category);
//   await saveTaskWithCatch(tasks[taskId]);
//   return tasks[taskId];
// }

// async function saveTaskWithCatch(task) {
//   try {
//     await saveTaskToFirebase(task);
//   } catch (error) {
//     console.error("Fehler beim Hochladen der Daten: ", error);
//   }
// }

async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
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

function clearCategoryContainer(categoryContainer) {
  document.getElementById(categoryContainer).innerHTML = "";
}

function handleNoTasksInCategory(categoryContainer) {
  let oppositeElementName = "no-" + categoryContainer;
  let oppositeElement = getRightOppositeElement(oppositeElementName);
  document.getElementById(categoryContainer).innerHTML = oppositeElement;
}

// function generateContactsHTML(task) {
//   let contactsHTML = "";
//   if (task.assigned) {
//     let lengthOfAssignedTo = task.assigned.length;
//     task.assigned.forEach((assignee, index) => {
//       if (index < 3) {
//         let initials = getInitials(assignee.name);
//         contactsHTML += `<div class="task-contact" style='background-color: ${assignee.color}'>${initials}</div>`;
//       } else if (index === 3) {
//         contactsHTML += `<div class='taskAssignedToNumberContainer'><span>+ ${lengthOfAssignedTo - 3}</span></div>`;
//       }
//     });
//   }
//   return contactsHTML;
// }

function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}

function getInitials(name) {
  let nameArray = name.trim().split(" ");
  let initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
  return initials;
}

// board_filter_and_search.js file

function editPopUpSearchContacts(taskIndex) {
  let searchValue = getSearchValue();
  let searchedUsers = filterUsersByName(searchValue);
  clearPopUp();
  searchedUsers.forEach((contact) => {
    let contactIndex = findUserIndex(contact);
    let isAssigned = checkIfAssigned(contact, taskIndex);
    renderContact(contact, contactIndex, taskIndex, isAssigned);
  });
}

function getSearchValue() {
  return document.getElementById("big-edit-task-assigned-to-input").value.trim().toLowerCase();
}

function filterUsersByName(searchValue) {
  return allUsers.filter((user) => user.name.toLowerCase().startsWith(searchValue));
}

function findUserIndex(contact) {
  return allUsers.findIndex((user) => user.name === contact.name);
}

function searchForTasks() {
  let searchValue = document.getElementById("search-input").value.trim().toLowerCase();
  searchedTasks = [];
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    if (task.title.toLowerCase().includes(searchValue) || task.description.toLowerCase().includes(searchValue)) {
      searchedTasks.push(task);
    }
  }
  renderSearchedTasks();
}

function renderSearchedTasks() {
  allCategories.forEach((categoryContainer) => {
    clearCategoryContainer(categoryContainer);
    let tasksInCategory = filterTasksByCategory(categoryContainer, searchedTasks);
    if (tasksInCategory.length === 0) {
      handleNoTasksInCategory(categoryContainer);
    } else if (searchedTasks.length < tasks.length) {
      renderTasksInCategory(tasksInCategory, categoryContainer);
    } else {
      updateHTML();
    }
  });
}

function filterTasksByCategory(categoryContainer, tasks) {
  return tasks.filter((task) => task.container === categoryContainer);
}

// manageSubtask.js file

function renderSubtask(taskJson) {
  let correctTaskId = taskJson.tasksIdentity;
  let container = document.getElementById("big-task-pop-up-subtasks-container");

  if (taskJson.subtask && taskJson.subtask.length > 0) {
    renderSubtasks(taskJson.subtask, correctTaskId, container);
  } else {
    renderNoSubtasksMessage(container);
  }
}

function renderSubtasks(subtasks, taskId, container) {
  subtasks.forEach((subtask, index) => {
    container.innerHTML += subtask["is-tasked-checked"]
      ? returnSubtaskHTMLWithBolean(taskId, subtask, index)
      : returnSubtaskHTML(taskId, subtask, index);
  });
}

function renderNoSubtasksMessage(container) {
  container.innerHTML = `
    <p class='big-task-pop-up-value-text'>No Subtasks</p>
  `;
}

async function depositSubtaskChanges(correctTaskId, subtasks) {
  for (let index = 0; index < subtasks.length; index++) {
    if (checkBoxCheckedJson.hasOwnProperty(index)) {
      subtasks[index]["is-tasked-checked"] = checkBoxCheckedJson[index];
    }
  }
  subtaskArray = subtasks;
  await saveChangedSubtaskToFirebase(correctTaskId);
}

async function saveChangedSubtaskToFirebase(correctTaskId) {
  let taskPath = `/testRealTasks/${correctTaskId}/subtask`;
  let response = await fetch(`${BASE_URL}${taskPath}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subtaskArray),
  });
  if (!response.ok) {
    console.error("Fehler beim Speichern der Task in Firebase:", response.status, response.statusText);
  } else {
  }
}

function renderOnlySubtaskContainerPopUp(taskJson) {
  document.getElementById("big-edit-task-subtask-container").innerHTML = "";
  subtaskArray = taskJson.subtask;
  if (taskJson.subtask) {
    for (let i = 0; i < taskJson.subtask.length; i++) {
      let subtask = taskJson.subtask[i];
      document.getElementById("big-edit-task-subtask-container").innerHTML += renderSubtaskInPopUpContainer(i, subtask);
    }
  }
}

function focusSubtaskInput() {
  document.getElementById("big-edit-task-subtask-input").focus();
}

function changeSubtaskInputIcons() {
  let subtaskInputIconContainer = document.getElementById("big-edit-task-subtask-input-icon-container");
  let subtaskInputValue = document.getElementById("big-edit-task-subtask-input");
  if (subtaskInputValue.value === "") {
    subtaskInputIconContainer.innerHTML = returnSubtaskInputHTMLPlusIconSVG();
  } else {
    subtaskInputIconContainer.innerHTML = returnSubtaskInputHTMLCloseIcon();
  }
}

function resetSubtaskInput() {
  document.getElementById("big-edit-task-subtask-input").value = "";
  changeSubtaskInputIcons();
}

function buildSubtaskArrayForUpload() {
  if (!subtaskArray) {
    subtaskArray = emptyList;
  }
  let subtaskInput = document.getElementById("big-edit-task-subtask-input");
  if (subtaskInput.value.trim().length > 0) {
    let subtaskJson = createSubtaskJson(subtaskInput.value);

    subtaskArray.push(subtaskJson);
    insertSubtasksIntoContainer();
    subtaskInput.value = "";
  }
}

function editSubtaskPopUpInput(i) {
  insertSubtasksIntoContainer();
  container = document.getElementById(`subtaskNumber${i}`);
  container.onmouseover = null;
  container.onmouseout = null;
  container.innerHTML = returnSubtaskEditedPopUpHTMLContainer(i);
}

function saveEditedSubtaskPopUp(i) {
  let text = document.getElementById(`subtaskEditedPopUp`).value;
  if (text == "") {
    markFalseEditSubtaskInput(`subtaskEditedPopUp`, i);
  } else {
    subtaskArray[i]["task-description"] = text;
    insertSubtasksIntoContainer();
  }
}

function markFalseEditSubtaskInput(inputString, i) {
  let subtaskContainer = document.getElementById(`big-task-pop-up-subtask-all`);
  subtaskContainer.innerHTML += returnMessageFalseInputValueHTML();
}

function deleteSubtaskPopUp(i) {
  subtaskArray.splice(i, 1);
  insertSubtasksIntoContainer();
}

async function getSubtaskFromDataBase(id) {
  let oldTaskAll = await loadRelevantData(`/testRealTasks/${id}`);
  if (oldTaskAll.subtask) {
    return oldTaskAll.subtask;
  } else {
    let subtaskArray = [];
    return subtaskArray;
  }
}

function resetSubtasks() {
  subtaskArray = [];
  checkBoxCheckedJson = {};
}

// async function saveSubtaskChanges(id) {
//   let task = tasks[id];
//   let taskForEditing = createTaskForEditing(task);
//   try {
//     await processTaskEditing(id, taskForEditing);
//   } catch (error) {
//   }
//   resetSubtasks();
//   updateHTML();
// }

function saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category) {
  tasks[taskId] = {
    assigned: objectForEditing["newAssignedTo"],
    category: category,
    container: container,
    date: objectForEditing["newDate"],
    description: objectForEditing["newDescription"],
    priority: objectForEditing["newPriority"],
    tasksIdentity: taskId,
    title: objectForEditing["newTitle"],
    subtask: objectForEditing["newSubtaskArray"],
  };
  let newTask = tasks[taskId];
  assignedToContactsBigContainer = [];
  return newTask;
}

function saveChangesSingleTaskWithoutSubtask(taskId, objectForEditing, container, category) {
  tasks[taskId] = {
    assigned: objectForEditing["newAssignedTo"],
    category: category,
    container: container,
    date: objectForEditing["newDate"],
    description: objectForEditing["newDescription"],
    priority: objectForEditing["newPriority"],
    tasksIdentity: taskId,
    title: objectForEditing["newTitle"],
  };
  let newTask = tasks[taskId];
  assignedToContactsBigContainer = [];
  return newTask;
}

function saveChangesWithSubtask(taskId, objectForEditing, container, category) {
  return saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category);
}

function saveChangesWithoutSubtask(taskId, objectForEditing, container, category) {
  return saveChangesSingleTaskWithoutSubtask(taskId, objectForEditing, container, category);
}

function bigEditTaskSubtaskInputCheckEnter(event) {
  if (event.key === "Enter") {
    buildSubtaskArrayForUpload();
  }
}

function setupSubtaskArray(taskJson) {
  subtaskArray = taskJson.subtask || [];
  taskJson.subtask = subtaskArray;
}

// Sonstiges 

function returnColorAndAssignedToContacts(contact, index, lengthOfAssignedTo, taskJson) {
  if (index < 3) {
    document.getElementById("big-edit-task-assigned-to-contact-container").innerHTML += `
    <div class='big-edit-task-assigned-to-contact' style='background-color:${contact.color}'>
      ${firstLetterFirstTwoWords(contact.name)}
    </div>
  `;
  } else if (index === 3) {
    document.getElementById(
      "big-edit-task-assigned-to-contact-container"
    ).innerHTML += `<div class='bigTaskAssignedToNumberContainer'><span>+ ${lengthOfAssignedTo - 3}</span></div>`;
  } else {
    updateBigTaskContactsContainerPlus(taskJson, lengthOfAssignedTo);
    return "";
  }
}