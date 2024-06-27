let testingTasks4 = [
  {
    category: "to-do-container",
    "story-category": "User Story",
    id: 0,
    title: "Contact Form and Imprint",
    task: "Create a contact form and imprint page",
    priority: "Low",
    "people-in-charge": ["AS", "DE", "EF"],
  },
  {
    category: "await-feedback-container",
    "story-category": "Technical Task",
    id: 1,
    title: "HTML Base Template Creation",
    task: "Create reusable HTML base templates",
    priority: "Medium",
    "people-in-charge": ["AM", "EM", "MB"],
  },
  {
    category: "await-feedback-container",
    "story-category": "User Story",
    id: 2,
    title: "Daily Kochwelt Recipe",
    task: "Implement daily recipe and portion calculator",
    priority: "Medium",
    "people-in-charge": ["EF", "AS", "TW"],
  },
  {
    category: "done-container",
    "story-category": "Technical Task",
    id: 3,
    title: "CSS Architecture Planning",
    task: "Define CSS naming conventions and structure",
    priority: "Urgent",
    "people-in-charge": ["SM", "BZ", "TW"],
  },
  // {
  //   "category": "in-progress-container",
  //   "story-category": "User Story",
  //   "id": 4,
  //   "title": "Kochwelt Page & Recipe Recommender",
  //   "task": "Build start page with recipe recommendation",
  //   "priority": "Low",
  //   "people-in-charge": ['AM', 'EM', 'MB']
  // }
];

let tasks = [];
const BASE_URL = "https://join-privat-default-rtdb.europe-west1.firebasedatabase.app/";
let categories = [];
let allCategories = [
  "to-do-container",
  "await-feedback-container",
  "done-container",
  "in-progress-container",
];
let elementDraggedOver;

/* Bemerkung: Die Ausführung von deleteCertainElements(), deren Aufgabe es wäre ausgewählte Datenbankeinträge wieder zu entfernen
funktioniert noch nicht, da die Firebase-Datenbank in diesem Fall den Zugriff verweigert ('Probleme mit der CORS policy') */

document.addEventListener("DOMContentLoaded", async function () {
  await getTasksFromDatabase();
  updateHTML();
});

async function deleteDataFromDatabase(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json()", {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("HTTP error! status: ${response.status}");
    }
    let responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    console.log("Error deleting data: ", error);
  }
}

async function deleteCertainElements() {
  let keyToDelete = "-O04CXUQam1YkaDlyItw";
  let path = keyToDelete;
  let result = await deleteDataFromDatabase(path);
  console.log("Ergebnis des Löschvorgangs: ", result);
}

async function loadData(path = "") {
  let response = await fetch(BASE_URL1 + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

async function loadDataTwo(path = "") {
  let response = await fetch(BASE_URL1 + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

async function getTasksFromDatabase() {
  tasks = loadTasksFromLocalStorage() || (await loadTasksFromDatabase());
  updateCategories();
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
  categories = [...new Set(tasks.map((task) => task.category))];
}

async function postData(path = "", data = tasksObject) {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    console.error("Error posting data:", error);
  }
}

// postData("tasks", testingTasks4).then(response => {
//   console.log('Response from Firebase:', response);
// });

// -O05H016uL_VT-vaNnYE
// -O0DxZFsRS2ts1lRHvbZ
// -O0EMm8rA_hMdc-POAVF

async function loadTasksFromDatabase() {
  let response = await loadData();
  console.log(response.tasks);
  if (response && response.tasks) {
    return Object.values(tasks);
  }
  return [];
}

function iterateThroughSubArray(taskArray, htmlElement) {
  taskArray.forEach((task) => {
    htmlElement.innerHTML += createToDoHTML(task);
  });
}

function checkIfEmpty(tasksDiv, divWithoutTasks) {
  let tasksDivContainer = document.getElementById(tasksDiv);
  let divWithoutTasksContainer = document.getElementById(divWithoutTasks);
  console.log(tasksDiv, divWithoutTasks);
  if (tasksDivContainer.innerHTML == "") {
    divWithoutTasksContainer.classList.remove("d-none");
  }
}

function updateHTML() {
  allCategories.forEach((category) => {
    let element = document.getElementById(category);
    let oppositeElementName = "no-" + category;
    let oppositeElement = getRightOppositeElement(oppositeElementName);
    if (element) {
      let filteredTasks = tasks.filter((task) => task.category === category);
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
  if (element["story-category"] == "User Story") {
    variableClass = "task-category";
  } else if (element["story-category"] == "Technical Task") {
    variableClass = "technical-task-category";
  }
  return variableClass;
}

function insertCorrectUrgencyIcon(element) {
  let svgElement;
  if (element["priority"] == "Urgent") {
    svgElement = generateHTMLUrgencyUrgent();
  } else if (element["priority"] == "Low") {
    svgElement = generateHTMLUrgencyLow();
  } else if (element["priority"] == "Medium") {
    svgElement = generateHTMLUrgencyMedium();
  }
  return svgElement;
}

function createToDoHTML(element) {
  let rightIcon = insertCorrectUrgencyIcon(element);
  let variableClass = setVariableClass(element);
  let oppositeCategory = "no-" + element["category"];
  let contactsHTML = "";

  for (let i = 0; i < element["people-in-charge"].length; i++) {
    contactsHTML += `<div class="task-contact">${element["people-in-charge"][i]}</div>`;
  }

  return generateTaskHTML(
    element["id"],
    variableClass,
    element["story-category"],
    element["title"],
    element["task"],
    contactsHTML,
    element["category"],
    oppositeCategory,
    rightIcon
  );
}

function startDragging(elementId) {
  elementDraggedOver = elementId;
}

function moveTo(category) {
  let oppositeCategory = "no-" + category;
  let task = tasks.find((task) => task.id == elementDraggedOver);
  if (task) {
    task.category = category;
    saveTasksToLocalStorage();
    updateHTML();
    removeEmptyMessage(category, oppositeCategory);
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeEmptyMessage(category, oppositeCategory) {
  let categoryContainer = document.getElementById(category);
  let oppositeCategoryContainer = document.getElementById(oppositeCategory);
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

function showAddTaskPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("add-task-pop-up").classList.remove("translate-100");
}

function hideAddTaskPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}
