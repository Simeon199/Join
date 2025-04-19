let userName = getUserNickname();
let firstTime = "true";
let allTasks;
let tasks = [];

// Mein Firebase Zugang - Anfang

// const BASE_URL = "https://join-9bbb0-default-rtdb.europe-west1.firebasedatabase.app/";

// Mein Firebase Zugang - Ende

// const BASE_URL = "https://join-privat-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Initializes the application, loads tasks, and sets up the UI.
 *
 */
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

/**
 * Renders the number of all container sections.
 *
 */
async function renderNumberOfAllContainers() {
  numberOfSection("to-do");
  numberOfSection("done");
  numberOfSection("in-progress");
  numberOfSection("await-feedback");
  numberOfSection("tasks-in-board");
  numberOfUrgentSection();
}

/**
 * Updates the number of tasks in a specified section.
 *
 * @param {string} section - The ID of the section to update.
 */
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
  } catch (error) { }
}

/**
 * Updates the number of urgent tasks in the section.
 *
 */
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

/**
 * Fetches and returns JSON data from a specified path.
 *
 * @param {string} path - The path to the JSON file.
 */
async function loadDataTwo(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

/**
 * Fetches and returns JSON data from a specified path.
 *
 * @param {string} path - The path to the JSON file.
 */
async function loadRelevantData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

/**
 * Updates the greeting message based on the user's name.
 *
 */
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

/**
 * Navigates to the board page.
 *
 */
function goToBoard() {
  window.location.href = "board.html";
}

/**
 * Marks the "summary" element as the current section.
 *
 */
function taskMarker() {
  document.getElementById("summary").classList.add("currentSection");
}

/**
 * Handles the greeting animation for first-time users.
 *
 */
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

/**
 * Checks if it is the user's first time and updates the variable accordingly.
 *
 */
function checkIfFirstTime() {
  let trueOrFalse = localStorage.getItem("firstTime");
  if (trueOrFalse) {
    firstTime = trueOrFalse;
  }
}

/**
 * Loads tasks from the database and returns them.
 *
 */
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

/**
 * Returns a greeting based on the current time of day.
 *
 */
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

/**
 * Gets the date for urgent tasks and updates the display.
 *
 */
function getDateFormUrgetTask() {
  dateCont = document.getElementById("upcommingDate");
  findUrgetnTasks();
  const earliestdate = returnDatefromAllUrgentTasks();
  getEarliestDate(earliestdate);
}

/**
 * Displays the earliest date in a formatted string.
 *
 * @param {Date} earliestDate - The date to format and display.
 */
function getEarliestDate(earliestDate) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  document.getElementById("upcommingDate").innerHTML = earliestDate.toLocaleDateString("en-US", options);
}

/**
 * Filters tasks to return only those with 'urgent' priority.
 *
 */
function findUrgetnTasks() {
  return tasks.filter((t) => t.priority === "urgent");
}

/**
 * Returns the earliest date from all urgent tasks.
 *
 */
function returnDatefromAllUrgentTasks() {
  const urgetTasks = findUrgetnTasks();
  if (urgetTasks.length > 0) {
    return earliestDate(urgetTasks);
  }
  return null;
}

/**
 * Finds the earliest date from an array of tasks.
 *
 * @param {Array} task - Array of tasks with date properties.
 */
function earliestDate(task) {
  const date = task.map((t) => new Date(t.date)).filter((d) => !isNaN(d));
  const earliestdate = new Date(Math.min(...date));
  return earliestdate;
}
