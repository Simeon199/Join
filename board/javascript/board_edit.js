import * as feedbackAndUrgency from './feedbackAndUrgencyTemplate.js';
export * from './board_edit.js';

export function clearPopUp() {
  document.getElementById("big-edit-task-assigned-to-pop-up").innerHTML = "";
}

export function checkIfAssigned(contact, taskIndex) {
  return tasks[taskIndex].assigned.some((assignedContact) => assignedContact.name === contact.name);
}

export function renderContact(contact, contactIndex, taskIndex, isAssigned) {
  let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: isAssigned });
  if (isAssigned) {
    renderOnlyActiveAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
  } else {
    renderOnlyAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
  }
}

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

export function getInputValue(elementId) {
  return document.getElementById(elementId).value;
}

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

function addInputError(elementId) {
  document.getElementById(elementId).classList.add("big-task-pop-up-input-error");
}

function removeInputError(elementId) {
  document.getElementById(elementId).classList.remove("big-task-pop-up-input-error");
}

export function removeInputErrors() {
  removeInputError("big-task-pop-up-title");
  removeInputError("big-task-pop-up-due-date-container");
}

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

export async function processTaskEditing(id, taskForEditing) {
  let newTaskReady = await updateTasksThroughEditing(id, taskForEditing);
  let newJsonElement = JSON.stringify(newTaskReady);
  let newJsontextElement = encodeURIComponent(newJsonElement);
  renderBigTask(newJsontextElement);
}

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

export function savePriorityValue(priority) {
  priorityValue = priority;
  return priorityValue;
}

export async function updateTasksThroughEditing(taskId, objectForEditing) {
  let task = tasks[taskId];
  let updatedTask = await updateTask(task, taskId, objectForEditing);
  checkBoxCheckedJson = {};
  return updatedTask;
}

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

export async function saveTaskWithCatch(task) {
  try {
    await saveTaskToFirebase(task);
  } catch (error) {
    console.error("Fehler beim Hochladen der Daten: ", error);
  }
}

export async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

export function checkCategoryColor(category) {
  if (category === "User Story") {
    return "#0038FF";
  } else if (category === "Technical Task") {
    return "#1FD7C1";
  } else {
    return "#42526e";
  }
}

export function checkPriorityIcon(priorityText) {
  if (priorityText === "urgent") {
    return feedbackAndUrgency.generateHTMLUrgencyUrgent();
  } else if (priorityText === "medium") {
    return feedbackAndUrgency.generateHTMLUrgencyMedium();
  } else if (priorityText === "low") {
    return feedbackAndUrgency.generateHTMLUrgencyLow();
  }
}

export function clearCategoryContainer(categoryContainer) {
  document.getElementById(categoryContainer).innerHTML = "";
}

export function handleNoTasksInCategory(categoryContainer) {
  let oppositeElementName = "no-" + categoryContainer;
  let oppositeElement = getRightOppositeElement(oppositeElementName);
  document.getElementById(categoryContainer).innerHTML = oppositeElement;
}

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

export function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}

export function getInitials(name) {
  let nameArray = name.trim().split(" ");
  let initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
  return initials;
}