/**
 * Enables editing of a specific subtask in the popup input container.
 *
 * @param {number} i - The index of the subtask to be edited.
 */

function editSubtaskPopUpInput(i) {
  insertSubtasksIntoContainer();
  container = document.getElementById(`subtaskNumber${i}`);
  container.onmouseover = null;
  container.onmouseout = null;
  container.innerHTML = returnSubtaskEditedPopUpHTMLContainer(i);
}

/**
 * This function retrieves the search value from the input field and filters the users by name based on this value. 
 * It then iterates over the filtered users, rendering each contact in the popup.
 *
 * @param {number} taskIndex - The index of the task for which contacts are being edited.
 */

function editPopUpSearchContacts(taskIndex) {
  let searchValue = getSearchValue();
  let searchedUsers = filterUsersByName(searchValue);
  clearPopUp();
  searchedUsers.forEach((contact) => {
    let contactIndex = findUserIndex(contact);
    let isAssigned = checkIfAssigned(contact, taskIndex);
    renderContact(contact, contactIndex, taskIndex, isAssigned);
  });
}

/**
 * This function gets the value from the "big-edit-task-assigned-to-input" field, trims any leading or trailing whitespace, and converts it to lowercase. 
 * The resulting string is used for searching contacts.
 *
 * @returns {string} The trimmed and lowercased search value.
 */

function getSearchValue() {
  return document.getElementById("big-edit-task-assigned-to-input").value.trim().toLowerCase();
}

/**
 * This function filters the `allUsers` array to include only those users whose names start with the given search value.
 *
 * @param {string} searchValue - The search value used to filter the users.
 * @returns {Array<Object>} An array of user objects whose names match the search criteria.
 */

function filterUsersByName(searchValue) {
  return allUsers.filter((user) => user.name.toLowerCase().startsWith(searchValue));
}

/**
 * Clears the content of the popup container.
 *
 */

function clearPopUp() {
  document.getElementById("big-edit-task-assigned-to-pop-up").innerHTML = "";
}

/**
 * Finds the index of a user in the allUsers array based on their name.
 *
 * @param {Object} contact - The contact object containing the name to search for.
 * @returns {number} The index of the user in the allUsers array, or -1 if its not found.
 */

function findUserIndex(contact) {
  return allUsers.findIndex((user) => user.name === contact.name);
}

/**
 * Checks if a contact is assigned to a specific task.
 *
 * @param {Object} contact - The contact object to check.
 * @param {number} taskIndex - The index of the task to check against.
 * @returns {boolean} True if the contact is assigned to the task, otherwise false.
 */

function checkIfAssigned(contact, taskIndex) {
  return tasks[taskIndex].assigned.some((assignedContact) => assignedContact.name === contact.name);
}

/**
 * This function creates a contact object, which includes the contact's name, color, and assignment status. 
 * It then calls the appropriate rendering function based on whether the contact is assigned or not.
 *
 * @param {Object} contact - The contact object to render.
 * @param {number} contactIndex - The index of the contact in the list.
 * @param {number} taskIndex - The index of the task associated with the contact.
 * @param {boolean} isAssigned - Indicates whether the contact is assigned to the task.
 */

function renderContact(contact, contactIndex, taskIndex, isAssigned) {
  let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: isAssigned });
  if (isAssigned) {
    renderOnlyActiveAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
  } else {
    renderOnlyAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
  }
}

/**
 * Hides the subtask container in the task edit popup.
 *
 */

function closeSubtaskContainer() {
  // let bigSubtaskContainer = document.getElementById("big-edit-task-subtask-container");
  // bigSubtaskContainer.classList.add("d-none");
}

/**
 * This function retrieves the edited text from the subtask input field. If the input field is empty, it calls a function to mark the input as invalid. 
 * If the input is not empty, it updates the subtask array with the new text and refreshes the subtask container display.
 *
 * @param {number} i - The index of the subtask in the `subtaskArray` to be updated.
 */

function saveEditedSubtaskPopUp(i) {
  let text = document.getElementById(`subtaskEditedPopUp`).value;
  if (text == "") {
    markFalseEditSubtaskInput(`subtaskEditedPopUp`, i);
  } else {
    subtaskArray[i]["task-description"] = text;
    insertSubtasksIntoContainer();
  }
}

