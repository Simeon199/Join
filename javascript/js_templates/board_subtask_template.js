/**
 * This function generates HTML for a task element without subtasks.
 *
 * @param {Object} element - The task element object containing task details.
 * @param {string} contactsHTML - The HTML string representing the contacts associated with the task.
 * @param {string} oppositeCategory - The name of the opposite category for drag-and-drop functionality.
 * @param {string} rightIcon - The HTML string for the icon to be displayed on the right side of the task.
 * @param {string} jsonTextElement - The JSON string representation of the task, which will be used for displaying the task popup.
 * @returns {string} The HTML string representing the task element without subtasks.
 */

function returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement) {
    return generateTaskHtml(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, false);
}

/**
 * Generates the HTML for the mobile dropdown menu for a task.
 *
 * @param {number} taskIndex - The index of the task.
 * @returns {string} The HTML string for the mobile dropdown.
 */

function generateMobileDropdown(taskIndex) {
    return /*html*/ `
      <div id="mobileDropdown${taskIndex}" class="mobileDropdown mobileDropdown-translate-100">
        <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'to-do-container')">To Do</a>
        <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'in-progress-container')">In Progress</a>
        <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'await-feedback-container')">Await Feedback</a>
        <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'done-container')">Done</a>
      </div>
    `;
}

/**
 * This function generates HTML for a task element.
 *
 * @param {Object} element - The task element object containing task details.
 * @param {string} contactsHTML - The HTML string representing the contacts associated with the task.
 * @param {string} oppositeCategory - The name of the opposite category for drag-and-drop functionality.
 * @param {string} rightIcon - The HTML string for the icon to be displayed on the right side of the task.
 * @param {string} jsonTextElement - The JSON string representation of the task, which will be used for displaying the task popup.
 * @param {boolean} hasSubtasks - Whether the task has subtasks.
 * @param {number} taskbarWidth - The width of the task bar (if hasSubtasks).
 * @param {number} numberOfTasksChecked - The number of checked subtasks (if hasSubtasks).
 * @returns {string} The HTML string representing the task element.
 */

function generateTaskHtml(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, hasSubtasks = false, taskbarWidth = 0, numberOfTasksChecked = 0) {
    const taskIndex = element.tasksIdentity ?? element["tasksIdentity"];
    const dragId = element["tasksIdentity"] ?? taskIndex;
    const descriptionFull = element["description"] || element.description || "";
    const taskDescription = descriptionFull.length > 40 ? descriptionFull.substring(0, 40) + "..." : descriptionFull;

    const middleContent = hasSubtasks ? /*html*/ `
      <div class="task-bar-container">
        <div class="task-bar">
          <div class="task-bar-content" style="width: ${taskbarWidth}%"></div>
        </div>
        <p class="task-bar-text">${numberOfTasksChecked}/${(element["subtask"] || []).length} Subtasks</p>
      </div>` : "";
    return buildTaskTemplate({
      element,
      contactsHTML,
      oppositeCategory,
      rightIcon,
      jsonTextElement,
      taskIndex,
      taskDescription,
      middleContent,
      dragId
    });
}

/**
 * Build the HTML template for a task. Receives precomputed values to keep caller small.
 */
function buildTaskTemplate({element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskIndex, taskDescription, middleContent, dragId}) {
  return /*html*/ `
    <div class="task" id=task${taskIndex} draggable="true"
      ondragstart="startDragging(${dragId}); rotateFunction(${taskIndex})"
      ondragend="checkIfEmpty('${element["container"]}', '${oppositeCategory}')"
      ondragover="allowDrop(event)" ondrop="moveTo('${element["container"]}')"
      onclick="showBigTaskPopUp('${jsonTextElement}')">
      <div class="task-category-and-dropdown">
        <div class='task-category' style='background-color: ${checkCategoryColor(element["category"]) }'>${element["category"]}</div>
        <div class="dropdownSVG" onclick="stopEvent(event); openMobileDropdown(${taskIndex})">${dropdownArrowSVG}</div>
      </div>
      ${generateMobileDropdown(taskIndex)}
      <h3 class="task-title">${element["title"]}</h3>
      <p class="task-description">${taskDescription}</p>
      ${middleContent}
      <div class="task-contacts-container">
        <div class="task-contacts">${contactsHTML}</div>
        ${rightIcon}
      </div>
    </div>

    <div id="${oppositeCategory}" class="no-task d-none"><p>No tasks in ${element["container"]}</p></div>
  `;
}

