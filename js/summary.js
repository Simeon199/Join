let userName = getUserNickname();
let firstTime = "true";

const BASE_URL1 = "https://join-testing-42ce4-default-rtdb.europe-west1.firebasedatabase.app/";

// numberOfToDo
async function numberOfToDo() {
  let responseJson = await loadDataTwo();
  let allTasks = responseJson["tasks"];

  let numberOfToDo = 0;

  for (const key in allTasks) {
    let task = allTasks[key];

    // change category
    if (task["category"] === "to-do-container") {
      console.log(task["category"]);
      numberOfToDo++;
    }
  }
}

// loadDataTwo
async function loadDataTwo(path = "") {
  let response = await fetch(BASE_URL1 + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

async function init() {
  greetAnimation();
  greet();

  await numberOfToDo();
  console.log(await loadDataTwo());

  initSidebar();
  checkIfUserIsLoggedIn();
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
