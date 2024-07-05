let tasks = [];
let categories = [];
let searchedTasks = [];
let allCategories = ["to-do-container", "await-feedback-container", "done-container", "in-progress-container"];
let elementDraggedOver;
let priorityValue = "";
let searchedInput = document.getElementById("search-input");
let isBigTaskPopUpOpen = false;
let allTasksWithSubtasks = [];
let assignedToContactsBigContainer = [];

document.addEventListener("DOMContentLoaded", async function () {
  await getTasksFromDatabase();
  updateHTML();
});

async function loadRelevantData(path = "") {
  let response = await fetch(BASE_URL1 + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

async function getTasksFromDatabase() {
  // tasks = loadTasksFromLocalStorage() || (await loadTasksFromDatabase());
  tasks = await loadTasksFromDatabase();
  // tasks = await loadTasksFromDatabase();
  updateCategories();
  updateHTML();
}

function loadTasksFromLocalStorage() {
  let storagedTasks = localStorage.getItem("tasks");
  if (storagedTasks) {
    return JSON.parse(storagedTasks);
  } else {
    return null;
  }
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
  return generateTaskHTML(
    element,
    // variableClass,
    contactsHTML,
    oppositeCategory,
    rightIcon,
    jsonElement
  );
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

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

async function saveTaskToFirebase(task) {
  const taskPath = `/testRealTasks/${task.tasksIdentity}`;
  const response = await fetch(`${BASE_URL1}${taskPath}.json`, {
    method: "PATCH",
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
  document.getElementById("add-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("add-task-pop-up").classList.remove("translate-100");
  standardContainer = container;
}

// hideAddTaskPopUp
function hideAddTaskPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

// showBigTaskPopUp
function showBigTaskPopUp(jsonTextElement) {
  isBigTaskPopUpOpen = true;
  document.getElementById("big-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("big-task-pop-up").classList.remove("translate-100");

  renderBigTask(jsonTextElement);
  console.log(jsonTextElement);
}

// hideBigTaskPopUp
function hideBigTaskPopUp() {
  isBigTaskPopUpOpen = false;
  document.getElementById("big-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("big-task-pop-up").classList.add("translate-100");
}

// renderBigTask
function renderBigTask(jsonTextElement) {
  let taskJson = JSON.parse(decodeURIComponent(jsonTextElement));
  console.log(taskJson.title);
  console.log(taskJson.description);
  console.log(taskJson.category);
  console.log(taskJson.date);
  console.log(taskJson.priority);
  document.getElementById("big-task-pop-up-priority-container").classList.remove("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-edit-task-pop-up-section-container");

  document.getElementById("big-task-pop-up-title").innerHTML = /*html*/ `<h1 id='big-task-pop-up-title-text'>${taskJson.title}</h1>`;
  document.getElementById("big-task-pop-up-description").innerHTML = taskJson.description;

  document.getElementById("big-task-pop-up-due-date-container").innerHTML = /*html*/ `
    <h2 class="big-task-pop-up-label-text">Due date:</h2>
    <p id="big-task-pop-up-date" class="big-task-pop-up-value-text">${taskJson.date}</p>
  `;

  document.getElementById("big-task-pop-up-category").innerHTML = taskJson.category;
  document.getElementById("big-task-pop-up-category").style.backgroundColor = checkCategoryColor(taskJson.category);

  document.getElementById("big-task-pop-up-priority-container").innerHTML = /*html*/ `
    <h2 class="big-task-pop-up-label-text">Priority:</h2>
    <div class="big-task-pop-up-value-text">
      <p id="big-task-pop-up-priority-text">${taskJson.priority}</p>

      <div id="big-task-pop-up-priority-icon">
        <svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.0685 7.16658H0.931507C0.684456 7.16658 0.447523 7.06773 0.272832 6.89177C0.0981406 6.71581 0 6.47716 0 6.22831C0 5.97947 0.0981406 5.74081 0.272832 5.56485C0.447523 5.38889 0.684456 5.29004 0.931507 5.29004H16.0685C16.3155 5.29004 16.5525 5.38889 16.7272 5.56485C16.9019 5.74081 17 5.97947 17 6.22831C17 6.47716 16.9019 6.71581 16.7272 6.89177C16.5525 7.06773 16.3155 7.16658 16.0685 7.16658Z"
            fill="#FF7A00"
          />
          <path
            d="M16.0685 2.7098H0.931507C0.684456 2.7098 0.447523 2.61094 0.272832 2.43498C0.0981406 2.25902 0 2.02037 0 1.77152C0 1.52268 0.0981406 1.28403 0.272832 1.10807C0.447523 0.932105 0.684456 0.833252 0.931507 0.833252H16.0685C16.3155 0.833252 16.5525 0.932105 16.7272 1.10807C16.9019 1.28403 17 1.52268 17 1.77152C17 2.02037 16.9019 2.25902 16.7272 2.43498C16.5525 2.61094 16.3155 2.7098 16.0685 2.7098Z"
            fill="#FF7A00"
          />
        </svg>
      </div>
    </div>
  `;

  document.getElementById("big-task-pop-up-priority-icon").innerHTML = checkPriorityIcon(taskJson.priority);

  document.getElementById("big-task-pop-up-bottom-buttons-container").innerHTML = returnDeleteEditHTML(taskJson.tasksIdentity, jsonTextElement);
  let contactsHTML = "";
  let initials = "";
  if (taskJson["assigned"] || typeof taskJson["assigned"] == Array) {
    for (let index = 0; index < taskJson["assigned"].length; index++) {
      let name = taskJson["assigned"][index]["name"];
      let nameArray = name.trim().split(" ");
      initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
    }
  }

  document.getElementById("big-task-pop-up-contact-all").innerHTML = /*html*/ `
    <h2 class="big-task-pop-up-label-text">Assigned To:</h2>
    <div id="big-task-pop-up-contact-container">${contactsHTML}</div>
  `;

  document.getElementById("big-task-pop-up-subtask-all").innerHTML = /*html*/ `
    <h2 class="big-task-pop-up-label-text">Subtasks</h2>
    <div id="big-task-pop-up-subtasks-container"></div>
  `;

  renderTaskContact(taskJson);
  renderSubtask(taskJson);
  // console.log(taskJson);
}

// renderSubtask
function renderSubtask(taskJson) {
  // console.log(taskJson)
  if (taskJson.subtask) {
    taskJson.subtask.forEach((subtask) => {
      // console.log(subtask["task-description"]);
      document.getElementById("big-task-pop-up-subtasks-container").innerHTML += returnSubtaskHTML(subtask["task-description"]);
    });
  } else {
    document.getElementById("big-task-pop-up-subtasks-container").innerHTML = /*html*/ `  
    <p class='big-task-pop-up-value-text'>No Subtasks</p>
    `;
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

  document.getElementById("big-task-pop-up-title").innerHTML = /*html*/ `
    <p class='big-edit-task-section-headline'>Title</p>
    <input type="text" id='big-edit-task-title-input' value='${oldTitle}' placeholder='Enter a title'>
  `;

  document.getElementById("big-task-pop-up-description").innerHTML = /*html*/ `
    <p class='big-edit-task-section-headline'>Description</p>
    <textarea id="big-edit-task-description-input" placeholder='Enter a Description'>${oldDescription}</textarea>
  `;

  document.getElementById("big-task-pop-up-due-date-container").classList.add("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-due-date-container").innerHTML = /*html*/ `
    <p class='big-edit-task-section-headline'>Due date</p>
    <input type="date" value='${oldDate}' id='big-edit-task-due-date-input'>
  `;

  document.getElementById("big-task-pop-up-priority-container").classList.add("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-priority-container").innerHTML = /*html*/ `
    <p id='big-edit-task-priority-section-headline'>Priority</p>
    <div id='big-edit-task-priority-container'>
      <div class='big-edit-task-priority-item' id='big-edit-task-urgent-priority' onclick='checkBigEditTaskPriority("urgent")'>
        Urgent
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.6527 15.2547C19.418 15.2551 19.1895 15.1803 19.0006 15.0412L10.7486 8.958L2.4965 15.0412C2.38065 15.1267 2.24907 15.1887 2.10927 15.2234C1.96947 15.2582 1.82419 15.2651 1.68172 15.2437C1.53925 15.2223 1.40239 15.1732 1.27894 15.099C1.1555 15.0247 1.04789 14.927 0.962258 14.8112C0.876629 14.6954 0.814657 14.5639 0.77988 14.4243C0.745104 14.2846 0.738203 14.1394 0.759574 13.997C0.802733 13.7095 0.958423 13.4509 1.19239 13.2781L10.0965 6.70761C10.2852 6.56802 10.5138 6.49268 10.7486 6.49268C10.9833 6.49268 11.2119 6.56802 11.4006 6.70761L20.3047 13.2781C20.4906 13.415 20.6285 13.6071 20.6987 13.827C20.7688 14.0469 20.7677 14.2833 20.6954 14.5025C20.6231 14.7216 20.4833 14.9124 20.296 15.0475C20.1088 15.1826 19.8836 15.2551 19.6527 15.2547Z" fill="#FF3D00"/>
        <path d="M19.6527 9.50568C19.4181 9.50609 19.1895 9.43124 19.0006 9.29214L10.7486 3.20898L2.49654 9.29214C2.26257 9.46495 1.96948 9.5378 1.68175 9.49468C1.39403 9.45155 1.13523 9.29597 0.962293 9.06218C0.789357 8.82838 0.71645 8.53551 0.759609 8.24799C0.802768 7.96048 0.958458 7.70187 1.19243 7.52906L10.0965 0.958588C10.2852 0.818997 10.5138 0.743652 10.7486 0.743652C10.9834 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4907 7.66598 20.6286 7.85809 20.6987 8.07797C20.7689 8.29785 20.7677 8.53426 20.6954 8.75344C20.6231 8.97262 20.4833 9.16338 20.2961 9.29847C20.1088 9.43356 19.8837 9.50608 19.6527 9.50568Z" fill="#FF3D00"/>
      </svg>
    </div>
    <div class='big-edit-task-priority-item' id='big-edit-task-medium-priority' onclick='checkBigEditTaskPriority("medium")'>
      Medium
      <svg width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.7596 7.91693H1.95136C1.66071 7.91693 1.38197 7.80063 1.17645 7.59362C0.970928 7.3866 0.855469 7.10584 0.855469 6.81308C0.855469 6.52032 0.970928 6.23955 1.17645 6.03254C1.38197 5.82553 1.66071 5.70923 1.95136 5.70923H19.7596C20.0502 5.70923 20.329 5.82553 20.5345 6.03254C20.74 6.23955 20.8555 6.52032 20.8555 6.81308C20.8555 7.10584 20.74 7.3866 20.5345 7.59362C20.329 7.80063 20.0502 7.91693 19.7596 7.91693Z" fill="#FFA800"/>
        <path d="M19.7596 2.67376H1.95136C1.66071 2.67376 1.38197 2.55746 1.17645 2.35045C0.970928 2.14344 0.855469 1.86267 0.855469 1.56991C0.855469 1.27715 0.970928 0.996386 1.17645 0.789374C1.38197 0.582363 1.66071 0.466064 1.95136 0.466064L19.7596 0.466064C20.0502 0.466064 20.329 0.582363 20.5345 0.789374C20.74 0.996386 20.8555 1.27715 20.8555 1.56991C20.8555 1.86267 20.74 2.14344 20.5345 2.35045C20.329 2.55746 20.0502 2.67376 19.7596 2.67376Z" fill="#FFA800"/>
      </svg>
    </div>
    <div class='big-edit-task-priority-item' id='big-edit-task-low-priority' onclick='checkBigEditTaskPriority("low")'>
      Low
      <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.8555 9.69779C10.6209 9.69819 10.3923 9.62335 10.2035 9.48427L1.30038 2.91453C1.18454 2.82898 1.0867 2.72146 1.01245 2.59812C0.938193 2.47478 0.888977 2.33803 0.867609 2.19569C0.824455 1.90821 0.897354 1.61537 1.07027 1.3816C1.24319 1.14782 1.50196 0.992265 1.78965 0.949143C2.07734 0.906021 2.3704 0.978866 2.60434 1.15165L10.8555 7.23414L19.1066 1.15165C19.2224 1.0661 19.354 1.00418 19.4938 0.969432C19.6336 0.934685 19.7788 0.927791 19.9213 0.949143C20.0637 0.970495 20.2006 1.01967 20.324 1.09388C20.4474 1.16808 20.555 1.26584 20.6407 1.3816C20.7263 1.49735 20.7883 1.62882 20.823 1.7685C20.8578 1.90818 20.8647 2.05334 20.8433 2.19569C20.822 2.33803 20.7727 2.47478 20.6985 2.59812C20.6242 2.72146 20.5264 2.82898 20.4106 2.91453L11.5075 9.48427C11.3186 9.62335 11.0901 9.69819 10.8555 9.69779Z" fill="#7AE229"/>
        <path d="M10.8555 15.4463C10.6209 15.4467 10.3923 15.3719 10.2035 15.2328L1.30038 8.66307C1.06644 8.49028 0.910763 8.2317 0.867609 7.94422C0.824455 7.65674 0.897354 7.3639 1.07027 7.13013C1.24319 6.89636 1.50196 6.7408 1.78965 6.69768C2.07734 6.65456 2.3704 6.7274 2.60434 6.90019L10.8555 12.9827L19.1066 6.90019C19.3405 6.7274 19.6336 6.65456 19.9213 6.69768C20.209 6.7408 20.4678 6.89636 20.6407 7.13013C20.8136 7.3639 20.8865 7.65674 20.8433 7.94422C20.8002 8.2317 20.6445 8.49028 20.4106 8.66307L11.5075 15.2328C11.3186 15.3719 11.0901 15.4467 10.8555 15.4463Z" fill="#7AE229"/>
      </svg>
    </div>
  </div>
  `;

  document
    .getElementById("big-edit-task-" + oldPriority.toLowerCase() + "-priority")
    .classList.add("big-edit-task-" + oldPriority.toLowerCase() + "-priority-aktiv");

  priorityValue = oldPriority;

  document.getElementById("big-task-pop-up-contact-all").innerHTML = /*html*/ `
    <div id='big-edit-task-assigned-to-top-container'>
      <p class='big-edit-task-section-headline'>Assigned to</p>
      
      <div onclick='showEditTaskAssignedToPopUp()' id='big-edit-task-assigned-to-input-container'>
        <input type='text' id='big-edit-task-assigned-to-input' placeholder='Select contacts to assign'>
          <svg id='big-edit-task-assigned-to-input-arrow' class='big-edit-task-assigned-to-input-arrow' width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.44451 4.3L0.844506 1.7C0.52784 1.38333 0.457006 1.02083 0.632006 0.6125C0.807006 0.204167 1.11951 0 1.56951 0H6.71951C7.16951 0 7.48201 0.204167 7.65701 0.6125C7.83201 1.02083 7.76117 1.38333 7.44451 1.7L4.84451 4.3C4.74451 4.4 4.63617 4.475 4.51951 4.525C4.40284 4.575 4.27784 4.6 4.14451 4.6C4.01117 4.6 3.88617 4.575 3.76951 4.525C3.65284 4.475 3.54451 4.4 3.44451 4.3Z" fill="#2A3647"/>
          </svg>
      </div>
    </div>

      <div id='big-edit-task-assigned-to-contact-container'></div>

    <div id='big-edit-task-assigned-to-pop-up-container' class='big-edit-task-assigned-to-pop-up-container height-0'>
      <div id='big-edit-task-assigned-to-pop-up' class='big-edit-task-assigned-to-pop-up box-shadow-none'></div>
    </div>
    `;

  document.getElementById("big-task-pop-up-subtask-all").innerHTML = /*html*/ `
    <p class='big-edit-task-section-headline'>Subtasks</p>
    <input type="text" id='big-edit-task-subtask-input' placeholder='Add new Subtask'>
  `;

  for (let i = 0; i < taskJson.assigned.length; i++) {
    const contact = taskJson.assigned[i];
    // console.log(contact);

    document.getElementById("big-edit-task-assigned-to-contact-container").innerHTML += /*html*/ `
      <div class='big-edit-task-assigned-to-contact' style='background-color:${contact.color}'>
        ${firstLetterFirstTwoWords(contact.name)}
      </div>
    `;
  }

  for (let i = 0; i < allUsers.length; i++) {
    const contact = allUsers[i];
    let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: false });

    document.getElementById("big-edit-task-assigned-to-pop-up").innerHTML += /*html*/ `
<div onclick='checkBigEditTaskContact(${i}, ${contactObject})' class='big-edit-task-assigned-to-pop-up-contact-container'>
  <div class='big-edit-task-assigned-to-pop-up-contact' >
    <div class='big-edit-task-assigned-to-pop-up-contact-badge' style='background-color: ${contact.color}'>${firstLetterFirstTwoWords(
      contact.name
    )}</div>
    <p class='big-edit-task-assigned-to-pop-up-contact-name'>${contact.name}</p>
  </div>
  
  <div class='big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container'>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
    </svg>
  </div>
</div>
    `;
  }

  document.getElementById("big-task-pop-up-bottom-buttons-container").innerHTML = /*html*/ `
  <button id='big-edit-task-pop-up-save-button' onclick='saveTaskChanges(${id})'>Ok</button>
`;
}

function showEditTaskAssignedToPopUp() {
  document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.toggle("height-0");
  document.getElementById("big-edit-task-assigned-to-pop-up").classList.toggle("box-shadow-none");
  document.getElementById("big-edit-task-assigned-to-input-arrow").classList.toggle("rotate-90");
}

function checkBigEditTaskContact(i, contactObject) {
  contactObject["isSelected"] = true;
  assignContactsBigContainer(contactObject);
  HTMLContactContainer = document.querySelectorAll(".big-edit-task-assigned-to-pop-up-contact-container")[i];
  HTMLContactContainer.classList.toggle("big-edit-task-assigned-to-pop-up-active-contact");

  if (HTMLContactContainer.classList.contains("big-edit-task-assigned-to-pop-up-active-contact")) {
    console.log("ak");
    document.querySelectorAll(".big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container")[i].innerHTML = /*html*/ `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 8V14C17 15.6569 15.6569 17 14 17H4C2.34315 17 1 15.6569 1 14V4C1 2.34315 2.34315 1 4 1H12" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M5 9L9 13L17 1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
      `;
  } else {
    document.querySelectorAll(".big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container")[i].innerHTML = /*html*/ `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2" />
    </svg>
     `;
  }
}

function assignContactsBigContainer(contact) {
  assignedToContactsBigContainer.push(contact);
  console.log(assignedToContactsBigContainer);
}

async function saveTaskChanges(id) {
  let newTitle = document.getElementById("big-edit-task-title-input").value;
  let newDescription = document.getElementById("big-edit-task-description-input").value;
  let newDate = document.getElementById("big-edit-task-due-date-input").value;
  let newPriority = priorityValue;
  let newAssignedTo = assignedToContactsBigContainer;
  let newSubtaskArray = "ArrayWillFollow";
  let taskForEditing = {
    newTitle: newTitle,
    newDescription: newDescription,
    newDate: newDate,
    newPriority: newPriority,
    newAssignedTo: newAssignedTo,
    newSubtaskArray: newSubtaskArray,
  };
  // console.log(taskForEditing);

  try {
    let newTaskReady = await updateTasksThroughEditing(id, taskForEditing);
    let newJsonElement = JSON.stringify(newTaskReady);
    let newJsontextElement = encodeURIComponent(newJsonElement);
    renderBigTask(newJsontextElement);
  } catch (error) {
    console.error("Fehler beim Speichern der Änderungen: ", error);
  }
  // assignedToContactsBigContainer = [];
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

// function createObjectForEditing() {
//   let objectForEditing = {
//     newTitle: document.getElementById("big-edit-task-title-input").value,
//     newDescription: document.getElementById("big-edit-task-description-input").value,
//     newDate: document.getElementById("big-edit-task-due-date-input").value,
//     newPriority: "priority",
//     newAssignedTo: document.getElementById("big-edit-task-assigned-to-input").value,
//     newSubtaskArray: "ArrayWillFollow",
//   };
//   return objectForEditing;
// }

function saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category) {
  console.log(objectForEditing);
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
  console.log(newTask);
  assignedToContactsBigContainer = [];
  return newTask;
}

function saveChangesSingleTaskWithoutSubtask(taskId, objectForEditing, container, category) {
  console.log(objectForEditing);
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
  console.log(newTask);
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
}

// deleteData
async function deleteData(path = "") {
  let response = await fetch(BASE_URL1 + path + ".json", {
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
  console.log(searchedTasks);
  renderSearchedTasks();
}

// renderSearchedTasks
function renderSearchedTasks() {
  // proofIfSearchedTaskEmpty();
  for (let i = 0; i < allCategories.length; i++) {
    const categoryContainer = allCategories[i];

    document.getElementById(categoryContainer).innerHTML = "";

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
  }
}

// function proofIfSearchedTaskEmpty() {
//   if (searchedTasks.length == 0) {
//     updateHTML();
//   }
// }

// taskMarker
function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}

function getInitials(name) {
  let nameArray = name.trim().split(" ");
  let initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");

  return initials;
}

function checkIfSubtaskExists() {
  for (index = 0; index < tasks.length; index++) {
    let certainTask = tasks[index];
    for (key in certainTask) {
      if (key == "subtask") {
        console.log(tasks[index]);
        allTasksWithSubtasks.push(certainTask);
      }
    }
  }
}
