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
  document.getElementById('arrowa').innerHTML = addTaskDropdownArrowSVG;
  document.getElementById('imgUrgent').innerHTML = addTaskUrgentSVG;
  document.getElementById('imgMedium').innerHTML = addTaskMediumSVG;
  document.getElementById('imgLow').innerHTML = addTaskLowSVG;
  document.getElementById('arrowb').innerHTML = addTaskDropdownArrowSVG;
  document.getElementById('plusSymbole').innerHTML = addTaskPlusSVG;
  // For clear button and create button, they don't have ids, so need to select differently
  const clearBtn = document.querySelector('.btn span:last-child');
  if (clearBtn) clearBtn.innerHTML = addTaskClearSVG;
  const createBtn = document.querySelector('.darkBTN span:last-child');
  if (createBtn) createBtn.innerHTML = addTaskCheckmarkSVG;
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
  let title = document.getElementById("inputTitle").value;
  let date = document.getElementById("date").value;

  if (title.length <= 1) {
    document.getElementById("requiredTitle").classList.remove("d-none");
  } else {
    document.getElementById("requiredTitle").classList.add("d-none");
  }

  if (date.length <= 1) {
    document.getElementById("requiredDate").classList.remove("d-none");
  } else {
    document.getElementById("requiredDate").classList.add("d-none");
  }

  if (checkCategory() == false) {
    document.getElementById("requiredCatergory").classList.remove("d-none");
  } else {
    document.getElementById("requiredDate").classList.add("d-none");
  }

  if (checkDate() === false) {
    document.getElementById("requiredDate").classList.remove("d-none");
    document.getElementById("requiredDate").innerHTML = "Date must be in the future";
  } else {
    document.getElementById("requiredDate").classList.add("d-none");
  }

  if (title.length > 1 && date.length > 1 && checkCategory() == true && checkDate() === true) {
    showBoardLoadScreen();
    await createTask(side);
    hideBoardLoadScreen();
  }
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
 * check if the FropDown is open or closed
 * 
 * @param {string} id 
 */
function checkDropDown(id) {
  rot = document.getElementById(id);
  if (rot.classList.contains("rotate")) {
    if (id == "arrowa") {
      hideDropDownAssignedTo();
    } else {
      hideDropDownCategory();
    }
  } else {
    if (id == "arrowa") {
      showDropDownAssignedTo();
    } else {
      showDropDownCategory();
    }
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
  animation = document.getElementById("dateAnimation");
  let dateInput = document.getElementById("date");
  const dateString = dateInput.value;
  const dateObject = new Date(dateString);
  const millisecondsSinceEpoch = dateObject.getTime();
  const addDate = new Date();
  if (dateString.length >= 9) {
    if (millisecondsSinceEpoch < addDate) {
      animation.classList.remove("d-none");
      setTimeout(() => animation.classList.add("d-none"), 3000);
      dateInput.value = "";
      return false;
    } else {
      return true;
    }
  } else {
    return null;
  }
}