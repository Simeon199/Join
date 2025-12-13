let assignetTo = document.getElementById("assignetTo");
let category = document.getElementById("category");
let priority;
let subArray = [];
let assignedContacts = [];
let standardContainer = "to-do-container";

/**
 * Initializes the SVG icons for the add task page
 */
function initAddTaskIcons() {
  initDropdownAndPriorityIcons();
  initButtonIcons();
}

/**
 * Initializes dropdown and priority icons using a mapping object
 */
function initDropdownAndPriorityIcons() {
  const iconMappings = {
    'arrowa': addTaskDropdownArrowSVG,
    'imgUrgent': addTaskUrgentSVG,
    'imgMedium': addTaskMediumSVG,
    'imgLow': addTaskLowSVG,
    'arrowb': addTaskDropdownArrowSVG,
    'plusSymbole': addTaskPlusSVG,
  };

  Object.entries(iconMappings).forEach(([id, svg]) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = svg;
    }
  });
}

/**
 * Initializes button icons for clear and create buttons
 */
function initButtonIcons() {
  setButtonIcon('.btn span:last-child', addTaskClearSVG);
  setButtonIcon('.darkBTN span:last-child', addTaskCheckmarkSVG);
}

/**
 * Sets the innerHTML of a button icon using a selector
 * @param {string} selector - The CSS selector for the element
 * @param {string} svg - The SVG content to set
 */
function setButtonIcon(selector, svg) {
  const element = document.querySelector(selector);
  if (element) {
    element.innerHTML = svg;
  }
}

/**
 * Marks the current Position in the Sidebar
 */
function taskMarker() {
  document.getElementById("addTask").classList.add("currentSection");
}

/**
 * add backgroundcolor of the priority Buttons
 * 
 * @param {string} id 
 */
function changePriority(id) {
  removeBackground(id);
  if (id == urgent) {
    urgent.classList.add("backgroundUrgent");
    priority = "urgent";
  }
  if (id == medium) {
    medium.classList.add("backgroundMedium");
    priority = "medium";
  }
  if (id == low) {
    low.classList.add("backgroundLow");
    priority = "low";
  }
}

/**
 * remove backgroundcolor of all containers without the id
 * 
 * @param {string} id 
 */
function removeBackground(id) {
  if (id == urgent) {
    medium.classList.remove("backgroundMedium");
    low.classList.remove("backgroundLow");
  }
  if (id == medium) {
    urgent.classList.remove("backgroundUrgent");
    low.classList.remove("backgroundLow");
  }
  if (id == low) {
    urgent.classList.remove("backgroundUrgent");
    medium.classList.remove("backgroundMedium");
  }
}

/**
 * clear the add Task page and set the standart values
 */
function clearTask() {
  let inputTitle = document.getElementById("inputTitle");
  let inputDescription = document.getElementById("inputDescription");
  let date = document.getElementById("date");
  inputTitle.value = "";
  inputDescription.value = "";
  clearAssignedTo();
  date.value = "";
  category = changeCategory("Select task category");
  clearSubtask();
  changePriority(medium);
  hideRequiredText();
}

/**
 * show the DropDown for the category field
 */
function showDropDownCategory() {
  document.getElementById("categoryDropDown").classList.remove("d-none");
  document.getElementById("arrowb").classList.add("rotate");
  document.getElementById("categoryDropDown").innerHTML = /*html*/ `
            <div onclick="hideDropDownCategory(); changeCategory('Technical Task')"><span>Technical Task</span></div>
            <div onclick="hideDropDownCategory(); changeCategory('User Story')"><span>User Story</span></div>
  `;
}

/**
 * hide the DropDown
 */
function hideDropDownCategory() {
  document.getElementById("categoryDropDown").classList.add("d-none");
  document.getElementById("arrowb").classList.remove("rotate");
}

/**
 * change the text in Category
 * 
 * @param {string} text 
 */
function changeCategory(text) {
  document.getElementById("categoryText").innerHTML = `${text}`;
}

/**
 * check if the catetgory is not the default value
 * 
 * @returns ture or false
 */
function checkCategory() {
  let select = document.getElementById("categoryText").textContent;
  let standart = "Select task category";
  if (select == standart) {
    return false;
  } else {
    return true;
  }
}

/**
 * check if the required Fields are filled
 * 
 * @param {string} side 
 */
async function checkRequiredFields(side) {
  let title = getInputValue("inputTitle");
  let date = getInputValue("date");
  showValidationErrors(title, date);
  if (isValid(title, date)) {
    await createTaskAsync(side);
  }
}

/**
 * Shows validation errors for title and date.
 * @param {string} title - The title value
 * @param {string} date - The date value
 */
