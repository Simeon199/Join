// const BASE_URL1 = "https://join-testing-42ce4-default-rtdb.europe-west1.firebasedatabase.app/";
// const BASE_URL = 'https://join-privat-default-rtdb.europe-west1.firebasedatabase.app/';

let assignetTo = document.getElementById("assignetTo");
let category = document.getElementById("category");
let priority;
let subArray = [];
let assignedContacts = [];
let standardContainer = "to-do-container";

async function init() {
  changePriority(medium);
  getAllContacts();
  tasksId = await loadTaskIdFromFirebase();
}

async function saveTaskIdToFirebase(taskId) {
  await upload("taskId", taskId);
}

async function loadTaskIdFromFirebase() {
  let response = await loadRelevantData("taskId");
  if (response !== null && response !== undefined) {
    return response;
  }
  return 0; // Fallback-Wert, falls keine taskId gefunden wurde
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
  // changeImg(id);
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

async function createTask(side) {
  // checkDate();
  await ensureAllTasksExists();
  await saveTask();
  if (side == "addTask") {
    startAnimation();
  }
  clearTask();
  if (side != "addTask") {
    hideAddTaskPopUp();
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

function showDropDownCategory() {
  document.getElementById("categoryDropDown").classList.remove("d-none");
  document.getElementById("arrowb").classList.add("rotate");
  document.getElementById("categoryDropDown").innerHTML = /*html*/ `
            <div onclick="hideDropDownCategory(); changeCategory('Technical Task')"><span>Technical Task</span></div>
            <div onclick="hideDropDownCategory(); changeCategory('User Story')"><span>User Story</span></div>
    `;
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

async function checkRequiredFields(side) {
  let title = document.getElementById("inputTitle").value;
  let date = document.getElementById("date").value;
  if (title.length <= 1 || date.length <= 1 || checkCategory() == false) {
    showRequiredText();
  } else {
    console.log("hi");
    showBoardLoadScreen();
    await createTask(side);
    hideBoardLoadScreen();
  }
}

function showRequiredText() {
  let ids = ["requiredTitle", "requiredDate", "requiredCatergory"];
  ids.forEach(function (id) {
    let element = document.getElementById(id);
    element.classList.remove("d-none");
  });
}

function hideRequiredText() {
  let ids = ["requiredTitle", "requiredDate", "requiredCatergory"];
  ids.forEach(function (id) {
    let element = document.getElementById(id);
    element.classList.add("d-none");
  });
}

async function upload(path = "", data) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

async function ensureAllTasksExists() {
  let response = await loadRelevantData();
  if (!response || !response.hasOwnProperty("testRealTasks")) {
    await upload("testRealTasks", []);
  }
}

async function saveTask() {
  let inputTitle = document.getElementById("inputTitle").value;
  let inputDescription = document.getElementById("inputDescription").value;
  let date = document.getElementById("date").value;
  let category = document.getElementById("categoryText").textContent;

  let newTask = {
    title: inputTitle,
    description: inputDescription,
    assigned: assignedContacts,
    date: date,
    priority: priority,
    category: category,
    subtask: subArray,
    container: standardContainer,
    tasksIdentity: tasksId,
  };
  tasksId++;
  await saveTaskIdToFirebase(tasksId); // Speichern der aktuellen tasksId in Firebase
  await uploadToAllTasks(newTask);
  tasks.push(newTask);
  saveTasksToLocalStorage();
  updateCategories();
  updateHTML();
}

async function uploadToAllTasks(task) {
  try {
    let response = await loadRelevantData();
    // let response = await loadData();
    let allTasks = response["testRealTasks"];
    if (!Array.isArray(allTasks)) {
      allTasks = [];
    }
    allTasks.push(task);
    await upload("testRealTasks", allTasks);
  } catch (error) {
    console.error("Fehler in uploadToAllTasks:", error);
  }
}

// function um festzustellen ob DropDown offen oder geschlossen ist
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

function hideAllAddTaskPopups() {
  hideDropDownAssignedTo();
  hideDropDownCategory();
  changeToInputfield();

  plus = document.getElementById("plusSymbole");
  subtask = document.getElementById("subtaskInputButtons");

  plus.classList.remove("d-none");
  subtask.classList.add("d-none");
}

async function loadRelevantData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

async function deleteTask(taskId) {
  showBoardLoadScreen();

  tasks = tasks.filter((task) => task.tasksIdentity !== taskId);
  for (let i = taskId; i < tasks.length; i++) {
    tasks[i].tasksIdentity = i;
  }
  await upload("testRealTasks", tasks);
  saveTasksToLocalStorage();
  tasksId = tasks.length;
  await saveTaskIdToFirebase(tasksId);
  updateCategories();
  updateHTML();

  hideBoardLoadScreen();
}

function startAnimation() {
  scrollTo(0, 0);
  document.getElementById("addedAnimation").classList.remove("d-none");
  document.getElementById("addedAnimation").classList.add("erase-in");
  document.getElementById("addTaskBody").classList.add("overflow-hidden");
  setTimeout(goToBoard, 1500);
}

function goToBoard() {
  window.location.href = "board.html";
}

function checkDate() {
   let dateInput = document.getElementById('date');
   console.log("date",dateInput.value);
   const addDate = new Date();
   console.log(addDate);
  if (dateInput.value < addDate) {
   console.log("vergangene Zeit kann nicht eingegeben werden!!")
  } else {
    console.log("zeit ist größer als jetzt!");
  }
}