/**
 * Displays an error message for an invalid subtask input.
 *
 * @param {string} inputString - The ID of the input field that contains the edited subtask text.
 * @param {number} i - The index of the subtask being edited.
 */

function markFalseEditSubtaskInput(inputString, i) {
  let subtaskContainer = document.getElementById(`big-task-pop-up-subtask-all`);
  subtaskContainer.innerHTML += returnMessageFalseInputValueHTML();
}

/**
 * This function removes a subtask from the `subtaskArray` at the specified index and then updates the display of the subtask container to reflect the deletion.
 *
 * @param {number} i - The index of the subtask to be deleted from the `subtaskArray`.
 */

function deleteSubtaskPopUp(i) {
  subtaskArray.splice(i, 1);
  insertSubtasksIntoContainer();
}

/**
 * This asynchronous function fetches the task data from the database using the provided task ID. 
 * It checks if the retrieved task data contains subtasks. If subtasks are present, they are returned; otherwise, an empty array is returned.
 *
 * @param {string} id - The ID of the task for which subtasks are to be retrieved.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of subtasks. If no subtasks are found, it resolves to an empty array.
 */

async function getSubtaskFromDataBase(id) {
  let oldTaskAll = await loadRelevantData(`/testRealTasks/${id}`);
  if (oldTaskAll.subtask) {
    return oldTaskAll.subtask;
  } else {
    let subtaskArray = [];
    return subtaskArray;
  }
}

/**
 * This asynchronous function collects new values from input fields, validates these inputs, and then processes the task updates. 
 * If validation passes, it creates a task object, saves the changes to the database.
 *
 * @param {string} id - The ID of the task to be updated.
 * @returns {Promise<void>} A promise that resolves when the task changes have been successfully saved.
 */

async function saveTaskChanges(id) {
  let newTitle = getInputValue("big-edit-task-title-input");
  let newDescription = getInputValue("big-edit-task-description-input");
  let newDate = getInputValue("big-edit-task-due-date-input");
  if (validateInputs(newTitle, newDate)) {
    showBoardLoadScreen();
    removeInputErrors();
    let taskForEditing = createTaskObject(newTitle, newDescription, newDate);
    try {
      await processTaskEditing(id, taskForEditing);
    } catch (error) {
      console.error("Fehler beim Speichern der Änderungen: ", error);
    }
    resetSubtasks();
    updateHTML();
    hideBoardLoadScreen();
  }
}

/**
 * Retrieves the value of an input field by its element ID.
 *
 * @param {string} elementId - The ID of the input field from which the value is to be retrieved.
 * @returns {string} The current value of the input field.
 */

function getInputValue(elementId) {
  return document.getElementById(elementId).value;
}

/**
 * This function checks whether the title and date inputs are provided and not empty. 
 * It adds input error indicators to the corresponding fields if they are empty, and removes error indicators if they are not. 
 * The function ensures that both fields are filled out before proceeding.
 *
 * @param {string} title - The title input to be validated.
 * @param {string} date - The date input to be validated.
 * @returns {boolean} `true` if both the title and date inputs are non-empty; `false` otherwise.
 */

function validateInputs(title, date) {
  if (title === "" && date === "") {
    addInputError("big-task-pop-up-title");
    addInputError("big-task-pop-up-due-date-container");
    return false;
  } else if (title === "") {
    addInputError("big-task-pop-up-title");
    removeInputError("big-task-pop-up-due-date-container");
    return false;
  } else if (date === "") {
    addInputError("big-task-pop-up-due-date-container");
    removeInputError("big-task-pop-up-title");
    return false;
  }
  return true;
}

/**
 * Adds an error class to an input field to indicate a validation error.
 *
 * @param {string} elementId - The ID of the HTML element (input field) to which the error class will be added.
 */

function addInputError(elementId) {
  document.getElementById(elementId).classList.add("big-task-pop-up-input-error");
}

/**
 * Removes the error class from an input field to indicate that the validation error has been resolved.
 *
 * @param {string} elementId - The ID of the HTML element (input field) from which the error class will be removed.
 */

