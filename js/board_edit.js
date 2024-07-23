function editSubtaskPopUpInput(i) {
  insertSubtasksIntoContainer();
  container = document.getElementById(`subtaskNumber${i}`);
  container.onmouseover = null;
  container.onmouseout = null;
  container.innerHTML = returnSubtaskEditedPopUpHTMLContainer(i);
}

function editPopUpSearchContacts(taskIndex) {
  let searchValue = getSearchValue();
  let searchedUsers = filterUsersByName(searchValue);
  clearPopUp();

  searchedUsers.forEach((contact) => {
    let contactIndex = findUserIndex(contact);
    let isAssigned = checkIfAssigned(contact, taskIndex);

    renderContact(contact, contactIndex, taskIndex, isAssigned);
  });
}

function getSearchValue() {
  return document.getElementById("big-edit-task-assigned-to-input").value.trim().toLowerCase();
}

function filterUsersByName(searchValue) {
  return allUsers.filter((user) => user.name.toLowerCase().startsWith(searchValue));
}

function clearPopUp() {
  document.getElementById("big-edit-task-assigned-to-pop-up").innerHTML = "";
}

function findUserIndex(contact) {
  return allUsers.findIndex((user) => user.name === contact.name);
}

function checkIfAssigned(contact, taskIndex) {
  return tasks[taskIndex].assigned.some((assignedContact) => assignedContact.name === contact.name);
}

function renderContact(contact, contactIndex, taskIndex, isAssigned) {
  let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: isAssigned });
  if (isAssigned) {
    renderOnlyActiveAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
  } else {
    renderOnlyAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
  }
}

function closeSubtaskContainer() {
  // let bigSubtaskContainer = document.getElementById("big-edit-task-subtask-container");
  // bigSubtaskContainer.classList.add("d-none");
}

function saveEditedSubtaskPopUp(i) {
  let text = document.getElementById(`subtaskEditedPopUp`).value;
  if (text == "") {
    markFalseEditSubtaskInput(`subtaskEditedPopUp`, i);
  } else {
    subtaskArray[i]["task-description"] = text;
    insertSubtasksIntoContainer();
  }
}

function markFalseEditSubtaskInput(inputString, i) {
  let subtaskContainer = document.getElementById(`big-task-pop-up-subtask-all`);
  subtaskContainer.innerHTML += returnMessageFalseInputValueHTML();
}

function deleteSubtaskPopUp(i) {
  subtaskArray.splice(i, 1);
  insertSubtasksIntoContainer();
}

async function getSubtaskFromDataBase(id) {
  let oldTaskAll = await loadRelevantData(`/testRealTasks/${id}`);
  if (oldTaskAll.subtask) {
    return oldTaskAll.subtask;
  } else {
    let subtaskArray = [];
    return subtaskArray;
  }
}

async function saveTaskChanges(id) {
  let newTitle = getInputValue("big-edit-task-title-input");
  let newDescription = getInputValue("big-edit-task-description-input");
  let newDate = getInputValue("big-edit-task-due-date-input");
  if (validateInputs(newTitle, newDate)) {
    showBoardLoadScreen();
    removeInputErrors();
    let taskForEditing = createTaskObject(newTitle, newDescription, newDate);
    try {
      await processTaskEditing(id, taskForEditing);
    } catch (error) {
      console.error("Fehler beim Speichern der Änderungen: ", error);
    }
    resetSubtasks();
    updateHTML();
    hideBoardLoadScreen();
  }
}

function getInputValue(elementId) {
  return document.getElementById(elementId).value;
}

