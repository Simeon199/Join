export * from './eventList_called_functions.js';
import * as eventlistener from './eventlistener.js';
import * as feedback from './feedbackTemplates.js'; 
import * as shared from '../../shared/javascript/shared.js';
import * as mainBoard from './board.js';
import * as data from '../../core/downloadData.js';

let elementDraggedOver = false;
let boardTemplatePrefix = '../../board/templates';

export function openMobileDropdown(taskIndex) {
  let dropdown = document.getElementById(`dropdown${taskIndex}`);
  dropdown.classList.toggle("mobileDropdown-translate-100");
  let task = mainBoard.tasks.find((task) => task.id === taskIndex);
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
    bigEditTaskSubtaskInputCheckEnter(event);
  });
  document.getElementById("big-edit-task-pop-up-save-button").addEventListener("click", () => {
    saveTaskChanges(taskElement.id);
  });
}

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