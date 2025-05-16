import * as contactsHTML from '../../contacts/javascript/contactsHTML.js';
import * as shared from '../../shared/javascript/shared.js';
import * as data from '../../core/downloadData.js';

// ehemals assignetTo

// let assignedTo = document.getElementById("assignedTo"); 
// let category = document.getElementById("category");
let priority = changePriority('medium');
// let standardContainer = "to-do-container";
// let userCredicals;
// let isSelect;

let subArray = [];
let assignedContacts = [];
let allContacts = [];
let searchResults = [];
let isAssignedDropdownOpen = false;

function toggleIsAssignedDropdownOpenFlag(){
  isAssignedDropdownOpen = !isAssignedDropdownOpen;
}

// Das noch irgendwo verarbeiten (es geht ums Plussymbol svg): onclick="stopEvent(event); focusInput()"

document.addEventListener('DOMContentLoaded', () => {
  if(window.location.pathname.endsWith('/add_tasks/add_task.html')){
    init();
    handleEventsFunction();
  }
  changePriority(medium);
});

async function init() {
  data.contactsData.onChange((data) => {
    allContacts = Object.values(data || {});
    console.log('allContacts:', allContacts);
  });
}

function handleEventsFunction(){
  handleAllClickEvents();
  handleKeyAndInputEvents();
  // handleRemainingEvents();
}

function handleAllClickEvents(){
  document.addEventListener('click', (event) => {
    bundleAssignedToClickEvents(event);
    bundleChangePriorityClickEvents(event);
    bundleTaskCategoryClickEvents(event);
    bundleSubtaskClickEvents(event);
    bundleClearAndAddTaskClickEvents(event);
    hidePopUpsWhenBodyClicked(event);
  });
}

function handleKeyAndInputEvents(){
  document.addEventListener('input', (event) => {
    if(event.target.matches('#searchField')){
      searchContacts();
    }
  });
  document.addEventListener('keyup', (event) => {
    if(event.target.matches('#subtask')){
      addSubtaskByEnterClick();
    }
  });
}

function addSubtaskByEnterClick() {
  let text = document.getElementById(`subtask-div`);
  let suby = document.getElementById("subtask");
  text.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && document.hasFocus()) {
      event.preventDefault();
      event.stopPropagation();
      document.getElementById("enterClick").click();
    }
  });
}

// async function handleRemainingEvents(){
//   let templateHTML = await renderSubtaskHTML();
//   templateHTML.id = `yyy${i}`;
// }

function hidePopUpsWhenBodyClicked(event){
  if(event.target.matches('#addTaskBody')){
      hideAllAddTaskPopups()
  } 
}

// --- Subtask Logic Starts Here ---

