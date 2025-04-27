import * as shared from '../../shared/javascript/shared.js';
import * as feedbackAndUrgency from './feedbackAndUrgencyTemplate.js';

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
let renderCurrentTaskId;
let touchTime;

document.addEventListener('DOMContentLoaded', async () => {
  shared.bundleLoadingHTMLTemplates();
  // init();
  init_task();
  updateHTML();
})


/**
 * This asynchronous function performs two main actions:
 * - Retrieves tasks from the database using `getTasksFromDatabase()`.
 * - Updates the HTML to reflect the fetched tasks using `updateHTML()`.
 * 
 */

async function init_task() {
  await getTasksFromDatabase();
  updateHTML();
}


/**
 * This asynchronous function performs the following actions:
 * - Fetches tasks from the database using `loadTasksFromDatabase()`.
 * - Updates the task categories using `updateCategories()`.
 * - Refreshes the HTML to display the updated tasks using `updateHTML()`.
 * 
 */

async function getTasksFromDatabase() {
  tasks = await loadTasksFromDatabase();
  updateCategories();
  updateHTML();
}

/**
 * This function performs the following actions:
 * - Extracts the unique categories from the `tasks` array by mapping each task to its `container` property.
 * - Stores the unique categories in the `categories` variable.
 *  
 */

function updateCategories() {
  categories = [...new Set(tasks.map((task) => task.container))];
}

/**
 * This asynchronous function performs the following actions:
 * - Fetches data using the `loadRelevantData()` function.
 * - Checks if the fetched data contains a `testRealTasks` property.
 * - If `testRealTasks` is present, iterates over its items and adds them to the `tasks` array.
 * - Returns the updated `tasks` array if tasks are found. Otherwise, returns an empty array.
 * 
 * @returns {Promise<Array>} A promise that resolves to an array containing the tasks loaded from the database, or an empty array if no tasks are found.
 */

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

/**
 * This function removes the `d-none` class from the HTML element with the ID `board-add_task-load-screen`, which makes the loading screen visible.
 * 
 */

function showBoardLoadScreen() {
  document.getElementById("board-add_task-load-screen").classList.remove("d-none");
}

/**
 * This function performs the following action adds the `d-none` class to the HTML element with the ID `board-add_task-load-screen`, which hides the loading screen.
 * 
 */

function hideBoardLoadScreen() {
  document.getElementById("board-add_task-load-screen").classList.add("d-none");
}

/**
 * This function performs the following actions:
 * - Checks the `category` property of the provided `element`.
 * - Sets the `variableClass` to `"task-category"` if the category is `"user story"`.
 * - Sets the `variableClass` to `"technical-task-category"` if the category is `"technical task"`.
 * - Returns the determined `variableClass`.
 * 
 * @param {Object} element - The element object containing a `category` property.
 * @returns {string} The CSS class name corresponding to the element's category.
 */

function setVariableClass(element) {
  let variableClass = "";
  if (element["category"] == "user story") {
    variableClass = "task-category";
  } else if (element["category"] == "technical task") {
    variableClass = "technical-task-category";
  }
  return variableClass;
}

/**
 * This function performs the following actions:
 * 1. Checks the `priority` property of the provided `element`.
 * 2. Calls the function to generate an SVG element based on the priority:
 *    - `generateHTMLUrgencyUrgent()` for `"urgent"` priority.
 *    - `generateHTMLUrgencyLow()` for `"low"` priority.
 *    - `generateHTMLUrgencyMedium()` for `"medium"` priority.
 * 3. Returns the generated SVG element.
 * 
 * @param {Object} element - The element object containing a `priority` property.
 * @returns {SVGElement} The generated SVG element corresponding to the element's priority.
 */

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

/**
 * This function performs the following actions:
 * 1. Inserts the correct urgency icon for the to-do item by calling `insertCorrectUrgencyIcon(element)`.
 * 2. Determines the opposite category for the to-do item creating `"no-"` to the `container` property of the element.
 * 3. Generates the HTML for contacts associated with the to-do item by calling `generateContactsHTML(element)`.
 * 4. Converts the `element` object to a JSON string.
 * 5. Creates the complete HTML for the to-do item by calling `generateTaskHTML()` with the following parameters:
 *    - The original `element`.
 *    - The generated contacts HTML.
 *    - The opposite category.
 *    - The urgency icon.
 *    - The JSON string representation of the element.
 * 
 * @param {Object} element - The to-do item object used to generate the HTML.
 * @returns {string} The generated HTML string for the to-do item.
 */

function createToDoHTML(element) {
  let rightIcon = insertCorrectUrgencyIcon(element);
  let oppositeCategory = "no-" + element.container;
  let contactsHTML = generateContactsHTML(element);
  let jsonElement = JSON.stringify(element);

  return generateTaskHTML(element, contactsHTML, oppositeCategory, rightIcon, jsonElement);
}