/**
 * This function generates HTML for a task element with subtasks.
 *
 * @param {Object} element - The task element object containing task details.
 * @param {string} contactsHTML - The HTML string containing contact information for the task.
 * @param {string} oppositeCategory - The opposite category name for drag-and-drop operations.
 * @param {string} rightIcon - The HTML string for the icon displayed on the right side of the task.
 * @param {string} jsonTextElement - The JSON stringified version of the task object.
 * @param {number} taskbarWidth - The width of the task bar representing subtasks progress, in percentage.
 * @param {number} numberOfTasksChecked - The number of completed subtasks.
 * @returns {string} The HTML string representing the task element with subtasks.
 */

function returnTaskHtmlWithSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskbarWidth, numberOfTasksChecked) {
    return generateTaskHtml(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, true, taskbarWidth, numberOfTasksChecked);
}

/**
 * This function creates an HTML snippet for a subtask item that includes:
 * - A checkbox icon (which toggles between unchecked and checked states).
 * - The subtask's description.
 *
 * @param {number} correctTaskId - The ID of the parent task to which the subtask belongs.
 * @param {Object} subtask - The subtask information.
 * @param {number} i - The index of the subtask, used to generate unique IDs for the HTML elements.
 * @returns {string} A string containing the HTML representation of the subtask.
 */

function returnSubtaskHTML(correctTaskId, subtask, i) {
    return buildSubtaskCheckboxHTML(correctTaskId, subtask, i, false);
}

/**
 * This function creates an HTML snippet for a subtask item that includes:
 * - A checkbox icon that toggles between unchecked and checked states. In this case, the `unchecked` state is initially hidden, and the `checked` state is visible.
 * - The subtask's description.
 * 
 * @param {number} correctTaskId - The ID of the parent task to which the subtask belongs.
 * @param {Object} subtask - The subtask information.
 * @param {number} i - The index of the subtask, used to generate unique IDs for the HTML elements.
 * @returns {string} A string containing the HTML representation of the subtask.
 */

function returnSubtaskHTMLWithBolean(correctTaskId, subtask, i) {
    return buildSubtaskCheckboxHTML(correctTaskId, subtask, i, true);
}

/**
 * Helper to build subtask checkbox HTML. `checked` toggles which svg is visible.
 */
function buildSubtaskCheckboxHTML(correctTaskId, subtask, i, checked) {
    const uncheckedClass = checked ? "big-task-pop-up-subtask-checkbox-icon d-none" : "big-task-pop-up-subtask-checkbox-icon";
    const checkedClass = checked ? "big-task-pop-up-subtask-checkbox-icon" : "big-task-pop-up-subtask-checkbox-icon d-none";
    return /*html*/ `
    <div class="big-task-pop-up-subtasks" id="bigSubtaskNo${i}">
      <svg id="checkBoxIconUnchecked${i}" onclick="addCheckedStatus(${i}, ${correctTaskId})" class="${uncheckedClass}" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">${boardSubtaskUncheckedCheckboxSVG}</svg>
      <svg id="checkBoxIconChecked${i}" onclick="addCheckedStatus(${i}, ${correctTaskId})" class="${checkedClass}" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">${boardSubtaskCheckedCheckboxSVG}</svg>
      <p>${subtask["task-description"]}</p>
    </div>
  `;
}

