let userName = getUserNickname();
let firstTime = "true";
let allTasks;

const BASE_URL1 = "https://join-testing-42ce4-default-rtdb.europe-west1.firebasedatabase.app/";

async function init() {
  let responseJson = await loadDataTwo();
  allTasks = responseJson["everyTasks"];

  greetAnimation();
  greet();

  renderNumberOfAllContainers();

  initSidebar();
  checkIfUserIsLoggedIn();

  console.log(allTasks);
  console.log(loadDataTwo());
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
  let response = await fetch(BASE_URL1 + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

function greet() {
  cont = document.getElementById("greetingCont");
  if (userName === "Guest") {
    cont.innerHTML = /*html*/ `
        <p>Good morning</p>
    `;
  } else {
    cont.innerHTML = /*html*/ `
        <p>Good morning,<span class='greet-username'>${userName}</span></p>
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
          Good morning
      `;
    } else {
      greetAnimationText.innerHTML = /*html*/ `
         Good morning, <span class='greet-animation-username'>${userName}</span>
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
