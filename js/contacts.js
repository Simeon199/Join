let allUsers = [];
let firstUsersNameLetter = [];
let colors = [
  "#4B3C99", // MB
  "#FF4646", // TW
  "#FF8C1A", // AM
  "#AA4FFF", // AS
  "#6464FF", // BZ
  "#DE1AFF", // DE
  "#FFC61A", // EF
  "#32D4C3", // EM
  "#FF5733", // New Color 1
  "#33FF57", // New Color 2
  "#3357FF", // New Color 3
  "#FF33A8", // New Color 4
  "#A833FF", // New Color 5
  "#33FFDD", // New Color 6
  "#FFDD33", // New Color 7
  "#DD33FF", // New Color 8
  "#FF336B", // New Color 9
  "#6BFF33", // New Color 10
  "#1E3A55", // New Color 11
  "#FFA500", // New Color 12
  "#00CED1", // New Color 13
  "#8A2BE2", // New Color 14
  "#A52A2A", // New Color 15
  "#7FFF00", // New Color 16
  "#D2691E", // New Color 17
  "#FF7F50", // New Color 18
  "#DC143C", // New Color 19
  "#008B8B", // New Color 20
];
let activeContactIndex = null;

// initContact
async function initContact() {
  allUsers = [];
  firstUsersNameLetter = [];
  await getAllContacts();
  await renderContactList();
}

// getAllContacts
async function getAllContacts(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseJson = await response.json();
  let userData = responseJson["contacts"];
  for (const key in userData) {
    const userD = userData[key];
    let newUser = {
      id: key,
      name: userD.name,
      email: userD.email,
      phone: userD.number,
      color: userD.color,
    };
    allUsers.push(newUser);
    sortContacts();
  }
  await sortAllUserLetters();
}