/**
 * This function performs the following actions:
 * - Checks if the `assigned` property of the provided `element` exists and is an array.
 * - If the `assigned` property is not valid, returns an empty string.
 * - Initializes an empty string `contactsHTML` to accumulate the generated HTML.
 * - Iterates over the `assigned` array and generates HTML for each contact by calling `generateContactHTML()`.
 * - Appends the generated HTML for each contact to `contactsHTML`.
 * 
 * @param {Object} element - The object representing the item (in this case the corresponding task), which includes an `assigned` property.
 * @returns {string} A string containing the HTML representation of the assigned contacts.
 */

function generateContactsHTML(element) {
  if (!element.assigned || !Array.isArray(element.assigned)) return "";
  let contactsHTML = "";
  let lengthOfAssignedTo = element.assigned.length;
  for (let i = 0; i < lengthOfAssignedTo; i++) {
    contactsHTML += generateContactHTML(element, i, lengthOfAssignedTo);
  }
  return contactsHTML;
}

/**
 * This function creates HTML based on the index of the contact in the `assigned` array. Thereby the following cases are considered:
 * - For indices less than 3, it generates a `<div>` element displaying the contact's initials and background color.
 * - For the index exactly equal to 3, it generates a `<div>` element that shows the number of additional assigned contacts beyond the first three.
 * - For indices greater than 3, it updates the HTML to include a summary of the additional contacts and returns an empty string.
 * 
 * @param {Object} element - The object representing the item, which includes an `assigned` property.
 * @param {number} index - The index of the contact in the `assigned` array.
 * @param {number} lengthOfAssignedTo - The total number of contacts assigned to the item.
 * @returns {string} A string containing the HTML representation of the contact or a summary of additional contacts.
 */

function generateContactHTML(element, index, lengthOfAssignedTo) {
  if (index < 3) {
    let name = element.assigned[index].name;
    let initials = getInitials(name);
    return /*html*/ `<div class="task-contact" style='background-color: ${element.assigned[index].color}'>${initials}</div>`;
  } else if (index === 3) {
    return /*html*/ `<div class='taskAssignedToNumberContainer'><span>+ ${lengthOfAssignedTo - 3}</span></div>`;
  } else {
    updateTaskContactPlusHTML(element, lengthOfAssignedTo);
    return "";
  }
}

/**
 * This function performs the following actions:
 * - Selects the container element for additional contacts using the `tasksIdentity` property of the provided `element`.
 * - Updates the inner HTML of the selected container with the result of `showTaskContactPlusHTML()`, passing the total number of assigned contacts.
 * 
 * @param {Object} element - The object representing the item, which includes the `tasksIdentity` property.
 * @param {number} lengthOfAssignedTo - The total number of contacts assigned to the item.
 */

function updateTaskContactPlusHTML(element, lengthOfAssignedTo) {
  let container = document.querySelectorAll("taskAssignedToNumberContainer")[element.tasksIdentity];
  if (container) {
    container.innerHTML = showTaskContactPlusHTML(lengthOfAssignedTo);
  }
}

/** 
 * This function performs the following actions:
 * - Selects the container element for additional contacts in the big task view using the `tasksIdentity` property from the `taskJson` object.
 * - Updates the inner HTML of the selected container with the result of `showTaskContactPlusHTML()`, passing the total number of assigned contacts.
 * 
 * @param {Object} taskJson - The task object containing the `tasksIdentity` property used to select the container.
 * @param {number} lengthOfAssignedTo - The total number of contacts assigned to the task.
 */

function updateBigTaskContactsContainerPlus(taskJson, lengthOfAssignedTo) {
  let container = document.querySelectorAll("bigTaskAssignedToNumberContainer")[taskJson.tasksIdentity];
  if (container) {
    container.innerHTML = showTaskContactPlusHTML(lengthOfAssignedTo);
  }
}

/**
 * This function creates an HTML snippet that shows a "+" sign followed by the number of extra assigned contacts, calculated as the total number of assigned contacts minus three.
 * 
 * @param {number} lengthOfAssignedTo - The total number of contacts assigned to the task.
 * @returns {string} - An HTML string displaying the number of additional contacts beyond the first three.
 */

function showTaskContactPlusHTML(lengthOfAssignedTo) {
  return /*html*/ `
    <span>+ ${lengthOfAssignedTo - 3}</span>
  `;
}

/**
 * This function applies a CSS transform to the HTML element with the ID `task{id}`, where `{id}` is the provided `id` parameter, to rotate it by 3 degrees.
 * 
 * @param {number|string} id - The identifier of the HTML element to be rotated.
 */

function rotateFunction(id) {
  document.getElementById(`task${id}`).style.transform = "rotate(3deg)";
}

