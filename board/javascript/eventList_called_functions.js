export * from './eventList_called_functions.js';
import * as feedback from './feedbackTemplates.js'; 


export function openMobileDropdown(taskIndex) {
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

export async function showBigTaskPopUp(taskElement) { 
  isBigTaskPopUpOpen = true;
  await shared.initHTMLContent(`${boardTemplatePrefix}/big_task_pop_up_templates/big_task-pop-up-template.tpl`, 'big-task-pop-up-bg');
  document.getElementById("big-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("big-task-pop-up").classList.remove("translate-100");
  document.body.style.overflow = "hidden";
  await renderBigTask(taskElement);
  assignEventListenersToBigTask(taskElement);
}

export function hideBigTaskPopUp() {
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

export function renderEditTask(taskElement) {
  let oldPriority = taskElement.priority;
  let oldTitle = document.getElementById("big-task-pop-up-title-text").innerHTML;
  let oldDescription = document.getElementById("big-task-pop-up-description").innerHTML;
  let oldDate = document.getElementById("big-task-pop-up-date").innerHTML;
  document.getElementById("big-task-pop-up-category").innerHTML = "";
  document.getElementById("big-task-pop-up-category").style = "background-color: white;";
  renderCurrentTaskId = taskElement.id;
  renderAllBigPopUp(oldTitle, oldDescription, oldDate, oldPriority, taskElement); // id
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

export async function renderBigTask(taskElement) {
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

export function renderCorrectAssignedNamesIntoBigTask(taskElement) {
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
  let subtasks = tasks[index]["subtask"]; 
  let checkBoxChecked = toggleCheckboxIcons(index);
  updateCheckboxStatus(index, checkBoxChecked);
  depositSubtaskChanges(subtasks); 
}

export function updateCheckboxStatus(index, checkBoxChecked) {
  checkBoxCheckedJson[index] = checkBoxChecked;
}

export function toggleCheckboxIcons(index) {
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

export async function depositSubtaskChanges(subtasks) { // correctTaskId
  for (let index = 0; index < subtasks.length; index++) {
    if (checkBoxCheckedJson.hasOwnProperty(index)) {
      subtasks[index]["is-tasked-checked"] = checkBoxCheckedJson[index];
    }
  }
  subtaskArray = subtasks;
  // await saveChangedSubtaskToFirebase(correctTaskId);
}

export function searchForTasks() {
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

export function renderSearchedTasks() {
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

export function allowDrop(event) {
  event.preventDefault();
}

export function replaceSpacesWithDashes(str) {
  return str.replace(/ /g, "-");
}

export async function moveTasksToCategory(taskIndex, newCategory) {
  let task = tasks.find((task) => task.id === taskIndex);
  if (task) {
    task.container = newCategory;
    updateHTML();
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
    standardContainer = container;
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
  let task = tasks.find((task) => task.id == elementDraggedOver);
  if (task) {
    task.container = container;
    updateHTML();
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