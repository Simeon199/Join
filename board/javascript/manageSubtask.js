function renderSubtask(taskJson) {
    let correctTaskId = taskJson.tasksIdentity;
    let container = document.getElementById("big-task-pop-up-subtasks-container");
  
    if (taskJson.subtask && taskJson.subtask.length > 0) {
      renderSubtasks(taskJson.subtask, correctTaskId, container);
    } else {
      renderNoSubtasksMessage(container);
    }
}

function renderSubtasks(subtasks, taskId, container) {
    subtasks.forEach((subtask, index) => {
      container.innerHTML += subtask["is-tasked-checked"]
        ? returnSubtaskHTMLWithBolean(taskId, subtask, index)
        : returnSubtaskHTML(taskId, subtask, index);
    });
}

function renderNoSubtasksMessage(container) {
    container.innerHTML = /*html*/ `
      <p class='big-task-pop-up-value-text'>No Subtasks</p>
    `;
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

function resetSubtaskInput() {
    document.getElementById("big-edit-task-subtask-input").value = "";
    changeSubtaskInputIcons();
}

function buildSubtaskArrayForUpload() {
    if (!subtaskArray) {
      subtaskArray = emptyList;
    }
    let subtaskInput = document.getElementById("big-edit-task-subtask-input");
    if (subtaskInput.value.trim().length > 0) {
      let subtaskJson = createSubtaskJson(subtaskInput.value);
  
      subtaskArray.push(subtaskJson);
      insertSubtasksIntoContainer();
      subtaskInput.value = "";
    }
}

function editSubtaskPopUpInput(i) {
    insertSubtasksIntoContainer();
    container = document.getElementById(`subtaskNumber${i}`);
    container.onmouseover = null;
    container.onmouseout = null;
    container.innerHTML = returnSubtaskEditedPopUpHTMLContainer(i);
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
    }
    resetSubtasks();
    updateHTML();
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

function saveChangesWithSubtask(taskId, objectForEditing, container, category) {
    return saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category);
}

function saveChangesWithoutSubtask(taskId, objectForEditing, container, category) {
    return saveChangesSingleTaskWithoutSubtask(taskId, objectForEditing, container, category);
}

function bigEditTaskSubtaskInputCheckEnter(event) {
    if (event.key === "Enter") {
      buildSubtaskArrayForUpload();
    }
}

function setupSubtaskArray(taskJson) {
    subtaskArray = taskJson.subtask || [];
    taskJson.subtask = subtaskArray;
  }