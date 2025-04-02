/**
 * This function checks if the provided `taskJson` object contains subtasks. If subtasks are present, it calls `renderSubtasks` to display them. 
 * If there are no subtasks, it calls `renderNoSubtasksMessage` to show an appropriate message.
 *
 * @param {Object} taskJson - The JSON object representing the task.
 */

function renderSubtask(taskJson) {
    let correctTaskId = taskJson.tasksIdentity;
    let container = document.getElementById("big-task-pop-up-subtasks-container");
  
    if (taskJson.subtask && taskJson.subtask.length > 0) {
      renderSubtasks(taskJson.subtask, correctTaskId, container);
    } else {
      renderNoSubtasksMessage(container);
    }
}

/**
 * This function iterates over an array of subtasks and appends the appropriate HTML for each subtask to the provided container. 
 * The HTML rendered depends on whether the subtask's `is-tasked-checked` property is true or false.
 *
 * @param {Array<Object>} subtasks - An array of subtask objects to be rendered.
 * @param {string} taskId - The unique identifier for the task to which the subtasks belong.
 * @param {HTMLElement} container - The HTML element where the subtasks will be rendered.
 */

function renderSubtasks(subtasks, taskId, container) {
    subtasks.forEach((subtask, index) => {
      container.innerHTML += subtask["is-tasked-checked"]
        ? returnSubtaskHTMLWithBolean(taskId, subtask, index)
        : returnSubtaskHTML(taskId, subtask, index);
    });
}

/**
 * This function sets the inner HTML of the given container to display a message indicating that there are no subtasks available.
 *
 * @param {HTMLElement} container - The HTML element where the "No Subtasks" message will be rendered.
 */

function renderNoSubtasksMessage(container) {
    container.innerHTML = /*html*/ `
      <p class='big-task-pop-up-value-text'>No Subtasks</p>
    `;
}

/**
 * This asynchronous function iterates through the `subtasks` array and updates each subtask's `is-tasked-checked` property based on the corresponding value in the `checkBoxCheckedJson` object. 
 * After updating the subtasks, it assigns the modified array to a global `subtaskArray` variable and then saves the changes to Firebase.
 *
 * @param {string} correctTaskId - The unique identifier for the task to which the subtasks belong.
 * @param {Array<Object>} subtasks - An array of subtask objects that need to be updated.
 * @returns {Promise<void>} A promise that resolves when the subtasks have been saved to Firebase.
 */

async function depositSubtaskChanges(correctTaskId, subtasks) {
    for (index = 0; index < subtasks.length; index++) {
      if (checkBoxCheckedJson.hasOwnProperty(index)) {
        subtasks[index]["is-tasked-checked"] = checkBoxCheckedJson[index];
      }
    }
    subtaskArray = subtasks;
    await saveChangedSubtaskToFirebase(correctTaskId);
}

/**
 * Saves the updated subtasks to Firebase.
 *
 * @param {string} correctTaskId - The unique identifier for the task whose subtasks are being updated.
 * @returns {Promise<void>} A promise that resolves when the update operation is complete. Logs an error if the request fails.
 */

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

/**
 * Renders the subtask container in the task editing pop-up.
 *
 * @param {Object} taskJson - The JSON object representing the task.
 */

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

/**
 * This function sets the focus to the input field used for entering subtasks in the task editing interface. 
 * 
 */

function focusSubtaskInput() {
    document.getElementById("big-edit-task-subtask-input").focus();
}

/**
 * This function checks the value of the subtask input field. If the field is empty, it sets the icon container's inner HTML to display a "plus" icon using `returnSubtaskInputHTMLPlusIconSVG`. 
 * If the field contains text, it updates the icon container to display a "close" icon using `returnSubtaskInputHTMLCloseIcon`.
 * 
 */

function changeSubtaskInputIcons() {
    let subtaskInputIconContainer = document.getElementById("big-edit-task-subtask-input-icon-container");
    let subtaskInputValue = document.getElementById("big-edit-task-subtask-input");
    if (subtaskInputValue.value === "") {
      subtaskInputIconContainer.innerHTML = returnSubtaskInputHTMLPlusIconSVG();
    } else {
      subtaskInputIconContainer.innerHTML = returnSubtaskInputHTMLCloseIcon();
    }
}

/**
 * Resets the subtask input field and updates its associated icons.
 *
 */

function resetSubtaskInput() {
    document.getElementById("big-edit-task-subtask-input").value = "";
    changeSubtaskInputIcons();
}

/**
 * Builds and updates the subtask array for upload based on the current input field value.
 *
 */

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

/**
 * Enables editing of a specific subtask in the popup input container.
 *
 * @param {number} i - The index of the subtask to be edited.
 */

function editSubtaskPopUpInput(i) {
    insertSubtasksIntoContainer();
    container = document.getElementById(`subtaskNumber${i}`);
    container.onmouseover = null;
    container.onmouseout = null;
    container.innerHTML = returnSubtaskEditedPopUpHTMLContainer(i);
}

