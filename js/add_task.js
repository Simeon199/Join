const BASE_URL1 = 'https://join-testing-42ce4-default-rtdb.europe-west1.firebasedatabase.app/';

let assignetTo = document.getElementById("assignetTo");
let category = document.getElementById("category");
let priority
let subArray = [];
let assignedContacts = [];
let taskinp = [];

function init() {
  changePriority(medium);
  getAllContacts();
}

function taskMarker() {
  document.getElementById("addTask").classList.add("currentSection");
}

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

async function createTask(containerDefault = "to-do-container") {
  console.log("create...");
  // showrequiredText1()
  // debugger
  await saveTask(containerDefault);
}

function clearTask() {
  let inputTitle = document.getElementById("inputTitle");
  let inputDescription = document.getElementById("inputDescription");
  let date = document.getElementById("date");
    console.error("Clearing...")
    // console.log(inputTitle.value);
    inputTitle.value= "";
    inputDescription.value='';
    clearAssignedTo();
    date.value = '';
    category = changeCategory('Select task category');
    clearSubtask();
    changePriority(medium);
}

function showDropDownCategory() {
    document.getElementById('categoryDropDown').classList.remove('d-none');
    document.getElementById('arrowb').classList.add("rotate");
    document.getElementById('categoryDropDown').innerHTML = /*html*/`
            <div onclick="hideDropDownCategory(); changeCategory('Technical Task')"><span>Technical Task</span></div>
            <div onclick="hideDropDownCategory(); changeCategory('User Story')"><span>User Story</span></div>
    `;
}

function hideDropDownCategory() {
  document.getElementById("categoryDropDown").classList.add("d-none");
  document.getElementById("arrowb").classList.remove("rotate");
}

function changeCategory(text) {
    document.getElementById('categoryText').innerHTML = `${text}`;
}

function showrequiredText() {
  let ids = ["requiredTitle", "requiredDate", "requiredCatergory"];
  ids.forEach(function(id) {
    let element = document.getElementById(id);
    if (element) {
      element.classList.remove('d-none');
    }
  }); 
}

async function upload(path = "", data = {}) {
  let response = await fetch(BASE_URL1 + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

async function saveTask(containerDefault) {
  let inputTitle = document.getElementById("inputTitle").value;
  let inputDescription = document.getElementById("inputDescription").value;
  let date = document.getElementById("date").value;
  let category = document.getElementById('categoryText').textContent;
  let ztask = {
    title: inputTitle,
    description: inputDescription,
    assigned: assignedContacts,
    date: date,
    priority: priority,
    category: category,
    subtask: subArray
  }
  taskinp.push(ztask);
  await upload("tasks", {
    title: inputTitle,
    description: inputDescription,
    assigned: assignedContacts,
    date: date,
    priority: priority,
    category: category,
    subtask: subArray,
    container: containerDefault 
  })
  console.log(taskinp);
  // return (responseToJson)
}

// function um festzustellen ob DropDown offen oder geschlossen ist
function checkDropDown(id) {
  rot = document.getElementById(id);
  if (rot.classList.contains("rotate")) {
    if (id == "arrowa") {
      hideDropDownAssignedTo()
    } else {
      hideDropDownCategory()
    }
  } else {
    if (id == "arrowa") {
      showDropDownAssignedTo()
    } else {
      showDropDownCategory()
    }
  }
}