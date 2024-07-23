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
 * - Sends a `fetch` request to the constructed URL, which combines `BASE_URL` with the provided `path` and a `.json` extension.
 * - Awaits the response and parses it as JSON.
 * - Returns the parsed JSON data.
 * 
 * @param {string} [path=""] - The path to append to `BASE_URL` for the data request. Defaults to an empty string.
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data from the response.
 */

async function loadRelevantData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
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
 * This asynchronous function performs the following actions:
 * - Constructs the path to store the task using the `tasksIdentity` property of the provided `task` object.
 * - Sends a `PUT` request to Firebase with the task data converted as JSON.
 * - Logs an error message to the console if the response indicates a failure.
 * 
 * @param {Object} task - The task object to be saved.
 */

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
  }
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
 * This function performs the following actions:
 * - Checks the screen width to determine whether to show the pop-up or redirect the user:
 * - If the screen width is 600 pixels or less, it redirects the user to `add_task.html`.
 * - If the screen width is greater than 600 pixels, it displays the pop-up:
 * - Disables page scrolling by setting the `overflow` style of the body to `"hidden"`.
 * - Reveals the background and pop-up elements by removing specific CSS classes.
 * - Sets the `standardContainer` variable to the provided `container` parameter.
 * 
 * @param {string} [container="to-do-container"] - The ID of the container where the pop-up should be displayed. Default value is "to-do-container".
 */

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

/**
 * This function hides the "Add Task" pop-up and restores page scrolling thereby performing the following actions:
 * - Restores the default page scrolling behavior by setting the `overflow` style of the body to `"unset"`.
 * - Hides the background overlay of the pop-up by adding the `bg-op-0` class to the element with the ID `add-task-pop-up-bg`.
 * - Moves the pop-up out of view by adding the `translate-100` class to the element with the ID `add-task-pop-up`.
 * 
 */

