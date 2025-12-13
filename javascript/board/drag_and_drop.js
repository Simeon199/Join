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
    return returnHtmlNoFeedbackContainer();
  } else if (oppositeElementName == "no-in-progress-container") {
    return returnHtmlNoProgressContainer();
  } else if (oppositeElementName == "no-to-do-container") {
    return returnHtmlNoToDoContainer();
  } else if (oppositeElementName == "no-done-container") {
    return returnHtmlNoDoneContainer();
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