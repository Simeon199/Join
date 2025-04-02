/**
 * Renders the correct assigned names into a big task pop-up.
 *
 * @param {Object} taskJson - The JSON object representing the task, which contains an `assigned` field.
 */

function renderCorrectAssignedNamesIntoBigTask(taskJson) {
  let contactsHTML = "";
  let initials = "";
  if (taskJson["assigned"] || typeof taskJson["assigned"] == Array) {
    for (let index = 0; index < taskJson["assigned"].length; index++) {
      let name = taskJson["assigned"][index]["name"];
      let nameArray = name.trim().split(" ");
      initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
    }
  }
  returnHTMLBigTaskPopUpContactAll(contactsHTML);
}

/**
 * This asynchronous function performs the following actions:
 * - Retrieves the subtasks associated with the provided `correctTaskId`.
 * - Toggles the checkbox status and updates the UI accordingly.
 * - Commits the changes to the subtasks.
 *
 * @param {number} i - The index of the subtask whose checkbox status is being updated.
 * @param {string} correctTaskId - The unique identifier for the task associated with the subtasks. 
 * @returns {Promise<void>} A promise that resolves when all operations are complete.
 */

async function addCheckedStatus(i, correctTaskId) {
  let subtasks = tasks[correctTaskId]["subtask"];
  let checkBoxChecked = toggleCheckboxIcons(i);
  updateCheckboxStatus(i, checkBoxChecked);
  depositSubtaskChanges(correctTaskId, subtasks);
}

/**
 * This function updates the visibility of the unchecked and checked checkbox icons based on their current state. It hides one icon and shows the other, 
 * indicating the new checked status of the checkbox.
 *
 * @param {number} i - The index used to identify the checkbox icons.
 * @returns {boolean} `true` if the checkbox is checked after toggling, `false` otherwise.
 */

function toggleCheckboxIcons(i) {
  let checkBoxIconUnchecked = document.getElementById(`checkBoxIconUnchecked${i}`);
  let checkBoxIconChecked = document.getElementById(`checkBoxIconChecked${i}`);
  if (!checkBoxIconUnchecked.classList.contains("d-none") && checkBoxIconChecked.classList.contains("d-none")) {
    checkBoxIconUnchecked.classList.add("d-none");
    checkBoxIconChecked.classList.remove("d-none");
    return true;
  } else if (!checkBoxIconChecked.classList.contains("d-none") && checkBoxIconUnchecked.classList.contains("d-none")) {
    checkBoxIconUnchecked.classList.remove("d-none");
    checkBoxIconChecked.classList.add("d-none");
    return false;
  }
}

/**
 * Updates the checkbox status in the `checkBoxCheckedJson` array.
 *
 * @param {number} i - The index of the checkbox in the `checkBoxCheckedJson` array.
 * @param {boolean} checkBoxChecked - The new checked status of the checkbox (true if checked, false if unchecked).
 */

function updateCheckboxStatus(i, checkBoxChecked) {
  checkBoxCheckedJson[i] = checkBoxChecked;
}

/**
 * This function updates the inner HTML of the contact container with a list of assigned contacts from the provided `taskJson` object. 
 * If there are assigned contacts, their details are rendered using `returnAssignedContactHTML`. If no contacts are assigned, a "No One Assigned" message is shown.
 *
 * @param {Object} taskJson - The JSON object representing the task.
 */

function renderTaskContact(taskJson) {
  assignedToContactsBigContainer = taskJson.assigned;
  if (taskJson.assigned && taskJson.assigned.length > 0) {
    taskJson.assigned.forEach((contact) => {
      document.getElementById("big-task-pop-up-contact-container").innerHTML += returnAssignedContactHTML(contact);
    });
  } else if (taskJson.assigned && taskJson.assigned.length == 0) {
    document.getElementById("big-task-pop-up-contact-container").innerHTML = /*html*/ `  
    <p class='big-task-pop-up-value-text'>No One Assigned</p>
    `;
  } else {
    document.getElementById("big-task-pop-up-contact-container").innerHTML = /*html*/ `  
    <p class='big-task-pop-up-value-text'>No One Assigned</p>
    `;
  }
}

/**
 * This function parses the JSON data from `jsonTextElement` to retrieve the task details. It then updates the content and styling of various elements in the pop-up to reflect 
 * the task's current state. Additionally, it prepares the task for editing by setting the `renderCurrentTaskId` and calling `renderAllBigPopUp` to display the task information.
 *
 * @param {string} jsonTextElement - The JSON-encoded string representing the task details.
 * @param {string} id - The unique identifier for the task to be edited.
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

/**
 * This function updates the display of the "Assigned To" pop-up by toggling its height, box-shadow, and input arrow rotation. It also manages the focus state of the associated input field.
 *
 */

function toggleEditTaskAssignedToPopUp() {
  document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.toggle("height-0");
  document.getElementById("big-edit-task-assigned-to-pop-up").classList.toggle("box-shadow-none");
  document.getElementById("big-edit-task-assigned-to-input-arrow").classList.toggle("rotate-90");
  toggleFocusAssignedToInput();
}

/**
 * This function hides the "Assigned To" pop-up by adding the `height-0` class to its container, 
 * removing the `box-shadow-none` class from the pop-up, and resetting the input arrow rotation. 
 * 
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
 * This function checks if the "Assigned To" pop-up container is hidden by looking for the `height-0` class. 
 * If the container is hidden, it removes focus from the input field. If the container is visible, it sets focus to the input field.
 * 
 */

function toggleFocusAssignedToInput() {
  if (document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.contains("height-0")) {
    document.getElementById("big-edit-task-assigned-to-input").blur();
  } else {
    document.getElementById("big-edit-task-assigned-to-input").focus();
  }
}