/**
 * This function generates a template for displaying a subtask item within a pop-up container. Each subtask item includes:
 * - The subtask description.
 * - Edit and delete icons for managing the subtask.
 * 
 * @param {number} i - The index of the subtask in the subtask list.
 * @param {Object} subtask - An object representing the subtask, which includes:
 * @returns {string} - The HTML string representing the subtask item.
 */

function renderSubtaskInPopUpContainer(i, subtask) {
    return /*html*/ `
      <div ondblclick=" editSubtaskPopUpInput(${i})" onclick='stopEvent(event);' id="subtaskNumber${i}" class="edit-popup-subtasks" >
        <li >${subtask["task-description"]}</li>
        <div id="popUpSubBTN${i}" class="edit-popup-subtask-icon-container">
          <svg onclick="editSubtaskPopUpInput(${i}), stopEvent(event)" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            ${boardSubtaskEditIconSVG}
          </svg>
          <div class='edit-popup-subtasks-line'></div>
          <svg onclick="deleteSubtaskPopUp(${i}), stopEvent(event)" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            ${boardSubtaskDeleteIconSVG}
          </svg>
        </div>
      </div>
    `;
}

/**
 * Returns the HTML string for a plus icon SVG used in the subtask input area.
 *
 * @returns {string} The HTML string containing the SVG markup for the plus icon.
 */

function returnSubtaskInputHTMLPlusIconSVG() {
    return /*html*/ `
        <svg id='big-edit-task-subtask-input-plus-icon' width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          ${plusIconSVG}
        </svg>
      `;
}

/**
 * Returns the HTML string for subtask input control icons, including a close icon and a save icon.
 * 
 * @returns {string} The HTML string containing the SVG markup for the close and save icons.
 */

function returnSubtaskInputHTMLCloseIcon() {
    return /*html*/ `
      <svg id='big-edit-task-subtask-input-close-icon' onclick='resetSubtaskInput()' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${closeIconSVG}
      </svg>
      <div class='big-edit-task-subtask-icon-line'></div>
      <svg id='big-edit-task-subtask-input-save-icon' onclick='buildSubtaskArrayForUpload()' width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${saveIconSVG}
      </svg> 
      `;
}

/**
 * This function creates an input field pre-filled with the description of the subtask at the specified index in the `subtaskArray`.
 * It also includes two buttons: one for deleting the subtask and another for saving the edited subtask.
 * 
 * @param {number} i - The index of the subtask in the `subtaskArray` to be edited.
 * @returns {string} The HTML markup for the subtask editing input and buttons.
 */

function returnEditSubtaskPopUpInputHTML(i) {
    return /*html*/ `
      <input id="subtaskEditedPopUp" type="text" value="${subtaskArray[i]["task-description"]}">
      <div class="inputButtons">
        <img onclick="deleteSubtaskPopUp(${i}), stopEvent(event)" src="../../assets/img/deletetrash.svg" alt="">
        <div class="subtaskBorder"></div>
        <img onclick="saveEditedSubtaskPopUp(${i}), stopEvent(event)" src="../../assets/img/checksubmit.svg" alt="">
      </div>
  `;
}

/**
 * Generates the HTML content for an editable subtask pop-up, including an input field for the subtask description and action icons.
 * 
 * @param {number} i - The index of the subtask in the `subtaskArray` whose description is to be displayed in the input field.
 * @returns {string} - A string containing the HTML markup for the subtask pop-up container.
 */

function returnSubtaskEditedPopUpHTMLContainer(i) {
    return /*html*/ `<input id="subtaskEditedPopUp" type="text" value="${subtaskArray[i]["task-description"]}">
        <div class="edit-popup-subtask-icon-container">
          <svg  onclick="deleteSubtaskPopUp(${i}), stopEvent(event)" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
           ${boardSubtaskDeleteIconSVG}
          </svg>
          <div class="subtaskBorder"></div>
          <svg onclick="saveEditedSubtaskPopUp(${i}), stopEvent(event)" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            ${saveIconSVG}
          </svg>
        </div>
      `;
}