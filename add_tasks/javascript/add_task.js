import * as contacts from '../../contacts/javascript/contacts.js';
import * as shared from '../../shared/javascript/shared.js';

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
  }
});

function handleAllClickEvents(){
  document.getElementById('arrowa').addEventListener('click', () => {
    checkDropDown('arrowa');
  });
  document.getElementById("addTaskBody").addEventListener('click', () => {
    hideAllAddTaskPopups();
  });
  document.getElementById('changeTo').addEventListener('click', () => {
    changeToInputfield();
  });
  document.getElementById('assignedToDropDown').addEventListener('click', (event) => {
    stopEvent(event)
  });
  document.getElementById('urgent').addEventListener('click', () => {
    changePriority('urgent');
  });
  document.getElementById('medium').addEventListener('click', () => {
    changePriority('medium');
  });
  document.getElementById('low').addEventListener('click', () => {
    changePriority('low');
  });
  document.getElementById('category').addEventListener('click', (event) => {
    checkDropDown('arrowb');
    stopEvent(event);
  });
  document.getElementById('subtask').addEventListener('click', (event) => {
    hideOrShowEditButtons();
    stopEvent(event);
  });
  document.getElementById('subtaskInputButtons').addEventListener('click', () => {
    clearSubtaskInput();
  });
  document.getElementById('enterClick').addEventListener('click', () => {
    addSubtask();
  });
  document.getElementById('clearTaskDiv').addEventListener('click', () => {
    clearTask();
  });
  document.getElementById('subButton').addEventListener('click', () => {
    checkRequiredFields('addTask');
    return false;
  })
}

function handleKeyAndInputEvents(){
  document.getElementById('searchField').addEventListener('input', () => {
    searchContacts();
  });
  document.getElementById('subtask').addEventListener('keyup', () => {
    addSubtaskByEnterClick();
  });
}

async function init() {
  allContacts = await contacts.getAllContacts();
  // shared.bundleLoadingHTMLTemplates();
  handleAllClickEvents();
  handleKeyAndInputEvents();
  changePriority(medium);
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
  for (let i = 0; i < allContacts.length; i++) {
    let user = allContacts[i];
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

// id="user${i}" class=assignedDropDownField onclick="checkAssignedContacts('${user[`name`]}', '${user[`color`]}', ${i})"

async function renderAssignedToHTML(user, i) {
  let templateHTML = await shared.initHTMLContent('/add_tasks/templates/render-assigned-to-html.tpl', 'assignedToDropDown');
  if(templateHTML){
    templateHTML.id=`user${i}`;
    console.log(document.getElementById(`user${i}`).childNodes);
    console.log('template: ', document.getElementById('assignedToDropDown'));
    try {
      document.getElementById(`assignetToLetters${i}`).style.backgroundColor = user.color;
      showUserLetters(`assignetToLetters${i}`, user.name);
      document.getElementById(`user${i}`).addEventListener('click', () => {
        checkAssignedContacts(`${user.name}`, `${user.color}`, `${i}`);
      });
    } catch(error){
      console.error('Something didnt work out with loading the template', error);
    }
  }
}

function showDropDownAssignedToOnlyResult() {
  let contact = document.getElementById("assignedToDropDown");
  contact.innerHTML = "";
  for (let i = 0; i < searchResults.length; i++) {
    user = searchResults[i];
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

function checkDropDown(id) {
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
  subtask = document.getElementById("sowSubtasks");
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
  let templateHTML = await shared.initHTMLContent('/add_tasks/templates/render-subtask-html.tpl', 'sowSubtasks');
  return templateHTML;
}

function clearSubtask() {
  let subtask = document.getElementById("sowSubtasks");
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
  cont = document.getElementById("testForFunction");
  plus = document.getElementById("plusSymbole");
  subtask = document.getElementById("subtaskInputButtons");
  plus.classList.add("d-none");
  subtask.classList.remove("d-none");
}

function showsubtaskIsEmptyError() {
  emptySub = document.getElementById("emptySubtask");
  emptySub.classList.remove("d-none");
  setTimeout(function () {
    document.getElementById("emptySubtask").classList.add("d-none");
  }, 5000);
}

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

// function checkAssignedContacts(name, color, i) {
//   x = { name: name, color: color, selected: false };
//   selUser = document.getElementById(`user${i}`);
//   if (selUser.classList.contains("contactIsSelect") == true) {
//     document.getElementById(`none_checked${i}`).classList.remove("d-none");
//     document.getElementById(`checked${i}`).classList.add("d-none");
//     selUser.classList.remove("contactIsSelect");
//     removeAssignedToContects(x.name, i);
//   } else {
//     document.getElementById(`none_checked${i}`).classList.add("d-none");
//     document.getElementById(`checked${i}`).classList.remove("d-none");
//     selUser.classList.add("contactIsSelect");
//     x.selected = true;
//     addUserToTask(x);
//   }
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

// function removeAssignedToContects(name, index) {
//   for (let i = 0; i < assignedContacts.length; i++) {
//     indexOfName = assignedContacts[i].name.includes(name);
//     if (indexOfName == true) {
//       document.getElementById(`user${index}`).classList.remove("contactIsSelect");
//       assignedContacts.splice(i, 1);
//     }
//   }
//   assignetToContects();
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

// function assignetToContects() {
//   circleCont = document.getElementById("userCircles");
//   circleCont.innerHTML = "";
//   for (let i = 0; i < assignedContacts.length; i++) {
//     renderAssignedToCircle(i, assignedContacts[i].name, assignedContacts[i].color, circleCont);
//   }
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

// function renderAssignedToCircle(i, user, color, circleCont) {
//   if (i <= 3) {
//     circleCont.innerHTML += `
//       <div class="assignetToDiv circle" id="showCircle${i}"></div>
//     `;
//     circle = document.getElementById(`showCircle${i}`).style;
//     circle.backgroundColor = color;
//     circle.border = "2px solid rgba(255, 255, 255, 1)";
//     if (assignedContacts.length >= 1) {
//       if (assignedContacts[0].name != user) {
//         circle.marginLeft = "-24px";
//       }
//     }
//     showUserLetters(`showCircle${i}`, user);
//   } else if (i == 4) {
//     circleCont.innerHTML += showplusSVG();
//   } else {
//     showplusSVG();
//   }
// }

// function showplusSVG() {
//   let moreNumber = assignedContacts.length - 4;
//   return `
//     <span class="contactsMoreNumber">+ ${moreNumber}</span>
//   `;
// }