import * as shared from '../../shared/javascript/shared.js';
import * as feedbackAndUrgency from './feedbackAndUrgencyTemplate.js';
import * as data from '../../core/reactiveData.js';

// import * as firebase from '../../core/firebase.js';

let boardTemplatePrefix = '../../board/templates';
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

// --- Rendering Process Starts Here ---

document.addEventListener('DOMContentLoaded', async () => {
  await shared.bundleLoadingHTMLTemplates();
  await loadTasksFromDatabase();
  handleEventListenersAfterDOMLoaded();
});

function updateCategories() {
  categories = [...new Set(tasks.map((task) => task.container))];
}

async function loadTasksFromDatabase() {
  tasks = await data.getAllTasks();
  updateCategories();
  await updateHTML();
}

export async function updateHTML() {
  for (const container of allCategories) {
    let element = document.getElementById(container);
    if (element) { 
      let filteredTasks = tasks.filter((task) => task.container === container);
      let remainingTasks = tasks.filter((task) => task.container !== container);
      element.innerHTML = "";
      if (filteredTasks.length > 0) {
        await iterateThroughSubArray(filteredTasks, container);
      } else if(remainingTasks.length > 0){
        let oppositeElementName = `no-${container}`;
        element.appendChild(await feedbackAndUrgency.getRightOppositeElement(oppositeElementName));
      }
    }
  }
}

async function iterateThroughSubArray(taskArray, containerName) {
  let htmlElement = document.getElementById(containerName);
  if(taskArray){
    for (let i = 0; i < taskArray.length; i++) {
      let task = taskArray[i];
      let result = await createToDoHTML(task);
      htmlElement.appendChild(result);
    }
  }
  return null;
}

async function createToDoHTML(taskElement) {
  let oppositeCategory = `no-${taskElement.container}`;
  return await generateTaskHTML(taskElement, oppositeCategory); 
}

async function generateTaskHTML(taskElement, oppositeCategory) {
  if (doesSubtaskObjectExistWithPositiveLength(taskElement)) {
    return await prepareTaskWithSubtaskAndCreateIt(taskElement, oppositeCategory);
  } else if (doesSubtaskObjectExistWithLengthEqualsNull(taskElement)) {
    return await returnTaskHtmlWithoutSubtask(taskElement, oppositeCategory); 
  } else {
    return await returnTaskHtmlWithoutSubtask(taskElement, oppositeCategory); 
  }
}

function doesSubtaskObjectExistWithPositiveLength(taskElement){
  return taskElement["subtask"] && taskElement["subtask"].length > 0
}

async function prepareTaskWithSubtaskAndCreateIt(taskElement, oppositeCategory){
  let numberOfTasksChecked = 0;
  let taskObject = calculateNumberOfCheckedSubtasksAndCreateTaskObject(taskElement, oppositeCategory, numberOfTasksChecked); 
  return await returnTaskHtmlWithSubtask(taskObject);
}

function calculateNumberOfCheckedSubtasksAndCreateTaskObject(taskElement, oppositeCategory, numberOfTasksChecked){
  computeNumberOfSubtasksChecked(numberOfTasksChecked, taskElement);
  let taskbarWidth = Math.round((numberOfTasksChecked / taskElement["subtask"].length) * 100);
  let taskObject = {
    'taskElement': taskElement,
    'oppositeCategory': oppositeCategory,
    'taskbarWidth': taskbarWidth,
    'numberOfTasksChecked': numberOfTasksChecked
  };
  return taskObject;
}

function computeNumberOfSubtasksChecked(numberOfTasksChecked, taskElement){
  for (let index = 0; index < taskElement["subtask"].length; index++) {
    if (isSubtaskChecked(taskElement, index)) {
      numberOfTasksChecked += 1;
    }
  }
}

function isSubtaskChecked(taskElement, index){
  return taskElement["subtask"][index]["is-tasked-checked"] === true
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
  let templateObject = await shared.initHTMLContent(`${boardTemplatePrefix}/board_subtask_templates/taskHtmlWithSubtask.tpl`, taskObject.taskElement.container);
  let templateIdentity = `task${taskIndex}`;
  templateObject.id = templateIdentity;
  let template = await assignIdsToTemplate(templateIdentity, taskObject, taskIndex);  
  manageEventListenersOnTaskDiv(taskObject, taskIndex);
  return template;
}

