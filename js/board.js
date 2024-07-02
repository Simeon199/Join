let tasks = [];
let categories = [];
let searchedTasks = [];
let allCategories = ["to-do-container", "await-feedback-container", "done-container", "in-progress-container"];
let elementDraggedOver;
// console.log(document.getElementById("search-input"));
let searchedInput = document.getElementById("search-input");
let isBigTaskPopUpOpen = false;

/* Bemerkung: Die Ausführung von deleteCertainElements(), deren Aufgabe es wäre ausgewählte Datenbankeinträge wieder zu entfernen
funktioniert noch nicht, da die Firebase-Datenbank in diesem Fall den Zugriff verweigert ('Probleme mit der CORS policy') */

document.addEventListener("DOMContentLoaded", async function () {
  await getTasksFromDatabase();
  updateHTML();
});

// async function loadData(path = "") {
//   let response = await fetch(BASE_URL1 + path + ".json");
//   let responseAsJson = await response.json();
//   return responseAsJson;
// }

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

// async function loadTasksFromDatabase() {
//   let response = await loadData();
//   console.log(response.tasksList);
//   if (response && response.tasksList) {
//     for (index = 0; index < response.tasksList.length; index++) {
//       tasks.push(response.tasksList[index]);
//     }
//     return tasks;
//   }
//   return [];
// }

// async function loadTasksFromDatabase() {
//   let response = await loadData();
//   console.log(response.testRealTasks);
//   if (response && response.testRealTasks) {
//     for (index = 0; index < response.testRealTasks.length; index++) {
//       tasks.push(response.testRealTasks[index]);
//     }
//     return tasks;
//   }
//   return [];
// }

async function loadTasksFromDatabase() {
  let response = await loadRelevantData();
  // console.log(response.testRealTasks);
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
      // console.log(container);
      // console.log(tasks);
      let filteredTasks = tasks.filter((task) => task.container === container);
      // console.log(filteredTasks);
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
  let variableClass = setVariableClass(element);
  let oppositeCategory = "no-" + element["container"];

  let contactsHTML = "";
  if (element["assigned"] || typeof element["assigned"] == Array) {
    for (let i = 0; i < element["assigned"].length; i++) {
      let name = element["assigned"][i]["name"];
      let initials = getInitials(name);
      contactsHTML += /*html*/ `  
      <div class="task-contact" style='background-color: ${element["assigned"][i]["color"]}'>${initials}</div>`;
      // contactsHTML += `<div class="task-contact">${element["assigned"][i]["name"]}</div>`;
    }
  }

  let jsonElement = JSON.stringify(element);

  return generateTaskHTML(
    element["tasksIdentity"],
    variableClass,
    element["category"],
    element["title"],
    element["description"],
    contactsHTML,
    element["container"],
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

// async function saveTaskToFirebase(task) {
//   const taskPath = `/tasksList/${task.tasksIdentity}`;
//   const response = await fetch(`${BASE_URL1}${taskPath}.json`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(task),
//   });

//   if (!response.ok) {
//     console.error("Fehler beim Speichern der Task in Firebase:", response.statusText);
//   } else {
//     console.log("Task erfolgreich in Firebase gespeichert");
//   }
// }

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
  // console.log(taskJson["assigned"].length);

  document.getElementById("big-task-pop-up-title").innerHTML = /*html*/ `<h1 id='big-task-pop-up-title-text'>${taskJson.title}</h1>`;
  document.getElementById("big-task-pop-up-description").innerHTML = taskJson.description;
  document.getElementById("big-task-pop-up-date").innerHTML = taskJson.date;
  document.getElementById("big-task-pop-up-category").innerHTML = taskJson.category;
  document.getElementById("big-task-pop-up-category").style.backgroundColor = checkCategoryColor(taskJson.category);
  document.getElementById("big-task-pop-up-priority-text").innerHTML = taskJson.priority;
  document.getElementById("big-task-pop-up-priority-icon").innerHTML = checkPriorityIcon(taskJson.priority);

  document.getElementById("big-task-pop-up-bottom-buttons-container").innerHTML = returnDeleteEditHTML(taskJson.tasksIdentity);
  let contactsHTML = "";
  let initials = "";
  if (taskJson["assigned"] || typeof taskJson["assigned"] == Array) {
    for (let index = 0; index < taskJson["assigned"].length; index++) {
      let name = taskJson["assigned"][index]["name"];
      let nameArray = name.trim().split(" ");
      initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
      // contactsHTML += /*html*/ `
      // <div class="task-contact" style='background-color: ${taskJson["assigned"][index]["color"]}'>${initials}</div>`;
    }
    // contactsHTML += `<div class="task-contact">${taskJson["assigned"][index]["name"]}</div>`;
  }

  document.getElementById("big-task-pop-up-contact-container").innerHTML = contactsHTML;
  document.getElementById("big-task-pop-up-subtasks-container").innerHTML = "";

  renderTaskContact(taskJson);
  renderSubtask(taskJson);
}

// renderSubtask
function renderSubtask(taskJson) {
  if (taskJson.subtask) {
    taskJson.subtask.forEach((subtask) => {
      document.getElementById("big-task-pop-up-subtasks-container").innerHTML += returnSubtaskHTML(subtask);
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
function renderEditTask() {
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

  document.getElementById("big-task-pop-up-bottom-buttons-container").innerHTML = /*html*/ `
  <button id='big-edit-task-pop-up-save-button'>Ok</button>
`;
}

// deleteTask
// function deleteTask(id) {
//   deleteData("tasksList/" + id);
// }

// function deleteTask(id) {
//   deleteData("testRealTask/" + id);
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
              <div class="task-contact">${initials}</div>`;
          }
        }

        document.getElementById(categoryContainer).innerHTML += generateTaskHTML(
          task["tasksIdentity"],
          variableClass,
          task["category"],
          task["title"],
          task["description"],
          contactsHTML,
          task["container"],
          oppositeCategory,
          rightIcon,
          jsonElement
        );
      }
    }
  }
}

// taskMarker
function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}

function getInitials(name) {
  // Split the name by space to get an array of words
  let nameArray = name.trim().split(" ");

  // Map through the array and return the first character of each word in uppercase
  let initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");

  return initials;
}
