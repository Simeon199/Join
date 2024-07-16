function iterateThroughSubArray(taskArray, htmlElement) {
  for (i = 0; i < taskArray.length; i++) {
    let task = taskArray[i];
    htmlElement.innerHTML += createToDoHTML(task);
  }
}

function checkIfEmpty(tasksDiv, divWithoutTasks) {
  let tasksDivContainer = document.getElementById(tasksDiv);
  let divWithoutTasksContainer = document.getElementById(divWithoutTasks);
  if (tasksDivContainer.innerHTML == "") {
    divWithoutTasksContainer.classList.remove("d-none");
  }
}

function updateHTML() {
  allCategories.forEach((container) => {
    let element = document.getElementById(container);
    let oppositeElementName = "no-" + container;
    let oppositeElement = getRightOppositeElement(oppositeElementName);
    if (element) {
      let filteredTasks = tasks.filter((task) => task.container === container);
      element.innerHTML = "";
      if (filteredTasks.length > 0) {
        iterateThroughSubArray(filteredTasks, element);
      } else {
        element.innerHTML = oppositeElement;
      }
    }
  });
}

function startDragging(elementId) {
  elementDraggedOver = elementId;
}

async function moveTo(container) {
  let oppositeContainer = "no-" + container;
  let task = tasks.find((task) => task.tasksIdentity == elementDraggedOver);
  if (task) {
    task.container = container;
    saveTasksToLocalStorage();
    updateHTML();
    removeEmptyMessage(container, oppositeContainer);
  }
  try {
    await saveTaskToFirebase(task);
  } catch (error) {
    console.error("Fehler beim Speichern der tasks in der Firebase-Datenbank:", error);
  }
}

function removeEmptyMessage(container, oppositeContainer) {
  let categoryContainer = document.getElementById(container);
  let oppositeCategoryContainer = document.getElementById(oppositeContainer);
  if (oppositeCategoryContainer) {
    categoryContainer.removeChild(oppositeCategoryContainer);
  }
}

function getRightOppositeElement(oppositeElementName) {
  if (oppositeElementName == "no-await-feedback-container") {
    return returnHtmlNoFeedbackContainer();
  } else if (oppositeElementName == "no-in-progress-container") {
    return returnHtmlNoProgressContainer();
  } else if (oppositeElementName == "no-to-do-container") {
    return returnHtmlNoToDoContainer();
  } else if (oppositeElementName == "no-done-container") {
    return returnHtmlNoDoneContainer();
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function openMobileDropdown(taskIndex) {
  let dropdown = document.getElementById(`mobileDropdown${taskIndex}`);
  dropdown.classList.toggle('mobileDropdown-translate-100');
}

async function moveTasksToCategory(taskIndex, newCategory, currentContainer) {
  proveCurrentContainer(newCategory, currentContainer);
  let task = tasks.find((task) => task.tasksIdentity == taskIndex);
  if (task) {
    task.container = newCategory;
    saveTasksToLocalStorage();
    updateHTML();
    try {
      await saveTaskToFirebase(task);
    } catch (error) {
      console.error("Fehler beim Speichern der tasks in der Firebase-Datenbank:", error);
    }
  }
}

function proveCurrentContainer(newCategory, currentContainer) {
  if (newCategory == currentContainer) {
    document.getElementById(newCategory).classList.add("d-none");
  }
}