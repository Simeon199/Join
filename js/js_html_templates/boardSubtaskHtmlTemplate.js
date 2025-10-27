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
    let taskIndex = element.tasksIdentity;
    let taskDescription = element["description"];
    if (taskDescription.length > 40) {
      taskDescription = element["description"].substring(0, 40) + "...";
    }
    return /*html*/ `
    <div class="task" 
        id=task${taskIndex}
        draggable="true"
        ondragstart="startDragging(${element["tasksIdentity"]}); rotateFunction(${taskIndex})"
        ondragend="checkIfEmpty('${element["container"]}', '${oppositeCategory}')"
        ondragover="allowDrop(event)"
        ondrop="moveTo('${element["container"]}')"
        onclick="showBigTaskPopUp('${jsonTextElement}')"
    > <div class="task-category-and-dropdown">
        <div class='task-category' style='background-color: ${checkCategoryColor(element["category"])}'>
          ${element["category"]}
        </div>
        <div class="dropdownSVG" onclick="stopEvent(event); openMobileDropdown(${taskIndex})">
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.29998 4.3L0.699975 1.7C0.383309 1.38333 0.312475 1.02083 0.487475 0.6125C0.662475 0.204167 0.974975 0 1.42498 0H6.57498C7.02498 0 7.33747 0.204167 7.51248 0.6125C7.68748 1.02083 7.61664 1.38333 7.29997 1.7L4.69998 4.3C4.59998 4.4 4.49164 4.475 4.37498 4.525C4.25831 4.575 4.13331 4.6 3.99998 4.6C3.86664 4.6 3.74164 4.575 3.62498 4.525C3.50831 4.475 3.39998 4.4 3.29998 4.3Z" fill="#2A3647"/>
          </svg>
        </div>
      </div>
      <div id="mobileDropdown${taskIndex}" class="mobileDropdown mobileDropdown-translate-100">
        <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'to-do-container')">To Do</a>
        <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'in-progress-container')">In Progress</a>
        <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'await-feedback-container')">Await Feedback</a>
        <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'done-container')">Done</a>
      </div>
      <h3 class="task-title">${element["title"]}</h3>
      <p class="task-description">${taskDescription}</p>
      <div class="task-contacts-container">
        <div class="task-contacts">
          ${contactsHTML}
        </div>
        ${rightIcon}
      </div>
    </div>
    <div id="${oppositeCategory}" class="no-task d-none">
      <p>No tasks in ${element["container"]}</p>
    </div>
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
    let taskIndex = element.tasksIdentity;
    let taskDescription = element["description"];
    if (taskDescription.length > 40) {
      taskDescription = taskDescription.substring(0, 40) + "...";
    }
    return /*html*/ `
        <div class="task" id=task${taskIndex}
            draggable="true" 
            ondragstart="startDragging(${element["tasksIdentity"]}); rotateFunction(${taskIndex})" 
            ondragend="checkIfEmpty('${element["container"]}', '${oppositeCategory}')" 
            ondragover="allowDrop(event)"
            ondrop="moveTo('${element["container"]}')"
            onclick="showBigTaskPopUp('${jsonTextElement}')"
        > <div class="task-category-and-dropdown">
            <div class='task-category' style='background-color: ${checkCategoryColor(element["category"])}'>
              ${element["category"]}
            </div>
            <div class="dropdownSVG" onclick="stopEvent(event); openMobileDropdown(${taskIndex})">
              <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.29998 4.3L0.699975 1.7C0.383309 1.38333 0.312475 1.02083 0.487475 0.6125C0.662475 0.204167 0.974975 0 1.42498 0H6.57498C7.02498 0 7.33747 0.204167 7.51248 0.6125C7.68748 1.02083 7.61664 1.38333 7.29997 1.7L4.69998 4.3C4.59998 4.4 4.49164 4.475 4.37498 4.525C4.25831 4.575 4.13331 4.6 3.99998 4.6C3.86664 4.6 3.74164 4.575 3.62498 4.525C3.50831 4.475 3.39998 4.4 3.29998 4.3Z" fill="#2A3647"/>
              </svg>
            </div>
          </div>
          <div id="mobileDropdown${taskIndex}" class="mobileDropdown mobileDropdown-translate-100">
            <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'to-do-container')">To Do</a>
            <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'in-progress-container')">In Progress</a>
            <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'await-feedback-container')">Await Feedback</a>
            <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'done-container')">Done</a>
          </div>
          <h3 class="task-title">${element["title"]}</h3>
          <p class="task-description">${taskDescription}</p>
          <div class="task-bar-container">
            <div class="task-bar">
              <div class="task-bar-content" style="width: ${taskbarWidth}%"></div>
            </div>
            <p class="task-bar-text">${numberOfTasksChecked}/${element["subtask"].length} Subtasks</p>
          </div>
          <div class="task-contacts-container">
            <div class="task-contacts">
              ${contactsHTML}
            </div>
            ${rightIcon}
          </div>
        </div>
        <div id="${oppositeCategory}" class="no-task d-none">
          <p>No tasks in ${element["container"]}</p>
        </div>`;
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
    return /*html*/ `
    <div class="big-task-pop-up-subtasks" id="bigSubtaskNo${i}">
      <svg
        id="checkBoxIconUnchecked${i}"
        onclick="addCheckedStatus(${i}, ${correctTaskId})"
        class="big-task-pop-up-subtask-checkbox-icon"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >   
        <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2" />
      </svg>
      <svg 
        id="checkBoxIconChecked${i}"
        onclick="addCheckedStatus(${i}, ${correctTaskId})"
        class="big-task-pop-up-subtask-checkbox-icon d-none" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 8.96582V14.9658C17 16.6227 15.6569 17.9658 14 17.9658H4C2.34315 17.9658 1 16.6227 1 14.9658V4.96582C1 3.30897 2.34315 1.96582 4 1.96582H12" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
          <path d="M5 9.96582L9 13.9658L17 2.46582" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>${subtask["task-description"]}</p>
    </div>
  `;
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
    return /*html*/ `
    <div class="big-task-pop-up-subtasks" id="bigSubtaskNo${i}">
      <svg
        id="checkBoxIconUnchecked${i}"
        onclick="addCheckedStatus(${i}, ${correctTaskId})"
        class="big-task-pop-up-subtask-checkbox-icon d-none"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >   
        <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2" />
      </svg>
      <svg 
        id="checkBoxIconChecked${i}"
        onclick="addCheckedStatus(${i}, ${correctTaskId})"
        class="big-task-pop-up-subtask-checkbox-icon" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 8.96582V14.9658C17 16.6227 15.6569 17.9658 14 17.9658H4C2.34315 17.9658 1 16.6227 1 14.9658V4.96582C1 3.30897 2.34315 1.96582 4 1.96582H12" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
          <path d="M5 9.96582L9 13.9658L17 2.46582" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
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
            <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
          </svg>
          <div class='edit-popup-subtasks-line'></div>
          <svg onclick="deleteSubtaskPopUp(${i}), stopEvent(event)" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
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
          <path d="M6.14453 8H1.14453C0.861198 8 0.623698 7.90417 0.432031 7.7125C0.240365 7.52083 0.144531 7.28333 0.144531 7C0.144531 6.71667 0.240365 6.47917 0.432031 6.2875C0.623698 6.09583 0.861198 6 1.14453 6H6.14453V1C6.14453 0.716667 6.24036 0.479167 6.43203 0.2875C6.6237 0.0958333 6.8612 0 7.14453 0C7.42786 0 7.66536 0.0958333 7.85703 0.2875C8.0487 0.479167 8.14453 0.716667 8.14453 1V6H13.1445C13.4279 6 13.6654 6.09583 13.857 6.2875C14.0487 6.47917 14.1445 6.71667 14.1445 7C14.1445 7.28333 14.0487 7.52083 13.857 7.7125C13.6654 7.90417 13.4279 8 13.1445 8H8.14453V13C8.14453 13.2833 8.0487 13.5208 7.85703 13.7125C7.66536 13.9042 7.42786 14 7.14453 14C6.8612 14 6.6237 13.9042 6.43203 13.7125C6.24036 13.5208 6.14453 13.2833 6.14453 13V8Z" fill="#2A3647"/>
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
        <path d="M7.14434 8.40005L2.24434 13.3C2.061 13.4834 1.82767 13.575 1.54434 13.575C1.261 13.575 1.02767 13.4834 0.844336 13.3C0.661003 13.1167 0.569336 12.8834 0.569336 12.6C0.569336 12.3167 0.661003 12.0834 0.844336 11.9L5.74434 7.00005L0.844336 2.10005C0.661003 1.91672 0.569336 1.68338 0.569336 1.40005C0.569336 1.11672 0.661003 0.883382 0.844336 0.700049C1.02767 0.516715 1.261 0.425049 1.54434 0.425049C1.82767 0.425049 2.061 0.516715 2.24434 0.700049L7.14434 5.60005L12.0443 0.700049C12.2277 0.516715 12.461 0.425049 12.7443 0.425049C13.0277 0.425049 13.261 0.516715 13.4443 0.700049C13.6277 0.883382 13.7193 1.11672 13.7193 1.40005C13.7193 1.68338 13.6277 1.91672 13.4443 2.10005L8.54434 7.00005L13.4443 11.9C13.6277 12.0834 13.7193 12.3167 13.7193 12.6C13.7193 12.8834 13.6277 13.1167 13.4443 13.3C13.261 13.4834 13.0277 13.575 12.7443 13.575C12.461 13.575 12.2277 13.4834 12.0443 13.3L7.14434 8.40005Z" fill="#2A3647"/>
      </svg>
      <div class='big-edit-task-subtask-icon-line'></div>
      <svg id='big-edit-task-subtask-input-save-icon' onclick='buildSubtaskArrayForUpload()' width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.69474 9.15L14.1697 0.675C14.3697 0.475 14.6072 0.375 14.8822 0.375C15.1572 0.375 15.3947 0.475 15.5947 0.675C15.7947 0.875 15.8947 1.1125 15.8947 1.3875C15.8947 1.6625 15.7947 1.9 15.5947 2.1L6.39474 11.3C6.19474 11.5 5.96141 11.6 5.69474 11.6C5.42807 11.6 5.19474 11.5 4.99474 11.3L0.694738 7C0.494738 6.8 0.398905 6.5625 0.407238 6.2875C0.415572 6.0125 0.519738 5.775 0.719738 5.575C0.919738 5.375 1.15724 5.275 1.43224 5.275C1.70724 5.275 1.94474 5.375 2.14474 5.575L5.69474 9.15Z" fill="#2A3647"/>
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
    return `<input id="subtaskEditedPopUp" type="text" value="${subtaskArray[i]["task-description"]}">
        <div class="edit-popup-subtask-icon-container">
          <svg  onclick="deleteSubtaskPopUp(${i}), stopEvent(event)" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
          </svg>
  
          <div class="subtaskBorder"></div>
  
          <svg onclick="saveEditedSubtaskPopUp(${i}), stopEvent(event)" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.69474 9.15L14.1697 0.675C14.3697 0.475 14.6072 0.375 14.8822 0.375C15.1572 0.375 15.3947 0.475 15.5947 0.675C15.7947 0.875 15.8947 1.1125 15.8947 1.3875C15.8947 1.6625 15.7947 1.9 15.5947 2.1L6.39474 11.3C6.19474 11.5 5.96141 11.6 5.69474 11.6C5.42807 11.6 5.19474 11.5 4.99474 11.3L0.694738 7C0.494738 6.8 0.398905 6.5625 0.407238 6.2875C0.415572 6.0125 0.519738 5.775 0.719738 5.575C0.919738 5.375 1.15724 5.275 1.43224 5.275C1.70724 5.275 1.94474 5.375 2.14474 5.575L5.69474 9.15Z" fill="#2A3647"/>
          </svg>
  
        </div>
      `;
}