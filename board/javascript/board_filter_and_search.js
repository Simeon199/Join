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

function findUserIndex(contact) {
  return allUsers.findIndex((user) => user.name === contact.name);
}

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

function filterTasksByCategory(categoryContainer, tasks) {
  return tasks.filter((task) => task.container === categoryContainer);
}