function removeInputError(elementId) {
  document.getElementById(elementId).classList.remove("big-task-pop-up-input-error");
}

/**
 * This function calls `removeInputError` for specific input fields to remove any visual error indicators, indicating that validation errors for these fields have been resolved. 
 * 
 */

function removeInputErrors() {
  removeInputError("big-task-pop-up-title");
  removeInputError("big-task-pop-up-due-date-container");
}

/**
 * This function constructs and returns an object representing a task including all its defining attributes. 
 *
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The due date of the task in a valid date format.
 * @returns {Object} An object representing the task with the following properties:
 */

function createTaskObject(title, description, date) {
  return {
    newTitle: title,
    newDescription: description,
    newDate: date,
    newPriority: priorityValue,
    newAssignedTo: assignedToContactsBigContainer,
    newSubtaskArray: subtaskArray,
  };
}

/**
 * Processes the editing of a task and updates the user interface with the edited task.
 * 
 * @param {string} id - The ID of the task to be edited.
 * @param {Object} task - An object representing the task with updated details.
 */

async function processTaskEditing(id, task) {
  let newTaskReady = await updateTasksThroughEditing(id, task);
  let newJsonElement = JSON.stringify(newTaskReady);
  let newJsontextElement = encodeURIComponent(newJsonElement);
  renderBigTask(newJsontextElement);
}

/**
 * This function clears the current subtask array and resets the checkbox status object. 
 * 
 */

function resetSubtasks() {
  subtaskArray = [];
  checkBoxCheckedJson = {};
}

/**
 * Saves the changes made to a task's subtasks and updates the user interface.
 *
 * @param {string} id - The ID of the task whose subtasks are being edited.
 */

async function saveSubtaskChanges(id) {
  let task = tasks[id];
  let taskForEditing = createTaskForEditing(task);
  try {
    await processTaskEditing(id, taskForEditing);
  } catch (error) {
  }
  resetSubtasks();
  updateHTML();
}

/**
 * Creates a task object formatted for editing from the provided task details.
 *
 * @param {Object} task - The task object to format for editing.
 * @returns {Object} A new task object formatted for editing.
 */

function createTaskForEditing(task) {
  let { title, description, date, priority, subtask, assigned } = task;
  let taskForEditing = {
    newTitle: title,
    newDescription: description,
    newDate: date,
    newPriority: priority,
    newSubtaskArray: subtask,
  };
  if (assigned) {
    taskForEditing.newAssignedTo = assigned;
  }
  return taskForEditing;
}

/**
 * This function takes a task ID and a task object with editing details, updates the task, and then renders the updated task information in the user interface.
 * 
 * @param {string} id - The ID of the task being edited.
 * @param {Object} taskForEditing - An object containing the updated task details.
 */

async function processTaskEditing(id, taskForEditing) {
  let newTaskReady = await updateTasksThroughEditing(id, taskForEditing);
  let newJsonElement = JSON.stringify(newTaskReady);
  let newJsontextElement = encodeURIComponent(newJsonElement);
  renderBigTask(newJsontextElement);
}

/**
 * This function clears the current list of subtasks and resets the checkbox status object. 
 * It prepares the subtasks state for a new set of subtasks or a fresh editing session by emptying the `subtaskArray` and `checkBoxCheckedJson`.
 * 
 */

function resetSubtasks() {
  subtaskArray = [];
  checkBoxCheckedJson = {};
}

/**
 * This function updates the visual representation of task priorities by adding or removing active classes based on the provided priority level. 
 *
 * @param {string} priority - The priority level to set for the task. 
 * @returns {string} The priority value that was saved.
 */

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

/**
 * Saves and returns the priority value.
 *
 * @param {string} priority - The priority value to be saved. 
 * @returns {string} The priority value that was saved.
 */

function savePriorityValue(priority) {
  priorityValue = priority;
  return priorityValue;
}

/**
 * This function updates a task with new details including subtask information.
 *
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @param {Object} objectForEditing - An object containing the updated properties for the task. 
 * @param {string} container - The container associated with the task.
 * @param {string} category - The category of the task.
 * @returns {Object} The updated task object.
 */

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

