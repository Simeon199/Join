/**
 * This function performs the following actions:
 * - Checks the screen width to determine whether to show the pop-up or redirect the user:
 * - If the screen width is 600 pixels or less, it redirects the user to `add_task.html`.
 * - If the screen width is greater than 600 pixels, it displays the pop-up:
 * - Disables page scrolling by setting the `overflow` style of the body to `"hidden"`.
 * - Reveals the background and pop-up elements by removing specific CSS classes.
 * - Sets the `standardContainer` variable to the provided `container` parameter.
 * 
 * @param {string} [container="to-do-container"] - The ID of the container where the pop-up should be displayed. Default value is "to-do-container".
 */

function showAddTaskPopUp(container = "to-do-container") {
    const screenWidth = window.screen.width;
    if (screenWidth <= 600) {
      window.location = "add_task.html";
    } else {
      document.body.style.overflow = "hidden";
      document.getElementById("add-task-pop-up-bg").classList.remove("bg-op-0");
      document.getElementById("add-task-pop-up").classList.remove("translate-100");
      standardContainer = container;
      initAddTaskIcons();
    }
}


/**
 * This function hides the "Add Task" pop-up and restores page scrolling thereby performing the following actions:
 * - Restores the default page scrolling behavior by setting the `overflow` style of the body to `"unset"`.
 * - Hides the background overlay of the pop-up by adding the `bg-op-0` class to the element with the ID `add-task-pop-up-bg`.
 * - Moves the pop-up out of view by adding the `translate-100` class to the element with the ID `add-task-pop-up`.
 * 
 */

function hideAddTaskPopUp() {
    document.body.style.overflow = "unset";
    document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
    document.getElementById("add-task-pop-up").classList.add("translate-100");
}

/**
 * This function displays the "Big Task" pop-up and renders the task content performing the following actions in the process:
 * - Sets the `isBigTaskPopUpOpen` variable to `true` to indicate that the pop-up is open.
 * - Reveals the background overlay for the pop-up by removing the `bg-op-0` class from the element with the ID `big-task-pop-up-bg`.
 * - Makes the pop-up visible by removing the `translate-100` class from the element with the ID `big-task-pop-up`.
 * - Disables page scrolling by setting the `overflow` style of the body to `"hidden"`.
 * - Calls the `renderBigTask()` function with the provided `jsonTextElement` to display the task content within the pop-up.
 * 
 * @param {string} jsonTextElement - A JSON string representing the task content to be rendered in the "Big Task" pop-up.
 */

function showBigTaskPopUp(jsonTextElement) {
    isBigTaskPopUpOpen = true;
    document.getElementById("big-task-pop-up-bg").classList.remove("bg-op-0");
    document.getElementById("big-task-pop-up").classList.remove("translate-100");
    document.body.style.overflow = "hidden";
    renderBigTask(jsonTextElement);
}

/**
 * This function hides the "Big Task" pop-up and restores page scrolling performing the following actions in the process:
 * - Sets the `isBigTaskPopUpOpen` variable to `false` to indicate that the pop-up is closed.
 * - Removes error styling from the title and due date input fields by removing the `big-task-pop-up-input-error` class from their respective elements.
 * - Hides the background overlay of the pop-up by adding the `bg-op-0` class to the element with the ID `big-task-pop-up-bg`.
 * - Moves the pop-up out of view by adding the `translate-100` class to the element with the ID `big-task-pop-up`.
 * - Restores page scrolling by setting the `overflow` style of the body to `"unset"`.
 * - If an element with the ID `big-task-pop-up-title-text` exists, retrieves its inner HTML to find the corresponding task index, and then saves any changes to the subtask using `saveSubtaskChanges()`.
 * 
 */

function hideBigTaskPopUp() {
    isBigTaskPopUpOpen = false;
    document.getElementById("big-task-pop-up-title").classList.remove("big-task-pop-up-input-error");
    document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-task-pop-up-input-error");
    document.getElementById("big-task-pop-up-bg").classList.add("bg-op-0");
    document.getElementById("big-task-pop-up").classList.add("translate-100");
    document.body.style.overflow = "unset";
    if (document.getElementById("big-task-pop-up-title-text")) {
      let title = document.getElementById("big-task-pop-up-title-text").innerHTML;
      let id = tasks.findIndex((task) => task.title === title);
      saveSubtaskChanges(id);
    }
}

