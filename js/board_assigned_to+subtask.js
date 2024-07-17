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

function renderSubtask(taskJson) {
  let correctTaskId = taskJson.tasksIdentity;
  if (taskJson.subtask && taskJson.subtask.length > 0) {
    // let subtasks = taskJson.subtask;
    taskJson.subtask.forEach((subtask, index) => {
      if (subtask["is-tasked-checked"] == false) {
        document.getElementById("big-task-pop-up-subtasks-container").innerHTML += returnSubtaskHTML(correctTaskId, subtask, index);
      } else if (subtask["is-tasked-checked"] == true) {
        document.getElementById("big-task-pop-up-subtasks-container").innerHTML += returnSubtaskHTMLWithBolean(correctTaskId, subtask, index);
      }
    });
  } else if (taskJson.subtask && taskJson.subtask.length == 0) {
    document.getElementById("big-task-pop-up-subtasks-container").innerHTML = /*html*/ `  
    <p class='big-task-pop-up-value-text'>No Subtasks</p>
    `;
  } else {
    document.getElementById("big-task-pop-up-subtasks-container").innerHTML = /*html*/ `  
    <p class='big-task-pop-up-value-text'>No Subtasks</p>
    `;
  }
}

async function addCheckedStatus(i, correctTaskId) {
  let subtasks = tasks[correctTaskId]["subtask"];
  let checkBoxChecked = false;
  let checkBoxIconUnchecked = document.getElementById(`checkBoxIconUnchecked${i}`);
  let checkBoxIconChecked = document.getElementById(`checkBoxIconChecked${i}`);

  if (!checkBoxIconUnchecked.classList.contains("d-none") && checkBoxIconChecked.classList.contains("d-none")) {
    checkBoxChecked = true;
    checkBoxCheckedJson[i] = checkBoxChecked;

    checkBoxIconUnchecked.classList.add("d-none");
    checkBoxIconChecked.classList.remove("d-none");
  } else if (!checkBoxIconChecked.classList.contains("d-none") && checkBoxIconUnchecked.classList.contains("d-none")) {
    checkBoxChecked = false;
    checkBoxCheckedJson[i] = checkBoxChecked;
    checkBoxIconUnchecked.classList.remove("d-none");
    checkBoxIconChecked.classList.add("d-none");
  }
  depositSubtaskChanges(correctTaskId, subtasks);
}

async function depositSubtaskChanges(correctTaskId, subtasks) {
  for (index = 0; index < subtasks.length; index++) {
    if (checkBoxCheckedJson.hasOwnProperty(index)) {
      subtasks[index]["is-tasked-checked"] = checkBoxCheckedJson[index];
    }
  }
  subtaskArray = subtasks;
  await saveChangedSubtaskToFirebase(correctTaskId);
}