/**
 * This function retrieves the edited text from the subtask input field. If the input field is empty, it calls a function to mark the input as invalid. 
 * If the input is not empty, it updates the subtask array with the new text and refreshes the subtask container display.
 *
 * @param {number} i - The index of the subtask in the `subtaskArray` to be updated.
 */

function saveEditedSubtaskPopUp(i) {
    let text = document.getElementById(`subtaskEditedPopUp`).value;
    if (text == "") {
      markFalseEditSubtaskInput(`subtaskEditedPopUp`, i);
    } else {
      subtaskArray[i]["task-description"] = text;
      insertSubtasksIntoContainer();
    }
}

/**
 * Displays an error message for an invalid subtask input.
 *
 * @param {string} inputString - The ID of the input field that contains the edited subtask text.
 * @param {number} i - The index of the subtask being edited.
 */

function markFalseEditSubtaskInput(inputString, i) {
    let subtaskContainer = document.getElementById(`big-task-pop-up-subtask-all`);
    subtaskContainer.innerHTML += returnMessageFalseInputValueHTML();
}

/**
 * This function removes a subtask from the `subtaskArray` at the specified index and then updates the display of the subtask container to reflect the deletion.
 *
 * @param {number} i - The index of the subtask to be deleted from the `subtaskArray`.
 */

function deleteSubtaskPopUp(i) {
    subtaskArray.splice(i, 1);
    insertSubtasksIntoContainer();
}

/**
 * This asynchronous function fetches the task data from the database using the provided task ID. 
 * It checks if the retrieved task data contains subtasks. If subtasks are present, they are returned; otherwise, an empty array is returned.
 *
 * @param {string} id - The ID of the task for which subtasks are to be retrieved.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of subtasks. If no subtasks are found, it resolves to an empty array.
 */

async function getSubtaskFromDataBase(id) {
    let oldTaskAll = await loadRelevantData(`/testRealTasks/${id}`);
    if (oldTaskAll.subtask) {
      return oldTaskAll.subtask;
    } else {
      let subtaskArray = [];
      return subtaskArray;
    }
}

/**
 * This function clears the current subtask array and resets the checkbox status object. 
 * 
 */

function resetSubtasks() {
    subtaskArray = [];
    checkBoxCheckedJson = {};
}

/**
 * Saves the changes made to a task's subtasks and updates the user interface.
 *
 * @param {string} id - The ID of the task whose subtasks are being edited.
 */

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

/**
 * This function updates a task with new details including subtask information.
 *
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @param {Object} objectForEditing - An object containing the updated properties for the task. 
 * @param {string} container - The container associated with the task.
 * @param {string} category - The category of the task.
 * @returns {Object} The updated task object.
 */

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

/**
 * Updates a task with new details, excluding subtask information.
 *
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @param {Object} objectForEditing - An object containing the updated properties for the task. 
 * @param {string} container - The container associated with the task.
 * @param {string} category - The category of the task.
 * @returns {Object} The updated task object.
 */

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

/**
 * This function updates the task object with new details including subtask information. It uses the `saveChangesSingleTaskWithSubtask` function to perform the update.
 *
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @param {Object} objectForEditing - An object containing the new details for the task.
 * @param {string} container - The identifier of the container where the task is displayed.
 * @param {string} category - The category of the task.
 * @returns {Object} The updated task object including subtask information.
 */

function saveChangesWithSubtask(taskId, objectForEditing, container, category) {
    return saveChangesSingleTaskWithSubtask(taskId, objectForEditing, container, category);
}

/**
 * This function updates the task object with new details but excludes any subtask information. It uses the `saveChangesSingleTaskWithoutSubtask` function to perform the update.
 *
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @param {Object} objectForEditing - An object containing the new details for the task.
 * @param {string} container - The identifier of the container where the task is displayed.
 * @param {string} category - The category of the task.
 * @returns {Object} The updated task object excluding subtask information.
 */

function saveChangesWithoutSubtask(taskId, objectForEditing, container, category) {
    return saveChangesSingleTaskWithoutSubtask(taskId, objectForEditing, container, category);
}

/**
 * This functions checks if the Enter key is pressed in the big task edit subtask input field and triggers the subtask array build thus performing the following actions:
 * - Listen for a key event in the big task edit subtask input field.
 * - If the Enter key is pressed, it calls the function to build the subtask array for upload.
 * 
 * @param {KeyboardEvent} event - The key event triggered by the user.
 */

function bigEditTaskSubtaskInputCheckEnter(event) {
    if (event.key === "Enter") {
      buildSubtaskArrayForUpload();
    }
}

/**
 * This function initializes the subtask array for a task based on the provided task JSON performing the following actions in the process:
 * - Sets the `subtaskArray` variable to the `subtask` property of the provided `taskJson` object, or initializes it as an empty array if `taskJson.subtask` is undefined or null.
 * - Updates the `subtask` property of `taskJson` to ensure it is always set to the `subtaskArray`.
 * 
 * @param {Object} taskJson - The JSON object representing the task, which includes the `subtask` property.
 */

function setupSubtaskArray(taskJson) {
    subtaskArray = taskJson.subtask || [];
    taskJson.subtask = subtaskArray;
  }