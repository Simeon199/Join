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

let standardContainer = 'to-do-container';
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
  loadTasksFromDatabase();

  // All Event Listeners
  document.getElementById('add-task-button-mobile').addEventListener('click', () => {
    showAddTaskPopUp('to-do-container');
  });
  document.getElementById('add-task-button').addEventListener('click', () => {
    showAddTaskPopUp('to-do-container');
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
  document.getElementById('urgent').addEventListener('click', () => {
    changePriority(urgent);
  });
  document.getElementById('medium').addEventListener('click', () => {
    changePriority(medium);
  });
  document.getElementById('low').addEventListener('click', () => {
    changePriority(low);
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

async function loadTasksFromDatabase() {
  tasks = await getAllTasks();
  updateCategories();
  updateHTML();
}

function updateCategories() {
  categories = [...new Set(tasks.map((task) => task.container))];
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
    let oppositeElementName = `no-${container}`;
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
  // let rightIcon = insertCorrectUrgencyIcon(taskElement);
  let oppositeCategory = `no-${taskElement.container}`;
  // let contactsHTML = generateContactsHTML(taskElement);
  // console.log('task element in createToDoHTML:', taskElement);
  return generateTaskHTML(taskElement, oppositeCategory); // contactsHTML
}

function generateTaskHTML(taskElement, contactsHTML, oppositeCategory, rightIcon) {
  if (taskElement["subtask"] && taskElement["subtask"].length > 0) {
    let numberOfTasksChecked = 0;
    for (let index = 0; index < taskElement["subtask"].length; index++) {
      if (taskElement["subtask"][index]["is-tasked-checked"] == true) {
        numberOfTasksChecked += 1;
      }
    }
    let taskbarWidth = Math.round((numberOfTasksChecked / taskElement["subtask"].length) * 100);
    let taskObject = {
      'taskElement': taskElement,
      'oppositeCategory': oppositeCategory,
      'rightIcon': rightIcon,
      'taskbarWidth': taskbarWidth,
      'numberOfTasksChecked': numberOfTasksChecked
    };
    returnTaskHtmlWithSubtask(taskObject); 
  } else if (taskElement["subtask"] && taskElement["subtask"].length == 0) {
    return returnTaskHtmlWithoutSubtask(taskElement, contactsHTML, oppositeCategory, rightIcon); // jsonTextElement
  } else {
    return returnTaskHtmlWithoutSubtask(taskElement, contactsHTML, oppositeCategory, rightIcon); // jsonTextElement
  }
}

async function returnTaskHtmlWithSubtask(taskObject){
  let taskIndex = taskObject.taskElement.id;
  let taskDescription = taskObject.taskElement.description;
  if (taskDescription.length > 40) {
    taskDescription = taskDescription.substring(0, 40) + "...";
  }
  let template = await loadTemplateForTaskOnBoardAndAssignIds(taskObject, taskIndex);
  return template;
}

async function loadTemplateForTaskOnBoardAndAssignIds(taskObject, taskIndex){
  let template = await shared.initHTMLContent('../../board/templates/board_subtask_templates/taskHtmlWithSubtask.tpl', taskObject.taskElement.container);
  template.id = `task${taskIndex}`;
  template.querySelector('.task-category').style.backgroundColor = checkCategoryColor(taskObject.taskElement.category);
  template.querySelector('.task-category').innerHTML =  taskObject.taskElement.category;
  template.querySelector('.dropdownSVG').id = `dropdown${taskIndex}`;
  template.querySelector('.mobileDropdown').id = `mobileDropdown${taskIndex}`;
  template.querySelector('.task-title').innerHTML = taskObject.taskElement.title;
  template.querySelector('.task-description').innerHTML = taskObject.taskElement.description;
  template.querySelector('.task-bar-content').style.width = `${taskObject.taskbarWidth}%`;
  template.querySelector('.task-bar-text').innerHTML = `${taskObject.numberOfTasksChecked}/${taskObject.taskElement.subtask.length} Subtasks`;
  template.querySelector('.task-contacts').innerHTML = generateContactsHTML(taskObject.taskElement);
  template.querySelector('.priority-icon').appendChild(await insertCorrectUrgencyIcon(taskObject.taskElement));
  manageEventListenersOnTaskDiv(taskObject, taskIndex);
}

async function insertCorrectUrgencyIcon(element) {
  let svgElement;
  if (element["priority"] === "urgent") {
    svgElement = await feedbackAndUrgency.generateHTMLUrgencyUrgent();
  } else if (element["priority"] === "low") {
    svgElement = await feedbackAndUrgency.generateHTMLUrgencyLow();
  } else if (element["priority"] === "medium") {
    svgElement = await feedbackAndUrgency.generateHTMLUrgencyMedium();
  }
  return svgElement;
}

function manageEventListenersOnTaskDiv(taskObject, taskIndex){
  handleMoveTasksEvents(taskIndex);
  handleDropEventsForMobileVersion(taskObject, taskIndex);
}

function handleMoveTasksEvents(taskIndex){
  let rightMobileDrowdown = document.getElementById(`dropdown${taskIndex}`); // mobileDropdown${taskIndex}
  rightMobileDrowdown.addEventListener('click', (event) => {
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
}

function handleDropEventsForMobileVersion(taskObject, taskIndex){
  let task = document.getElementById(`task${taskIndex}`);
  task.querySelector('.dropdownSVG').addEventListener('click', (event) => {
    shared.stopEvent(event);
    openMobileDropdown(taskIndex);
  });
  task.addEventListener('click', () => {
    showBigTaskPopUp(taskObject.taskElement);
  });
  task.addEventListener('dragstart', () => {
    startDragging(taskIndex);
    rotateFunction(taskIndex);
  });
  task.addEventListener('dragend', () => {
    checkIfEmpty(taskObject.taskElement.container, taskObject.oppositeCategory);
  });
  task.addEventListener('dragover', (event) => {
    event.preventDefault();
    allowDrop(event);
  });
  task.addEventListener('drop', () => {
    moveTo(taskObject.taskElement.container);
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
  for (let i = 0; i < dropdownItems.length; i++) {
    let category = replaceSpacesWithDashes(dropdownItems[i].textContent.trim().toLowerCase() + "-container");
    if (category === currentCategory.toLowerCase()) {
      dropdownItems[i].style.display = "none";
    } else {
      dropdownItems[i].style.display = "block";
    }
  }
}

async function showBigTaskPopUp(taskElement) { 
  isBigTaskPopUpOpen = true;
  await shared.initHTMLContent('../../board/templates/big_task_pop_up_templates/big_task-pop-up-template.tpl', 'big-task-pop-up-bg');
  document.getElementById("big-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("big-task-pop-up").classList.remove("translate-100");
  document.body.style.overflow = "hidden";
  await renderBigTask(taskElement);
}

async function renderBigTask(taskElement) {
  document.getElementById("big-task-pop-up-priority-container").classList.remove("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-title-text").innerHTML = `${taskElement.title}`;
  document.getElementById("big-task-pop-up-description").innerHTML = `${taskElement.description}`; 
  document.getElementById("big-task-pop-up-date").innerHTML = `${taskElement.date}`;
  document.getElementById('big-task-pop-up-priority-text').innerHTML = `${taskElement.priority}`;
  document.getElementById("big-task-pop-up-category").innerHTML = taskElement.category;
  document.getElementById("big-task-pop-up-category").style.backgroundColor = checkCategoryColor(taskElement.category);
  // let subtaskContainer = document.getElementById("big-edit-task-subtask-container");
  // for(let i=0; i < taskElement.subtask.length; i++){
  //   subtaskContainer.innerHTML = `<li>${taskElement.subtask[i]['task-description']}</li>`;
  // }
  document.getElementById("big-task-pop-up-priority-icon").appendChild(await insertCorrectUrgencyIcon(taskElement));
  // document.getElementById("big-task-pop-up-bottom-buttons-container").innerHTML = returnDeleteEditHTML(taskJson.tasksIdentity, jsonTextElement);
  renderCorrectAssignedNamesIntoBigTask(taskElement);
  // returnHTMLBigTaskPopUpSubtaskAll();
  // renderTaskContact(taskElement);
  renderSubtask(taskElement); 
}

function renderCorrectAssignedNamesIntoBigTask(taskElement) {
  let initials = "";
  if (taskElement["assigned"] || typeof taskElement["assigned"] == Array) {
    for (let index = 0; index < taskElement["assigned"].length; index++) {
      let name = taskElement["assigned"][index]["name"];
      let nameArray = name.trim().split(" ");
      initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
      returnContactHTML(taskElement, initials, index);
      // let contactsHTML = generateContactsHTML(taskElement);
      // returnHTMLBigTaskPopUpContactAll(taskElement, name);
    }
  }
}

function renderSubtask(taskElement) { // Ersetze taskJson durch taskElement
  let correctTaskId = taskElement.id;
  if (taskElement.subtask && taskElement.subtask.length > 0) {
    renderSubtasks(taskElement.subtask, correctTaskId);
  } else {
    renderNoSubtasksMessage();
  }
}

function renderSubtasks(subtasks, taskId) { 
  // <!--- Ganz Wichtig ! ---!>

  // returnSubtaskHTMLWithBolean => Lade subtaskHtmlWithBolean.tpl
  // returnSubtaskHTML => Lade subtaskInPopUpContainer.tpl
  
  let container = document.getElementById("big-task-pop-up-subtasks-container");
  subtasks.forEach((subtask, index) => {
    container.innerHTML += subtask["is-tasked-checked"]
      ? returnSubtaskHTMLWithBolean(taskId, subtask, index)
      : returnSubtaskHTML(taskId, subtask, index);
  });
}

function renderNoSubtasksMessage() {
  let container = document.getElementById("big-task-pop-up-subtasks-container");
  container.innerHTML = `<p class='big-task-pop-up-value-text'>No Subtasks</p>`;
}

// function returnHTMLBigTaskPopUpContactAll(taskElement) {
//   let contactsHTML = generateContactsHTML(taskElement);
//   document.getElementById("big-task-pop-up-contact-all").innerHTML = `
//     <h2 class="big-task-pop-up-label-text">Assigned To:</h2>
//     <div id="big-task-pop-up-contact-container">
//       <div>${contactsHTML}</div>
//       <p>${name}</p>
//     </div>
//   `;
// }

function returnContactHTML(taskElement, initials, index){
  document.getElementById('big-task-pop-up-contact-container').innerHTML += `
    <div class="big-task-pop-up-contact">
      <div class="big-task-pop-up-profile-badge" style="background: ${taskElement.assigned[index]['color']}">${initials}</div>
      <p class="big-task-pop-up-profile-name">${taskElement.assigned[index]["name"]}</p>
    </div>`
}

function generateContactsHTML(taskElement) {
  let contactsHTML = "";
  if (taskElement.assigned) {
    let lengthOfAssignedTo = taskElement.assigned.length;
    taskElement.assigned.forEach((assignee, index) => {
      if (index < 3) {
        let initials = getInitials(assignee.name);
        contactsHTML += `<div class="task-contact" style='background-color: ${assignee.color}'>${initials}</div>`;
      } else if (index === 3) {
        contactsHTML += `<div class='taskAssignedToNumberContainer'><span>+ ${lengthOfAssignedTo - 3}</span></div>`;
      }
    });
  }
  return contactsHTML;
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

function rotateFunction(id) {
  document.getElementById(`task${id}`).style.transform = "rotate(3deg)";
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
  // try {
  //   await saveTaskToFirebase(task);
  // } catch (error) {
  //   console.error("Fehler beim Speichern der tasks in der Firebase-Datenbank:", error);
  // }
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
    // try {
    //   await saveTaskToFirebase(task);
    // } catch (error) {
    //   console.error("Fehler beim Speichern der tasks in der Firebase-Datenbank:", error);
    // }
  }
}

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

function clearCategoryContainer(categoryContainer) {
  document.getElementById(categoryContainer).innerHTML = "";
}

function handleNoTasksInCategory(categoryContainer) {
  let oppositeElementName = "no-" + categoryContainer;
  let oppositeElement = getRightOppositeElement(oppositeElementName);
  document.getElementById(categoryContainer).innerHTML = oppositeElement;
}

function getInitials(name) {
  let nameArray = name.trim().split(" ");
  let initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
  return initials;
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