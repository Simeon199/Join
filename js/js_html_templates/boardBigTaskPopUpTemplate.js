/**
 * This function updates the inner HTML of the priority container in the task pop-up with priority options.
 * Each priority option is a clickable item that triggers the `checkBigEditTaskPriority` function with the respective priority level ("urgent", "medium", or "low").
 *
 */

function returnBigTaskPopUpPriorityContainer() {
    document.getElementById("big-task-pop-up-priority-container").innerHTML = /*html*/ `
      <p id='big-edit-task-priority-section-headline'>Priority</p>
      <div id='big-edit-task-priority-container'>
        <div class='big-edit-task-priority-item' id='big-edit-task-urgent-priority' onclick='checkBigEditTaskPriority("urgent")'>
          Urgent
          ${urgentPrioritySVG}
        </div>
        <div class='big-edit-task-priority-item' id='big-edit-task-medium-priority' onclick='checkBigEditTaskPriority("medium")'>
          Medium
          ${mediumPrioritySVG}
        </div>
        <div class='big-edit-task-priority-item' id='big-edit-task-low-priority' onclick='checkBigEditTaskPriority("low")'>
          Low
          ${lowPrioritySVG}
        </div>
      </div>
    `;
}

/**
 * Updates the inner HTML of the contact selection section in the task pop-up.
 * 
 * @param {string} id - The identifier used for the contact search functionality.
 */

function returnBigTaskPopUpContactAll(id) {
    document.getElementById("big-task-pop-up-contact-all").innerHTML = /*html*/ `
        <div id='big-edit-task-assigned-to-top-container'>
          <p class='big-edit-task-section-headline'>Assigned to</p>
          
          <div onclick='stopEvent(event);' id='big-edit-task-assigned-to-input-container'>
            <input  onclick=' toggleEditTaskAssignedToPopUp()' type='text' id='big-edit-task-assigned-to-input' onkeyup='editPopUpSearchContacts("${id}")' placeholder='Select contacts to assign'>
              ${assignedToArrowSVG}
          </div>
        </div>
        <div id='big-edit-task-assigned-to-contact-container'></div>
        <div id='big-edit-task-assigned-to-pop-up-container' class='big-edit-task-assigned-to-pop-up-container height-0'>
          <div id='big-edit-task-assigned-to-pop-up' onclick='stopEvent(event);' class='big-edit-task-assigned-to-pop-up box-shadow-none'></div>
        </div>
    `;
}

/**
 * Updates the inner HTML of the subtasks section in the task pop-up.
 * 
 */

function returnBigTaskPopUpSubtasksAll() {
    document.getElementById("big-task-pop-up-subtask-all").innerHTML = /*html*/ `
      <p class='big-edit-task-section-headline'>Subtasks</p>
  
      <div id='big-edit-task-subtask-input-container' onkeyup='changeSubtaskInputIcons()' onclick='focusSubtaskInput()'>
        <input onkeyup='bigEditTaskSubtaskInputCheckEnter(event)' type="text" id='big-edit-task-subtask-input' placeholder='Add new Subtask'>
        
        <div id='big-edit-task-subtask-input-icon-container'>
          ${subtaskPlusSVG}
        </div>
      </div>
      <ul id='big-edit-task-subtask-container'></ul>
    `;
}

/**
 * This function appends an HTML block to the element with the ID "big-edit-task-assigned-to-pop-up". Each contact item consists of:
 * - A contact badge with the contact's initials, styled according to the contact's color.
 * - The contact's name.
 * - A checkbox icon indicating whether the contact is selected.
 * 
 * @param {Object} contact - The contact information.
 * @param {Object} contactObject - The full contact object.
 * @param {number} i - The index of the contact in the contact list.
 * @param {number} taskIndex - The index of the task.
 */

function renderOnlyAssignedToPopUp(contact, contactObject, i, taskIndex) {
    document.getElementById("big-edit-task-assigned-to-pop-up").innerHTML += /*html*/ `
        <div onclick='checkBigEditTaskContact(${i}, ${contactObject},${taskIndex})' class='big-edit-task-assigned-to-pop-up-contact-container'>
          <div class='big-edit-task-assigned-to-pop-up-contact' >
            <div class='big-edit-task-assigned-to-pop-up-contact-badge' style='background-color: ${contact.color}'>
              ${firstLetterFirstTwoWords(contact.name)}
            </div>
            <p class='big-edit-task-assigned-to-pop-up-contact-name'>${contact.name}</p>
          </div>
  
          <div class='big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container'>
            ${uncheckedCheckboxSVG}
          </div>
        </div>
      `;
}