/**
 * This function Closes all dropdown pop-ups by selecting all elements with the class "mobileDropdown" and adding the "mobileDropdown-translate-100" CSS class to each of them
 * to hide them.
 * 
 */

function closeAllDropDownPopUps() {
  let AllMobileDropdownPopUps = document.querySelectorAll(".mobileDropdown");
  for (let i = 0; i < AllMobileDropdownPopUps.length; i++) {
    let dropdown = document.getElementById(`mobileDropdown${i}`);
    dropdown.classList.add("mobileDropdown-translate-100");
  }
}

/**
 * This function generates the HTML content for a task element, including subtasks and other details thereby performing the following actions:
 * - Encodes the JSON representation of the task element.
 * - If the task has subtasks, calculates the number of checked subtasks and the corresponding taskbar width.
 * - Depending on the presence and length of subtasks, it returns the appropriate HTML by calling the respective helper functions.
 * 
 * @param {Object} element - The task element containing task details.
 * @param {string} contactsHTML - The HTML content representing the contacts associated with the task.
 * @param {string} oppositeCategory - The CSS class representing the opposite category of the task.
 * @param {string} rightIcon - The HTML content representing the urgency icon of the task.
 * @param {string} jsonElement - The JSON string representation of the task element.
 * @returns {string} - The generated HTML content for the task.
 */

function generateTaskHTML(element, contactsHTML, oppositeCategory, rightIcon, jsonElement) {
  let jsonTextElement = encodeURIComponent(jsonElement);
  if (element["subtask"] && element["subtask"].length > 0) {
    let numberOfTasksChecked = 0;
    for (index = 0; index < element["subtask"].length; index++) {
      if (element["subtask"][index]["is-tasked-checked"] == true) {
        numberOfTasksChecked += 1;
      }
    }
    let taskbarWidth = Math.round((numberOfTasksChecked / element["subtask"].length) * 100);
    return returnTaskHtmlWithSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskbarWidth, numberOfTasksChecked);
  } else if (element["subtask"] && element["subtask"].length == 0) {
    return returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement);
  } else {
    return returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement);
  }
}

let currentOpenDropdown = null;

/**
 * This function processes each task in the `taskArray` and generates HTML for each task using
 * the `createToDoHTML` function. It then appends this HTML content to the provided `htmlElement`.
 * 
 * @param {Array} taskArray - An array of tasks where each task represents data to be converted into HTML.
 * @param {HTMLElement} htmlElement - The HTML element to which the generated HTML content will be appended.
 */

function iterateThroughSubArray(taskArray, htmlElement) {
  for (i = 0; i < taskArray.length; i++) {
    let task = taskArray[i];
    htmlElement.innerHTML += createToDoHTML(task);
  }
}

/**
 * This function checks if the `tasksDiv` container has content.
 * If the container is empty, it removes the "d-none" class from the `divWithoutTasks` container, making it visible.
 * 
 * @param {string} tasksDiv - The ID of the HTML element that contains tasks to be checked for content.
 * @param {string} divWithoutTasks - The ID of the HTML element to be shown if the `tasksDiv` is empty.
 */

function checkIfEmpty(tasksDiv, divWithoutTasks) {
  let tasksDivContainer = document.getElementById(tasksDiv);
  let divWithoutTasksContainer = document.getElementById(divWithoutTasks);
  if (tasksDivContainer.innerHTML == "") {
    divWithoutTasksContainer.classList.remove("d-none");
  }
}

/**
 * This function iterates through a list of container IDs (global defined Array `allCategories`) and performs the following actions for each:
 * - Retrieves the HTML element corresponding to the container ID.
 * - Determines the name of an opposite element to be shown when there are no tasks.
 * - Filters the `tasks` array to get tasks associated with the current container.
 * - Clears the content of the container element.
 * - If there are tasks for the container, it generates and inserts HTML for these tasks using `iterateThroughSubArray`.
 * - If no tasks are found, it displays the opposite element in the container.
 * 
 */