function bundleSubtaskClickEvents(event){
  if(event.target.matches('#subtask')){
    hideOrShowEditButtons();
    shared.stopEvent(event);
  } else if(event.target.matches('#subtaskInputButtons')){
    clearSubtaskInput();
  } else if(event.target.matches('#enterClick')){
    addSubtask();
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

function rendersubtask() {
  let subtask = document.getElementById("showSubtasks");
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

async function renderSubtaskHTML(i, content){
  let templateHTML = await shared.initHTMLContent('/add_tasks/templates/render-subtask-html.tpl', 'showSubtasks');
  templateHTML.id = `yyy${i}`;
  let wrapperDiv = document.getElementById(`yyy${i}`);
  wrapperDiv.addEventListener('mouseover', () => {
    toggleDNone(i);
  });
  wrapperDiv.addEventListener('mouseout', () => {
    toggleDNone(i);
  });
  wrapperDiv.addEventListener('dblclick', () => {
    editSubtask(i);
  });
  templateHTML.querySelector('li').innerHTML = `${content}`;
  templateHTML.querySelector('div').id = `subBTN${i}`;
  let subBTN = document.getElementById(`subBTN${i}`);
  subBTN.querySelectorAll('svg')[0].addEventListener('click', (event) => {
    editSubtask(i);
    shared.stopEvent(event);
  });
  subBTN.querySelectorAll('svg')[1].addEventListener('click', (event) => {
    deleteSubtask(i);
    shared.stopEvent(event);
  })
  return templateHTML;
}

function toggleDNone(id) {
  document.getElementById(`subBTN${id}`).classList.toggle("d-none");
}

function editSubtask(i) {
  editSubtaskInput(i);
}

function editSubtaskInput(i) {
  let container = document.getElementById(`yyy${i}`);
  container.onmouseover = null;
  container.onmouseout = null;
  container.ondblclick = null;
  let templateHTML = shared.initHTMLContent('/add_tasks/templates/edit-subtask-inputHTML.tpl', `yyy${i}`);
  templateHTML.querySelector('input').value = `${subArray[i]["task-description"]}`; // input id hier war 'subtaskEdited'
  templateHTML.querySelector('.inputButtons').querySelectorAll('img')[0].addEventListener('click', (event) => {
    deleteSubtask(i);
    shared.stopEvent(event);
  });
  templateHTML.querySelector('.inputButtons').querySelectorAll('img')[0].addEventListener('click', (event) => {
    saveEditedSubtask(i);
    shared.stopEvent(event);
  })
  // container.innerHTML = returnEditSubtaskInputHTML(i);
  let edit = document.getElementById(`subtaskEdited`);
  subtask[i] = edit.value;
  return templateHTML;
}

function saveEditedSubtask(i) {
  let text = document.getElementById(`subtaskEdited`).value;
  if (text.length > 0) {
    subArray[i]["task-description"] = text;
    rendersubtask();
  } else {
    showsubtaskIsEmptyError();
  }
}

function showsubtaskIsEmptyError() {
  let emptySub = document.getElementById("emptySubtask");
  emptySub.classList.remove("d-none");
  setTimeout(function () {
    document.getElementById("emptySubtask").classList.add("d-none");
  }, 5000);
}

function deleteSubtask(i) {
  subArray.splice(i, 1);
  rendersubtask();
}

function hideOrShowEditButtons() {
  let cont = document.getElementById("subtask-div");
  let plus = document.getElementById("plusSymbole");
  let subtask = document.getElementById("subtaskInputButtons");
  plus.classList.add("d-none");
  subtask.classList.remove("d-none");
}

// --- Subtask Logic Ends Here ---

function bundleClearAndAddTaskClickEvents(event){
  if(event.target.matches('#clearTaskDiv')){
    clearTask();
  } else if(event.target.matches('#subButton')){
    checkRequiredFields('addTask');
    return false;
  } 
}

function bundleTaskCategoryClickEvents(event){
  if(event.target.matches('#techTask')) {
    hideDropDownCategory();
    changeCategory('Technical Task');
  } else if(event.target.matches('#userStory')){
    hideDropDownCategory();
    changeCategory('User Story');
  } 
}

function bundleChangePriorityClickEvents(event){
  if(event.target.matches('#category')){
    checkDropDown('arrowb');
    shared.stopEvent(event);
  } else if(event.target.matches('#urgent')){
    changePriority('urgent');
  } else if(event.target.matches('#medium')){
    changePriority('medium');
  } else if(event.target.matches('#low')){
    changePriority('low');
  } 
}

function isAssignedToAreaClicked(event){
  return event.target.matches('#changeTo') || event.target.matches('standartValue') ||  event.target.matches('arrowa');
}

function bundleAssignedToClickEvents(event){
  if(isAssignedToAreaClicked(event) && !isAssignedDropdownOpen){
    checkDropDown('arrowa');
    toggleIsAssignedDropdownOpenFlag();
  } else if(isAssignedToAreaClicked(event) && isAssignedDropdownOpen){ 
    hideDropDownAssignedTo();
    toggleIsAssignedDropdownOpenFlag();
  }
  // changeToInputfield();
  // else if(event.target.matches('#searchField')){ 
  //   hideDropDownAssignedTo();
  // }
  // else if(event.target.matches('#changeTo')){
  //   changeToInputfield();
  // } 
}

function checkDropDown(id) {
  let rot = document.getElementById(id);
  if (rot.classList.contains("rotate")) {
    hidingDropdownAndCategory(id)
  } else {
    showingDropdownCategory(id);
  }
}

function hidingDropdownAndCategory(id){
  if (id == "arrowa") {
    hideDropDownAssignedTo();
  } else {
    hideDropDownCategory();
  }
}

function showingDropdownCategory(id){
  if (id == "arrowa") {
    showDropDownAssignedTo();
  } else {
    showDropDownCategory();
  }
}

function changeToInputfield() { 
  let changecont = document.getElementById("changeTo");
  let search = document.getElementById("searchArea");
  let input = document.getElementById("searchField");
  let standardValue = document.getElementById("standartValue");
  window.addEventListener("click", (event) => {
    if (changecont.contains(event.target)) {
      search.classList.remove("d-none");
      input.classList.remove("d-none");
      standardValue.classList.add("d-none");
      input.focus();
      showDropDownAssignedTo();
    } else {
      search.classList.add("d-none");
      input.classList.add("d-none");
      standardValue.classList.remove("d-none");
      input.value = "";
    }
  });
}

function hideDropDownAssignedTo() {
  document.getElementById("arrowa").classList.remove("rotate");
  let contact = document.getElementById("assignedToDropDown");
  contact.classList.add("d-none");
  contact.innerHTML = "";
}

// Hier beginnt die Funktionenkette, die die Zuweisung der Kontakte zur Aufgabe verwaltet

async function showDropDownAssignedTo() {
  getContactContainerAndClearContentForRendering();
  showAllContactsInDropdownMenu();
  showDropdownAndRotateArrow();
}

function getContactContainerAndClearContentForRendering(){
  let contact = document.getElementById("assignedToDropDown");
  contact.innerHTML = "";
}

function showAllContactsInDropdownMenu(){
  for (let i = 0; i < allContacts.length; i++) {
    showSingleContactsInDropdownMenu(i);
  }
}

async function showSingleContactsInDropdownMenu(i){
  let user = allContacts[i];
  await renderAssignedToHTML(user, i);
  if (assignedContacts != 0) {
    manageIsContactSelectedVisibility(user, i);
  }
}

function showDropdownAndRotateArrow(){
  let contact = document.getElementById("assignedToDropDown");
  contact.classList.remove("d-none");
  document.getElementById("arrowa").classList.add("rotate");
}

function manageIsContactSelectedVisibility(user, i){
  if (checkAssignedContactsStatus(user.name) === true) {
    highlightSelectedContact(i);
  } else {
    hideHighlightingOnSelectedContact(i);
  }
}

function hideHighlightingOnSelectedContact(i){
  document.getElementById(`user${i}`).classList.remove("contactIsSelect");
  document.getElementById(`checked${i}`).classList.add("d-none");
}

function highlightSelectedContact(i){
  document.getElementById(`user${i}`).classList.add("contactIsSelect");
  document.getElementById(`checked${i}`).classList.remove("d-none");
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

function searchContacts() {
  document.getElementById("assignedToDropDown").innerHTML = "";
  let search = document.getElementById("searchField");
  let text = search.value.toLowerCase();
  let searchResults = [];
  if (text.length >= 1) {
    for (let i = 0; i < allContacts.length; i++) {
      aU = allContacts[i].name.toLowerCase();
      if (aU.includes(text)) {
        searchResults.push(allContacts[i]);
      }
    }
    showDropDownAssignedToOnlyResult();
  } else {
    showDropDownAssignedTo();
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
  assignedToLetters.id = `assignedToLetters${i}`; // ehemals assignetToLetters
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
    addUserToTask(x);
  }
}

function addUserToTask(user) {
  let userCredicals = {
    name: user.name,
    color: user.color,
    isSelected: user.selected,
  };
  assignedContacts.push(userCredicals);
  assignedToContacts();
}

function removeAssignedToContects(name, index) {
  for (let i = 0; i < assignedContacts.length; i++) {
    let indexOfName = assignedContacts[i].name.includes(name);
    if (indexOfName == true) {
      document.getElementById(`user${index}`).classList.remove("contactIsSelect");
      assignedContacts.splice(i, 1);
    }
  }
  assignedToContacts();
}

function assignedToContacts() {
  for (let i = 0; i < assignedContacts.length; i++) {
    renderAssignedToCircle(i, assignedContacts[i].name, assignedContacts[i].color);
  }
}

function renderAssignedToCircle(i, user, color) {
  let circleCont = document.getElementById("userCircles");
  circleCont.innerHTML = "";
  if (i <= 3) {
    loadTemplateAndAddStyling(i, user, color);
  } else if (i == 4) {
    circleCont.innerHTML += showplusSVG();
  } else {
    showplusSVG();
  }
}

async function loadTemplateAndAddStyling(i, user, color){
  let templateHTML = await shared.initHTMLContent('/add_tasks/templates/assigned-to-div-circle.tpl', 'userCircles'); 
  templateHTML.id = `showCircle${i}`;
  getCircleAndStyleIt(i, color, user);
  shared.showUserLetters(`showCircle${i}`, user);
}

function getCircleAndStyleIt(i, color, user){
  let circle = document.getElementById(`showCircle${i}`).style;
  circle.backgroundColor = color;
  circle.border = "2px solid rgba(255, 255, 255, 1)";
  if (assignedContacts.length >= 1) {
    if (assignedContacts[0].name != user) {
      circle.marginLeft = "-24px";
    }
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
  // contact.innerHTML = "";
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
  let templateHTML = await shared.initHTMLContent('/add_tasks/templates/show-dropdown-category.tpl', 'categoryDropDown'); 
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

// function createNewTask() {
//   return {
//     title: getInputValue("inputTitle"),
//     description: getInputValue("inputDescription"),
//     assigned: assignedContacts,
//     date: getInputValue("date"),
//     priority: priority,
//     category: document.getElementById("categoryText").textContent,
//     subtask: subArray,
//     container: standardContainer
//   };
// }

function hideRequiredText() {
  let ids = ["requiredTitle", "requiredDate", "requiredCatergory"];
  ids.forEach(function (id) {
    let element = document.getElementById(id);
    element.classList.add("d-none");
  });
}

// function getInputValue(elementId) {
//   return document.getElementById(elementId).value;
// }

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

function createSubtaskJson(value) {
  return { "task-description": value, "is-tasked-checked": false };
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

// All unused functions are lying here

// function focusInput() {
//   hideOrShowEditButtons();
//   let activSubtask = document.getElementById("subtask");
//   activSubtask.focus();
// }

// function startAnimation() {
//   scrollTo(0, 0);
//   document.getElementById("addedAnimation").classList.remove("d-none");
//   document.getElementById("addedAnimation").classList.add("erase-in");
//   document.getElementById("addTaskBody").classList.add("overflow-hidden");
//   setTimeout(goToBoard, 1500);
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