/**
 * Updates a task with new details, excluding subtask information.
 *
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @param {Object} objectForEditing - An object containing the updated properties for the task. 
 * @param {string} container - The container associated with the task.
 * @param {string} category - The category of the task.
 * @returns {Object} The updated task object.
 */

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

/**
 * This function updates a task in the `tasks` collection and resets the checkbox state.
 *
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @param {Object} objectForEditing - An object containing the new details for the task.
 * @returns {Promise<Object>} A promise that resolves to the updated task object.
 */

async function updateTasksThroughEditing(taskId, objectForEditing) {
  let task = tasks[taskId];
  let updatedTask = await updateTask(task, taskId, objectForEditing);
  checkBoxCheckedJson = {};
  return updatedTask;
}

/**
 * Updates a task with new details and saves it to the `tasks` collection, that contains each task on the board.
 *
 * @param {Object} task - The current task object to be updated.
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @param {Object} objectForEditing - An object containing the new details for the task. The object should include the updated properties for the task.
 * @returns {Promise<Object>} A promise that resolves to the updated task object after saving.
 */

async function updateTask(task, taskId, objectForEditing) {
  let container = task.container;
  let category = task.category;
  tasks[taskId] =
    task.subtask || subtaskArray != null
      ? saveChangesWithSubtask(taskId, objectForEditing, container, category)
      : saveChangesWithoutSubtask(taskId, objectForEditing, container, category);
  await saveTaskWithCatch(tasks[taskId]);
  return tasks[taskId];
}

/**
 * This function attempts to save the provided task object to Firebase. If the operation fails, it catches the error and logs an error message to the console.
 *
 * @param {Object} task - The task object to be saved to Firebase. The task object should contain all the necessary properties required by Firebase.
 */

async function saveTaskWithCatch(task) {
  try {
    await saveTaskToFirebase(task);
  } catch (error) {
    console.error("Fehler beim Hochladen der Daten: ", error);
  }
}

/**
 * This function updates the task object with new details including subtask information. It uses the `saveChangesSingleTaskWithSubtask` function to perform the update.
 *
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @param {Object} objectForEditing - An object containing the new details for the task.
 * @param {string} container - The identifier of the container where the task is displayed.
 * @param {string} category - The category of the task.
 * @returns {Object} The updated task object including subtask information.
 */

function saveChangesWithSubtask(taskId, objectForEditing, container, category) {
  return saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category);
}

/**
 * This function updates the task object with new details but excludes any subtask information. It uses the `saveChangesSingleTaskWithoutSubtask` function to perform the update.
 *
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @param {Object} objectForEditing - An object containing the new details for the task.
 * @param {string} container - The identifier of the container where the task is displayed.
 * @param {string} category - The category of the task.
 * @returns {Object} The updated task object excluding subtask information.
 */

function saveChangesWithoutSubtask(taskId, objectForEditing, container, category) {
  return saveChangesSingleTaskWithoutSubtask(taskId, objectForEditing, container, category);
}

/**
 * Deletes data at the specified path from the Firebase database.
 *
 * @param {string} [path=""] - The path in the Firebase database where the data should be deleted. Defaults to an empty string.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the DELETE request.
 */

async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

/**
 * This function maps a specific task category to a corresponding color code.
 * 
 * @param {string} category - The category of the task. Can be one of the following values:
 *                             - "User Story"
 *                             - "Technical Task"
 *                             - Any other string
 * @returns {string} The color code associated with the given category. 
 */

function checkCategoryColor(category) {
  if (category === "User Story") {
    return "#0038FF";
  } else if (category === "Technical Task") {
    return "#1FD7C1";
  } else {
    return "#42526e";
  }
}

/**
 * Returns the HTML for an icon representing the priority level of a task.
 *
 * @param {string} priorityText - The priority level of the task. 
 * @returns {string} The HTML string representing the icon for the given priority level.
*/

function checkPriorityIcon(priorityText) {
  if (priorityText === "urgent") {
    return generateHTMLUrgencyUrgent();
  } else if (priorityText === "medium") {
    return generateHTMLUrgencyMedium();
  } else if (priorityText === "low") {
    return generateHTMLUrgencyLow();
  }
}