// sortContacts
function sortContacts() {
  allUsers.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

// sortAllUserLetters
function sortAllUserLetters() {
  for (let i = 0; i < allUsers.length; i++) {
    let userLetter = allUsers[i]["name"].charAt(0).toLowerCase();
    if (!firstUsersNameLetter.includes(userLetter)) {
      firstUsersNameLetter.push(userLetter);
    }
  }
  firstUsersNameLetter.sort();
}

// postNewContact
async function postNewContact(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

// deleteData
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

// firstLetterFirstTwoWords
function firstLetterFirstTwoWords(text) {
  // Split the string into words
  const words = text.split(" ");

  // Extract the first letter of each word
  const firstLetters = words.map((word) => word.charAt(0));

  // Concatenate the first two letters into a string
  const result = firstLetters.slice(0, 2).join("");

  return result.toUpperCase();
}

// randomColor
function randomColor() {
  let randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

// showPopUp
function showPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("add-task-pop-up").classList.remove("translate-100");

  hideAllSmallPopUps();
}

// hidePopUp
function hidePopUp() {
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

// show ContactSuccessfullyCreatedPopUp
function showContactSuccessfullyCreatedPopUp() {
  document
    .getElementById("contact-successfully-created-pop-up-bg")
    .classList.remove("hide-pop-up-translate-100");
}

// hide ContactSuccessfullyCreatedPopUp
function hideContactSuccessfullyCreatedPopUp() {
  setTimeout(() => {
    document
      .getElementById("contact-successfully-created-pop-up-bg")
      .classList.add("hide-pop-up-translate-100");
  }, 3000);
}

// load screen
function showLoadScreen() {
  document.getElementById("load-screen").classList.remove("d-none");
}

function hideLoadScreen() {
  document.getElementById("load-screen").classList.add("d-none");
}

// toggleBigContact
function toggleBigContact(i, userName, userEmail, userNumber, userID, userColor) {
  let bigContact = document.getElementById("big-contact");
  let contactEl = document.querySelectorAll(".contact")[i];

  if (activeContactIndex === i) {
    deselectContact();
  } else {
    selectContact(userName, userEmail, userNumber, userID, i, userColor, bigContact, contactEl);
  }
}

//deselectContact
async function deselectContact() {
  document.getElementById("big-contact").classList.add("hide-big-contact");
  document.querySelectorAll(".contact")[activeContactIndex].classList.remove("contact-aktiv");
  document
    .getElementById("right-site-container")
    .classList.add("right-site-container-translate-100");
  document
    .getElementById("show-icon-container-button")
    .classList.add("show-icon-container-button-translate-100");
  document.getElementById("show-icon-container-button").classList.remove("animation");

  activeContactIndex = null;
}

// selectContact
async function selectContact(
  userName,
  userEmail,
  userNumber,
  userID,
  i,
  userColor,
  bigContact,
  contactEl
) {
  await renderBigContact(userName, userEmail, userNumber, userID, i, userColor);
  if (activeContactIndex !== null) {
    document.querySelectorAll(".contact")[activeContactIndex].classList.remove("contact-aktiv");
  }
  contactEl.classList.add("contact-aktiv");
  bigContact.classList.remove("hide-big-contact");
  document
    .getElementById("right-site-container")
    .classList.remove("right-site-container-translate-100");
  document
    .getElementById("show-icon-container-button")
    .classList.remove("show-icon-container-button-translate-100");
  document.getElementById("show-icon-container-button").classList.add("animation");
  activeContactIndex = i;

  contactEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// showIconContainer
function showIconContainer() {
  document.getElementById("icon-container").classList.toggle("icon-container-translate-100");
}

// hideAllPopUps
function hideAllSmallPopUps() {
  document.getElementById("icon-container").classList.add("icon-container-translate-100");
}

// taskMarker
function taskMarker() {
  document.getElementById("contacts").classList.add("currentSection");
}

// renderContactList
function renderContactList() {
  let contactListContainer = document.getElementById("contact-list");
  contactListContainer.innerHTML = "";

  for (let i = 0; i < firstUsersNameLetter.length; i++) {
    renderContactLetterContainer(i, contactListContainer);
  }
}

// renderContactLetterContainer
function renderContactLetterContainer(i, contactListContainer) {
  const letter = firstUsersNameLetter[i];
  contactListContainer.innerHTML += returnContactLetterContainerHTML(letter);
  document.querySelectorAll(".letter-list-contact-container")[i].innerHTML = "";
  for (let j = 0; j < allUsers.length; j++) {
    renderContact(i, j, letter);
  }
}

// renderContact
function renderContact(i, j, letter) {
  const user = allUsers[j];
  if (user["name"].toLowerCase().startsWith(letter)) {
    document.querySelectorAll(".letter-list-contact-container")[i].innerHTML += returnContactHTML(
      j,
      user
    );
  }
}

// renderBigContact
function renderBigContact(userName, userEmail, userNumber, userID, i, userColor) {
  document.getElementById("big-profile-badge").innerHTML = firstLetterFirstTwoWords(userName);
  document.getElementById("big-profile-badge").style.backgroundColor = userColor;
  document.getElementById("big-name").innerHTML = userName;
  document.getElementById("big-email").innerHTML = userEmail;
  document.getElementById("big-number").innerHTML = userNumber;
  document.getElementById("icon-container").innerHTML = returnBigContactIconContainerHTML(
    userName,
    userEmail,
    userNumber,
    userID,
    i,
    userColor
  );
}

// renderAddContactPopUp
function renderAddContactPopUp() {
  document.getElementById("pop-up-inputs-container").innerHTML = returnAddContactPopUpFormHTML();
  document.getElementById("pop-up-headline-container").innerHTML =
    returnAddContactPopUpHeadlineHTML();
  document.getElementById("pop-up-contact-logo").innerHTML = returnAddContactPopUpContactLogoHTML();
  document.getElementById("pop-up-contact-logo").style.backgroundColor = "#d1d1d1";
}

// renderEditContactPopUp
function renderEditContactPopUp(userID, userName, userEmail, userNumber, i, userColor) {
  document.getElementById("pop-up-inputs-container").innerHTML = returnEditContactPopUpFormHTML(
    userID,
    i,
    userColor
  );
  document.getElementById("pop-up-headline-container").innerHTML =
    returnEditContactPopUpHeadlineHTML();
  document.getElementById("pop-up-contact-logo").innerHTML =
    returnEditContactPopUpLogoHTML(userName);
  document.getElementById("pop-up-contact-logo").style.backgroundColor = userColor;
  document.getElementById("pop-up-name-input").value = userName;
  document.getElementById("pop-up-email-input").value = userEmail;
  document.getElementById("pop-up-phone-input").value = userNumber;
}

// editContact
async function editContact(userID, i, userColor) {
  showLoadScreen();
  await deleteData("/contacts/" + userID);
  addNewContact(userColor);
  hideLoadScreen();
}

// deleteData
async function deleteContact(userID) {
  await deleteData("/contacts/" + userID);
  deselectContact();
  await initContact();
}

// addNewContact
async function addNewContact(bgColor = randomColor()) {
  showLoadScreen();
  await hidePopUp();
  let nameInputValue = document.getElementById("pop-up-name-input").value;
  let emailInputValue = document.getElementById("pop-up-email-input").value;
  let phoneInputValue = document.getElementById("pop-up-phone-input").value;
  await postNewContact("/contacts", {
    name: nameInputValue,
    email: emailInputValue,
    number: phoneInputValue,
    color: bgColor,
  });
  await initContact();
  afterAddingNewContactShowBigContact(nameInputValue);
  hideLoadScreen();

  await showContactSuccessfullyCreatedPopUp();
  hideContactSuccessfullyCreatedPopUp();
}

// afterAddingNewContactShowBigContact
function afterAddingNewContactShowBigContact(nameInputValue) {
  let index = allUsers.findIndex((user) => user.name === nameInputValue);
  let userName = allUsers[index]["name"];
  let userEmail = allUsers[index]["email"];
  let userNumber = allUsers[index]["phone"];
  let userID = allUsers[index]["id"];
  let userColor = allUsers[index]["color"];
  renderBigContact(userName, userEmail, userNumber, userID, index, userColor);
  document.querySelectorAll(".contact")[index].classList.add("contact-aktiv");
  document.getElementById("big-contact").classList.remove("hide-big-contact");
  document
    .getElementById("right-site-container")
    .classList.remove("right-site-container-translate-100");
  document
    .getElementById("show-icon-container-button")
    .classList.remove("show-icon-container-button-translate-100");
  document.getElementById("show-icon-container-button").classList.add("animation");
  activeContactIndex = index;
  document
    .querySelectorAll(".contact")
    [index].scrollIntoView({ behavior: "smooth", block: "nearest" });
}
