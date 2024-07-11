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

document.addEventListener("DOMContentLoaded", async function () {
  await getTasksFromDatabase();
  updateHTML();
});

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

function loadTasksFromLocalStorage() {
  let storagedTasks = localStorage.getItem("tasks");
  if (storagedTasks) {
    return JSON.parse(storagedTasks);
  } else {
    return null;
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// showLoadScreen
function showBoardLoadScreen() {
  document.getElementById("board-load-screen").classList.remove("d-none");
}

function hideBoardLoadScreen() {
  document.getElementById("board-load-screen").classList.add("d-none");
}

function iterateThroughSubArray(taskArray, htmlElement) {
  for (i = 0; i < taskArray.length; i++) {
    let task = taskArray[i];
    htmlElement.innerHTML += createToDoHTML(task);
  }
}

function checkIfEmpty(tasksDiv, divWithoutTasks) {
  let tasksDivContainer = document.getElementById(tasksDiv);
  let divWithoutTasksContainer = document.getElementById(divWithoutTasks);
  if (tasksDivContainer.innerHTML == "") {
    divWithoutTasksContainer.classList.remove("d-none");
  }
}

function updateHTML() {
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
  let oppositeCategory = "no-" + element["container"];

  let contactsHTML = "";
  if (element["assigned"] || typeof element["assigned"] == Array) {
    for (let i = 0; i < element["assigned"].length; i++) {
      let name = element["assigned"][i]["name"];
      let initials = getInitials(name);
      contactsHTML += /*html*/ `  
      <div class="task-contact" style='background-color: ${element["assigned"][i]["color"]}'>${initials}</div>`;
    }
  }
  let jsonElement = JSON.stringify(element);
  return generateTaskHTML(element, contactsHTML, oppositeCategory, rightIcon, jsonElement);
}

function startDragging(elementId) {
  elementDraggedOver = elementId;
}

async function moveTo(container) {
  let oppositeContainer = "no-" + container;
  let task = tasks.find((task) => task.tasksIdentity == elementDraggedOver);
  if (task) {
    task.container = container;
    saveTasksToLocalStorage();
    updateHTML();
    removeEmptyMessage(container, oppositeContainer);
  }
  try {
    await saveTaskToFirebase(task);
  } catch (error) {
    console.error("Fehler beim Speichern der tasks in der Firebase-Datenbank:", error);
  }
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
}

function removeEmptyMessage(container, oppositeContainer) {
  let categoryContainer = document.getElementById(container);
  let oppositeCategoryContainer = document.getElementById(oppositeContainer);
  if (oppositeCategoryContainer) {
    categoryContainer.removeChild(oppositeCategoryContainer);
  }
}

function getRightOppositeElement(oppositeElementName) {
  if (oppositeElementName == "no-await-feedback-container") {
    return returnHtmlNoFeedbackContainer();
  } else if (oppositeElementName == "no-in-progress-container") {
    return returnHtmlNoProgressContainer();
  } else if (oppositeElementName == "no-to-do-container") {
    return returnHtmlNoToDoContainer();
  } else if (oppositeElementName == "no-done-container") {
    return returnHtmlNoDoneContainer();
  }
}

function allowDrop(event) {
  event.preventDefault();
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
  clearTask();
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

function renderSubtask(taskJson) {
  let correctTaskId = taskJson.tasksIdentity;
  if (taskJson.subtask) {
    taskJson.subtask.forEach((subtask, index) => {
      if (subtask["is-tasked-checked"] == false) {
        document.getElementById("big-task-pop-up-subtasks-container").innerHTML += returnSubtaskHTML(correctTaskId, subtask, index);
      } else if (subtask["is-tasked-checked"] == true) {
        document.getElementById("big-task-pop-up-subtasks-container").innerHTML += returnSubtaskHTMLWithBolean(correctTaskId, subtask, index);
      }
    });
  } else {
    document.getElementById("big-task-pop-up-subtasks-container").innerHTML = /*html*/ `  
    <p class='big-task-pop-up-value-text'>No Subtasks</p>
    `;
  }
}

async function addCheckedStatus(i, correctTaskId) {
  let subtasks = tasks[correctTaskId]["subtask"];
  let checkBoxChecked = false;
  let checkBoxIconUnchecked = document.getElementById(`checkBoxIconUnchecked${i}`);
  let checkBoxIconChecked = document.getElementById(`checkBoxIconChecked${i}`);

  if (!checkBoxIconUnchecked.classList.contains("d-none") && checkBoxIconChecked.classList.contains("d-none")) {
    checkBoxChecked = true;
    checkBoxCheckedJson[i] = checkBoxChecked;

    checkBoxIconUnchecked.classList.add("d-none");
    checkBoxIconChecked.classList.remove("d-none");
  } else if (!checkBoxIconChecked.classList.contains("d-none") && checkBoxIconUnchecked.classList.contains("d-none")) {
    checkBoxChecked = false;
    checkBoxCheckedJson[i] = checkBoxChecked;
    checkBoxIconUnchecked.classList.remove("d-none");
    checkBoxIconChecked.classList.add("d-none");
  }
  depositSubtaskChanges(correctTaskId, subtasks);
}

async function depositSubtaskChanges(correctTaskId, subtasks) {
  for (index = 0; index < subtasks.length; index++) {
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
    console.log("Task erfolgreich in Firebase gespeichert");
  }
}

// renderContact
function renderTaskContact(taskJson) {
  if (taskJson.assigned) {
    taskJson.assigned.forEach((contact) => {
      document.getElementById("big-task-pop-up-contact-container").innerHTML += returnAssignedContactHTML(contact);
    });
  } else {
    document.getElementById("big-task-pop-up-contact-container").innerHTML = /*html*/ `  
    <p class='big-task-pop-up-value-text'>No One Assigned</p>
    `;
  }
}

// renderEditTask
function renderEditTask(jsonTextElement, id) {
  let taskJson = JSON.parse(decodeURIComponent(jsonTextElement));
  let oldPriority = taskJson.priority;
  let oldTitle = document.getElementById("big-task-pop-up-title-text").innerHTML;
  let oldDescription = document.getElementById("big-task-pop-up-description").innerHTML;
  let oldDate = document.getElementById("big-task-pop-up-date").innerHTML;
  document.getElementById("big-task-pop-up-category").innerHTML = "";
  document.getElementById("big-task-pop-up-category").style = "background-color: white;";
  renderAllBigPopUp(oldTitle, oldDescription, oldDate, oldPriority, taskJson, id);
}

function renderAllBigPopUp(oldTitle, oldDescription, oldDate, oldPriority, taskJson, id) {
  if (subtaskArray.length !== 0) {
    taskJson["subtask"] = subtaskArray;
  }
  returnBigTaskPopUpTitle(oldTitle);
  returnBigTaskPopUpDescription(oldDescription);
  document.getElementById("big-task-pop-up-due-date-container").classList.add("big-edit-task-pop-up-section-container");
  returnBigTaskPopUpDueDateContainer(oldDate);
  document.getElementById("big-task-pop-up-priority-container").classList.add("big-edit-task-pop-up-section-container");
  returnBigTaskPopUpPriorityContainer();
  document
    .getElementById("big-edit-task-" + oldPriority.toLowerCase() + "-priority")
    .classList.add("big-edit-task-" + oldPriority.toLowerCase() + "-priority-aktiv");
  priorityValue = oldPriority;
  returnBigTaskPopUpContactAll(id);
  returnBigTaskPopUpSubtasksAll();
  renderBigTaskAssignedContactContainer(taskJson);
  renderBigEditTaskAssignedToPopUp(taskJson);
  returnBigPopUpEditButtons(id);
}

function showEditTaskAssignedToPopUp() {
  document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.remove("height-0");
  document.getElementById("big-edit-task-assigned-to-pop-up").classList.remove("box-shadow-none");
  document.getElementById("big-edit-task-assigned-to-input-arrow").classList.add("rotate-90");
  toggleFocusAssignedToInput();
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
  document.getElementById("big-edit-task-assigned-to-contact-container").innerHTML = "";
  if (taskJson.assigned) {
    for (let i = 0; i < taskJson.assigned.length; i++) {
      const contact = taskJson.assigned[i];
      returnColorAndAssignedToContacts(contact);
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

function checkBigEditTaskContact(i, contactObject, taskIndex) {
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

// addContactToAssigned
function addContactToAssigned(contactObject, taskIndex) {
  let taskJson = tasks[taskIndex];
  assignedToContactsBigContainer.push(contactObject);
  taskJson.assigned = assignedToContactsBigContainer;
  renderBigTaskAssignedContactContainer(taskJson);
}

// deleteContactToAssigned
function deleteContactToAssigned(contactObject, taskIndex) {
  let taskJson = tasks[taskIndex];
  let contactObjectIndex = assignedToContactsBigContainer.findIndex((jsonObject) => jsonObject.name === contactObject.name);
  assignedToContactsBigContainer.splice(contactObjectIndex, 1);
  renderBigTaskAssignedContactContainer(taskJson);
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

function changeSaveIconClickedOnStatus() {
  if (isSaveIconClicked == false) {
    isSaveIconClicked = true;
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
  let subtaskJson = createSubtaskJson(subtaskInput.value);
  subtaskArray.push(subtaskJson);
  insertSubtasksIntoContainer();
  subtaskInput.innerHTML = "";
}

function insertSubtasksIntoContainer() {
  document.getElementById("big-edit-task-subtask-container").innerHTML = "";
  // let subtaskAllContainer = document.getElementById("big-task-pop-up-subtask-all");
  // subtaskAllContainer.innerHTML += `<div id="onlySubtasks"></div>`;
  // let onlySubtasks = document.getElementById("onlySubtasks");
  document.getElementById("big-edit-task-subtask-container").innerHTML = "";
  if (subtaskArray.length >= 1) {
    for (let i = 0; i < subtaskArray.length; i++) {
      let subtask = subtaskArray[i];
      document.getElementById("big-edit-task-subtask-container").innerHTML += renderSubtaskInPopUpContainer(i, subtask);
    }
  } else {
    // onlySubtasks.classList.add("d-none");
  }
}

// function sowSubaskEdditButtons(i) {
//   document.getElementById(`popUpSubBTN${i}`).classList.remove("d-none");
// }

// function hideSubaskEdditButtons(i) {
//   document.getElementById(`popUpSubBTN${i}`).classList.add("d-none");
// }

function editSubtaskPopUpInput(i) {
  insertSubtasksIntoContainer();
  container = document.getElementById(`subtaskNumber${i}`);
  container.onmouseover = null;
  container.onmouseout = null;
  container.innerHTML = /*html*/ `
      <input id="subtaskEditedPopUp" type="text" value="${subtaskArray[i]["task-description"]}">
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

function editPopUpSearchContacts(taskIndex) {
  let searchValue = document.getElementById("big-edit-task-assigned-to-input").value.trim().toLowerCase();
  searchedUsers = [];
  for (i = 0; i < allUsers.length; i++) {
    let user = allUsers[i];
    if (user.name.toLowerCase().startsWith(searchValue)) {
      searchedUsers.push(user);
    }
  }
  document.getElementById("big-edit-task-assigned-to-pop-up").innerHTML = "";
  for (let i = 0; i < searchedUsers.length; i++) {
    const contact = searchedUsers[i];
    let contactIndex = allUsers.findIndex((user) => user.name === contact.name);

    console.log(contact.name);

    let allNames = [];

    for (let j = 0; j < tasks[taskIndex].assigned.length; j++) {
      const assignedContact = tasks[taskIndex].assigned[j];
      if (contact.name === tasks[taskIndex].assigned[j].name) {
        let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: true });
        renderOnlyActiveAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
        allNames.push(contact.name);
      }
    }
    if (!allNames.includes(contact.name)) {
      let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: false });
      renderOnlyAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
      allNames.push(contact.name);
    }

    // if (contact.name === taskJson.assigned[j].name) {
    //   let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: true });
    //   renderOnlyActiveAssignedToPopUp(contact, contactObject, i, taskIndex);
    // } else {
    //   let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: false });
    //   renderOnlyAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
    // }
  }
}

function closeSubtaskContainer() {
  // let bigSubtaskContainer = document.getElementById("big-edit-task-subtask-container");
  // bigSubtaskContainer.classList.add("d-none");
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
  // let inputField = document.getElementById(inputString);
  // let rightSubtask = document.getElementById(`subtaskNumber${i}`);
  let subtaskContainer = document.getElementById(`big-task-pop-up-subtask-all`);
  // rightSubtask.style.borderColor = "red";
  subtaskContainer.innerHTML += `<div class="messageFalseInputValue">
                                  <p>Leerer Subtask kann nicht abgespeichert werden. Bitte geben Sie einen gültigen Inhalt ein!</p>
                                <div>`;
  // inputField.style.borderColor = "red";
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

async function saveTaskChanges(id) {
  let newTitle = document.getElementById("big-edit-task-title-input").value;
  let newDescription = document.getElementById("big-edit-task-description-input").value;
  let newDate = document.getElementById("big-edit-task-due-date-input").value;
  let newPriority = priorityValue;
  let newAssignedTo = assignedToContactsBigContainer;
  let newSubtaskArray = subtaskArray;
  let taskForEditing = {
    newTitle: newTitle,
    newDescription: newDescription,
    newDate: newDate,
    newPriority: newPriority,
    newAssignedTo: newAssignedTo,
    newSubtaskArray: newSubtaskArray,
  };
  try {
    let newTaskReady = await updateTasksThroughEditing(id, taskForEditing);
    let newJsonElement = JSON.stringify(newTaskReady);
    let newJsontextElement = encodeURIComponent(newJsonElement);
    renderBigTask(newJsontextElement);
  } catch (error) {
    console.error("Fehler beim Speichern der Änderungen: ", error);
  }
  subtaskArray = [];
  checkBoxCheckedJson = {};
  updateHTML();
}

async function saveSubtaskChanges(id) {
  let task = tasks[id];
  let newTitle = task.title;
  let newDescription = task.description;
  let newDate = task.date;
  let newPriority = task.priority;
  let newSubtaskArray = task.subtask;
  let taskForEditing = {};

  if (task.assigned) {
    let newAssignedTo = task.assigned;

    taskForEditing = {
      newTitle: newTitle,
      newDescription: newDescription,
      newDate: newDate,
      newPriority: newPriority,
      newAssignedTo: newAssignedTo,
      newSubtaskArray: newSubtaskArray,
    };
  } else {
    taskForEditing = {
      newTitle: newTitle,
      newDescription: newDescription,
      newDate: newDate,
      newPriority: newPriority,
      newSubtaskArray: newSubtaskArray,
    };
  }
  try {
    let newTaskReady = await updateTasksThroughEditing(id, taskForEditing);
    let newJsonElement = JSON.stringify(newTaskReady);
    let newJsontextElement = encodeURIComponent(newJsonElement);
    renderBigTask(newJsontextElement);
  } catch (error) {
    console.error("Fehler beim Speichern der Änderungen: ", error);
  }
  subtaskArray = [];
  checkBoxCheckedJson = {};
  updateHTML();
}

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

async function updateTasksThroughEditing(taskId, objectForEditing) {
  for (let index = 0; index < tasks.length; index++) {
    if (index == taskId) {
      let container = tasks[taskId]["container"];
      let category = tasks[taskId]["category"];
      if (tasks[taskId]["subtask"]) {
        tasks[taskId] = saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category);
      } else if (!tasks[taskId]["subtask"] && subtaskArray != null) {
        tasks[taskId] = saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category);
      } else {
        tasks[taskId] = saveChangesSingleTaskWithoutSubtask(taskId, objectForEditing, container, category);
      }
      try {
        await saveTaskToFirebase(tasks[taskId]);
      } catch (error) {
        console.error("Fehler beim Hochladen der Daten: ", error);
      }
      return tasks[taskId];
    }
  }
  checkBoxCheckedJson = {};
}

// deleteData
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

// checkCategoryColor
function checkCategoryColor(category) {
  if (category === "User Story") {
    return "#0038FF";
  } else if (category === "Technical Task") {
    return "#1FD7C1";
  } else {
    return "#42526e";
  }
}

// checkPriorityIcon
function checkPriorityIcon(priorityText) {
  if (priorityText === "urgent") {
    return generateHTMLUrgencyUrgent();
  } else if (priorityText === "medium") {
    return generateHTMLUrgencyMedium();
  } else if (priorityText === "low") {
    return generateHTMLUrgencyLow();
  }
}

// checkIfTitleContainsSearchedInput
function searchForTasks() {
  let searchValue = document.getElementById("search-input").value.trim().toLowerCase();
  searchedTasks = [];

  for (i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    if (task.title.toLowerCase().includes(searchValue) || task.description.toLowerCase().includes(searchValue)) {
      searchedTasks.push(task);
    }
  }
  renderSearchedTasks();
}

// renderSearchedTasks
function renderSearchedTasks() {
  for (let i = 0; i < allCategories.length; i++) {
    const categoryContainer = allCategories[i];
    document.getElementById(categoryContainer).innerHTML = "";
    if (searchedTasks.length < tasks.length) {
      for (let j = 0; j < searchedTasks.length; j++) {
        const task = searchedTasks[j];

        if (categoryContainer === task.container) {
          let jsonElement = JSON.stringify(task);
          let rightIcon = insertCorrectUrgencyIcon(task);
          let variableClass = setVariableClass(task);
          let oppositeCategory = "no-" + task["container"];
          let contactsHTML = "";
          if (task["assigned"]) {
            for (let index = 0; index < task["assigned"].length; index++) {
              let name = task["assigned"][index]["name"];
              let initials = getInitials(name);
              contactsHTML += /*html*/ `
                <div class="task-contact" style='background-color: ${task["assigned"][index]["color"]}'>${initials}</div>`;
            }
          }
          document.getElementById(categoryContainer).innerHTML += generateTaskHTML(task, contactsHTML, oppositeCategory, rightIcon, jsonElement);
        }
      }
    } else {
      updateHTML();
    }
  }
}

// taskMarker
function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}

function getInitials(name) {
  let nameArray = name.trim().split(" ");
  let initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");

  return initials;
}
