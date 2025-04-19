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
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
        d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z"
        fill="#2A3647"
        />
      </svg>
      Delete
  </div>
  <div class="big-task-pop-up-stroke"></div>
  <div id="big-task-pop-up-edit-button" onclick='renderEditTask("${jsonTextElement}", ${id})'>
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
      d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z"
      fill="#2A3647"
      />
    </svg>
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
  return `<div class="messageFalseInputValue">
    <p>Leerer Subtask kann nicht abgespeichert werden. Bitte geben Sie einen gültigen Inhalt ein!</p>
  <div>`;
}