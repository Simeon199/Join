checkWebsiteLocation();
checkIfUserIsLoggedIn();

// stopEvent
function stopEvent(event) {
  event.stopPropagation();
}

function greetUser(){
  let nickname = localStorage.getItem("userNickname");
  if (!nickname) {
    nickname = sessionStorage.getItem("userNickname");
  }
  if (nickname) {
    alert("Sei gegrüßt " + nickname);
  }
}

function createLoggedInStatusObject() {
  let obj = {
    status: localStorage.getItem("isLoggedIn"),
    currentUser: localStorage.getItem("currentUser"),
    sessionUser: sessionStorage.getItem("currentUser"),
    sessionStatus: sessionStorage.getItem("isLoggedIn"),
    currentPath: window.location.pathname.split("/").pop(),
    guestLoginStatus: sessionStorage.getItem("guestLoginStatus"),
  };
  return obj;
}

function checkIfUserIsLoggedIn() {
  let LoggedInObject = createLoggedInStatusObject();
  if (LoggedInObject["guestLoginStatus"] == "true") {
    if (LoggedInObject["currentPath"] !== "summary.hmtl") {
      console.log("Nutzer ist als Gast eingeloggt");
    }
  } else if (
    (LoggedInObject["status"] === "true" && LoggedInObject["currentUser"]) ||
    (LoggedInObject["sessionStatus"] === "true" && LoggedInObject["sessionUser"])
  ) {
    console.log("Nutzer ist eingeloggt");
  } else {
    if (
      LoggedInObject["currentPath"] !== "register.html" &&
      LoggedInObject["currentPath"] !== "login.html"
    ) {
      window.location.href = "login.html";
    }
  }
  if (LoggedInObject["sessionStatus"] === "true" && !LoggedInObject["sessionUser"]) {
    setStorageAttributes();
  }
}

function registerInputFieldFunction(
  inputLock,
  registerInputField,
  visibilityInputImage,
  visibility
) {
  registerInputField.addEventListener("input", function () {
    inputLock.classList.add("d-none");
    if (registerInputField.value.length > 0 && registerInputField.type == "password") {
      visibilityInputImage.classList.remove("d-none");
      visibility.classList.add("d-none");
    } else if (registerInputField.value.length > 0 && registerInputField.type == "text") {
      visibilityInputImage.classList.add("d-none");
      visibility.classList.remove("d-none");
    } else if (registerInputField.value.length == 0) {
      inputLock.classList.remove("d-none");
      visibilityInputImage.classList.add("d-none");
      visibility.classList.add("d-none");
    }
  });
}

function registerInputFieldRepeatFunction(
  registerInputFieldRepeat,
  inputLockRepeat,
  visibilityInputImageRepeat,
  visibility,
  visibilityRepeat
) {
  registerInputFieldRepeat.addEventListener("input", function () {
    inputLockRepeat.classList.add("d-none");
    if (registerInputFieldRepeat.value.length > 0 && registerInputFieldRepeat.type == "password") {
      visibilityInputImageRepeat.classList.remove("d-none");
      visibility.classList.add("d-none");
    } else if (
      registerInputFieldRepeat.value.length > 0 &&
      registerInputFieldRepeat.type == "text"
    ) {
      visibilityInputImageRepeat.classList.add("d-none");
      visibilityRepeat.classList.remove("d-none");
    } else if (registerInputFieldRepeat.value.length == 0) {
      inputLockRepeat.classList.remove("d-none");
      visibilityInputImageRepeat.classList.add("d-none");
      visibilityRepeat.classList.add("d-none");
    }
  });
}


function checkWebsiteLocation() {
  let currentURL = window.location.href;
  if (currentURL.includes("login.html")) {
    document.addEventListener("DOMContentLoaded", () => {
      let loginPassword = document.getElementById("loginPassword");
      let loginLock = document.getElementById("loginLock");
      loginPasswordFunction(loginPassword, loginLock, visibilityInputImage, visibility);
    });
  } else if (currentURL.includes("register.html")) {
    document.addEventListener("DOMContentLoaded", () => {
      let obj = createObjectforEventListener();
      registerInputFieldFunction(
        obj["inputLock"],
        obj["registerInputField"],
        obj["visibilityInputImage"],
        obj["visibility"]
      );
      registerInputFieldRepeatFunction(
        obj["registerInputFieldRepeat"],
        obj["inputLockRepeat"],
        obj["visibilityInputImageRepeat"],
        obj["visibility"],
        obj["visibilityRepeat"]
      );
    });
  } else {
    checkIfUserIsLoggedIn();
  }
}

function createObjectforEventListener() {
  let object = {
    visibility: document.getElementById("visibility"),
    visibilityRepeat: document.getElementById("visibilityRepeat"),
    registerInputField: document.getElementById("loginPassword"),
    registerInputFieldRepeat: document.getElementById("loginPasswordRepeat"),
    visibilityInputImage: document.getElementById("visibilityInputImage"),
    visibilityInputImageRepeat: document.getElementById("visibilityInputImageRepeat"),
    inputLock: document.getElementById("inputLock"),
    inputLockRepeat: document.getElementById("inputLockRepeat"),
  };
  return object;
}