/**
 * Renders the "Assigned Contacts" section of a task.
 *
 * @param {Object} taskJson - The JSON object representing the task.
 */

function renderBigTaskAssignedContactContainer(taskJson) {
  let lengthOfAssignedTo = taskJson.assigned.length;
  document.getElementById("big-edit-task-assigned-to-contact-container").innerHTML = "";
  if (taskJson.assigned) {
    for (let i = 0; i < taskJson.assigned.length; i++) {
      const contact = taskJson.assigned[i];
      returnColorAndAssignedToContacts(contact, i, lengthOfAssignedTo, taskJson);
    }
  } else {
    taskJson.assigned = [];
    returnNoOneIsAssignedHTML();
  }
}

/**
 * Renders the "Assigned To" pop-up for editing a task.
 *
 * @param {Object} taskJson - The JSON object representing the task.
 */

function renderBigEditTaskAssignedToPopUp(taskJson) {
  for (let i = 0; i < allUsers.length; i++) {
    let taskIndex = taskJson.tasksIdentity;
    const contact = allUsers[i];
    let allNames = [];
    for (let j = 0; j < taskJson.assigned.length; j++) {
      const assignedContact = taskJson.assigned[j];
      if (contact.name === taskJson.assigned[j].name) {
        let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: true });
        renderOnlyActiveAssignedToPopUp(contact, contactObject, i, taskIndex);
        allNames.push(contact.name);
      }
    }
    if (!allNames.includes(contact.name)) {
      let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: false });
      renderOnlyAssignedToPopUp(contact, contactObject, i, taskIndex);
      allNames.push(contact.name);
    }
    renderOnlySubtaskContainerPopUp(taskJson);
  }
}

/**
 * Toggles the selection state of a contact in the "Assigned To" pop-up and updates the task's assigned contacts.
 *
 * @param {number} i - The index of the contact in the pop-up container.
 * @param {Object} contactObject - The contact object representing the contact to be toggled.
 * @param {string} taskIndex - The unique identifier for the task being edited.
 */

function checkBigEditTaskContact(i, contactObject, taskIndex) {
  if (tasks[taskIndex].assigned) {
    assignedToContactsBigContainer = tasks[taskIndex].assigned;
  } else {
    assignedToContactsBigContainer = [];
  }
  HTMLContactContainer = document.querySelectorAll(".big-edit-task-assigned-to-pop-up-contact-container")[i];
  HTMLContactContainer.classList.toggle("big-edit-task-assigned-to-pop-up-active-contact");
  if (HTMLContactContainer.classList.contains("big-edit-task-assigned-to-pop-up-active-contact")) {
    contactObject["isSelected"] = true;
    addContactToAssigned(contactObject, taskIndex);
    returnBigEditTaskAssignedToPopUpContactCheckboxIconHTML(i);
  } else {
    contactObject["isSelected"] = false;
    deleteContactToAssigned(contactObject, taskIndex);
    returnBigEditTaskAssignedToPopUpContactCheckboxSecondIconHTML(i);
  }
}

/**
 * This function updates the task's assigned contacts by adding the provided `contactObject` to the `assignedToContactsBigContainer` array. 
 * It then updates the task's `assigned` property with this updated list and re-renders the "Assigned Contacts" container to reflect the change.
 *
 * @param {Object} contactObject - The contact object to be added to the assigned contacts.
 * @param {string} taskIndex - The unique identifier for the task to which the contact is being assigned.
 */

function addContactToAssigned(contactObject, taskIndex) {
  let taskJson = tasks[taskIndex];
  assignedToContactsBigContainer.push(contactObject);
  taskJson.assigned = assignedToContactsBigContainer;
  renderBigTaskAssignedContactContainer(taskJson);
}

/**
 * This function updates the task's assigned contacts by removing the provided `contactObject` from the `assignedToContactsBigContainer` array. 
 * It then updates the task's assigned contacts and re-renders the "Assigned Contacts" container to reflect the change.
 *
 * @param {Object} contactObject - The contact object to be removed from the assigned contacts.
 * @param {string} taskIndex - The unique identifier for the task from which the contact is being removed.
 */

function deleteContactToAssigned(contactObject, taskIndex) {
  let taskJson = tasks[taskIndex];
  let contactObjectIndex = assignedToContactsBigContainer.findIndex((jsonObject) => jsonObject.name === contactObject.name);
  assignedToContactsBigContainer.splice(contactObjectIndex, 1);
  renderBigTaskAssignedContactContainer(taskJson);
}

/**
 * This function updates the global `isSaveIconClicked` variable to `true` if it is currently `false`. 
 * 
 */

function changeSaveIconClickedOnStatus() {
  if (isSaveIconClicked == false) {
    isSaveIconClicked = true;
  }
}

/**
 * Inserts the current subtasks into the subtask container element.
 *
 */

function insertSubtasksIntoContainer() {
  document.getElementById("big-edit-task-subtask-container").innerHTML = "";
  document.getElementById("big-edit-task-subtask-container").innerHTML = "";
  if (subtaskArray && subtaskArray.length >= 1) {
    for (let i = 0; i < subtaskArray.length; i++) {
      let subtask = subtaskArray[i];
      document.getElementById("big-edit-task-subtask-container").innerHTML += renderSubtaskInPopUpContainer(i, subtask);
    }
  } else if (subtaskArray && subtaskArray.length == 0 && tasks[renderCurrentTaskId]["subtask"]) {
  } else if (!subtaskArray && !tasks[renderCurrentTaskId]["subtask"]) {
    document.getElementById("big-edit-task-subtask-container").innerHTML += "";
  }
}