async function saveChangedSubtaskToFirebase(correctTaskId) {
  let taskPath = `/testRealTasks/${correctTaskId}/subtask`;
  let response = await fetch(`${BASE_URL}${taskPath}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subtaskArray),
  });
  if (!response.ok) {
    console.error("Fehler beim Speichern der Task in Firebase:", response.status, response.statusText);
  } else {
    console.log("Task erfolgreich in Firebase gespeichert");
  }
}

// renderContact
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

// renderEditTask
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

function toggleEditTaskAssignedToPopUp() {
  document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.toggle("height-0");
  document.getElementById("big-edit-task-assigned-to-pop-up").classList.toggle("box-shadow-none");
  document.getElementById("big-edit-task-assigned-to-input-arrow").classList.toggle("rotate-90");
  toggleFocusAssignedToInput();
}

function closeAllSmallPopUpPopUps() {
  if (document.getElementById("big-edit-task-title-input")) {
    document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.add("height-0");
    document.getElementById("big-edit-task-assigned-to-pop-up").classList.add("box-shadow-none");
    document.getElementById("big-edit-task-assigned-to-input-arrow").classList.remove("rotate-90");

    insertSubtasksIntoContainer();
  }
}

function toggleFocusAssignedToInput() {
  if (document.getElementById("big-edit-task-assigned-to-pop-up-container").classList.contains("height-0")) {
    document.getElementById("big-edit-task-assigned-to-input").blur();
  } else {
    document.getElementById("big-edit-task-assigned-to-input").focus();
  }
}

function renderBigTaskAssignedContactContainer(taskJson) {
  document.getElementById("big-edit-task-assigned-to-contact-container").innerHTML = "";
  if (taskJson.assigned) {
    for (let i = 0; i < taskJson.assigned.length; i++) {
      const contact = taskJson.assigned[i];
      returnColorAndAssignedToContacts(contact);
    }
  } else {
    taskJson.assigned = [];
    returnNoOneIsAssignedHTML();
  }
}

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

function renderOnlySubtaskContainerPopUp(taskJson) {
  document.getElementById("big-edit-task-subtask-container").innerHTML = "";
  subtaskArray = taskJson.subtask;
  if (taskJson.subtask) {
    for (let i = 0; i < taskJson.subtask.length; i++) {
      let subtask = taskJson.subtask[i];
      document.getElementById("big-edit-task-subtask-container").innerHTML += renderSubtaskInPopUpContainer(i, subtask);
    }
  }
}

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

// addContactToAssigned
function addContactToAssigned(contactObject, taskIndex) {
  let taskJson = tasks[taskIndex];
  assignedToContactsBigContainer.push(contactObject);
  taskJson.assigned = assignedToContactsBigContainer;
  renderBigTaskAssignedContactContainer(taskJson);
}

// deleteContactToAssigned
function deleteContactToAssigned(contactObject, taskIndex) {
  let taskJson = tasks[taskIndex];

  let contactObjectIndex = assignedToContactsBigContainer.findIndex((jsonObject) => jsonObject.name === contactObject.name);
  assignedToContactsBigContainer.splice(contactObjectIndex, 1);
  renderBigTaskAssignedContactContainer(taskJson);
}

function focusSubtaskInput() {
  document.getElementById("big-edit-task-subtask-input").focus();
}

function changeSubtaskInputIcons() {
  let subtaskInputIconContainer = document.getElementById("big-edit-task-subtask-input-icon-container");
  let subtaskInputValue = document.getElementById("big-edit-task-subtask-input");
  if (subtaskInputValue.value === "") {
    subtaskInputIconContainer.innerHTML = returnSubtaskInputHTMLPlusIconSVG();
  } else {
    subtaskInputIconContainer.innerHTML = returnSubtaskInputHTMLCloseIcon();
  }
}

function changeSaveIconClickedOnStatus() {
  if (isSaveIconClicked == false) {
    isSaveIconClicked = true;
  }
}

function resetSubtaskInput() {
  document.getElementById("big-edit-task-subtask-input").value = "";
  changeSubtaskInputIcons();
}

function buildSubtaskArrayForUpload() {
  if (!subtaskArray) {
    subtaskArray = emptyList;
  }
  let subtaskInput = document.getElementById("big-edit-task-subtask-input");
  let subtaskJson = createSubtaskJson(subtaskInput.value);
  subtaskArray.push(subtaskJson);
  insertSubtasksIntoContainer();
  subtaskInput.value = "";
}

function insertSubtasksIntoContainer() {
  console.log(subtaskArray);
  console.log(tasks[renderCurrentTaskId]);
  document.getElementById("big-edit-task-subtask-container").innerHTML = "";
  // let subtaskAllContainer = document.getElementById("big-task-pop-up-subtask-all");
  // subtaskAllContainer.innerHTML += `<div id="onlySubtasks"></div>`;
  // let onlySubtasks = document.getElementById("onlySubtasks");
  document.getElementById("big-edit-task-subtask-container").innerHTML = "";
  if (subtaskArray && subtaskArray.length >= 1) {
    for (let i = 0; i < subtaskArray.length; i++) {
      let subtask = subtaskArray[i];
      document.getElementById("big-edit-task-subtask-container").innerHTML += renderSubtaskInPopUpContainer(i, subtask);
    }
  } else if (subtaskArray && subtaskArray.length == 0 && tasks[renderCurrentTaskId]["subtask"]) {
    // let subtasks = tasks[renderCurrentTaskId]["subtask"];
    // for (let i = 0; i < subtasks.length; i++) {
    //   let subtask = subtasks[i];
    //   document.getElementById("big-edit-task-subtask-container").innerHTML += renderSubtaskInPopUpContainer(i, subtask);
    // }
  } else if (!subtaskArray && !tasks[renderCurrentTaskId]["subtask"]) {
    // document.getElementById("big-edit-task-subtask-container").innerHTML += `<div class="noSubtaskMessage" id="noSubtaskMessage"><p>Aktuell sind keine Subtasks vorhanden.</p></div>`;
    document.getElementById("big-edit-task-subtask-container").innerHTML += "";
  }
}