/**
 * This function appends an HTML block to the element with the ID "big-edit-task-assigned-to-pop-up".  * The contact item is styled as active, indicating it is currently selected or relevant.
 * Each active contact item consists of:
 * - A contact badge with the contact's initials, styled according to the contact's color.
 * - The contact's name.
 * - A checked checkbox icon indicating the contact is selected.
 * 
 * @param {Object} contact - The contact information.
 * @param {Object} contactObject - The full contact object.
 * @param {number} i - The index of the contact in the contact list.
 * @param {number} taskIndex - The index of the task.
 */

function renderOnlyActiveAssignedToPopUp(contact, contactObject, i, taskIndex) {
    document.getElementById("big-edit-task-assigned-to-pop-up").innerHTML += /*html*/ `
        <div onclick='checkBigEditTaskContact(${i}, ${contactObject},${taskIndex})' class='big-edit-task-assigned-to-pop-up-contact-container big-edit-task-assigned-to-pop-up-active-contact'>
          <div class='big-edit-task-assigned-to-pop-up-contact' >
            <div class='big-edit-task-assigned-to-pop-up-contact-badge' style='background-color: ${contact.color}'>
              ${firstLetterFirstTwoWords(contact.name)}
            </div>
            <p class='big-edit-task-assigned-to-pop-up-contact-name'>${contact.name}</p>
          </div>
  
          <div class='big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container'>
            ${checkedCheckboxSVG}
          </div>
        </div>
      `;
}

/**
 * Updates the due date section of the task pop-up container with the given date.
 * 
 * @param {string} date - The due date to be displayed, formatted as a string.
 */

function returnHTMLBigTaskPopUpDueDateContainerContent(date) {
    document.getElementById("big-task-pop-up-due-date-container").innerHTML = /*html*/ `
      <h2 class="big-task-pop-up-label-text">Due date:</h2>
      <p id="big-task-pop-up-date" class="big-task-pop-up-value-text">${date}</p>
    `;
}

/**
 * Updates the priority section of the task pop-up container with the given priority level.
 * 
 * @param {string} priority - The priority level to be displayed.
 */

function returnHTMLBigTaskPopUpPriorityContainer(priority) {
    document.getElementById("big-task-pop-up-priority-container").innerHTML = /*html*/ `
      <h2 class="big-task-pop-up-label-text">Priority:</h2>
      <div class="big-task-pop-up-value-text">
        <p id="big-task-pop-up-priority-text">${priority}</p>
  
        <div id="big-task-pop-up-priority-icon">
          ${priorityDisplaySVG}
        </div>
      </div>
    `;
}

/**
 * This function updates the contact section of the task pop-up container with a list of contacts.
 * 
 * @param {string} contactsHTML - The HTML string representing the list of contacts to be displayed in the pop-up.
 */

function returnHTMLBigTaskPopUpContactAll(contactsHTML) {
    document.getElementById("big-task-pop-up-contact-all").innerHTML = /*html*/ `
      <h2 class="big-task-pop-up-label-text">Assigned To:</h2>
      <div id="big-task-pop-up-contact-container">${contactsHTML}</div>
    `;
}

/**
 * Updates the subtasks section of the task pop-up container.
 * 
 */

function returnHTMLBigTaskPopUpSubtaskAll() {
    document.getElementById("big-task-pop-up-subtask-all").innerHTML = /*html*/ `
      <h2 class="big-task-pop-up-label-text">Subtasks</h2>
      <div id="big-task-pop-up-subtasks-container"></div>
    `;
}
  
  /**
   * Updates the HTML content of the task pop-up description section.
   * 
   * @param {string} oldDescription - The initial description.
   */
  
  function returnBigTaskPopUpDescription(oldDescription) {
    document.getElementById("big-task-pop-up-description").innerHTML = /*html*/ `
      <p class='big-edit-task-section-headline'>Description</p>
      <textarea id="big-edit-task-description-input" placeholder='Enter a Description'>${oldDescription}</textarea>
    `;
}