/**
 * Renders the content of the "Big Task" pop-up based on the provided task data thus performing the following actions:
 * 1. Parses the provided `jsonTextElement` (a JSON string) to extract task details.
 * 2. Updates various elements of the "Big Task" pop-up with the task data:
 *    - Removes specific CSS classes from the priority and due date containers.
 *    - Sets the title and description of the task.
 *    - Updates the due date container, category, and category background color.
 *    - Updates the priority container and icon.
 *    - Sets the HTML for the bottom buttons (e.g., delete and edit).
 *    - Renders assigned names, subtasks, and task contacts.
 * 
 * @param {string} jsonTextElement - A JSON string representing the task data to be rendered in the "Big Task" pop-up.
 * @param {Object} jsonTextElement.title - The title of the task.
 * @param {Object} jsonTextElement.description - The description of the task.
 * @param {Object} jsonTextElement.date - The due date of the task.
 * @param {Object} jsonTextElement.category - The category of the task.
 * @param {Object} jsonTextElement.priority - The priority level of the task.
 * @param {Object} jsonTextElement.tasksIdentity - The unique identifier of the task.
 */

function renderBigTask(jsonTextElement) {
    let taskJson = JSON.parse(decodeURIComponent(jsonTextElement));
    removeEditClasses();
    setBigTaskPopUpElements(taskJson);
    renderBigTaskAdditional(taskJson, jsonTextElement);
}

/**
 * Removes edit-related CSS classes from priority and due date containers.
 */
function removeEditClasses() {
    document.getElementById("big-task-pop-up-priority-container").classList.remove("big-edit-task-pop-up-section-container");
    document.getElementById("big-task-pop-up-due-date-container").classList.remove("big-edit-task-pop-up-section-container");
}

/**
 * Sets the basic elements of the big task pop-up.
 * 
 * @param {Object} taskJson - The task data object.
 */
function setBigTaskPopUpElements(taskJson) {
    document.getElementById("big-task-pop-up-title").innerHTML = /*html*/ `<h1 id='big-task-pop-up-title-text'>${taskJson.title}</h1>`;
    document.getElementById("big-task-pop-up-description").innerHTML = taskJson.description;
    returnHTMLBigTaskPopUpDueDateContainerContent(taskJson.date);
    document.getElementById("big-task-pop-up-category").innerHTML = taskJson.category;
    document.getElementById("big-task-pop-up-category").style.backgroundColor = checkCategoryColor(taskJson.category);
    returnHTMLBigTaskPopUpPriorityContainer(taskJson.priority);
    document.getElementById("big-task-pop-up-priority-icon").innerHTML = checkPriorityIcon(taskJson.priority);
}

/**
 * Renders additional elements for the big task pop-up.
 * 
 * @param {Object} taskJson - The task data object.
 * @param {string} jsonTextElement - The JSON string of the task.
 */
function renderBigTaskAdditional(taskJson, jsonTextElement) {
    document.getElementById("big-task-pop-up-bottom-buttons-container").innerHTML = returnDeleteEditHTML(taskJson.tasksIdentity, jsonTextElement);
    renderCorrectAssignedNamesIntoBigTask(taskJson);
    returnHTMLBigTaskPopUpSubtaskAll();
    renderTaskContact(taskJson);
    renderSubtask(taskJson);
}

/**
 * Renders the complete "Big Task" pop-up with updated details and subtask information performing the following actions in the process:
 * - Sets up the subtask array for the task using the provided `taskJson` and `id`.
 * - Renders the pop-up elements such as title, description, date, and priority based on the provided old values and `id`.
 * - Renders the detailed information of the big task, including priority and `id`, based on the provided `taskJson`.
 * 
 * @param {string} oldTitle - The previous title of the task to be used in rendering.
 * @param {string} oldDescription - The previous description of the task to be used in rendering.
 * @param {string} oldDate - The previous due date of the task to be used in rendering.
 * @param {string} oldPriority - The previous priority level of the task to be used in rendering.
 * @param {Object} taskJson - The JSON object containing updated task details.
 * @param {string} id - The unique identifier of the task.
 */

