/**
 * Board Assigned To Module
 * Handles assigned contacts and subtask checkboxes for board tasks
 */

// ==================== SUBTASK CHECKBOX HANDLING ====================

/**
 * Toggles checkbox status and updates UI and data.
 * @param {number} i - Subtask index
 * @param {string} correctTaskId - Task ID
 */
async function addCheckedStatus(i, correctTaskId) {
  let subtasks = tasks[correctTaskId]["subtask"];
  let checkBoxChecked = toggleCheckboxIcons(i);
  updateCheckboxStatus(i, checkBoxChecked);
  depositSubtaskChanges(correctTaskId, subtasks);
}

/**
 * Toggles checkbox icons visibility.
 * @param {number} i - Checkbox index
 * @returns {boolean} True if checked
 */
function toggleCheckboxIcons(i) {
  let unchecked = document.getElementById(`checkBoxIconUnchecked${i}`);
  let checked = document.getElementById(`checkBoxIconChecked${i}`);
  let isCurrentlyChecked = checked.classList.contains("d-none");

  unchecked.classList.toggle("d-none");
  checked.classList.toggle("d-none");

  return isCurrentlyChecked;
}

/**
 * Updates checkbox status in JSON array.
 * @param {number} i - Index
 * @param {boolean} status - Checked status
 */
function updateCheckboxStatus(i, status) {
  checkBoxCheckedJson[i] = status;
}

// ==================== ASSIGNED CONTACTS RENDERING ====================

/**
 * Renders assigned names into big task pop-up.
 * @param {Object} taskJson - Task data
 */
function renderCorrectAssignedNamesIntoBigTask(taskJson) {
  let contactsHTML = "";
  let initials = "";
  if (taskJson["assigned"] && Array.isArray(taskJson["assigned"])) {
    for (let contact of taskJson["assigned"]) {
      let nameArray = contact.name.trim().split(" ");
      initials = nameArray.map(word => word.charAt(0).toUpperCase()).join("");
    }
  }
  returnHTMLBigTaskPopUpContactAll(contactsHTML);
}

/**
 * Renders task contacts in pop-up.
 * @param {Object} taskJson - Task data
 */
function renderTaskContact(taskJson) {
  assignedToContactsBigContainer = taskJson.assigned || [];
  let container = document.getElementById("big-task-pop-up-contact-container");

  if (assignedToContactsBigContainer.length > 0) {
    container.innerHTML = "";
    assignedToContactsBigContainer.forEach(contact => {
      container.innerHTML += returnAssignedContactHTML(contact);
    });
  } else {
    container.innerHTML = `<p class='big-task-pop-up-value-text'>No One Assigned</p>`;
  }
}

/**
 * Renders assigned contact container for editing.
 * @param {Object} taskJson - Task data
 */
function renderBigTaskAssignedContactContainer(taskJson) {
  let container = document.getElementById("big-edit-task-assigned-to-contact-container");
  container.innerHTML = "";

  if (!taskJson.assigned) {
    taskJson.assigned = [];
    returnNoOneIsAssignedHTML();
    return;
  }

  for (let i = 0; i < taskJson.assigned.length; i++) {
    const contact = taskJson.assigned[i];
    returnColorAndAssignedToContacts(contact, i, taskJson.assigned.length, taskJson);
  }
}

// ==================== TASK EDITING ====================

/**
 * Prepares task for editing.
 * @param {string} jsonTextElement - Encoded task JSON
 * @param {string} id - Task ID
 */
function renderEditTask(jsonTextElement, id) {
  let taskJson = JSON.parse(decodeURIComponent(jsonTextElement));
  let oldPriority = taskJson.priority;
  let oldTitle = document.getElementById("big-task-pop-up-title-text").innerHTML;
  let oldDescription = document.getElementById("big-task-pop-up-description").innerHTML;
  let oldDate = document.getElementById("big-task-pop-up-date").innerHTML;

  document.getElementById("big-task-pop-up-category").innerHTML = "";
  document.getElementById("big-task-pop-up-category").style = "background-color: white;";
  renderCurrentTaskId = id;
  renderAllBigPopUp(oldTitle, oldDescription, oldDate, oldPriority, taskJson, id);
}

// ==================== POP-UP MANAGEMENT ====================

/**
 * Toggles assigned to pop-up visibility.
 */