function showValidationErrors(title, date) {
  validateTitle(title);
  validateDateInput(date);
  validateCategoryField();
  validateDateFutureField();
}

/**
 * Validates the title field.
 * @param {string} title - The title
 */
function validateTitle(title) {
  if (title.length <= 1) {
    document.getElementById("requiredTitle").classList.remove("d-none");
  } else {
    document.getElementById("requiredTitle").classList.add("d-none");
  }
}

/**
 * Validates the date input field.
 * @param {string} date - The date
 */
function validateDateInput(date) {
  if (date.length <= 1) {
    document.getElementById("requiredDate").classList.remove("d-none");
  } else {
    document.getElementById("requiredDate").classList.add("d-none");
  }
}

/**
 * Validates the category field.
 */
function validateCategoryField() {
  if (checkCategory() == false) {
    document.getElementById("requiredCatergory").classList.remove("d-none");
  } else {
    document.getElementById("requiredDate").classList.add("d-none");
  }
}

/**
 * Validates the date future field.
 */
function validateDateFutureField() {
  if (checkDate() === false) {
    document.getElementById("requiredDate").classList.remove("d-none");
    document.getElementById("requiredDate").innerHTML = "Date must be in the future";
  } else {
    document.getElementById("requiredDate").classList.add("d-none");
  }
}

/**
 * Checks if all fields are valid.
 * @param {string} title - The title
 * @param {string} date - The date
 * @returns {boolean} True if valid
 */
function isValid(title, date) {
  return title.length > 1 && date.length > 1 && checkCategory() == true && checkDate() === true;
}

/**
 * Creates the task asynchronously.
 * @param {string} side - The side
 */
async function createTaskAsync(side) {
  showBoardLoadScreen();
  await createTask(side);
  hideBoardLoadScreen();
}

/**
 * show the container with the text message
 */
function showRequiredText() {
  let ids = ["requiredTitle", "requiredDate", "requiredCatergory"];
  ids.forEach(function (id) {
    let element = document.getElementById(id);
    element.classList.remove("d-none");
  });
}

/**
 * hide the container with the text message
 */
function hideRequiredText() {
  let ids = ["requiredTitle", "requiredDate", "requiredCatergory"];
  ids.forEach(function (id) {
    let element = document.getElementById(id);
    element.classList.add("d-none");
  });
}

/**
 * get the elements value
 * 
 * @param {string} elementId 
 * @returns 
 */
function getInputValue(elementId) {
  return document.getElementById(elementId).value;
}

/**
 * check if the DropDown is open or closed
 * 
 * @param {string} id 
 */
function checkDropDown(id) {
  const rot = document.getElementById(id);
  const isRotated = rot.classList.contains("rotate");
  if (id === "arrowa") {
    isRotated ? hideDropDownAssignedTo() : showDropDownAssignedTo();
  } else {
    isRotated ? hideDropDownCategory() : showDropDownCategory();
  }
}

/**
 * hide all popups on screen
 */
function hideAllAddTaskPopups() {
  hideDropDownAssignedTo();
  hideDropDownCategory();
  changeToInputfield();
  plus = document.getElementById("plusSymbole");
  subtask = document.getElementById("subtaskInputButtons");
  plus.classList.remove("d-none");
  subtask.classList.add("d-none");
}

/**
 * Start "got to board" animation
 */
function startAnimation() {
  scrollTo(0, 0);
  document.getElementById("addedAnimation").classList.remove("d-none");
  document.getElementById("addedAnimation").classList.add("erase-in");
  document.getElementById("addTaskBody").classList.add("overflow-hidden");
  setTimeout(goToBoard, 1500);
}

/**
 * go to the board side
 */
function goToBoard() {
  window.location.href = "board.html";
}

/**
 * check if the Date in the inputfield is not in the past
 * @returns 
 */
function checkDate() {
  let dateInput = document.getElementById("date");
  const dateString = dateInput.value;
  if (dateString.length >= 9) {
    const isValid = validateDateFuture(dateString);
    if (!isValid) {
      showDateError();
      return false;
    } else {
      return true;
    }
  } else {
    return null;
  }
}

/**
 * Validates if the date is in the future.
 * @param {string} dateString - The date string
 * @returns {boolean} True if future
 */
function validateDateFuture(dateString) {
  const dateObject = new Date(dateString);
  const millisecondsSinceEpoch = dateObject.getTime();
  const addDate = new Date();
  return millisecondsSinceEpoch >= addDate;
}

/**
 * Shows the date error animation and clears input.
 */
function showDateError() {
  animation = document.getElementById("dateAnimation");
  let dateInput = document.getElementById("date");
  animation.classList.remove("d-none");
  setTimeout(() => animation.classList.add("d-none"), 3000);
  dateInput.value = "";
}