function renderAllBigPopUp(oldTitle, oldDescription, oldDate, oldPriority, taskJson, id) {
    setupSubtaskArray(taskJson, id);
    renderPopUpElements(oldTitle, oldDescription, oldDate, oldPriority, id);
    renderBigTaskDetails(taskJson, oldPriority, id);
}

/**
 * This function renders elements of the "Big Task" pop-up with the provided old values performing the following actions in the process:
 * - Setting the title of the pop-up using the provided `oldTitle`.
 * - Setting the description of the pop-up using the provided `oldDescription`.
 * - Rendering the due date section of the pop-up using the provided `oldDate` and the `returnBigTaskPopUpDueDateContainer` function.
 * - Rendering the priority section of the pop-up using the provided `oldPriority` and the `returnBigTaskPopUpPriorityContainer` function.
 * - Setting the global `priorityValue` to the provided `oldPriority`.
 * - Activating the priority element in the pop-up by adding the corresponding CSS class.
 * 
 * @param {string} oldTitle - The previous title of the task.
 * @param {string} oldDescription - The previous description of the task.
 * @param {string} oldDate - The previous due date of the task.
 * @param {string} oldPriority - The previous priority level of the task.
 * @param {string} id - The unique identifier of the task.
 */

function renderPopUpElements(oldTitle, oldDescription, oldDate, oldPriority, id) {
    returnBigTaskPopUpTitle(oldTitle);
    returnBigTaskPopUpDescription(oldDescription);
    renderBigTaskPopUpSection("big-task-pop-up-due-date-container", oldDate, returnBigTaskPopUpDueDateContainer);
    renderBigTaskPopUpSection("big-task-pop-up-priority-container", oldPriority, returnBigTaskPopUpPriorityContainer);
    priorityValue = oldPriority;
    document
      .getElementById("big-edit-task-" + oldPriority.toLowerCase() + "-priority")
      .classList.add("big-edit-task-" + oldPriority.toLowerCase() + "-priority-aktiv");
}

/**
 * This function renders a section of the "Big Task" pop-up by adding a specific CSS class and calling the render function "renderFunction(value)".
 * 
 * @param {string} containerId - The ID of the container element to be updated.
 * @param {string} value - The value to be passed to the `renderFunction`.
 * @param {function} renderFunction - The function to be called to render the content of the section.
 */

function renderBigTaskPopUpSection(containerId, value, renderFunction) {
    document.getElementById(containerId).classList.add("big-edit-task-pop-up-section-container");
    renderFunction(value);
}

/**
 * This function renders detailed information for the "Big Task" pop-up performing the following actions in the process:
 * - Rendering all contact elements for the "Big Task" pop-up using the task ID.
 * - Rendering all subtask elements for the "Big Task" pop-up.
 * - Rendering the assigned contact container using the provided `taskJson`.
 * - Rendering the assigned contacts in the edit pop-up using the provided `taskJson`.
 * - Rendering the edit buttons for the "Big Task" pop-up using the task ID.
 * 
 * @param {Object} taskJson - The JSON object containing the task details.
 * @param {oldPriority} - The former priority of the task.
 * @param {string} id - The unique identifier of the task.
 */

function renderBigTaskDetails(taskJson, oldPriority, id) {
    returnBigTaskPopUpContactAll(id);
    returnBigTaskPopUpSubtasksAll();
    renderBigTaskAssignedContactContainer(taskJson);
    renderBigEditTaskAssignedToPopUp(taskJson);
    returnBigPopUpEditButtons(id);
}

/**
 * This function iterates through the provided tasks and checks if each task belongs to 
 * the given category container. For each task that matches, it generates the appropriate 
 * HTML and updates the container's inner HTML.
 *
 * @param {Array<Object>} tasks - An array of task objects to be rendered. 
 * @param {string} categoryContainer - The ID of the category container where the tasks will be rendered.
 */

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