function toggleEditTaskAssignedToPopUp() {
  document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.toggle("height-0");
  document.getElementById("big-edit-task-assigned-to-pop-up").classList.toggle("box-shadow-none");
  document.getElementById("big-edit-task-assigned-to-input-arrow").classList.toggle("rotate-90");
  toggleFocusAssignedToInput();
}

/**
 * Closes all small pop-ups.
 */
function closeAllSmallPopUpPopUps() {
  if (document.getElementById("big-edit-task-title-input")) {
    document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.add("height-0");
    document.getElementById("big-edit-task-assigned-to-pop-up").classList.add("box-shadow-none");
    document.getElementById("big-edit-task-assigned-to-input-arrow").classList.remove("rotate-90");
    insertSubtasksIntoContainer();
  }
}

/**
 * Toggles focus on assigned to input.
 */
function toggleFocusAssignedToInput() {
  let container = document.getElementById("big-edit-task-assigned-to-pop-up-container");
  let input = document.getElementById("big-edit-task-assigned-to-input");

  if (container.classList.contains("height-0")) {
    input.blur();
  } else {
    input.focus();
  }
}

// ==================== ASSIGNED TO POP-UP ====================

/**
 * Renders assigned to pop-up for editing.
 * @param {Object} taskJson - Task data
 */
function renderBigEditTaskAssignedToPopUp(taskJson) {
  for (let contact of allUsers) {
    let taskIndex = taskJson.tasksIdentity;
    let isAssigned = taskJson.assigned.some(assigned => assigned.name === contact.name);

    let contactObject = JSON.stringify({
      name: contact.name,
      color: contact.color,
      isSelected: isAssigned
    });

    if (isAssigned) {
      renderOnlyActiveAssignedToPopUp(contact, contactObject, allUsers.indexOf(contact), taskIndex);
    } else {
      renderOnlyAssignedToPopUp(contact, contactObject, allUsers.indexOf(contact), taskIndex);
    }
  }
  renderOnlySubtaskContainerPopUp(taskJson);
}

/**
 * Toggles contact selection in pop-up.
 * @param {number} i - Contact index
 * @param {Object} contactObject - Contact data
 * @param {string} taskIndex - Task ID
 */
function checkBigEditTaskContact(i, contactObject, taskIndex) {
  assignedToContactsBigContainer = tasks[taskIndex].assigned || [];
  let container = document.querySelectorAll(".big-edit-task-assigned-to-pop-up-contact-container")[i];

  container.classList.toggle("big-edit-task-assigned-to-pop-up-active-contact");
  let isSelected = container.classList.contains("big-edit-task-assigned-to-pop-up-active-contact");

  contactObject.isSelected = isSelected;

  if (isSelected) {
    addContactToAssigned(contactObject, taskIndex);
    returnBigEditTaskAssignedToPopUpContactCheckboxIconHTML(i);
  } else {
    deleteContactToAssigned(contactObject, taskIndex);
    returnBigEditTaskAssignedToPopUpContactCheckboxSecondIconHTML(i);
  }
}

/**
 * Adds contact to assigned list.
 * @param {Object} contactObject - Contact data
 * @param {string} taskIndex - Task ID
 */
function addContactToAssigned(contactObject, taskIndex) {
  let taskJson = tasks[taskIndex];
  assignedToContactsBigContainer.push(contactObject);
  taskJson.assigned = assignedToContactsBigContainer;
  renderBigTaskAssignedContactContainer(taskJson);
}

/**
 * Removes contact from assigned list.
 * @param {Object} contactObject - Contact data
 * @param {string} taskIndex - Task ID
 */
function deleteContactToAssigned(contactObject, taskIndex) {
  let taskJson = tasks[taskIndex];
  let index = assignedToContactsBigContainer.findIndex(obj => obj.name === contactObject.name);
  assignedToContactsBigContainer.splice(index, 1);
  taskJson.assigned = assignedToContactsBigContainer;
  renderBigTaskAssignedContactContainer(taskJson);
}

// ==================== MISCELLANEOUS ====================

/**
 * Sets save icon clicked status.
 */
function changeSaveIconClickedOnStatus() {
  if (!isSaveIconClicked) {
    isSaveIconClicked = true;
  }
}

/**
 * Inserts subtasks into container.
 */
function insertSubtasksIntoContainer() {
  let container = document.getElementById("big-edit-task-subtask-container");
  container.innerHTML = "";

  if (subtaskArray && subtaskArray.length > 0) {
    subtaskArray.forEach((subtask, i) => {
      container.innerHTML += renderSubtaskInPopUpContainer(i, subtask);
    });
  }
}