function hideAddTaskPopUp() {
  document.body.style.overflow = "unset";
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

/**
 * This function displays the "Big Task" pop-up and renders the task content performing the following actions in the process:
 * - Sets the `isBigTaskPopUpOpen` variable to `true` to indicate that the pop-up is open.
 * - Reveals the background overlay for the pop-up by removing the `bg-op-0` class from the element with the ID `big-task-pop-up-bg`.
 * - Makes the pop-up visible by removing the `translate-100` class from the element with the ID `big-task-pop-up`.
 * - Disables page scrolling by setting the `overflow` style of the body to `"hidden"`.
 * - Calls the `renderBigTask()` function with the provided `jsonTextElement` to display the task content within the pop-up.
 * 
 * @param {string} jsonTextElement - A JSON string representing the task content to be rendered in the "Big Task" pop-up.
 */

function showBigTaskPopUp(jsonTextElement) {
  isBigTaskPopUpOpen = true;
  document.getElementById("big-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("big-task-pop-up").classList.remove("translate-100");
  document.body.style.overflow = "hidden";
  renderBigTask(jsonTextElement);
}

/**
 * This function hides the "Big Task" pop-up and restores page scrolling performing the following actions in the process:
 * - Sets the `isBigTaskPopUpOpen` variable to `false` to indicate that the pop-up is closed.
 * - Removes error styling from the title and due date input fields by removing the `big-task-pop-up-input-error` class from their respective elements.
 * - Hides the background overlay of the pop-up by adding the `bg-op-0` class to the element with the ID `big-task-pop-up-bg`.
 * - Moves the pop-up out of view by adding the `translate-100` class to the element with the ID `big-task-pop-up`.
 * - Restores page scrolling by setting the `overflow` style of the body to `"unset"`.
 * - If an element with the ID `big-task-pop-up-title-text` exists, retrieves its inner HTML to find the corresponding task index, and then saves any changes to the subtask using `saveSubtaskChanges()`.
 * 
 */

function hideBigTaskPopUp() {
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

/**
 * Renders the content of the "Big Task" pop-up based on the provided task data thus performing the following actions:
 * 1. Parses the provided `jsonTextElement` (a JSON string) to extract task details.
 * 2. Updates various elements of the "Big Task" pop-up with the task data:
 *    - Removes specific CSS classes from the priority and due date containers.
 *    - Sets the title and description of the task.
 *    - Updates the due date container, category, and category background color.
 *    - Updates the priority container and icon.
 *    - Sets the HTML for the bottom buttons (e.g., delete and edit).
 *    - Renders assigned names, subtasks, and task contacts.
 * 
 * @param {string} jsonTextElement - A JSON string representing the task data to be rendered in the "Big Task" pop-up.
 * @param {Object} jsonTextElement.title - The title of the task.
 * @param {Object} jsonTextElement.description - The description of the task.
 * @param {Object} jsonTextElement.date - The due date of the task.
 * @param {Object} jsonTextElement.category - The category of the task.
 * @param {Object} jsonTextElement.priority - The priority level of the task.
 * @param {Object} jsonTextElement.tasksIdentity - The unique identifier of the task.
 */

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

/**
 * Renders the complete "Big Task" pop-up with updated details and subtask information performing the following actions in the process:
 * - Sets up the subtask array for the task using the provided `taskJson` and `id`.
 * - Renders the pop-up elements such as title, description, date, and priority based on the provided old values and `id`.
 * - Renders the detailed information of the big task, including priority and `id`, based on the provided `taskJson`.
 * 
 * @param {string} oldTitle - The previous title of the task to be used in rendering.
 * @param {string} oldDescription - The previous description of the task to be used in rendering.
 * @param {string} oldDate - The previous due date of the task to be used in rendering.
 * @param {string} oldPriority - The previous priority level of the task to be used in rendering.
 * @param {Object} taskJson - The JSON object containing updated task details.
 * @param {string} id - The unique identifier of the task.
 */

function renderAllBigPopUp(oldTitle, oldDescription, oldDate, oldPriority, taskJson, id) {
  setupSubtaskArray(taskJson, id);
  renderPopUpElements(oldTitle, oldDescription, oldDate, oldPriority, id);
  renderBigTaskDetails(taskJson, oldPriority, id);
}

/**
 * This function initializes the subtask array for a task based on the provided task JSON performing the following actions in the process:
 * - Sets the `subtaskArray` variable to the `subtask` property of the provided `taskJson` object, or initializes it as an empty array if `taskJson.subtask` is undefined or null.
 * - Updates the `subtask` property of `taskJson` to ensure it is always set to the `subtaskArray`.
 * 
 * @param {Object} taskJson - The JSON object representing the task, which includes the `subtask` property.
 */

function setupSubtaskArray(taskJson) {
  subtaskArray = taskJson.subtask || [];
  taskJson.subtask = subtaskArray;
}

/**
 * This function renders elements of the "Big Task" pop-up with the provided old values performing the following actions in the process:
 * - Setting the title of the pop-up using the provided `oldTitle`.
 * - Setting the description of the pop-up using the provided `oldDescription`.
 * - Rendering the due date section of the pop-up using the provided `oldDate` and the `returnBigTaskPopUpDueDateContainer` function.
 * - Rendering the priority section of the pop-up using the provided `oldPriority` and the `returnBigTaskPopUpPriorityContainer` function.
 * - Setting the global `priorityValue` to the provided `oldPriority`.
 * - Activating the priority element in the pop-up by adding the corresponding CSS class.
 * 
 * @param {string} oldTitle - The previous title of the task.
 * @param {string} oldDescription - The previous description of the task.
 * @param {string} oldDate - The previous due date of the task.
 * @param {string} oldPriority - The previous priority level of the task.
 * @param {string} id - The unique identifier of the task.
 */

function renderPopUpElements(oldTitle, oldDescription, oldDate, oldPriority, id) {
  returnBigTaskPopUpTitle(oldTitle);
  returnBigTaskPopUpDescription(oldDescription);
  renderBigTaskPopUpSection("big-task-pop-up-due-date-container", oldDate, returnBigTaskPopUpDueDateContainer);
  renderBigTaskPopUpSection("big-task-pop-up-priority-container", oldPriority, returnBigTaskPopUpPriorityContainer);
  priorityValue = oldPriority;
  document
    .getElementById("big-edit-task-" + oldPriority.toLowerCase() + "-priority")
    .classList.add("big-edit-task-" + oldPriority.toLowerCase() + "-priority-aktiv");
}

/**
 * This function renders a section of the "Big Task" pop-up by adding a specific CSS class and calling the render function "renderFunction(value)".
 * 
 * @param {string} containerId - The ID of the container element to be updated.
 * @param {string} value - The value to be passed to the `renderFunction`.
 * @param {function} renderFunction - The function to be called to render the content of the section.
 */

function renderBigTaskPopUpSection(containerId, value, renderFunction) {
  document.getElementById(containerId).classList.add("big-edit-task-pop-up-section-container");
  renderFunction(value);
}

/**
 * This function renders detailed information for the "Big Task" pop-up performing the following actions in the process:
 * - Rendering all contact elements for the "Big Task" pop-up using the task ID.
 * - Rendering all subtask elements for the "Big Task" pop-up.
 * - Rendering the assigned contact container using the provided `taskJson`.
 * - Rendering the assigned contacts in the edit pop-up using the provided `taskJson`.
 * - Rendering the edit buttons for the "Big Task" pop-up using the task ID.
 * 
 * @param {Object} taskJson - The JSON object containing the task details.
 * @param {string} id - The unique identifier of the task.
 */

function renderBigTaskDetails(taskJson, id) {
  returnBigTaskPopUpContactAll(id);
  returnBigTaskPopUpSubtasksAll();
  renderBigTaskAssignedContactContainer(taskJson);
  renderBigEditTaskAssignedToPopUp(taskJson);
  returnBigPopUpEditButtons(id);
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

/**
 * This functions checks if the Enter key is pressed in the big task edit subtask input field and triggers the subtask array build thus performing the following actions:
 * - Listen for a key event in the big task edit subtask input field.
 * - If the Enter key is pressed, it calls the function to build the subtask array for upload.
 * 
 * @param {KeyboardEvent} event - The key event triggered by the user.
 */

function bigEditTaskSubtaskInputCheckEnter(event) {
  if (event.key === "Enter") {
    buildSubtaskArrayForUpload();
  }
}
