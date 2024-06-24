let userName = getUserNickname();
let firstTime = "true";

async function init() {
  await checkIfFirstTime();
  greetAnimation();
  greet();
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
  if (firstTime === "true") {
    console.log(firstTime);
    const greetAnimation = document.getElementById("greet-animation");

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
  }
}

function checkIfFirstTime() {
  let trueOrFalse = localStorage.getItem("firstTime");
  if (trueOrFalse) {
    firstTime = trueOrFalse;
  }
}