export function updateHTML() {
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

/**
 * This function updates the global variable `elementDraggedOver` to the ID of the element that is
 * being dragged over.
 * 
 * @param {string} elementId - The ID of the HTML element that is currently being dragged over.
 */

function startDragging(elementId) {
  elementDraggedOver = elementId;
}

/**
 * This asynchronous function performs the following actions:
 * - Finds the task that matches the `elementDraggedOver` identifier.
 * - Updates the container of the found task to the specified `container`.
 * - Refreshes the HTML content to reflect the change by calling `updateHTML`.
 * - Removes any empty message from the previous container.
 * - Saves the updated task to Firebase.
 * 
 * @param {string} container - The ID of the container to which the task should be moved.
 */

async function moveTo(container) {
  let oppositeContainer = "no-" + container;
  let task = tasks.find((task) => task.tasksIdentity == elementDraggedOver);
  if (task) {
    task.container = container;
    updateHTML();
    removeEmptyMessage(container, oppositeContainer);
  }
  try {
    await saveTaskToFirebase(task);
  } catch (error) {
    console.error("Fehler beim Speichern der tasks in der Firebase-Datenbank:", error);
  }
}

/**
 * This function removes an HTML element, identified by `oppositeContainer`, from another element specified by `container`.
 * If the element to be removed exists within the container, it will be removed from the DOM.
 * 
 * @param {string} container - The ID of the HTML element (container) from which the `oppositeContainer` element should be removed.
 * @param {string} oppositeContainer - The ID of the HTML element to be removed from the `container`.
 */

function removeEmptyMessage(container, oppositeContainer) {
  let categoryContainer = document.getElementById(container);
  let oppositeCategoryContainer = document.getElementById(oppositeContainer);
  if (oppositeCategoryContainer) {
    categoryContainer.removeChild(oppositeCategoryContainer);
  }
}

/**
 * This function returns HTML content for a specific element based on the value of `oppositeElementName`. It
 * matches the provided name with predefined options and calls the corresponding function to return the appropriate HTML.
 * 
 * @param {string} oppositeElementName - The name of the opposite element, which determines the HTML content to be returned.
 */

function getRightOppositeElement(oppositeElementName) {
  if (oppositeElementName == "no-await-feedback-container") {
    return feedbackAndUrgency.returnHtmlNoFeedbackContainer();
  } else if (oppositeElementName == "no-in-progress-container") {
    return feedbackAndUrgency.returnHtmlNoProgressContainer();
  } else if (oppositeElementName == "no-to-do-container") {
    return feedbackAndUrgency.returnHtmlNoToDoContainer();
  } else if (oppositeElementName == "no-done-container") {
    return feedbackAndUrgency.returnHtmlNoDoneContainer();
  }
}

/**
 * This function prevents the default handling of the drag-and-drop event to allow dropping.
 * 
 * @param {DragEvent} event - The drag-and-drop event object that is passed to the event handler.
 */

function allowDrop(event) {
  event.preventDefault();
}

/**
 * This function takes a string as input and returns a new string where all spaces (' ') are replaced with dashes ('-').
 * 
 * @param {string} str - The input string in which spaces will be replaced with dashes.
 * @returns {string} - The modified string with spaces replaced by dashes.
 */

function replaceSpacesWithDashes(str) {
  return str.replace(/ /g, "-");
}

/**
 * This function performs the following actions:
 * - Toggles the "mobileDropdown-translate-100" class on the dropdown menu to show or hide it.
 * - Finds the task associated with the given `taskIndex` and retrieves its category.
 * - Updates the visibility of dropdown items based on whether they match the current task's category.
 * - Hides the dropdown items that match the current category and shows those that do not.
 * 
 * @param {number} taskIndex - The index of the task associated with the dropdown menu to be toggled.
 */

function openMobileDropdown(taskIndex) {
  let dropdown = document.getElementById(`mobileDropdown${taskIndex}`);
  dropdown.classList.toggle("mobileDropdown-translate-100");
  let task = tasks.find((task) => task.tasksIdentity == taskIndex);
  let currentCategory = task.container;
  let dropdownItems = dropdown.querySelectorAll("a");
  if (!dropdown.classList.contains("mobileDropdown-translate-100")) {
    currentOpenDropdown = dropdown;
  } else {
    currentOpenDropdown = null;
  }
  for (i = 0; i < dropdownItems.length; i++) {
    let category = replaceSpacesWithDashes(dropdownItems[i].textContent.trim().toLowerCase() + "-container");
    if (category === currentCategory.toLowerCase()) {
      dropdownItems[i].style.display = "none";
    } else {
      dropdownItems[i].style.display = "block";
    }
  }
}

/**
 * This asynchronous function performs the following actions:
 * - Finds the task identified by `taskIndex` and updates its category to `newCategory`.
 * - Refreshes the HTML content to reflect the new category of the task by calling `updateHTML`.
 * - Scrolls the task element into view smoothly so that it is centered in the viewport.
 * - Saves the updated task to Firebase. If there is an error during the save operation, it is logged to the console.
 * 
 * @param {number} taskIndex - The index of the task to be moved.
 * @param {string} newCategory - The name of the new category to which the task should be moved.
 */

async function moveTasksToCategory(taskIndex, newCategory) {
  let task = tasks.find((task) => task.tasksIdentity == taskIndex);
  if (task) {
    task.container = newCategory;
    updateHTML();
    let taskElement = document.getElementById("task" + taskIndex);
    taskElement.scrollIntoView({ behavior: "smooth", block: "center" });
    try {
      await saveTaskToFirebase(task);
    } catch (error) {
      console.error("Fehler beim Speichern der tasks in der Firebase-Datenbank:", error);
    }
  }
}