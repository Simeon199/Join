/**
 * This function generates HTML for a task element used in search results.
 *
 * @param {number} id - The unique identifier for the task.
 * @param {string} variableClass - The CSS class to be applied to the task element.
 * @param {string} storyCategory - The category of the story to which the task belongs.
 * @param {string} title - The title of the task.
 * @param {string} taskDescription - The description of the task. It will be truncated if it exceeds 40 characters.
 * @param {string} contactsHTML - The HTML string representing the contacts associated with the task.
 * @param {string} category - The category name for the task.
 * @param {string} oppositeCategory - The name of the opposite category for drag-and-drop functionality.
 * @param {string} rightIcon - The HTML string for the icon to be displayed on the right side of the task.
 * @param {Object} jsonElement - The JSON object representing the task, which will be encoded as a URI component.
 * @returns {string} The HTML string representing the task element.
 */

function generateTaskHTMLForSearch(
  id,
  variableClass,
  storyCategory,
  title,
  taskDescription,
  contactsHTML,
  category,
  oppositeCategory,
  rightIcon,
  jsonElement
) {
  let jsonTextElement = encodeURIComponent(jsonElement);
  if (taskDescription.length > 40) {
    taskDescription = taskDescription.substring(0, 40) + "...";
  }
  return /*html*/ `
      <div class="task" 
          id="task${index}"
          draggable="true" 
          ondragstart="startDragging(${id}); rotateFunction(${taskIndex})" 
          ondragend="checkIfEmpty('${category}', '${oppositeCategory}')" 
          ondragover="allowDrop(event)"
          ondrop="moveTo('${category}')"
          onclick="showBigTaskPopUp('${jsonTextElement}')"
      >
        <div class='task-category' style='background-color: ${checkCategoryColor(storyCategory)}'>${storyCategory}</div>
        <h3 class="task-title">${title}</h3>
        <p class="task-description">${taskDescription}</p>
        <div class="task-bar-container">
          <div class="task-bar">
            <div class="task-bar-content"></div>
          </div>
          <p class="task-bar-text">1/2 Subtasks</p>
        </div>
        <div class="task-contacts-container">
          <div class="task-contacts">
            ${contactsHTML}
          </div>
          ${rightIcon}
        </div>
      </div>
      <div id="${oppositeCategory}" class="no-task d-none">
        <p>No tasks in ${category}</p>
      </div>
    `;
}

/**
 * This function creates a string of HTML that contains the contact name with a background color as well as the initials of the according contact.
 *
 * @param {Object} contact - The contact information.
 * @returns {string} A string containing the HTML representation of the contact.
 */

function returnAssignedContactHTML(contact) {
  return /*html*/ `
      <div class="big-task-pop-up-contact">
        <div class="big-task-pop-up-profile-badge" style="background: ${contact.color}">${firstLetterFirstTwoWords(contact.name)}</div>
        <p class="big-task-pop-up-profile-name">${contact.name}</p>
      </div>
      `;
}

/**
 * This function creates an HTML snippet that includes:
 * - A delete button with an associated icon. Clicking the button triggers the `hideBigTaskPopUp` function and the `deleteTask` function with the specified `id`.
 * - A separator line.
 * - An edit button with an associated icon. Clicking the button triggers the `renderEditTask` function with the provided `jsonTextElement` and `id`.
 * 
 * @param {number} id - The ID of the task to be edited or deleted.
 * @param {string} jsonTextElement - The JSON representation of the task to be edited.
 * @returns {string} A string containing the HTML representation of the delete and edit buttons.
 */

function returnDeleteEditHTML(id, jsonTextElement) {
  return /*html*/ `
  <div id="big-task-pop-up-delete-button" onclick='hideBigTaskPopUp(); deleteTask(${id})'>
      ${deleteIconSVG}
      Delete
  </div>
  <div class="big-task-pop-up-stroke"></div>
  <div id="big-task-pop-up-edit-button" onclick='renderEditTask("${jsonTextElement}", ${id})'>
    ${editIconSVG}
    Edit
</div>`;
}

/**
 * This function sets the inner HTML of the specified container to display a message stating that no one is assigned to the task.
 * 
 */

function returnNoOneIsAssignedHTML() {
  document.getElementById("big-edit-task-assigned-to-contact-container").innerHTML = /*html*/ `
  <p class='big-task-pop-up-value-text'>No one is assigned</p>
  `;
}

/**
 * Generates HTML content for displaying an error message when a subtask input is invalid or empty.
 * 
 * @returns {string} - A string containing the HTML markup for the error message container.
 */

function returnMessageFalseInputValueHTML() {
  return /*html*/ `<div class="messageFalseInputValue">
    <p>Leerer Subtask kann nicht abgespeichert werden. Bitte geben Sie einen gültigen Inhalt ein!</p>
  <div>`;
}