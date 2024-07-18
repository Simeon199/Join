function editSubtaskPopUpInput(i) {
  insertSubtasksIntoContainer();
  container = document.getElementById(`subtaskNumber${i}`);
  container.onmouseover = null;
  container.onmouseout = null;
  container.innerHTML = returnSubtaskEditedPopUpHTMLContainer(i);
}

function returnSubtaskEditedPopUpHTMLContainer(i) {
  return `<input id="subtaskEditedPopUp" type="text" value="${subtaskArray[i]["task-description"]}">
      <div class="edit-popup-subtask-icon-container">
        <svg  onclick="deleteSubtaskPopUp(${i}), stopEvent(event)" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
        </svg>

        <div class="subtaskBorder"></div>

        <svg onclick="saveEditedSubtaskPopUp(${i}), stopEvent(event), closeSubtaskContainer()" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.69474 9.15L14.1697 0.675C14.3697 0.475 14.6072 0.375 14.8822 0.375C15.1572 0.375 15.3947 0.475 15.5947 0.675C15.7947 0.875 15.8947 1.1125 15.8947 1.3875C15.8947 1.6625 15.7947 1.9 15.5947 2.1L6.39474 11.3C6.19474 11.5 5.96141 11.6 5.69474 11.6C5.42807 11.6 5.19474 11.5 4.99474 11.3L0.694738 7C0.494738 6.8 0.398905 6.5625 0.407238 6.2875C0.415572 6.0125 0.519738 5.775 0.719738 5.575C0.919738 5.375 1.15724 5.275 1.43224 5.275C1.70724 5.275 1.94474 5.375 2.14474 5.575L5.69474 9.15Z" fill="#2A3647"/>
        </svg>

      </div>
    `;
}

function editPopUpSearchContacts(taskIndex) {
  let searchValue = document.getElementById("big-edit-task-assigned-to-input").value.trim().toLowerCase();
  searchedUsers = [];
  for (i = 0; i < allUsers.length; i++) {
    let user = allUsers[i];
    if (user.name.toLowerCase().startsWith(searchValue)) {
      searchedUsers.push(user);
    }
  }
  document.getElementById("big-edit-task-assigned-to-pop-up").innerHTML = "";
  for (let i = 0; i < searchedUsers.length; i++) {
    const contact = searchedUsers[i];
    let contactIndex = allUsers.findIndex((user) => user.name === contact.name);

    let allNames = [];

    for (let j = 0; j < tasks[taskIndex].assigned.length; j++) {
      const assignedContact = tasks[taskIndex].assigned[j];
      if (contact.name === tasks[taskIndex].assigned[j].name) {
        let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: true });
        renderOnlyActiveAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
        allNames.push(contact.name);
      }
    }
    if (!allNames.includes(contact.name)) {
      let contactObject = JSON.stringify({ name: contact.name, color: contact.color, isSelected: false });
      renderOnlyAssignedToPopUp(contact, contactObject, contactIndex, taskIndex);
      allNames.push(contact.name);
    }
  }
}

