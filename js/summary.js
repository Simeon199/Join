let userName = getUserNickname();
let firstTime = "true";

async function init() {
  greetAnimation();
  greet();

  initSidebar();
  checkIfUserIsLoggedIn();
}

function greet() {
  cont = document.getElementById("greetingCont");
  if ((userName = "Guest")) {
    cont.innerHTML = /*html*/ `
        <p>Good morning</p>
    `;
  } else {
    cont.innerHTML = /*html*/ `
        <p>Good morning,</p><h3>${userName}</h3>
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