/**
 * Updates the HTML content of the task pop-up title section.
 * 
 * @param {string} oldTitle - The initial title text.
 */

function returnBigTaskPopUpTitle(oldTitle) {
    document.getElementById("big-task-pop-up-title").innerHTML = /*html*/ `
      <p class='big-edit-task-section-headline'>Title</p>
      <input type="text" id='big-edit-task-title-input' value='${oldTitle}' placeholder='Enter a title'>
    `;
  }
  
  /**
   * Updates the HTML content of the task pop-up due date section.
   * 
   * @param {string} oldDate - The initial due date.
   */
  
  function returnBigTaskPopUpDueDateContainer(oldDate) {
    document.getElementById("big-task-pop-up-due-date-container").innerHTML = /*html*/ `
      <p class='big-edit-task-section-headline'>Due date</p>
      <input type="text" value='${oldDate}' maxlength='10' placeholder='dd/mm/yyyy' id='big-edit-task-due-date-input'>
    `;
}

/**
 * This function appends the contact's color and initials to the container. If the index of the contact is less than 3, it will add the contact with the specified background color and initials. 
 * If the index is exactly 3, it will display a count of additional contacts. If the index exceeds 3, it will trigger an update function for displaying remaining contacts.
 * 
 * @param {Object} contact - The contact object containing information to be displayed.
 * @param {number} index - The index of the contact in the list.
 * @param {number} lengthOfAssignedTo - The total number of assigned contacts.
 * @param {Object} taskJson - The JSON object representing the task, used for updating additional contacts.
 * @returns {string} An empty string if the index exceeds 3, otherwise appends HTML to the container.
 */

function returnColorAndAssignedToContacts(contact, index, lengthOfAssignedTo, taskJson) {
    if (index < 3) {
      document.getElementById("big-edit-task-assigned-to-contact-container").innerHTML += /*html*/ `
      <div class='big-edit-task-assigned-to-contact' style='background-color:${contact.color}'>
        ${firstLetterFirstTwoWords(contact.name)}
      </div>
  `;
    } else if (index === 3) {
      document.getElementById(
        "big-edit-task-assigned-to-contact-container"
      ).innerHTML += /*html*/ `<div class='bigTaskAssignedToNumberContainer'><span>+ ${lengthOfAssignedTo - 3}</span></div>`;
    } else {
      updateBigTaskContactsContainerPlus(taskJson, lengthOfAssignedTo);
      return "";
    }
}

/** 
 * This function sets the inner HTML of the "big-task-pop-up-bottom-buttons-container" element to include an "Ok" button. 
 * Clicking this button triggers the `saveTaskChanges` function with the specified `id` parameter.
 * 
 * @param {number} id - The ID of the task to be saved. This ID is passed to the `saveTaskChanges` function when the button is clicked.
 */

function returnBigPopUpEditButtons(id) {
    document.getElementById("big-task-pop-up-bottom-buttons-container").innerHTML = /*html*/ `
    <button id='big-edit-task-pop-up-save-button' onclick='saveTaskChanges(${id})'>
      Ok
      ${saveButtonCheckmarkSVG}
    </button>`;
}

/**
 * This function modifies the inner HTML of the checkbox icon container at the given index `i`. It adds an SVG representing
 * a checkmark to indicate that the corresponding contact is selected.
 * 
 * @param {number} i - The index of the checkbox icon container to be updated. This index is used to select the appropriate 
 *                      container within the `big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container` elements.
 */

function returnBigEditTaskAssignedToPopUpContactCheckboxIconHTML(i) {
    document.querySelectorAll(".big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container")[i].innerHTML = /*html*/ `
      ${checkedCheckboxSVG}
      `;
}
  
  /**
   * Updates the HTML of a specific checkbox icon container in the "Assigned To" section of the big task edit pop-up with an unselected checkbox icon.
   * 
   * @param {number} i - The index of the checkbox icon container to be updated. This index is used to select the appropriate
   *                      container within the `big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container` elements.
   */
  
  function returnBigEditTaskAssignedToPopUpContactCheckboxSecondIconHTML(i) {
    document.querySelectorAll(".big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container")[i].innerHTML = /*html*/ `
      ${uncheckedCheckboxSVG}
    `;
}