async function assignIdsToTemplate(templateIdentity, taskObject, taskIndex){
  let template = document.getElementById(templateIdentity);
  template.setAttribute('draggable', 'true');
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
  return template;
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

function doesSubtaskObjectExistWithLengthEqualsNull(taskElement){
  return taskElement["subtask"] && taskElement["subtask"].length === 0;
}

async function returnTaskHtmlWithoutSubtask(taskElement, oppositeCategory){
  let id = `task${taskElement['id']}`;
  let templateObject = await shared.initHTMLContent(`${boardTemplatePrefix}/board_subtask_templates/taskHtmlWithoutSubtask.tpl`, taskElement['container']);
  templateObject.id = id;
  let template = await assignIdsAndContentToTaskWithoutSubtask(id, taskElement);
  handleTaskWithoutSubtaskEventlisteners(id, taskElement, oppositeCategory);
  handleMoveTasksEvents(taskElement.id);
  return template;
}

async function assignIdsAndContentToTaskWithoutSubtask(id, taskElement){
  let taskRef = document.getElementById(id);
  taskRef.querySelector('.task-category').style = `background: ${checkCategoryColor(taskElement.category)}`;
  taskRef.querySelector('.task-category').innerHTML = taskElement.category;
  taskRef.setAttribute('draggable', 'true');
  taskRef.querySelector('.mobileDropdown').id = `dropdown${taskElement.id}`;
  taskRef.querySelector('.task-title').innerHTML = `${taskElement.title}`;
  taskRef.querySelector('.task-description').innerHTML = `${taskElement.description}`;
  taskRef.querySelector('.task-contacts').innerHTML = generateContactsHTML(taskElement);
  taskRef.querySelector('.priority-icon').appendChild(await insertCorrectUrgencyIcon(taskElement));
  return taskRef;
}

// --- Rendering Process Ends Here ---

// --- All EventListener Start Here ---

function handleEventListenersAfterDOMLoaded(){
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
}

function handleTaskWithoutSubtaskEventlisteners(id, taskElement, oppositeCategory){
  let taskRef = document.getElementById(id);
  taskRef.addEventListener('dragstart', () => {
    startDragging(taskElement.id);
    rotateFunction(taskElement.id);
  });
  taskRef.addEventListener('dragend', () => {
    checkIfEmpty(taskElement.container, oppositeCategory);
  });
  taskRef.addEventListener('dragover', (event) => {
    event.preventDefault();
    allowDrop(event);
  });
  taskRef.addEventListener('drop', () => {
    moveTo(taskElement.container);
  });
  taskRef.addEventListener('click', () => {
    showBigTaskPopUp(taskElement);
  });
  taskRef.querySelector('.dropdownSVG').addEventListener('click', (event) => {
    openMobileDropdown(taskElement.id);
    shared.stopEvent(event);
  });
}

function manageEventListenersOnTaskDiv(taskObject, taskIndex){
  handleMoveTasksEvents(taskIndex);
  handleDropEventsForMobileVersion(taskObject, taskIndex);
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

function assignEventListenersToBigTask(taskElement){
  document.getElementById('big-task-pop-up-delete-button').addEventListener('click', () => {
    hideBigTaskPopUp();
    deleteTask('big-task-pop-up');
  });
  document.getElementById('big-task-pop-up-edit-button').addEventListener('click', () => {
    renderEditTask(taskElement); // id
  });  
  // document.getElementById('big-task-pop-up-bg').addEventListener('mousedown', () => {
  //   hideBigTaskPopUp();
  // });
  // document.getElementById('big-task-pop-up').addEventListener('mousedown', (event) => {
  //   shared.stopEvent(event);
  // });
  // document.getElementById('big-task-pop-up').addEventListener('click', () => {
  //   closeAllSmallPopUpPopUps();
  // });
  // document.getElementById('big-task-pop-up-close-icon').addEventListener('click', () => {
  //   hideBigTaskPopUp();
  // });
}

function handleMoveTasksEvents(taskIndex){
  let rightMobileDrowdown = document.getElementById(`dropdown${taskIndex}`); 
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

// --- All EventListener End here ---

function openMobileDropdown(taskIndex) {
  let dropdown = document.getElementById(`dropdown${taskIndex}`);
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
  await shared.initHTMLContent(`${boardTemplatePrefix}/big_task_pop_up_templates/big_task-pop-up-template.tpl`, 'big-task-pop-up-bg');
  document.getElementById("big-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("big-task-pop-up").classList.remove("translate-100");
  document.body.style.overflow = "hidden";
  await renderBigTask(taskElement);
  assignEventListenersToBigTask(taskElement);
}

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

function renderEditTask(taskElement) {
  let oldPriority = taskElement.priority;
  let oldTitle = document.getElementById("big-task-pop-up-title-text").innerHTML;
  let oldDescription = document.getElementById("big-task-pop-up-description").innerHTML;
  let oldDate = document.getElementById("big-task-pop-up-date").innerHTML;
  document.getElementById("big-task-pop-up-category").innerHTML = "";
  document.getElementById("big-task-pop-up-category").style = "background-color: white;";
  renderCurrentTaskId = taskElement.id;
  renderAllBigPopUp(oldTitle, oldDescription, oldDate, oldPriority, taskElement); // id
}

function renderAllBigPopUp(oldTitle, oldDescription, oldDate, oldPriority, taskElement) { // id
  setupSubtaskArray(taskElement);
  renderPopUpElements(oldTitle, oldDescription, oldDate, oldPriority);
  renderBigTaskDetails(taskElement, oldPriority); // id
}

function setupSubtaskArray(taskElement) {
  subtaskArray = taskElement.subtask || [];
  taskElement.subtask = subtaskArray;
}

function renderPopUpElements(oldTitle, oldDescription, oldDate, oldPriority) { // id
  returnBigTaskPopUpTitle(oldTitle); // Sackgasse 
  returnBigTaskPopUpDescription(oldDescription); // Sackgasse
  renderBigTaskPopUpSection("big-task-pop-up-due-date-container", oldDate, returnBigTaskPopUpDueDateContainer);
  renderBigTaskPopUpSection("big-task-pop-up-priority-container", oldPriority, returnBigTaskPopUpPriorityContainer);
  priorityValue = oldPriority;
  document.getElementById("big-edit-task-" + oldPriority.toLowerCase() + "-priority").classList.add("big-edit-task-" + oldPriority.toLowerCase() + "-priority-aktiv");
}

function renderBigTaskPopUpSection(containerId, value, renderFunction) {
  document.getElementById(containerId).classList.add("big-edit-task-pop-up-section-container");
  renderFunction(value); // Sackgasse
}

function renderBigTaskDetails(taskElement) { // taskElement id
  returnBigTaskPopUpContactAll(taskElement.id);
  returnBigTaskPopUpSubtasksAll();
  renderBigTaskAssignedContactContainer(taskElement);
  renderBigEditTaskAssignedToPopUp(taskElement);
  returnBigPopUpEditButtons(taskElement.id);
}

async function renderBigTask(taskElement) {
  document.getElementById("big-task-pop-up-priority-container").classList.remove("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-title-text").innerHTML = `${taskElement.title}`;
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

function renderSubtask(taskElement) {
  if (taskElement.subtask && taskElement.subtask.length > 0) {
    renderSubtasks(taskElement.subtask); 
  } else {
    renderNoSubtasksMessage();
  }
}

function renderSubtasks(subtasks) { 
  subtasks.forEach(async (subtask, index) => {
    await loadSubtasksTemplateAndAssignIds(subtask, index);
    document.getElementById(`checkBoxIconUnchecked${index}`).addEventListener('click', () => {
      addCheckedStatus(index); 
    });
    document.getElementById(`checkBoxIconChecked${index}`).addEventListener('click', () => {
      addCheckedStatus(index); 
    });
  });
}

async function loadSubtasksTemplateAndAssignIds(subtask, index){  
  let template = await shared.initHTMLContent(`${boardTemplatePrefix}/board_subtask_templates/subtaskHtmlWithBolean.tpl`, 'big-task-pop-up-subtasks-container');
  template.id = `subtaskInPopUp${index}`;
  template.querySelectorAll('svg')[0].id = `checkBoxIconUnchecked${index}`;
  template.querySelectorAll('svg')[1].id = `checkBoxIconChecked${index}`;
  template.querySelector('p').innerHTML = subtask['task-description'];
}

async function addCheckedStatus(index) {
  let subtasks = tasks[index]["subtask"]; 
  let checkBoxChecked = toggleCheckboxIcons(index);
  updateCheckboxStatus(index, checkBoxChecked);
  depositSubtaskChanges(subtasks); 
}

function updateCheckboxStatus(index, checkBoxChecked) {
  checkBoxCheckedJson[index] = checkBoxChecked;
}

function toggleCheckboxIcons(index) {
  let checkBoxIconUnchecked = document.getElementById(`checkBoxIconUnchecked${index}`);
  let checkBoxIconChecked = document.getElementById(`checkBoxIconChecked${index}`);
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

async function depositSubtaskChanges(subtasks) { // correctTaskId
  for (let index = 0; index < subtasks.length; index++) {
    if (checkBoxCheckedJson.hasOwnProperty(index)) {
      subtasks[index]["is-tasked-checked"] = checkBoxCheckedJson[index];
    }
  }
  subtaskArray = subtasks;
  // await saveChangedSubtaskToFirebase(correctTaskId);
}

// function insertSubtasksIntoContainer() {
//   document.getElementById("big-edit-task-subtask-container").innerHTML = "";
//   document.getElementById("big-edit-task-subtask-container").innerHTML = "";
//   if (subtaskArray && subtaskArray.length >= 1) {
//     for (let i = 0; i < subtaskArray.length; i++) {
//       let subtask = subtaskArray[i];
//       document.getElementById("big-edit-task-subtask-container").innerHTML += renderSubtaskInPopUpContainer(i, subtask);
//     }
//   } else if (subtaskArray && subtaskArray.length == 0 && tasks[renderCurrentTaskId]["subtask"]) {
//   } else if (!subtaskArray && !tasks[renderCurrentTaskId]["subtask"]) {
//     document.getElementById("big-edit-task-subtask-container").innerHTML += "";
//   }
// }

// function editSubtaskPopUpInput(i) {
//   insertSubtasksIntoContainer();
//   container = document.getElementById(`subtaskNumber${i}`);
//   container.onmouseover = null;
//   container.onmouseout = null;
//   container.innerHTML = returnSubtaskEditedPopUpHTMLContainer(i);
// }

function renderNoSubtasksMessage() {
  let container = document.getElementById("big-task-pop-up-subtasks-container");
  container.innerHTML = `<p class='big-task-pop-up-value-text'>No Subtasks</p>`;
}

function returnContactHTML(taskElement, initials, index){
  document.getElementById('big-task-pop-up-contact-container').innerHTML += `
    <div class="big-task-pop-up-contact">
      <div class="big-task-pop-up-profile-badge" style="background: ${taskElement.assigned[index]['color']}">${initials}</div>
      <p class="big-task-pop-up-profile-name">${taskElement.assigned[index]["name"]}</p>
    </div>`
}

function rotateFunction(id) {
  document.getElementById(`task${id}`).style.transform = "rotate(3deg)";
}

function checkIfEmpty(tasksDiv, divWithoutTasks) {
  console.log('input variables: ', divWithoutTasks);
  let tasksDivContainer = document.getElementById(tasksDiv);
  let divWithoutTasksContainer = document.getElementById(divWithoutTasks);
  console.log('divWithoutTasksContainer before if-Statement: ', divWithoutTasksContainer);
  if (tasksDivContainer.innerHTML === "") {
    console.log('div without tasks container: ', divWithoutTasksContainer);
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
}

function removeEmptyMessage(container, oppositeContainer) {
  let categoryContainer = document.getElementById(container);
  let oppositeCategoryContainer = document.getElementById(oppositeContainer);
  if (oppositeCategoryContainer) {
    categoryContainer.removeChild(oppositeCategoryContainer);
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
  let oppositeElement = feedbackAndUrgency.getRightOppositeElement(oppositeElementName);
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