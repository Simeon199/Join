import * as contactsHTML from '../../contacts/javascript/contactsHTML.js';
import * as shared from '../../shared/javascript/shared.js';
import * as data from '../../core/downloadData.js';

let assignetTo = document.getElementById("assignetTo");
let category = document.getElementById("category");
let priority;
let subArray = [];
let assignedContacts = [];
let allContacts = [];
let standardContainer = "to-do-container";
let userCredicals;
let isSelect;
let searchResults = [];

document.addEventListener('DOMContentLoaded', () => {
  if(window.location.pathname.endsWith('/add_tasks/add_task.html')){
    init();
    handleEventsFunction();
  }
  changePriority(medium);
});

function handleEventsFunction(){
  handleAllClickEvents();
  handleKeyAndInputEvents();
}

async function init() {
  data.contactsData.onChange((data) => {
    allContacts = Object.values(data || {});
    console.log('allContacts:', allContacts);
  });
}

function handleAllClickEvents(){
  document.addEventListener('click', (event) => {
    if(event.target.matches('#arrowa')){
      checkDropDown('arrowa');
    } else if(event.target.matches('#addTaskBody')){
      hideAllAddTaskPopups()
    } else if(event.target.matches('#changeTo')){
      changeToInputfield();
    } else if(event.target.matches('#assignedToDropDown')){
      shared.stopEvent(event);
    } else if(event.target.matches('#urgent')){
      changePriority('urgent');
    } else if(event.target.matches('#medium')){
      changePriority('medium');
    } else if(event.target.matches('#low')){
      changePriority('low');
    } else if(event.target.matches('#category')){
      checkDropDown('arrowb');
      shared.stopEvent(event);
    } else if(event.target.matches('#subtask')){
      hideOrShowEditButtons();
      shared.stopEvent(event);
    } else if(event.target.matches('#subtaskInputButtons')){
      clearSubtaskInput();
    } else if(event.target.matches('#enterClick')){
      addSubtask();
    } else if(event.target.matches('#clearTaskDiv')){
      clearTask();
    } else if(event.target.matches('#subButton')){
      checkRequiredFields('addTask');
      return false;
    }
  });
}

function handleKeyAndInputEvents(){
  document.addEventListener('input', (event) => {
    if(event.target.matches('#searchField')){
      searchContacts();
    }
  })
  document.addEventListener('keyup', (event) => {
    if(event.target.matches('#subtask')){
      addSubtaskByEnterClick();
    }
  })
}

// Hier beginnt die Funktionenkette, die die Zuweisung der Kontakte zur Aufgabe verwaltet