function closeSubtaskContainer() {
  let bigSubtaskContainer = document.getElementById("big-edit-task-subtask-container");
  bigSubtaskContainer.classList.add("d-none");
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

function returnMessageFalseInputValueHTML() {
  return `<div class="messageFalseInputValue">
    <p>Leerer Subtask kann nicht abgespeichert werden. Bitte geben Sie einen gültigen Inhalt ein!</p>
  <div>`;
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
  let newTitle = document.getElementById("big-edit-task-title-input").value;
  let newDescription = document.getElementById("big-edit-task-description-input").value;
  let newDate = document.getElementById("big-edit-task-due-date-input").value;
  if (newTitle === "" && newDate === "") {
    document.getElementById("big-task-pop-up-title").classList.add("big-task-pop-up-input-error");
    document.getElementById("big-task-pop-up-due-date-container").classList.add("big-task-pop-up-input-error");
  } else if (newTitle === "") {
    document.getElementById("big-task-pop-up-title").classList.add("big-task-pop-up-input-error");
    document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-task-pop-up-input-error");
  } else if (newDate === "") {
    document.getElementById("big-task-pop-up-due-date-container").classList.add("big-task-pop-up-input-error");
    document.getElementById("big-task-pop-up-title").classList.remove("big-task-pop-up-input-error");
  } else {
    showBoardLoadScreen();

    document.getElementById("big-task-pop-up-title").classList.remove("big-task-pop-up-input-error");
    document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-task-pop-up-input-error");

    let newPriority = priorityValue;
    let newAssignedTo = assignedToContactsBigContainer;
    let newSubtaskArray = subtaskArray;
    let taskForEditing = {
      newTitle: newTitle,
      newDescription: newDescription,
      newDate: newDate,
      newPriority: newPriority,
      newAssignedTo: newAssignedTo,
      newSubtaskArray: newSubtaskArray,
    };
    try {
      let newTaskReady = await updateTasksThroughEditing(id, taskForEditing);
      let newJsonElement = JSON.stringify(newTaskReady);
      let newJsontextElement = encodeURIComponent(newJsonElement);
      renderBigTask(newJsontextElement);
    } catch (error) {
      console.error("Fehler beim Speichern der Änderungen: ", error);
    }
    subtaskArray = [];
    checkBoxCheckedJson = {};
    updateHTML();

    hideBoardLoadScreen();
  }
}

async function saveSubtaskChanges(id) {
  let task = tasks[id];
  let newTitle = task.title;
  let newDescription = task.description;
  let newDate = task.date;
  let newPriority = task.priority;
  let newSubtaskArray = task.subtask;
  let taskForEditing = {};

  if (task.assigned) {
    let newAssignedTo = task.assigned;

    taskForEditing = {
      newTitle: newTitle,
      newDescription: newDescription,
      newDate: newDate,
      newPriority: newPriority,
      newAssignedTo: newAssignedTo,
      newSubtaskArray: newSubtaskArray,
    };
  } else {
    taskForEditing = {
      newTitle: newTitle,
      newDescription: newDescription,
      newDate: newDate,
      newPriority: newPriority,
      newSubtaskArray: newSubtaskArray,
    };
  }
  try {
    let newTaskReady = await updateTasksThroughEditing(id, taskForEditing);
    let newJsonElement = JSON.stringify(newTaskReady);
    let newJsontextElement = encodeURIComponent(newJsonElement);
    renderBigTask(newJsontextElement);
  } catch (error) {
    // console.error("Fehler beim Speichern der Änderungen: ", error);
  }
  subtaskArray = [];
  checkBoxCheckedJson = {};
  updateHTML();
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
  for (let index = 0; index < tasks.length; index++) {
    if (index == taskId) {
      let container = tasks[taskId]["container"];
      let category = tasks[taskId]["category"];
      if (tasks[taskId]["subtask"]) {
        tasks[taskId] = saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category);
      } else if (!tasks[taskId]["subtask"] && subtaskArray != null) {
        tasks[taskId] = saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category);
      } else {
        tasks[taskId] = saveChangesSingleTaskWithoutSubtask(taskId, objectForEditing, container, category);
      }
      try {
        await saveTaskToFirebase(tasks[taskId]);
      } catch (error) {
        console.error("Fehler beim Hochladen der Daten: ", error);
      }
      return tasks[taskId];
    }
  }
  checkBoxCheckedJson = {};
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
  allCategories.forEach(categoryContainer => {
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
  return tasks.filter(task => task.container === categoryContainer);
}

function handleNoTasksInCategory(categoryContainer) {
  let oppositeElementName = "no-" + categoryContainer;
  let oppositeElement = getRightOppositeElement(oppositeElementName);
  document.getElementById(categoryContainer).innerHTML = oppositeElement;
}

function renderTasksInCategory(tasks, categoryContainer) {
  tasks.forEach(task => {
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
