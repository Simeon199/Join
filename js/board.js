let tasks = [];
let categories = [];
let searchedTasks = [];
let allCategories = ["to-do-container", "await-feedback-container", "done-container", "in-progress-container"];
let elementDraggedOver;
// console.log(document.getElementById("search-input"));
let searchedInput = document.getElementById("search-input");
let isBigTaskPopUpOpen = false;
let allTasksWithSubtasks = [];

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
  let oldTitle = document.getElementById("big-task-pop-up-title-text").innerHTML;
  let oldDescription = document.getElementById("big-task-pop-up-description").innerHTML;

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
    <input type="date" id='big-edit-task-due-date-input'>
  `;

  document.getElementById("big-task-pop-up-priority-container").classList.add("big-edit-task-pop-up-section-container");
  document.getElementById("big-task-pop-up-priority-container").innerHTML = /*html*/ `
    <p id='big-edit-task-priority-section-headline'>Priority</p>
    <div id='big-edit-task-priority-container'>
      <div class='big-edit-task-priority-item'>Urgent</div>
      <div class='big-edit-task-priority-item'>Medium</div>
      <div class='big-edit-task-priority-item'>Low</div>
    </div>
  `;

  document.getElementById("big-task-pop-up-contact-all").innerHTML = /*html*/ `
    <p class='big-edit-task-section-headline'>Assigned to</p>

    <input type='text' id='big-edit-task-assigned-to-input' placeholder='Select contacts to assign'>

    <div id='big-edit-task-assigned-to-pop-up' class='d-none'>
      <div class='big-edit-task-assigned-to-pop-up-contact-container'>
        <div class='big-edit-task-assigned-to-pop-up-contact'>
          <div>SM</div>
          <p>Sofia Müller</p>
        </div>

        <input type="checkbox">
      </div>
    </div>
    `;

  document.getElementById("big-task-pop-up-subtask-all").innerHTML = /*html*/ `
    <p class='big-edit-task-section-headline'>Subtasks</p>
    <input type="text" id='big-edit-task-subtask-input' placeholder='Add new Subtask'>
  `;

  // let taskForEditing = createObjectForEditing(id);
  // console.log(taskForEditing);
  // let newTaskReady = updateTasksThroughEditing(id, taskForEditing);
  // console.log(newTaskReady);
  // let newJsonElement = JSON.stringify(newTaskReady);
  // console.log(newJsonElement);
  // let newJsontextElement = encodeURIComponent(newJsonElement);
  // console.log(newJsontextElement);

  document.getElementById("big-task-pop-up-bottom-buttons-container").innerHTML = /*html*/ `
  <button id='big-edit-task-pop-up-save-button' onclick='saveTaskChanges(${id})'>Ok</button>
`;

// Hier Original!

//   document.getElementById("big-task-pop-up-bottom-buttons-container").innerHTML = /*html*/ `
//   <button id='big-edit-task-pop-up-save-button' onclick='renderBigTask("${jsonTextElement}")'>Ok</button>
// `;
}

async function saveTaskChanges(id) {
  let newTitle = document.getElementById("big-edit-task-title-input").value;
  let newDescription = document.getElementById("big-edit-task-description-input").value;
  let newDate = document.getElementById("big-edit-task-due-date-input").value;
  let newPriority = "priority"; 
  let newAssignedTo = document.getElementById("big-edit-task-assigned-to-input").value;
  let newSubtaskArray = "ArrayWillFollow"; 
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
  updateHTML();

  // let newTaskReady = updateTasksThroughEditing(id, taskForEditing);
  // let newJsonElement = JSON.stringify(newTaskReady);
  // let newJsontextElement = encodeURIComponent(newJsonElement);

  // renderBigTask(newJsontextElement);
}

function createObjectForEditing() {
  let objectForEditing = {
    newTitle: document.getElementById("big-edit-task-title-input").value,
    newDescription: document.getElementById("big-edit-task-description-input").value,
    newDate: document.getElementById("big-edit-task-due-date-input").value,
    newPriority: "priority",
    newAssignedTo: document.getElementById("big-edit-task-assigned-to-input").value,
    newSubtaskArray: "ArrayWillFollow",
  };
  return objectForEditing;
}

function saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category){
  tasks[taskId] = {
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
  return newTask;
}

function saveChangesSingleTaskWithoutSubtask(taskId, objectForEditing, container, category){
  tasks[taskId] = {
    category: category,
    container: container,
    date: objectForEditing["newDate"],
    description: objectForEditing["newDescription"],
    priority: objectForEditing["newPriority"],
    tasksIdentity: taskId,
    title: objectForEditing["newTitle"],
  };
  let newTask = tasks[taskId];
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
        // await deleteData(path = "/testRealTasks/undefined");
      } catch (error) {
        console.error("Fehler beim Hochladen der Daten: ", error);
      }
      return tasks[taskId];
    }
  }
}

// function updateTasksThroughEditing(taskId, objectForEditing) {
//   for (index = 0; index < tasks.length; index++) {
//     if (index == taskId) {
//       let container = tasks[taskId]["container"];
//       let category = tasks[taskId]["category"];
//       if (tasks[taskId]["subtask"]) {
//         tasks[taskId] = saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category);
//         await upload("testRealTasks", tasks);
//         return tasks[taskId];
//       } else {
//         tasks[taskId] = saveChangesSingleTaskWithoutSubtask(taskId, objectForEditing, container, category);
//         await upload("testRealTasks", tasks);
//         return tasks[taskId];
//       }
//     }
//   }
// }

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
