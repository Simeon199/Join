/**
 * This function retrieves the search value from the input field and filters the users by name based on this value. 
 * It then iterates over the filtered users, rendering each contact in the popup.
 *
 * @param {number} taskIndex - The index of the task for which contacts are being edited.
 */

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

/**
 * This function gets the value from the "big-edit-task-assigned-to-input" field, trims any leading or trailing whitespace, and converts it to lowercase. 
 * The resulting string is used for searching contacts.
 *
 * @returns {string} The trimmed and lowercased search value.
 */

function getSearchValue() {
    return document.getElementById("big-edit-task-assigned-to-input").value.trim().toLowerCase();
}

/**
 * This function filters the `allUsers` array to include only those users whose names start with the given search value.
 *
 * @param {string} searchValue - The search value used to filter the users.
 * @returns {Array<Object>} An array of user objects whose names match the search criteria.
 */

function filterUsersByName(searchValue) {
    return allUsers.filter((user) => user.name.toLowerCase().startsWith(searchValue));
}

/**
 * Finds the index of a user in the allUsers array based on their name.
 *
 * @param {Object} contact - The contact object containing the name to search for.
 * @returns {number} The index of the user in the allUsers array, or -1 if its not found.
 */

function findUserIndex(contact) {
    return allUsers.findIndex((user) => user.name === contact.name);
}

/**
 * Searches for tasks based on the user's input and renders the matching tasks.
 * 
 */

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

/**
 * This function iterates through all predefined categories, clears the existing content of each
 * category container, and then filters and renders tasks that match the search query for each 
 * category. If no tasks are found for a category, it handles the empty category scenario.
 * If all tasks match the search query, the entire HTML is updated instead.
 * 
 */

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

/**
 * This function filters an array of tasks and returns only those tasks that belong to a 
 * specified category container. 
 *
 * @param {string} categoryContainer - The ID of the category container used to filter tasks.
 * @param {Array<Object>} tasks - An array of task objects to be filtered.
 * @returns {Array<Object>} - An array of task objects that belong to the specified category container.
 */

function filterTasksByCategory(categoryContainer, tasks) {
    return tasks.filter((task) => task.container === categoryContainer);
}