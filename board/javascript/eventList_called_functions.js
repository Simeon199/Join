export * from './eventList_called_functions.js';
import * as eventlistener from './eventlistener.js';
import * as feedback from './feedbackTemplates.js'; 
import * as shared from '../../shared/javascript/shared.js';
import * as mainBoard from './board.js';
import * as data from '../../core/downloadData.js';

let elementDraggedOver = false;
let currentOpenDropdown = null;
let boardTemplatePrefix = '../../board/templates';

export function openMobileDropdown(taskElement) {
  let dropdown = document.getElementById(`dropdown${taskElement.id}`); 
  let currentCategory = taskElement.container; 
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
  removeDivFromDOMIfExists("big-task-pop-up");
  await shared.initHTMLContent(`${boardTemplatePrefix}/big_task_pop_up_templates/big_task-pop-up-template.tpl`, 'big-task-pop-up-bg');
  document.getElementById("big-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("big-task-pop-up").classList.remove("translate-100");
  document.body.style.overflow = "hidden";
  await renderBigTask(taskElement);
  eventlistener.assignEventListenersToBigTask(taskElement);
}

function removeDivFromDOMIfExists(divId) {
  let div = document.getElementById(divId);
  if (div) {
    div.remove();
  }
}

export function hideBigTaskPopUp() {
  document.getElementById("big-task-pop-up-title").classList.remove("big-task-pop-up-input-error");
  document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-task-pop-up-input-error");
  document.getElementById("big-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("big-task-pop-up").classList.add("translate-100");
  document.body.style.overflow = "unset";
}

export async function renderEditTask(taskElement) {
  removeDivFromDOMIfExists('big-task-pop-up');
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
  document.getElementById("big-edit-task-subtask-input-container").addEventListener("keyup", async () => {
    await changeSubtaskInputIcons();
  });
  document.getElementById("big-edit-task-subtask-input").addEventListener("keyup", (event) => {
    bigEditTaskSubtaskInputCheckEnter(event);
  });
  document.getElementById("big-edit-task-pop-up-save-button").addEventListener("click", () => {
    saveTaskChanges(taskElement.id);
  });
}

// Ehemals nicht vorhande Funktionen - Anfang

function focusSubtaskInput() {
  document.getElementById("big-edit-task-subtask-input").focus();
}

async function changeSubtaskInputIcons() {
  let subtaskInputIconContainer = document.getElementById("big-edit-task-subtask-input-icon-container");
  let subtaskInputValue = document.getElementById("big-edit-task-subtask-input");
  subtaskInputIconContainer.innerHTML = "";
  if (subtaskInputValue.value === "") {
    await shared.initHTMLContent(`${boardTemplatePrefix}/board_subtask_templates/subtaskInputHTMLPlusIcon.tpl`, 'big-edit-task-subtask-input-icon-container');
    document.getElementById("big-edit-task-subtask-input-save-icon").addEventListener("click", () => {
      buildSubtaskArrayForUpload();
    });    
  } else {
    await shared.initHTMLContent(`${boardTemplatePrefix}/board_subtask_templates/subtaskInputHTMLCloseIcon.tpl`, 'big-edit-task-subtask-input-icon-container');
    document.getElementById("big-edit-task-subtask-input-close-icon").addEventListener("click", () => {
      resetSubtaskInput();
    });  
  }
}

function bigEditTaskSubtaskInputCheckEnter(event) {
  if (event.key === "Enter") {
    buildSubtaskArrayForUpload();
  }
}

// buildSubtaskArrayForUpload !== buildSubtaskArrayForUpload

function buildSubtaskArrayForUpload() {
  mainBoard.clearArray(mainBoard.subtaskArray);
  let subtaskInput = document.getElementById("big-edit-task-subtask-input");
  if (subtaskInput.value.trim().length > 0) {
    mainBoard.insertSubtasksIntoContainer();
    subtaskInput.value = "";
  }
}

export function editSubtaskPopUpInput(i) {
  mainBoard.insertSubtasksIntoContainer();
  container = document.getElementById(`subtaskNumber${i}`);
  container.onmouseover = null;
  container.onmouseout = null;
  container.innerHTML = returnSubtaskEditedPopUpHTMLContainer(i);
}

function returnSubtaskEditedPopUpHTMLContainer(i) { // Irgendein Template bei mir
  return `<input id="subtaskEditedPopUp" type="text" value="${subtaskArray[i]["task-description"]}">
      <div class="edit-popup-subtask-icon-container">
        <svg  onclick="deleteSubtaskPopUp(${i}), stopEvent(event)" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
        </svg>
        <div class="subtaskBorder"></div>
        <svg onclick="saveEditedSubtaskPopUp(${i}), stopEvent(event), closeSubtaskContainer()" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.69474 9.15L14.1697 0.675C14.3697 0.475 14.6072 0.375 14.8822 0.375C15.1572 0.375 15.3947 0.475 15.5947 0.675C15.7947 0.875 15.8947 1.1125 15.8947 1.3875C15.8947 1.6625 15.7947 1.9 15.5947 2.1L6.39474 11.3C6.19474 11.5 5.96141 11.6 5.69474 11.6C5.42807 11.6 5.19474 11.5 4.99474 11.3L0.694738 7C0.494738 6.8 0.398905 6.5625 0.407238 6.2875C0.415572 6.0125 0.519738 5.775 0.719738 5.575C0.919738 5.375 1.15724 5.275 1.43224 5.275C1.70724 5.275 1.94474 5.375 2.14474 5.575L5.69474 9.15Z" fill="#2A3647"/>
        </svg>

      </div>
    `;
}

// Ehemals nicht vorhandene Funktionen - Ende

function assignContentToEditTaskPopUp(taskElement){
  document.getElementById("big-edit-task-title-input").value = taskElement.title;
  document.getElementById("big-edit-task-description-input").innerHTML = taskElement.description;
  document.getElementById("big-edit-task-due-date-input").value = taskElement.date;
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

export function renderBigTaskDetails(taskElement) {
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
    mainBoard.insertSubtasksIntoContainer();
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
    mainBoard.setContainer(container);
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
  let tasksDivContainer = document.getElementById(tasksDiv);
  let divWithoutTasksContainer = document.getElementById(divWithoutTasks);
  if (tasksDivContainer.innerHTML === "") {
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