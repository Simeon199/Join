import {ref, get, push, remove } from "../../core/database.js";
import db from "../../core/database.js";
import * as contacts from '../../contacts/javascript/contacts.js';
import * as shared from '../../shared/javascript/shared.js';
import { allContacts } from "../../contacts/javascript/contactsHTML.js";

const database = db.database;


let assignetTo = document.getElementById("assignetTo");
let category = document.getElementById("category");
let priority;
let subArray = [];
let assignedContacts = [];
let standardContainer = "to-do-container";

document.addEventListener('DOMContentLoaded', () => {
  shared.bundleLoadingHTMLTemplates();
  handleAllClickEvents();
  init();
});

function handleAllClickEvents(){
  document.getElementById('arrowa').addEventListener('click', () => {
    checkDropDown('arrowa');
  });
  document.getElementById("addTaskBody").addEventListener('click', () => {
    hideAllAddTaskPopups();
  });
}

/**
 * Initializes add-task variables and functions when the website loads.
 */

async function init() {
  changePriority(medium);
  allContacts = await contacts.getAllContacts();
  console.log('all users: ', allContacts);
  // tasksId = await loadTaskIdFromFirebase();
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
    let newTask = createNewTask();
    await uploadToAllTasks(newTask);
    // await createTask(side);
    hideBoardLoadScreen();
  }
}

/**
 * push task to array all tasks
 * 
 * @param {json} task 
 */

async function uploadToAllTasks(task){
  let tasksRef = ref(database, 'kanban/sharedBoard/tasks');
  await push(tasksRef, task);
}

/**
 * retuns the task json
 * 
 * @returns json
 */