function changeToInputfield() {
  let changecont = document.getElementById("changeTo");
  let search = document.getElementById("searchArea").classList;
  let input = document.getElementById("searchField");
  let stV = document.getElementById("standartValue").classList;
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

function showDropDownAssignedTo() {
  let contact = document.getElementById("assignedToDropDown");
  contact.innerHTML = "";
  for (let i = 0; i < allContacts.length; i++) { // allContacts
    let user = allContacts[i]; // allContacts
    renderAssignedToHTML(user, i);
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

function searchContacts() {
  document.getElementById("assignedToDropDown").innerHTML = "";
  let search = document.getElementById("searchField");
  let text = search.value.toLowerCase();
  if (text.length >= 1) {
    let searchResults = [];
    for (let i = 0; i < allContacts.length; i++) {
      aU = allContacts[i].name.toLowerCase();
      if (aU.includes(text)) {
        searchResults.push(allContacts[i]);
      }
    }
    showDropDownAssignedToOnlyResult();
  } else {
    let searchResults = [];
    showDropDownAssignedTo();
  }
}

async function renderAssignedToHTML(user, i) {
  let templateHTML = await shared.initHTMLContent('/add_tasks/templates/render-assigned-to-html.tpl', 'assignedToDropDown');
  if(templateHTML){
    templateHTML.id=`user${i}`;
    try {
      showContactsAndMakeThemSelectable(user, i);
    } catch(error){
      console.error('Something didnt work out with loading the template', error);
    }
  }
}

function showContactsAndMakeThemSelectable(user, i){
  prepareSingleContactForSelection(user, i);
  document.getElementById(`user${i}`).addEventListener('click', () => {
    checkAssignedContacts(`${user.name}`, `${user.color}`, `${i}`);
  });
}

function prepareSingleContactForSelection(user, i){
  let parentDiv = document.getElementById(`user${i}`);
  let assignedToLetters = parentDiv.querySelectorAll('div')[0];
  let dropdownUser = parentDiv.querySelectorAll('div')[1];
  let checkboxesSVG = dropdownUser.querySelector('.checkboxesSVG');
  let contactInitials = contactsHTML.getContactInitials(user.name);
  assignedToLetters.id = `assignetToLetters${i}`;
  assignedToLetters.style.backgroundColor = user.color;
  assignedToLetters.innerHTML = contactInitials;
  dropdownUser.querySelector('span').innerHTML = user.name; 
  checkboxesSVG.querySelectorAll('img')[0].id = `none_checked${i}`;
  checkboxesSVG.querySelectorAll('img')[1].id = `checked${i}`;
}

function checkAssignedContacts(name, color, i) {
  let x = { name: name, color: color, selected: false };
  let selUser = document.getElementById(`user${i}`);
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
    // addUserToTask(x);
  }
}

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

function assignetToContects() {
  let circleCont = document.getElementById("userCircles");
  circleCont.innerHTML = "";
  for (let i = 0; i < assignedContacts.length; i++) {
    renderAssignedToCircle(i, assignedContacts[i].name, assignedContacts[i].color, circleCont);
  }
}

function renderAssignedToCircle(i, user, color, circleCont) {
  if (i <= 3) {
    circleCont.innerHTML += `
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
    // showUserLetters(`showCircle${i}`, user);
  } else if (i == 4) {
    circleCont.innerHTML += showplusSVG();
  } else {
    showplusSVG();
  }
}

function showplusSVG() {
  let moreNumber = assignedContacts.length - 4;
  return `
    <span class="contactsMoreNumber">+ ${moreNumber}</span>
  `;
}

function showDropDownAssignedToOnlyResult() {
  let contact = document.getElementById("assignedToDropDown");
  contact.innerHTML = "";
  for (let i = 0; i < searchResults.length; i++) {
    let user = searchResults[i];
    renderAssignedToHTML(user, i);
  }
  contact.classList.remove("d-none");
  document.getElementById("arrowa").classList.add("rotate");
}

// Hier endet die Funktionenkette, die die Zuweisung der Kontakte zur Aufgabe verwaltet

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

async function showDropDownCategory() {
  document.getElementById("categoryDropDown").classList.remove("d-none");
  document.getElementById("arrowb").classList.add("rotate");
  let templateHTML = await shared.initHTMLContent('/add_tasks/templates/show-dropdown-category.tpl', 'categoryDropdown');
  return templateHTML;
}

function hideDropDownCategory() {
  document.getElementById("categoryDropDown").classList.add("d-none");
  document.getElementById("arrowb").classList.remove("rotate");
}

function changeCategory(text) {
  document.getElementById("categoryText").innerHTML = `${text}`;
}

function checkCategory() {
  let select = document.getElementById("categoryText").textContent;
  let standart = "Select task category";
  if (select == standart) {
    return false;
  } else {
    return true;
  }
}

function manageDateAndTitleInputStyles(){
  let title = document.getElementById("inputTitle").value;
  let date = document.getElementById("date").value;
  toggleStyleDependingOnId(title, 'requiredTitle');
  toggleStyleDependingOnId(date, 'requiredDate');
}

function toggleStyleDependingOnId(inputValue, targetId){
  if(inputValue.length <= 1){
    document.getElementById(`${targetId}`).classList.remove("d-none");
  } else {
    document.getElementById(`${targetId}`).classList.add("d-none");
  }
}

function handleCheckCategory(){
  if (checkCategory() == false) {
    document.getElementById("requiredCatergory").classList.remove("d-none");
  } else {
    document.getElementById("requiredDate").classList.add("d-none");
  }
}

function handleCheckDate(){
  if (checkDate() === false) {
    document.getElementById("requiredDate").classList.remove("d-none");
    document.getElementById("requiredDate").innerHTML = "Date must be in the future";
  } else {
    document.getElementById("requiredDate").classList.add("d-none");
  }
}

function checkDateAndCategory(){
  handleCheckCategory();
  handleCheckDate();
}

function checkAndPrepareUploadOfNewTask(){
  if (isAddTaskFormCorrectlyFilled()) {
    showBoardLoadScreen();
    // let newTask = createNewTask();
    // await uploadToAllTasks(newTask);
    hideBoardLoadScreen();
  }
}

function isAddTaskFormCorrectlyFilled(){
  return title.length > 1 && date.length > 1 && checkCategory() == true && checkDate() === true
}

async function checkRequiredFields(side) {
  manageDateAndTitleInputStyles();
  checkDateAndCategory();
  checkAndPrepareUploadOfNewTask();
}

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
  };
}

function hideRequiredText() {
  let ids = ["requiredTitle", "requiredDate", "requiredCatergory"];
  ids.forEach(function (id) {
    let element = document.getElementById(id);
    element.classList.add("d-none");
  });
}


function getInputValue(elementId) {
  return document.getElementById(elementId).value;
}

function checkDropDown(id) { // arrowb wird hier überhaupt nicht abgeprüft --> Abgleichen mit originalem Join-Code!
  let rot = document.getElementById(id);
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

function hideAllAddTaskPopups() {
  hideDropDownAssignedTo();
  hideDropDownCategory();
  changeToInputfield();
  let plus = document.getElementById("plusSymbole");
  let subtask = document.getElementById("subtaskInputButtons");
  plus.classList.remove("d-none");
  subtask.classList.add("d-none");
}

function checkDate() {
  let animation = document.getElementById("dateAnimation");
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

function hideDropDownAssignedTo() {
  document.getElementById("arrowa").classList.remove("rotate");
  let contact = document.getElementById("assignedToDropDown");
  contact.classList.add("d-none");
  contact.innerHTML = "";
}

function clearAssignedTo() {
  let div = document.getElementById("userCircles");
  assignedContacts = [];
  div.innerHTML = "";
}

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

function createSubtaskJson(value) {
  return { "task-description": value, "is-tasked-checked": false };
}

function rendersubtask() {
  let subtask = document.getElementById("showSubtasks");
  subtask.innerHTML = "";
  if (subArray.length >= 1) {
    for (let i = 0; i < subArray.length; i++) {
      // let content = subArray[i]["task-description"];
      subtask.innerHTML += renderSubtaskHTML(); // i, content
    }
    subtask.classList.remove("d-none");
  } else {
    subtask.classList.add("d-none");
  }
}

async function renderSubtaskHTML(){
  let templateHTML = await shared.initHTMLContent('/add_tasks/templates/render-subtask-html.tpl', 'showSubtasks');
  return templateHTML;
}

function clearSubtask() {
  let subtask = document.getElementById("showSubtasks");
  subArray = [];
  subtask.innerHTML = "";
  i = 0;
  subtask.classList.add("d-none");
  hideOrShowEditButtons();
}

function clearSubtaskInput() {
  document.getElementById("subtask").value = "";
}

function hideOrShowEditButtons() {
  // debugger;
  let cont = document.getElementById("testForFunction");
  let plus = document.getElementById("plusSymbole");
  let subtask = document.getElementById("subtaskInputButtons");
  plus.classList.add("d-none");
  subtask.classList.remove("d-none");
}

function showsubtaskIsEmptyError() {
  let emptySub = document.getElementById("emptySubtask");
  emptySub.classList.remove("d-none");
  setTimeout(function () {
    document.getElementById("emptySubtask").classList.add("d-none");
  }, 5000);
}

function addSubtaskByEnterClick() {
  let text = document.getElementById(`testForFunction`);
  let suby = document.getElementById("subtask");
  text.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && document.hasFocus()) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("enterClick").click();
    }
  });
}

// All unused functions are lying here

// function saveEditedSubtask(i) {
//   let text = document.getElementById(`subtaskEdited`).value;
//   if (text.length > 0) {
//     subArray[i]["task-description"] = text;
//     rendersubtask();
//   } else {
//     showsubtaskIsEmptyError();
//   }
// }

// function toggleDNone(id) {
//   document.getElementById(`subBTN${id}`).classList.toggle("d-none");
// }

// function editSubtask(i) {
//   editSubtaskInput(i);
// }

// function focusInput() {
//   hideOrShowEditButtons();
//   let activSubtask = document.getElementById("subtask");
//   activSubtask.focus();
// }

// function addUserToTask(u) {
//   userCredicals = {
//     name: u.name,
//     color: u.color,
//     isSelected: u.selected,
//   };
//   assignedContacts.push(userCredicals);
//   assignetToContects();
// }

// function startAnimation() {
//   scrollTo(0, 0);
//   document.getElementById("addedAnimation").classList.remove("d-none");
//   document.getElementById("addedAnimation").classList.add("erase-in");
//   document.getElementById("addTaskBody").classList.add("overflow-hidden");
//   setTimeout(goToBoard, 1500);
// }

// function deleteSubtask(i) {
//   subArray.splice(i, 1);
//   rendersubtask();
// }

// function editSubtaskInput(i) {
//   container = document.getElementById(`yyy${i}`);
//   container.onmouseover = null;
//   container.onmouseout = null;
//   container.ondblclick = null;
//   let templateHTML = shared.initHTMLContent('/add_tasks/templates/edit-subtask-inputHTML.tpl', `yyy${i}`);
//   container.innerHTML = returnEditSubtaskInputHTML(i);
//   edit = document.getElementById(`subtaskEdited`);
//   subtask[i] = edit.value;
//   return templateHTML;
// }

// function showRequiredText() {
//   let ids = ["requiredTitle", "requiredDate", "requiredCatergory"];
//   ids.forEach(function (id) {
//     let element = document.getElementById(id);
//     element.classList.remove("d-none");
//   });
// }

// function taskMarker() {
//   document.getElementById("addTask").classList.add("currentSection");
// }

// function goToBoard() {
//   window.location.href = "board.html";
// }