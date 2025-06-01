import * as feedbackAndUrgency from './feedbackAndUrgencyTemplate.js';
export * from './board_edit.js';

/**
 * Clears the content of the popup container.
 *
 */

export function clearPopUp() {
  document.getElementById("big-edit-task-assigned-to-pop-up").innerHTML = "";
}

/**
 * Checks if a contact is assigned to a specific task.
 *
 * @param {Object} contact - The contact object to check.
 * @param {number} taskIndex - The index of the task to check against.
 * @returns {boolean} True if the contact is assigned to the task, otherwise false.
 */

export function checkIfAssigned(contact, taskIndex) {
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

export function renderContact(contact, contactIndex, taskIndex, isAssigned) {
  let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: isAssigned });
  if (isAssigned) {
    renderOnlyActiveAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
  } else {
    renderOnlyAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
  }
}

/**
 * This asynchronous function collects new values from input fields, validates these inputs, and then processes the task updates. 
 * If validation passes, it creates a task object, saves the changes to the database.
 *
 * @param {string} id - The ID of the task to be updated.
 * @returns {Promise<void>} A promise that resolves when the task changes have been successfully saved.
 */

// async function saveTaskChanges(id) {
//   let newTitle = getInputValue("big-edit-task-title-input");
//   let newDescription = getInputValue("big-edit-task-description-input");
//   let newDate = getInputValue("big-edit-task-due-date-input");
//   if (validateInputs(newTitle, newDate)) {
//     showBoardLoadScreen();
//     removeInputErrors();
//     let taskForEditing = createTaskObject(newTitle, newDescription, newDate);
//     try {
//       await processTaskEditing(id, taskForEditing);
//     } catch (error) {
//       console.error("Fehler beim Speichern der Änderungen: ", error);
//     }
//     resetSubtasks();
//     updateHTML();
//     hideBoardLoadScreen();
//   }
// }

/**
 * Retrieves the value of an input field by its element ID.
 *
 * @param {string} elementId - The ID of the input field from which the value is to be retrieved.
 * @returns {string} The current value of the input field.
 */

export function getInputValue(elementId) {
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

export function validateInputs(title, date) {
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

export function removeInputErrors() {
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

export function createTaskObject(title, description, date) {
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
 * Creates a task object formatted for editing from the provided task details.
 *
 * @param {Object} task - The task object to format for editing.
 * @returns {Object} A new task object formatted for editing.
 */

export function createTaskForEditing(task) {
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

export async function processTaskEditing(id, taskForEditing) {
  let newTaskReady = await updateTasksThroughEditing(id, taskForEditing);
  let newJsonElement = JSON.stringify(newTaskReady);
  let newJsontextElement = encodeURIComponent(newJsonElement);
  renderBigTask(newJsontextElement);
}

/**
 * This function updates the visual representation of task priorities by adding or removing active classes based on the provided priority level. 
 *
 * @param {string} priority - The priority level to set for the task. 
 * @returns {string} The priority value that was saved.
 */

export function checkBigEditTaskPriority(priority) {
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

export function savePriorityValue(priority) {
  priorityValue = priority;
  return priorityValue;
}

/**
 * This function updates a task in the `tasks` collection and resets the checkbox state.
 *
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @param {Object} objectForEditing - An object containing the new details for the task.
 * @returns {Promise<Object>} A promise that resolves to the updated task object.
 */

export async function updateTasksThroughEditing(taskId, objectForEditing) {
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

export async function updateTask(task, taskId, objectForEditing) {
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

export async function saveTaskWithCatch(task) {
  try {
    await saveTaskToFirebase(task);
  } catch (error) {
    console.error("Fehler beim Hochladen der Daten: ", error);
  }
}

/**
 * Deletes data at the specified path from the Firebase database.
 *
 * @param {string} [path=""] - The path in the Firebase database where the data should be deleted. Defaults to an empty string.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the DELETE request.
 */

export async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

/**
 * This function maps a specific task category to a corresponding color code.
 * 
 * @param {string} category - The category of the task. 
 * @returns {string} The color code associated with the given category. 
 */

export function checkCategoryColor(category) {
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

export function checkPriorityIcon(priorityText) {
  if (priorityText === "urgent") {
    return feedbackAndUrgency.generateHTMLUrgencyUrgent();
  } else if (priorityText === "medium") {
    return feedbackAndUrgency.generateHTMLUrgencyMedium();
  } else if (priorityText === "low") {
    return feedbackAndUrgency.generateHTMLUrgencyLow();
  }
}

/**
 * Clears the content of a specified category container.
 * 
 * @param {string} categoryContainer - The ID of the category container element whose content will be cleared.
 */

export function clearCategoryContainer(categoryContainer) {
  document.getElementById(categoryContainer).innerHTML = "";
}

/**
 * This function updates the category container's inner HTML to display a message or element
 * indicating that there are no tasks available for that category.
 *
 * @param {string} categoryContainer - The ID of the category container where no tasks were found.
 */

export function handleNoTasksInCategory(categoryContainer) {
  let oppositeElementName = "no-" + categoryContainer;
  let oppositeElement = getRightOppositeElement(oppositeElementName);
  document.getElementById(categoryContainer).innerHTML = oppositeElement;
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

export function generateContactsHTML(task) {
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

export function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}

/**
 * This function takes a full name, splits it into words, and returns the initials
 * of each word. The initials are capitalized and concatenated into a single string.
 *
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The initials of the name, with each initial capitalized.
 */

export function getInitials(name) {
  let nameArray = name.trim().split(" ");
  let initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
  return initials;
}