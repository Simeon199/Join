let inputTitle = document.getElementById("inputTitle");
let inputDescription = document.getElementById("inputDescription");
let assignetTo = document.getElementById("assignetTo");
let date = document.getElementById("date");
let category = document.getElementById("category");
const subtask = document.getElementById("sowSubtasks");

function init() {
  changePriority(medium);
}

function taskMarker() {
  document.getElementById("addTask").classList.add("currentSection");
}

function changePriority(id) {
  removeBackground(id);
  if (id == urgent) {
    urgent.classList.add("backgroundUrgent");
  }
  if (id == medium) {
    medium.classList.add("backgroundMedium");
  }
  if (id == low) {
    low.classList.add("backgroundLow");
  }
  changeImg(id);
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

function changeImg(condition) {
  let urgentImg = document.getElementById("imgUrgent");
  let mediumImg = document.getElementById("imgMedium");
  let lowImg = document.getElementById("imgLow");
  if (condition == urgent) {
    urgentImg.setAttribute("src", "Assets/img/Prio altaurgent_white.svg");
  } else {
    urgentImg.setAttribute("src", "Assets/img/Prio altaUrgent_symbole.svg");
  }
  if (condition == medium) {
    mediumImg.setAttribute("src", "Assets/img/Prio mediameduim_white.svg");
  } else {
    mediumImg.setAttribute("src", "Assets/img/Capa 1medium_color.svg");
  }
  if (condition == low) {
    lowImg.setAttribute("src", "Assets/img/Prio bajalow_white.svg");
  } else {
    lowImg.setAttribute("src", "Assets/img/Prio bajaLow_symbole.svg");
  }
}

function createTask() {
  console.log("create");
}

function clearTask() {
    // console.log(inputTitle.value);
    // inputTitle.value= "";
    // inputDescription.value='';
    // assignetTo.value='';
    // date.value = '';
    category = changeCategory('Select task category');
    // clearSubtask();
    changePriority(medium);
}

function showDropDownAssignedTo() {
    showContactsToAssign();
    document.getElementById('assignedToDropDown').classList.remove('d-none');
    document.getElementById('assignedToDropDown').innerHTML = /*html*/`
            <div onclick="hideDropDownAssignedTo()"><span>Test1</span></div>
            <div><span>Test2</span></div>
            <div><span>Test3</span></div>
    `;
}

function showDropDownCategory() {
    document.getElementById('categoryDropDown').classList.remove('d-none');
    document.getElementById('categoryDropDown').innerHTML = /*html*/`
            <div onclick="hideDropDownCategory(); changeCategory('Technical Task')"><span>Technical Task</span></div>
            <div onclick="hideDropDownCategory(); changeCategory('User Story')"><span>User Story</span></div>
    `;
}

function hideDropDownAssignedTo() {
  document.getElementById("assignedToDropDown").classList.add("d-none");
}

function hideDropDownCategory() {
  document.getElementById("categoryDropDown").classList.add("d-none");
}

function changeCategory(text) {
    document.getElementById('categoryText').innerHTML = `${text}`;
}

async function showContactsToAssign() {
  await loadData("/contacts");
  // await loadData()
}

function addSubtask() {
    let text = document.getElementById('subtask');
    // aS = document.getElementById("sowSubtasks");
    aS = subtask;
    aS.classList.remove('d-none');
    // subtask.classList.remove('d-none');
    aS.innerHTML += /*html*/`
        <div class="subtasks"><span>${text.value}</span></div>
    `;
    text.value='';
}

function clearSubtask() {
    subtask.innerHTML= '';
    subtask.classList.add('d-none');
}