/**
 * Searches for tasks based on the user's input and renders the matching tasks.
 * 
 */

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

/**
 * This function iterates through all predefined categories, clears the existing content of each
 * category container, and then filters and renders tasks that match the search query for each 
 * category. If no tasks are found for a category, it handles the empty category scenario.
 * If all tasks match the search query, the entire HTML is updated instead.
 * 
 */

function renderSearchedTasks() {
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

/**
 * Clears the content of a specified category container.
 * 
 * @param {string} categoryContainer - The ID of the category container element whose content will be cleared.
 */

function clearCategoryContainer(categoryContainer) {
  document.getElementById(categoryContainer).innerHTML = "";
}

/**
 * This function filters an array of tasks and returns only those tasks that belong to a 
 * specified category container. 
 *
 * @param {string} categoryContainer - The ID of the category container used to filter tasks.
 * @param {Array<Object>} tasks - An array of task objects to be filtered.
 * @returns {Array<Object>} - An array of task objects that belong to the specified category container.
 */

function filterTasksByCategory(categoryContainer, tasks) {
  return tasks.filter((task) => task.container === categoryContainer);
}

/**
 * This function updates the category container's inner HTML to display a message or element
 * indicating that there are no tasks available for that category.
 *
 * @param {string} categoryContainer - The ID of the category container where no tasks were found.
 */

function handleNoTasksInCategory(categoryContainer) {
  let oppositeElementName = "no-" + categoryContainer;
  let oppositeElement = getRightOppositeElement(oppositeElementName);
  document.getElementById(categoryContainer).innerHTML = oppositeElement;
}

/**
 * This function iterates through the provided tasks and checks if each task belongs to 
 * the given category container. For each task that matches, it generates the appropriate 
 * HTML and updates the container's inner HTML.
 *
 * @param {Array<Object>} tasks - An array of task objects to be rendered. 
 * @param {string} categoryContainer - The ID of the category container where the tasks will be rendered.
 */

function renderTasksInCategory(tasks, categoryContainer) {
  tasks.forEach((task) => {
    if (categoryContainer === task.container) {
      let jsonElement = JSON.stringify(task);
      let rightIcon = insertCorrectUrgencyIcon(task);
      let variableClass = setVariableClass(task);
      let oppositeCategory = "no-" + task.container;
      let contactsHTML = generateContactsHTML(task);
      document.getElementById(categoryContainer).innerHTML += generateTaskHTML(task, contactsHTML, oppositeCategory, rightIcon, jsonElement);
    }
  });
}

/**
 * This function creates HTML elements for contacts assigned to a given task. It shows
 * the initials of up to three assignees, and if there are more than three, it adds a 
 * container displaying the number of additional assignees.
 *
 * @param {Object} task - The task object containing assigned contacts.
 * @param {Array<Object>} task.assigned - An array of assigned objects, each containing the name of the assignee as well as the the background color for the assignee's contact.
 * @returns {string} - The generated HTML string for displaying assigned contacts.
 */

function generateContactsHTML(task) {
  let contactsHTML = "";
  if (task.assigned) {
    let lengthOfAssignedTo = task.assigned.length;
    task.assigned.forEach((assignee, index) => {
      if (index < 3) {
        let initials = getInitials(assignee.name);
        contactsHTML += `<div class="task-contact" style='background-color: ${assignee.color}'>${initials}</div>`;
      } else if (index === 3) {
        contactsHTML += `<div class='taskAssignedToNumberContainer'><span>+ ${lengthOfAssignedTo - 3}</span></div>`;
      }
    });
  }
  return contactsHTML;
}

/**
 * This function adds a CSS class to the element with the ID "board" to indicate
 * that it is the currently active section of the interface. 
 * 
 */

function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}

/**
 * This function takes a full name, splits it into words, and returns the initials
 * of each word. The initials are capitalized and concatenated into a single string.
 *
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The initials of the name, with each initial capitalized.
 */

function getInitials(name) {
  let nameArray = name.trim().split(" ");
  let initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
  return initials;
}
