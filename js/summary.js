let userName = getUserNickname();
let firstTime = "true";
let allTasks;
let tasks = [];

const BASE_URL = "https://join-privat-default-rtdb.europe-west1.firebasedatabase.app/";

async function init() {
  let responseJson = await loadTasksFromDatabase();
  allTasks = responseJson;

  greetAnimation();
  greet();

  renderNumberOfAllContainers();

  await initSidebar();
  checkIfUserIsLoggedIn();

  loadTasksFromDatabase();
  getDateFormUrgetTask();
}

async function renderNumberOfAllContainers() {
  numberOfSection("to-do");
  numberOfSection("done");
  numberOfSection("in-progress");
  numberOfSection("await-feedback");
  numberOfSection("tasks-in-board");

  numberOfUrgentSection();
}

// numberOfSection
function numberOfSection(section) {
  let sectionNumber = document.getElementById(section + "-number");
  let number = 0;
  if (section === "tasks-in-board") {
    sectionNumber.innerHTML = allTasks.length;
    return;
  }
  for (const key in allTasks) {
    let task = allTasks[key];
    if (task["container"] === section + "-container") {
      number++;
    }
  }
  try {
    sectionNumber.innerHTML = number;
  } catch (error) {}
}

// numberOfUrgentSection
function numberOfUrgentSection() {
  let sectionNumber = document.getElementById("urgent-number");
  let number = 0;

  for (const key in allTasks) {
    let task = allTasks[key];
    if (task["priority"] === "urgent") {
      number++;
    }
  }
  sectionNumber.innerHTML = number;
}

// loadDataTwo
async function loadDataTwo(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

function greet() {
  cont = document.getElementById("greetingCont");
  if (userName === "Guest") {
    cont.innerHTML = /*html*/ `
        <p>${greetTime()}</p>
    `;
  } else {
    cont.innerHTML = /*html*/ `
        <p>${greetTime()},<span class='greet-username'>${userName}</span></p>
    `;
  }
}

function goToBoard() {
  window.location.href = "board.html";
}

function taskMarker() {
  document.getElementById("summary").classList.add("currentSection");
}

function greetAnimation() {
  checkIfFirstTime();

  const greetAnimation = document.getElementById("greet-animation");
  const greetAnimationText = document.getElementById("greet-animation-text");
  if (firstTime === "true") {
    if (userName === "Guest") {
      greetAnimationText.innerHTML = /*html*/ `
        <p>${greetTime()}</p>
      `;
    } else {
      greetAnimationText.innerHTML = /*html*/ `
        <p>${greetTime()},</p> <span class='greet-animation-username'>${userName}</span>
      `;
    }

    greetAnimation.classList.remove("d-none");

    // Set a timeout to hide the animation after a certain delay (e.g., 1.5 seconds)
    setTimeout(() => greetAnimation.classList.add("hide-greet-animation"), 1500);

    // Event listener to set display: none after the transition ends
    greetAnimation.addEventListener("transitionend", () => {
      if (greetAnimation.classList.contains("hide-greet-animation")) {
        greetAnimation.classList.add("d-none");
        firstTime = false;
        localStorage.setItem("firstTime", "false");
      }
    });
  } else {
    greetAnimation.classList.add("d-none");
  }
}

function checkIfFirstTime() {
  let trueOrFalse = localStorage.getItem("firstTime");
  if (trueOrFalse) {
    firstTime = trueOrFalse;
  }
}

async function loadTasksFromDatabase() {
  let response = await loadRelevantData();
  if (response && response.testRealTasks) {
    for (index = 0; index < response.testRealTasks.length; index++) {
      tasks.push(response.testRealTasks[index]);
    }
    return tasks;
  }
  return [];
}

async function loadRelevantData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

function greetTime() {
  const d = new Date();
  const time = d.getHours();

  if (time >= 4 && time <= 10) {
    return "Good morning";
  } else if (time > 12 && time < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

function getDateFormUrgetTask() {
  dateCont = document.getElementById("upcommingDate");
  findUrgetnTasks();
  const earliestdate = returnDatefromAllUrgentTasks();
  getEarliestDate(earliestdate);
}

function getEarliestDate(earliestDate) {
  const options = {year: "numeric", month: "long", day: "numeric"};
  document.getElementById("upcommingDate").innerHTML = 
  earliestDate.toLocaleDateString("en-US", options);
}

function findUrgetnTasks() {
  return tasks.filter((t)=> t.priority === 'urgent');
}

function returnDatefromAllUrgentTasks() {
  const urgetTasks = findUrgetnTasks();
  if (urgetTasks.length > 0) {
    return earliestDate(urgetTasks)
  }
  return null;
}

function earliestDate(task) {
  const date = task.map(t => new Date(t.date)).filter(d => !isNaN(d));
  const earliestdate = new Date(Math.min(...date));
  return earliestdate;
}