function validateInputs(title, date) {
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

function removeInputErrors() {
  removeInputError("big-task-pop-up-title");
  removeInputError("big-task-pop-up-due-date-container");
}

function createTaskObject(title, description, date) {
  return {
    newTitle: title,
    newDescription: description,
    newDate: date,
    newPriority: priorityValue,
    newAssignedTo: assignedToContactsBigContainer,
    newSubtaskArray: subtaskArray,
  };
}

async function processTaskEditing(id, task) {
  let newTaskReady = await updateTasksThroughEditing(id, task);
  let newJsonElement = JSON.stringify(newTaskReady);
  let newJsontextElement = encodeURIComponent(newJsonElement);
  renderBigTask(newJsontextElement);
}

function resetSubtasks() {
  subtaskArray = [];
  checkBoxCheckedJson = {};
}

async function saveSubtaskChanges(id) {
  let task = tasks[id];
  let taskForEditing = createTaskForEditing(task);

  try {
    await processTaskEditing(id, taskForEditing);
  } catch (error) {
    // console.error("Fehler beim Speichern der Änderungen: ", error);
  }

  resetSubtasks();
  updateHTML();
}

function createTaskForEditing(task) {
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

async function processTaskEditing(id, taskForEditing) {
  let newTaskReady = await updateTasksThroughEditing(id, taskForEditing);
  let newJsonElement = JSON.stringify(newTaskReady);
  let newJsontextElement = encodeURIComponent(newJsonElement);
  renderBigTask(newJsontextElement);
}

function resetSubtasks() {
  subtaskArray = [];
  checkBoxCheckedJson = {};
}

function checkBigEditTaskPriority(priority) {
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

function savePriorityValue(priority) {
  priorityValue = priority;
  return priorityValue;
}

function saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category) {
  tasks[taskId] = {
    assigned: objectForEditing["newAssignedTo"],
    category: category,
    container: container,
    date: objectForEditing["newDate"],
    description: objectForEditing["newDescription"],
    priority: objectForEditing["newPriority"],
    tasksIdentity: taskId,
    title: objectForEditing["newTitle"],
    subtask: objectForEditing["newSubtaskArray"],
  };
  let newTask = tasks[taskId];
  assignedToContactsBigContainer = [];
  return newTask;
}

function saveChangesSingleTaskWithoutSubtask(taskId, objectForEditing, container, category) {
  tasks[taskId] = {
    assigned: objectForEditing["newAssignedTo"],
    category: category,
    container: container,
    date: objectForEditing["newDate"],
    description: objectForEditing["newDescription"],
    priority: objectForEditing["newPriority"],
    tasksIdentity: taskId,
    title: objectForEditing["newTitle"],
  };
  let newTask = tasks[taskId];
  assignedToContactsBigContainer = [];
  return newTask;
}

async function updateTasksThroughEditing(taskId, objectForEditing) {
  console.log(taskId);
  let task = tasks[taskId];
  let updatedTask = await updateTask(task, taskId, objectForEditing);
  checkBoxCheckedJson = {};
  return updatedTask;
}

async function updateTask(task, taskId, objectForEditing) {
  let container = task.container;
  let category = task.category;

  tasks[taskId] =
    task.subtask || subtaskArray != null
      ? saveChangesWithSubtask(taskId, objectForEditing, container, category)
      : saveChangesWithoutSubtask(taskId, objectForEditing, container, category);

  await saveTaskWithCatch(tasks[taskId]);

  return tasks[taskId];
}

async function saveTaskWithCatch(task) {
  try {
    await saveTaskToFirebase(task);
  } catch (error) {
    console.error("Fehler beim Hochladen der Daten: ", error);
  }
}

function saveChangesWithSubtask(taskId, objectForEditing, container, category) {
  return saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category);
}

function saveChangesWithoutSubtask(taskId, objectForEditing, container, category) {
  return saveChangesSingleTaskWithoutSubtask(taskId, objectForEditing, container, category);
}

// deleteData
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

// checkCategoryColor
function checkCategoryColor(category) {
  if (category === "User Story") {
    return "#0038FF";
  } else if (category === "Technical Task") {
    return "#1FD7C1";
  } else {
    return "#42526e";
  }
}

// checkPriorityIcon
function checkPriorityIcon(priorityText) {
  if (priorityText === "urgent") {
    return generateHTMLUrgencyUrgent();
  } else if (priorityText === "medium") {
    return generateHTMLUrgencyMedium();
  } else if (priorityText === "low") {
    return generateHTMLUrgencyLow();
  }
}

// checkIfTitleContainsSearchedInput
function searchForTasks() {
  let searchValue = document.getElementById("search-input").value.trim().toLowerCase();
  searchedTasks = [];
  for (i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    if (task.title.toLowerCase().includes(searchValue) || task.description.toLowerCase().includes(searchValue)) {
      searchedTasks.push(task);
    }
  }
  renderSearchedTasks();
}

function renderSearchedTasks() {
  allCategories.forEach((categoryContainer) => {
    clearCategoryContainer(categoryContainer);
    let tasksInCategory = filterTasksByCategory(categoryContainer, searchedTasks);
    if (tasksInCategory.length === 0) {
      handleNoTasksInCategory(categoryContainer);
    } else if (searchedTasks.length < tasks.length) {
      renderTasksInCategory(tasksInCategory, categoryContainer);
    } else {
      updateHTML();
    }
  });
}

function clearCategoryContainer(categoryContainer) {
  document.getElementById(categoryContainer).innerHTML = "";
}

function filterTasksByCategory(categoryContainer, tasks) {
  return tasks.filter((task) => task.container === categoryContainer);
}

function handleNoTasksInCategory(categoryContainer) {
  let oppositeElementName = "no-" + categoryContainer;
  let oppositeElement = getRightOppositeElement(oppositeElementName);
  document.getElementById(categoryContainer).innerHTML = oppositeElement;
}

function renderTasksInCategory(tasks, categoryContainer) {
  tasks.forEach((task) => {
    if (categoryContainer === task.container) {
      let jsonElement = JSON.stringify(task);
      let rightIcon = insertCorrectUrgencyIcon(task);
      let variableClass = setVariableClass(task);
      let oppositeCategory = "no-" + task.container;
      let contactsHTML = generateContactsHTML(task);
      document.getElementById(categoryContainer).innerHTML += generateTaskHTML(task, contactsHTML, oppositeCategory, rightIcon, jsonElement);
    }
  });
}

function generateContactsHTML(task) {
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

// taskMarker
function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}

function getInitials(name) {
  let nameArray = name.trim().split(" ");
  let initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
  return initials;
}
