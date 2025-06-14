export * from './eventList_called_functions.js';
import * as eventlistener from './eventlistener.js';
import * as feedback from './feedbackTemplates.js'; 
import * as shared from '../../shared/javascript/shared.js';
import * as mainBoard from './board.js';
import * as data from '../../core/downloadData.js';

let elementDraggedOver = false;
let currentOpenDropdown = null;
let boardTemplatePrefix = '../../board/templates';

export function openMobileDropdown(taskElement) { // taskIndex
  let dropdown = document.getElementById(`dropdown${taskElement.id}`); 
  // dropdown.classList.toggle("mobileDropdown-translate-100");
  console.log('tasks: ', taskElement);
  // let task = taskElement.find((task) => task.id === taskIndex);
  let currentCategory = taskElement.container; // task.container
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

export async function showBigTaskPopUp(taskElement) { 
  await shared.initHTMLContent(`${boardTemplatePrefix}/big_task_pop_up_templates/big_task-pop-up-template.tpl`, 'big-task-pop-up-bg');
  document.getElementById("big-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("big-task-pop-up").classList.remove("translate-100");
  document.body.style.overflow = "hidden";
  await renderBigTask(taskElement);
  eventlistener.assignEventListenersToBigTask(taskElement);
}

export function hideBigTaskPopUp() {
  document.getElementById("big-task-pop-up-title").classList.remove("big-task-pop-up-input-error");
  document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-task-pop-up-input-error");
  document.getElementById("big-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("big-task-pop-up").classList.add("translate-100");
  document.body.style.overflow = "unset";
  if (document.getElementById("big-task-pop-up-title-text")) {
    let title = document.getElementById("big-task-pop-up-title-text").innerHTML;
    let id = mainBoard.tasks.findIndex((task) => task.title === title);
    saveSubtaskChanges(id);
  }
}

export async function renderEditTask(taskElement) {
  setBigTaskPopUpEmptyIfItsNotEmpty();
  let template = await shared.initHTMLContent(`${boardTemplatePrefix}/big_task_pop_up_templates/big_task_edit_template.tpl`, 'big-task-pop-up-bg');
  assignEventListenersToEditTaskPopUp();
  assignContentToEditTaskPopUp(taskElement);
  return template; 
}

function assignEventListenersToEditTaskPopUp(){
   document.getElementById("big-task-pop-up").addEventListener("click", () => {
    closeAllSmallPopUpPopUps();
  });
  document.getElementById("big-task-pop-up").addEventListener("mousedown", (event) => {
    shared.stopEvent(event);
  });
  document.getElementById("big-edit-task-urgent-priority").addEventListener("click", () => {
    checkBigEditTaskPriority("urgent");
  });
  document.getElementById("big-edit-task-medium-priority").addEventListener("click", () => {
    checkBigEditTaskPriority("medium");
  });
  document.getElementById("big-edit-task-low-priority").addEventListener("click", ()=> {
    checkBigEditTaskPriority("low");
  });
  document.getElementById("big-edit-task-assigned-to-input-container").addEventListener("click", (event) => {
    shared.stopEvent(event);
  });
  document.getElementById("big-edit-task-assigned-to-input-arrow").addEventListener("click", () => {
    toggleEditTaskAssignedToPopUp();
  });
  document.getElementById("big-edit-task-assigned-to-input").addEventListener("click", () => {
    toggleEditTaskAssignedToPopUp();
  });
  document.getElementById("big-edit-task-assigned-to-input").addEventListener("keyup", () => {
    editPopUpSearchContacts(taskElement.id);
  });
  document.getElementById("big-edit-task-assigned-to-pop-up").addEventListener("click", (event) => {
    shared.stopEvent(event);
  });
  document.getElementById("big-edit-task-subtask-input-container").addEventListener("click", () => {
    focusSubtaskInput(); 
  });
  document.getElementById("big-edit-task-subtask-input-container").addEventListener("keyup", () => {
    changeSubtaskInputIcons();
  });
  document.getElementById("big-edit-task-subtask-input").addEventListener("keyup", (event) => {
    bigEditTaskSubtaskInputCheckEnter(event); // Nicht vorhanden
  });
  document.getElementById("big-edit-task-pop-up-save-button").addEventListener("click", () => {
    saveTaskChanges(taskElement.id);
  });
}

// Ehemals nicht vorhande Funktionen - Anfang

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

function returnSubtaskInputHTMLPlusIconSVG() {
  return /*html*/ `
      <svg id='big-edit-task-subtask-input-plus-icon' width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.14453 8H1.14453C0.861198 8 0.623698 7.90417 0.432031 7.7125C0.240365 7.52083 0.144531 7.28333 0.144531 7C0.144531 6.71667 0.240365 6.47917 0.432031 6.2875C0.623698 6.09583 0.861198 6 1.14453 6H6.14453V1C6.14453 0.716667 6.24036 0.479167 6.43203 0.2875C6.6237 0.0958333 6.8612 0 7.14453 0C7.42786 0 7.66536 0.0958333 7.85703 0.2875C8.0487 0.479167 8.14453 0.716667 8.14453 1V6H13.1445C13.4279 6 13.6654 6.09583 13.857 6.2875C14.0487 6.47917 14.1445 6.71667 14.1445 7C14.1445 7.28333 14.0487 7.52083 13.857 7.7125C13.6654 7.90417 13.4279 8 13.1445 8H8.14453V13C8.14453 13.2833 8.0487 13.5208 7.85703 13.7125C7.66536 13.9042 7.42786 14 7.14453 14C6.8612 14 6.6237 13.9042 6.43203 13.7125C6.24036 13.5208 6.14453 13.2833 6.14453 13V8Z" fill="#2A3647"/>
      </svg>
    `;
}

function returnSubtaskInputHTMLCloseIcon() {
  return /*html*/ `
    <svg id='big-edit-task-subtask-input-close-icon' onclick='resetSubtaskInput()' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.14434 8.40005L2.24434 13.3C2.061 13.4834 1.82767 13.575 1.54434 13.575C1.261 13.575 1.02767 13.4834 0.844336 13.3C0.661003 13.1167 0.569336 12.8834 0.569336 12.6C0.569336 12.3167 0.661003 12.0834 0.844336 11.9L5.74434 7.00005L0.844336 2.10005C0.661003 1.91672 0.569336 1.68338 0.569336 1.40005C0.569336 1.11672 0.661003 0.883382 0.844336 0.700049C1.02767 0.516715 1.261 0.425049 1.54434 0.425049C1.82767 0.425049 2.061 0.516715 2.24434 0.700049L7.14434 5.60005L12.0443 0.700049C12.2277 0.516715 12.461 0.425049 12.7443 0.425049C13.0277 0.425049 13.261 0.516715 13.4443 0.700049C13.6277 0.883382 13.7193 1.11672 13.7193 1.40005C13.7193 1.68338 13.6277 1.91672 13.4443 2.10005L8.54434 7.00005L13.4443 11.9C13.6277 12.0834 13.7193 12.3167 13.7193 12.6C13.7193 12.8834 13.6277 13.1167 13.4443 13.3C13.261 13.4834 13.0277 13.575 12.7443 13.575C12.461 13.575 12.2277 13.4834 12.0443 13.3L7.14434 8.40005Z" fill="#2A3647"/>
    </svg>
    <div class='big-edit-task-subtask-icon-line'></div>
    <svg id='big-edit-task-subtask-input-save-icon' onclick='buildSubtaskArrayForUpload()' width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.69474 9.15L14.1697 0.675C14.3697 0.475 14.6072 0.375 14.8822 0.375C15.1572 0.375 15.3947 0.475 15.5947 0.675C15.7947 0.875 15.8947 1.1125 15.8947 1.3875C15.8947 1.6625 15.7947 1.9 15.5947 2.1L6.39474 11.3C6.19474 11.5 5.96141 11.6 5.69474 11.6C5.42807 11.6 5.19474 11.5 4.99474 11.3L0.694738 7C0.494738 6.8 0.398905 6.5625 0.407238 6.2875C0.415572 6.0125 0.519738 5.775 0.719738 5.575C0.919738 5.375 1.15724 5.275 1.43224 5.275C1.70724 5.275 1.94474 5.375 2.14474 5.575L5.69474 9.15Z" fill="#2A3647"/>
    </svg> 
    `;
}

function bigEditTaskSubtaskInputCheckEnter(event) {
  if (event.key === "Enter") {
    buildSubtaskArrayForUpload();
  }
}

// buildSubtaskArrayForUpload !== buildSubtaskArrayForUpload

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

function createSubtaskJson(value) {
  return { "task-description": value, "is-tasked-checked": false };
}

async function insertSubtasksIntoContainer() {
  document.getElementById("big-edit-task-subtask-container").innerHTML = "";
  document.getElementById("big-edit-task-subtask-container").innerHTML = "";
  if (subtaskArray && subtaskArray.length >= 1) {
    for (let i = 0; i < subtaskArray.length; i++) {
      let subtask = subtaskArray[i];
      console.log('Does subtask exist?', subtask);
      let template = await  shared.initHTMLContent(`${boardTemplatePrefix}/board_subtask_templates/subtaskInPopUpContainer.tpl`, 'big-edit-task-subtask-container'); // document.getElementById("big-edit-task-subtask-container").innerHTML += renderSubtaskInPopUpContainer(i, subtask)
      return template;    
    }
  } else if (subtaskArray && subtaskArray.length == 0 && tasks[renderCurrentTaskId]["subtask"]) {
  } else if (!subtaskArray && !tasks[renderCurrentTaskId]["subtask"]) {
    document.getElementById("big-edit-task-subtask-container").innerHTML += "";
  }
}

// Ehemals nicht vorhandene Funktionen - Ende

function assignContentToEditTaskPopUp(taskElement){
  document.getElementById("big-edit-task-title-input").value = taskElement.title;
  document.getElementById("big-edit-task-description-input").innerHTML = taskElement.description;
  document.getElementById("big-edit-task-due-date-input").value = taskElement.date;
}
 
function setBigTaskPopUpEmptyIfItsNotEmpty(){
  let bigTaskPopUp = document.getElementById("big-task-pop-up");
  if(bigTaskPopUp.innerHTML !== ""){
    bigTaskPopUp.innerHTML = "";
  }
}

export function renderAllBigPopUp(oldTitle, oldDescription, oldDate, oldPriority, taskElement) { // id
  setupSubtaskArray(taskElement);
  renderPopUpElements(oldTitle, oldDescription, oldDate, oldPriority);
  renderBigTaskDetails(taskElement, oldPriority); // id
}

export function setupSubtaskArray(taskElement) {
  subtaskArray = taskElement.subtask || [];
  taskElement.subtask = subtaskArray;
}

export function renderPopUpElements(oldTitle, oldDescription, oldDate, oldPriority) { // id
  returnBigTaskPopUpTitle(oldTitle); // Sackgasse 
  returnBigTaskPopUpDescription(oldDescription); // Sackgasse
  renderBigTaskPopUpSection("big-task-pop-up-due-date-container", oldDate, returnBigTaskPopUpDueDateContainer);
  renderBigTaskPopUpSection("big-task-pop-up-priority-container", oldPriority, returnBigTaskPopUpPriorityContainer);
  priorityValue = oldPriority;
  document.getElementById("big-edit-task-" + oldPriority.toLowerCase() + "-priority").classList.add("big-edit-task-" + oldPriority.toLowerCase() + "-priority-aktiv");
}

export function renderBigTaskPopUpSection(containerId, value, renderFunction) {
  document.getElementById(containerId).classList.add("big-edit-task-pop-up-section-container");
  renderFunction(value); // Sackgasse
}

export function renderBigTaskDetails(taskElement) { // taskElement id
  returnBigTaskPopUpContactAll(taskElement.id);
  returnBigTaskPopUpSubtasksAll();
  renderBigTaskAssignedContactContainer(taskElement);
  renderBigEditTaskAssignedToPopUp(taskElement);
  returnBigPopUpEditButtons(taskElement.id);
}

function closeAllSmallPopUpPopUps() {
  if (document.getElementById("big-edit-task-title-input")) {
    document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.add("height-0");
    document.getElementById("big-edit-task-assigned-to-pop-up").classList.add("box-shadow-none");
    document.getElementById("big-edit-task-assigned-to-input-arrow").classList.remove("rotate-90");
    insertSubtasksIntoContainer();
  }
}

export async function renderBigTask(taskElement) {
  document.getElementById("big-task-pop-up-priority-container").classList.remove("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-title-text").innerHTML = `${taskElement.title}`;
  document.getElementById("big-task-pop-up-description").innerHTML = `${taskElement.description}`; 
  document.getElementById("big-task-pop-up-date").innerHTML = `${taskElement.date}`;
  document.getElementById('big-task-pop-up-priority-text').innerHTML = `${taskElement.priority}`;
  document.getElementById("big-task-pop-up-category").innerHTML = taskElement.category;
  document.getElementById("big-task-pop-up-category").style.backgroundColor = mainBoard.checkCategoryColor(taskElement.category);
  document.getElementById("big-task-pop-up-priority-icon").appendChild(await mainBoard.insertCorrectUrgencyIcon(taskElement));
  renderCorrectAssignedNamesIntoBigTask(taskElement);
  renderSubtask(taskElement); 
}

export function renderCorrectAssignedNamesIntoBigTask(taskElement) {
  let initials = "";
  if (taskElement["assigned"] || typeof taskElement["assigned"] == Array) {
    for (let index = 0; index < taskElement["assigned"].length; index++) {
      let name = taskElement["assigned"][index]["name"];
      let nameArray = name.trim().split(" ");
      initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
      returnContactHTML(taskElement, initials, index);
    }
  }
}

export function renderSubtask(taskElement) {
  if (taskElement.subtask && taskElement.subtask.length > 0) {
    renderSubtasks(taskElement.subtask); 
  } else {
    renderNoSubtasksMessage();
  }
}

export function renderSubtasks(subtasks) { 
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

export async function loadSubtasksTemplateAndAssignIds(subtask, index){  
  let template = await shared.initHTMLContent(`${boardTemplatePrefix}/board_subtask_templates/subtaskHtmlWithBolean.tpl`, 'big-task-pop-up-subtasks-container');
  template.id = `subtaskInPopUp${index}`;
  template.querySelectorAll('svg')[0].id = `checkBoxIconUnchecked${index}`;
  template.querySelectorAll('svg')[1].id = `checkBoxIconChecked${index}`;
  template.querySelector('p').innerHTML = subtask['task-description'];
}

export async function addCheckedStatus(index) { 
  if(data.tasks){
    data.tasks.onChange(() => {
      let tasks = Object.values(data.tasks.get());
      let subtasks = tasks[index]["subtask"];
      console.log('subtasks:', subtasks);
      toggleCheckboxIcons(index);
    });
    // let subtasks = mainBoard.tasks[index]["subtask"]; 
    // let checkBoxChecked = toggleCheckboxIcons(index);
    // updateCheckboxStatus(index, checkBoxChecked);
    // depositSubtaskChanges(subtasks); 
  }
}

export function updateCheckboxStatus(index, checkBoxChecked) {
  checkBoxCheckedJson[index] = checkBoxChecked;
}

export function toggleCheckboxIcons(index) {
  const unchecked = document.getElementById(`checkBoxIconUnchecked${index}`);
  const checked = document.getElementById(`checkBoxIconChecked${index}`);
  const isChecked = unchecked.classList.contains("d-none");
  unchecked.classList.toggle("d-none");
  checked.classList.toggle("d-none");
  return !isChecked;
}

// export function toggleCheckboxIcons(index) {
//   let checkBoxIconUnchecked = document.getElementById(`checkBoxIconUnchecked${index}`);
//   let checkBoxIconChecked = document.getElementById(`checkBoxIconChecked${index}`);
//   if (!checkBoxIconUnchecked.classList.contains("d-none") && checkBoxIconChecked.classList.contains("d-none")) {
//     checkBoxIconUnchecked.classList.add("d-none");
//     checkBoxIconChecked.classList.remove("d-none");
//     return true;
//   } else if (!checkBoxIconChecked.classList.contains("d-none") && checkBoxIconUnchecked.classList.contains("d-none")) {
//     checkBoxIconUnchecked.classList.remove("d-none");
//     checkBoxIconChecked.classList.add("d-none");
//     return false;
//   }
// }

export async function depositSubtaskChanges(subtasks) {
  for (let index = 0; index < subtasks.length; index++) {
    if (checkBoxCheckedJson.hasOwnProperty(index)) {
      subtasks[index]["is-tasked-checked"] = checkBoxCheckedJson[index];
    }
  }
  subtaskArray = subtasks;
}

export function searchForTasks() {
  let searchValue = document.getElementById("search-input").value.trim().toLowerCase();
  mainBoard.searchedTasks = [];
  for (let i = 0; i < mainBoard.tasks.length; i++) {
    let task = mainBoard.tasks[i];
    if (task.title.toLowerCase().includes(searchValue) || task.description.toLowerCase().includes(searchValue)) {
      mainBoard.searchedTasks.push(task);
    }
  }
  renderSearchedTasks();
}

export function renderSearchedTasks() {
  allCategories.forEach((categoryContainer) => {
    clearCategoryContainer(categoryContainer);
    let tasksInCategory = filterTasksByCategory(categoryContainer, mainBoard.searchedTasks);
    if (tasksInCategory.length === 0) {
      handleNoTasksInCategory(categoryContainer);
    } else if (mainBoard.searchedTasks.length < mainBoard.tasks.length) {
      renderTasksInCategory(tasksInCategory, categoryContainer);
    } else {
      mainBoard.updateHTML();
    }
  });
}

export function allowDrop(event) {
  event.preventDefault();
}

export function replaceSpacesWithDashes(str) {
  return str.replace(/ /g, "-");
}

export async function moveTasksToCategory(taskIndex, newCategory) {
  let task = mainBoard.tasks.find((task) => task.id === taskIndex);
  if (task) {
    task.container = newCategory;
    mainBoard.updateHTML();
    let taskElement = document.getElementById("task" + taskIndex);
    taskElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

export function showAddTaskPopUp(container = "to-do-container") {
  const screenWidth = window.screen.width;
  if (screenWidth <= 600) {
    window.location = "add_task.html";
  } else {
    document.body.style.overflow = "hidden";
    document.getElementById("add-task-pop-up-bg").classList.remove("bg-op-0");
    document.getElementById("add-task-pop-up").classList.remove("translate-100");
    mainBoard.standardContainer = container;
  }
}

export function hideAddTaskPopUp() {
  document.body.style.overflow = "unset";
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

export function clearCategoryContainer(categoryContainer) {
  document.getElementById(categoryContainer).innerHTML = "";
}

export function handleNoTasksInCategory(categoryContainer) {
  let oppositeElementName = "no-" + categoryContainer;
  let oppositeElement = feedback.getRightOppositeElement(oppositeElementName);
  document.getElementById(categoryContainer).innerHTML = oppositeElement;
}

export function renderNoSubtasksMessage() {
  let container = document.getElementById("big-task-pop-up-subtasks-container");
  container.innerHTML = `<p class='big-task-pop-up-value-text'>No Subtasks</p>`;
}

export function returnContactHTML(taskElement, initials, index){
  document.getElementById('big-task-pop-up-contact-container').innerHTML += `
    <div class="big-task-pop-up-contact">
      <div class="big-task-pop-up-profile-badge" style="background: ${taskElement.assigned[index]['color']}">${initials}</div>
      <p class="big-task-pop-up-profile-name">${taskElement.assigned[index]["name"]}</p>
    </div>`
}

export function rotateFunction(id) {
  document.getElementById(`task${id}`).style.transform = "rotate(3deg)";
}

export function checkIfEmpty(tasksDiv, divWithoutTasks) {
  console.log('input variables: ', divWithoutTasks);
  let tasksDivContainer = document.getElementById(tasksDiv);
  let divWithoutTasksContainer = document.getElementById(divWithoutTasks);
  console.log('divWithoutTasksContainer before if-Statement: ', divWithoutTasksContainer);
  if (tasksDivContainer.innerHTML === "") {
    console.log('div without tasks container: ', divWithoutTasksContainer);
    divWithoutTasksContainer.classList.remove("d-none");
  }
}

export function startDragging(elementId) {
  elementDraggedOver = elementId;
}

export async function moveTo(container) { 
  let oppositeContainer = "no-" + container;
  console.log('tasks: ', mainBoard.tasks);
  let task = mainBoard.tasks.find((task) => task.id == elementDraggedOver);
  if (task) {
    task.container = container;
    mainBoard.updateHTML();
    removeEmptyMessage(container, oppositeContainer);
  }
}

export function removeEmptyMessage(container, oppositeContainer) {
  let categoryContainer = document.getElementById(container);
  let oppositeCategoryContainer = document.getElementById(oppositeContainer);
  if (oppositeCategoryContainer) {
    categoryContainer.removeChild(oppositeCategoryContainer);
  }
}

export function filterTasksByCategory(categoryContainer, tasks) {
  return tasks.filter((task) => task.container === categoryContainer);
}