function createNewTask() {
  return {
    title: getInputValue("inputTitle"),
    description: getInputValue("inputDescription"),
    assigned: assignedContacts,
    date: getInputValue("date"),
    priority: priority,
    category: document.getElementById("categoryText").textContent,
    subtask: subArray,
    container: standardContainer
    // tasksIdentity: tasksId,
  };
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
  // debugger;
  let rot = document.getElementById(id);
  if (rot.classList.contains("rotate")) {
    if (id == "arrowa") {
      hideDropDownAssignedTo();
    } else {
      hideDropDownCategory();
    }
  } else {
    if (id == "arrowa") {
      assignContactsToTask.showDropDownAssignedTo();
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
  let plus = document.getElementById("plusSymbole");
  let subtask = document.getElementById("subtaskInputButtons");
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

let userCredicals;
let isSelect;
let searchResults = [];

/**
 * show Dropdown from AssignetTo field
 */
function showDropDownAssignedTo() {
  contact = document.getElementById("assignedToDropDown");
  contact.innerHTML = "";
  for (let i = 0; i < allContacts.length; i++) {
    user = allContacts[i];
    renderAssignedToHTML(user, contact, i);
    if (assignedContacts != 0) {
      if (checkAssignedContactsStatus(user.name) === true) {
        document.getElementById(`user${i}`).classList.add("contactIsSelect");
        document.getElementById(`checked${i}`).classList.remove("d-none");
      } else {
        document.getElementById(`user${i}`).classList.remove("contactIsSelect");
        document.getElementById(`checked${i}`).classList.add("d-none");
      }
    }
  }
  contact.classList.remove("d-none");
  document.getElementById("arrowa").classList.add("rotate");
}

/**
 * hide Drop down
 */
function hideDropDownAssignedTo() {
  document.getElementById("arrowa").classList.remove("rotate");
  contact = document.getElementById("assignedToDropDown");
  contact.classList.add("d-none");
  contact.innerHTML = "";
}

/**
 * render contacts HTML
 * 
 * @param {json} user 
 * @param {string} contact 
 * @param {number} i 
 */
function renderAssignedToHTML(user, contact, i) {
  contact.innerHTML += /*html*/ `
    <div id="user${i}" class=assignedDropDownField onclick="checkAssignedContacts('${user[`name`]}', '${user[`color`]}', ${i})">
      <div class="circle" id="assignetToLetters${i}"></div>
      <div class="DropDownUser"><span>${user["name"]}</span>
        <div class="checkboxesSVG">
          <img id="none_checked${i}" src="../../assets/img/Checkbox_black.svg" alt="">
          <img id="checked${i}" class="checked d-none" src="../../assets/img/Checkbox_checked.svg" alt="">
        </div>
      </div>
    </div>
  `;
  document.getElementById(`assignetToLetters${i}`).style.backgroundColor = user["color"];
  sowUserLetters(`assignetToLetters${i}`, user["name"]);
}

/**
 * show circles on Screen
 */
function assignetToContects() {
  circleCont = document.getElementById("userCircles");
  circleCont.innerHTML = "";
  for (let i = 0; i < assignedContacts.length; i++) {
    renderAssignedToCircle(i, assignedContacts[i].name, assignedContacts[i].color, circleCont);
  }
}

/**
 * render HTML code
 * 
 * @param {number} i 
 * @param {string} user 
 * @param {string} color 
 * @param {number} circleCont 
 */
function renderAssignedToCircle(i, user, color, circleCont) {
  if (i <= 3) {
    circleCont.innerHTML += /*html*/ `
      <div class="assignetToDiv circle" id="showCircle${i}"></div>
    `;
    circle = document.getElementById(`showCircle${i}`).style;
    circle.backgroundColor = color;
    circle.border = "2px solid rgba(255, 255, 255, 1)";
    if (assignedContacts.length >= 1) {
      if (assignedContacts[0].name != user) {
        circle.marginLeft = "-24px";
      }
    }
    sowUserLetters(`showCircle${i}`, user);
  } else if (i == 4) {
    circleCont.innerHTML += showplusSVG();
  } else {
    showplusSVG();
  }
}

/**
 * set to empty Array
 */
function clearAssignedTo() {
  let div = document.getElementById("userCircles");
  assignedContacts = [];
  div.innerHTML = "";
}

/**
 * added User to Task
 * @param {json} u 
 */
function addUserToTask(u) {
  userCredicals = {
    name: u.name,
    color: u.color,
    isSelected: u.selected,
  };
  assignedContacts.push(userCredicals);
  assignetToContects();
}

/**
 * check if a User is selected or not
 * 
 * @param {*} name 
 * @param {*} color 
 * @param {*} i 
 */
function checkAssignedContacts(name, color, i) {
  x = { name: name, color: color, selected: false };
  selUser = document.getElementById(`user${i}`);
  if (selUser.classList.contains("contactIsSelect") == true) {
    document.getElementById(`none_checked${i}`).classList.remove("d-none");
    document.getElementById(`checked${i}`).classList.add("d-none");
    selUser.classList.remove("contactIsSelect");
    removeAssignedToContects(x.name, i);
  } else {
    document.getElementById(`none_checked${i}`).classList.add("d-none");
    document.getElementById(`checked${i}`).classList.remove("d-none");
    selUser.classList.add("contactIsSelect");
    x.selected = true;
    addUserToTask(x);
  }
}

/**
 * check if contacts are selected if the popup is opening
 * 
 * @param {*} un 
 * @returns 
 */
function checkAssignedContactsStatus(un) {
  if (!assignedContacts == 0) {
    for (let i = 0; i < assignedContacts.length; i++) {
      if (assignedContacts[i].name == un) {
        if (assignedContacts[i].isSelected == true) {
          return true;
        }
      }
    }
  } else {
    return false;
  }
}

/**
 * remove added contact
 * 
 * @param {string} name 
 * @param {number} index 
 */
function removeAssignedToContects(name, index) {
  for (let i = 0; i < assignedContacts.length; i++) {
    indexOfName = assignedContacts[i].name.includes(name);
    if (indexOfName == true) {
      document.getElementById(`user${index}`).classList.remove("contactIsSelect");
      assignedContacts.splice(i, 1);
    }
  }
  assignetToContects();
}

/**
 * chage field to inputfield
 */
function changeToInputfield() {
  changecont = document.getElementById("changeTo");
  search = document.getElementById("searchArea").classList;
  input = document.getElementById("searchField");
  stV = document.getElementById("standartValue").classList;
  window.addEventListener("click", function (e) {
    if (changecont.contains(e.target)) {
      search.remove("d-none");
      input.classList.remove("d-none");
      stV.add("d-none");
      input.focus();
      showDropDownAssignedTo();
    } else {
      search.add("d-none");
      input.classList.add("d-none");
      stV.remove("d-none");
      input.value = "";
    }
  });
}

/**
 * show if the Letter macth with letters in user.names
 */
function searchContacts() {
  document.getElementById("assignedToDropDown").innerHTML = "";
  search = document.getElementById("searchField");
  text = search.value.toLowerCase();
  if (text.length >= 1) {
    searchResults = [];
    for (let i = 0; i < allContacts.length; i++) {
      aU = allContacts[i].name.toLowerCase();
      if (aU.includes(text)) {
        searchResults.push(allContacts[i]);
      }
    }
    showDropDownAssignedToOnlyResult();
  } else {
    searchResults = [];
    showDropDownAssignedTo();
  }
}

/**
 * show only contacts with the Letter(s) in the inputfield
 */

function showDropDownAssignedToOnlyResult() {
  contact = document.getElementById("assignedToDropDown");
  contact.innerHTML = "";
  for (let i = 0; i < searchResults.length; i++) {
    user = searchResults[i];
    renderAssignedToHTML(user, contact, i);
  }
  contact.classList.remove("d-none");
  document.getElementById("arrowa").classList.add("rotate");
}

/**
 *  show + symbole and nuber off added contacts
 * @returns 
 */
function showplusSVG() {
  let moreNumber = assignedContacts.length - 4;
  return /*html*/ `
    <span class="contactsMoreNumber">+ ${moreNumber}</span>
  `;
}

/**
 * add subtask to task
 */
function addSubtask() {
  let text = document.getElementById(`subtask`);
  if (text.value.length <= 0) {
    showsubtaskIsEmptyError();
  } else {
    let subtaskJson = createSubtaskJson(text.value);
    subArray.push(subtaskJson);
    text.value = "";
    rendersubtask();
    hideOrShowEditButtons();
  }
}

/**
 * generate subtaks json for board popup
 * 
 * @param {string} value 
 * @returns 
 */
function createSubtaskJson(value) {
  return { "task-description": value, "is-tasked-checked": false };
}

/**
 * go through the subArray and render the subtasks
 */
function rendersubtask() {
  subtask = document.getElementById("sowSubtasks");
  subtask.innerHTML = "";

  if (subArray.length >= 1) {
    for (let i = 0; i < subArray.length; i++) {
      let content = subArray[i]["task-description"];
      subtask.innerHTML += renderSubtaskHTML(i, content);
    }
    subtask.classList.remove("d-none");
  } else {
    subtask.classList.add("d-none");
  }
}

/**
 * return the HTML code for the subtasks
 * 
 * @param {number} i 
 * @param {string} content 
 * @returns 
 */
function renderSubtaskHTML(i, content) {
  return /*html*/ `
      <div onmouseover="toggleDNone(${i})" onmouseout="toggleDNone(${i})" ondblclick="editSubtask(${i})" id="yyy${i}" class="subtasks">
        <li >${content}</li>
        <div id="subBTN${i}" class="subBtn1 d-none">
          <svg onclick="editSubtask(${i}), stopEvent(event)" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
          </svg>
          <svg onclick="deleteSubtask(${i}), stopEvent(event)" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
          </svg>
        </div>
      </div>
    `;
}

/**
 * clearing subArray
 */
function clearSubtask() {
  let subtask = document.getElementById("sowSubtasks");
  subArray = [];
  subtask.innerHTML = "";
  i = 0;
  subtask.classList.add("d-none");
  hideOrShowEditButtons();
}

/**
 * clear the subtask Inputfield
 */
function clearSubtaskInput() {
  document.getElementById("subtask").value = "";
}

/**
 * eddeding the Subtask
 * 
 * @param {number} i 
 */
function editSubtask(i) {
  editSubtaskInput(i);
}

/**
 * call the edit function
 * 
 * @param {number} i 
 */
function editSubtaskInput(i) {
  container = document.getElementById(`yyy${i}`);
  container.onmouseover = null;
  container.onmouseout = null;
  container.ondblclick = null;
  container.innerHTML = returnEditSubtaskInputHTML(i);
  edit = document.getElementById(`subtaskEdited`);
  subtask[i] = edit.value;
}
 /**
  * render the Inputfield
  * 
  * @param {number} i 
  * @returns 
  */
function returnEditSubtaskInputHTML(i) {
  return `<input id="subtaskEdited" type="text" value="${subArray[i]["task-description"]}">
  <div class="inputButtons">
    <img onclick="deleteSubtask(${i}), stopEvent(event)" src="../../assets/img/deletetrash.svg" alt="">
    <div class="subtaskBorder"></div>
    <img onclick="saveEditedSubtask(${i}), stopEvent(event)" src="../../assets/img/checksubmit.svg" alt="">
  </div>
`;
}

/**
 * hide edit Buttons
 */
function hideOrShowEditButtons() {
  cont = document.getElementById("testForFunction");
  plus = document.getElementById("plusSymbole");
  subtask = document.getElementById("subtaskInputButtons");

  plus.classList.add("d-none");
  subtask.classList.remove("d-none");
}

/**
 * delete Subtask from array subArray
 * 
 * @param {number} i 
 */
function deleteSubtask(i) {
  subArray.splice(i, 1);
  rendersubtask();
}

/**
 * override curret subtask value
 * @param {number} i 
 */
function saveEditedSubtask(i) {
  let text = document.getElementById(`subtaskEdited`).value;
  if (text.length > 0) {
    subArray[i]["task-description"] = text;
    rendersubtask();
  } else {
    showsubtaskIsEmptyError();
  }
}

/**
 * hide or show buttons
 * 
 * @param {string} id 
 */
function toggleDNone(id) {
  document.getElementById(`subBTN${id}`).classList.toggle("d-none");
}

/**
 * show error massage
 */
function showsubtaskIsEmptyError() {
  emptySub = document.getElementById("emptySubtask");
  emptySub.classList.remove("d-none");
  setTimeout(function () {
    document.getElementById("emptySubtask").classList.add("d-none");
  }, 5000);
}

/**
 * set focus on inputfield
 */
function focusInput() {
  hideOrShowEditButtons();
  let activSubtask = document.getElementById("subtask");
  activSubtask.focus();
}

/**
 * add subtask with push on Enter
 */
function addSubtaskByEnterClick() {
  let text = document.getElementById(`testForFunction`);
  suby = document.getElementById("subtask");
  text.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && document.hasFocus()) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("enterClick").click();
    }
  });
}