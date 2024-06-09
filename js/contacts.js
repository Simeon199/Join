let allUsers = [];
let firstUsersNameLetter = [];

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
  let userData = responseJson["users"];

  for (const key in userData) {
    const userD = userData[key];

    let newUser = {
      id: key,
      name: userD.name,
      email: userD.email,
      phone: userD.number,
    };

    allUsers.push(newUser);

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

  await sortAllUserLetters();
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

// taskMarker
function taskMarker() {
  document.getElementById("contacts").classList.add("currentSection");
}

// renderContactList
function renderContactList() {
  let contactListContainer = document.getElementById("contact-list");

  contactListContainer.innerHTML = "";

  for (let i = 0; i < firstUsersNameLetter.length; i++) {
    const letter = firstUsersNameLetter[i];

    contactListContainer.innerHTML += /*html*/ `
      <div class="contact-container">
            <!-- letter -->
            <h2 class="letter">${letter.toUpperCase()}</h2>

            <div class='letter-list-contact-container'>
            </div>
       </div>
    `;

    document.querySelectorAll(".letter-list-contact-container")[i].innerHTML = "";

    for (let j = 0; j < allUsers.length; j++) {
      const user = allUsers[j];

      if (user["name"].toLowerCase().startsWith(letter)) {
        document.querySelectorAll(".letter-list-contact-container")[i].innerHTML +=
          returnContactHTML(j, user);
      }
    }
  }
}

// returnContactHTML
function returnContactHTML(j, user) {
  let userName = user["name"];
  let userEmail = user["email"];
  let userNumber = user["phone"];
  let userID = user["id"];
  return /*html*/ `
            <div class="contact" onclick="toggleBigContact(${j},'${userName}','${userEmail}','${userNumber}','${userID}')">
              <!-- profile badge -->
            <div class="profile-badge">
              <p>${firstLetterFirstTwoWords(userName)}</p>
            </div>
          
          <div class="name-and-email-container">
            <p class="name">${userName}</p>
          <p class="email">${user["email"]}</p>
        </div>
      </div>
    `;
}

let activeContactIndex = null;

// toggleBigContact
function toggleBigContact(i, userName, userEmail, userNumber, userID) {
  let bigContact = document.getElementById("big-contact");
  let contactEl = document.querySelectorAll(".contact")[i];

  if (activeContactIndex === i) {
    // Deselect the contact
    bigContact.classList.add("hide-big-contact");
    contactEl.classList.remove("contact-aktiv");
    activeContactIndex = null;
  } else {
    // Select the contact
    renderBigContact(userName, userEmail, userNumber, userID);
    if (activeContactIndex !== null) {
      document.querySelectorAll(".contact")[activeContactIndex].classList.remove("contact-aktiv");
    }
    contactEl.classList.add("contact-aktiv");
    bigContact.classList.remove("hide-big-contact");
    activeContactIndex = i;

    contactEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// showAddContactPopUp
function showAddContactPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("add-task-pop-up").classList.remove("translate-100");
}

// renderBigContact
function renderBigContact(userName, userEmail, userNumber, userID) {
  document.getElementById("big-profile-badge").innerHTML = firstLetterFirstTwoWords(userName);

  document.getElementById("big-name").innerHTML = userName;

  document.getElementById("big-email").innerHTML = userEmail;

  document.getElementById("big-number").innerHTML = userNumber;

  document.getElementById("icon-container").innerHTML = /*html*/ `
    <div id="edit-contact">
      <svg
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="edit-icon"
          d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 
          1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 
          16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 
          4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 
          8.4Z"
          fill="#2A3647"
        />
      </svg>
      <p>Edit</p>
    </div>

    <div id="delete-contact" onclick='deleteContact("${userID}")'>
      <svg
        width="16"
        height="18"
        viewBox="0 0 16 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="delete-icon"
          d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 
          3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 
          1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 
          5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 
          0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 
          1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 
          2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 
          13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 
          13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 
          13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 
          5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 
          13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 
          10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 
          5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 
          9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z"
          fill="#2A3647"
        />
      </svg>
      <p>Delete</p>
    </div>
  `;
}

// deleteData
async function deleteContact(userID) {
  document.getElementById("big-contact").classList.add("hide-big-contact");

  await deleteData("/users/" + userID);

  await initContact();
}

function firstLetterFirstTwoWords(text) {
  // Split the string into words
  const words = text.split(" ");

  // Extract the first letter of each word
  const firstLetters = words.map((word) => word.charAt(0));

  // Concatenate the first two letters into a string
  const result = firstLetters.slice(0, 2).join("");

  return result.toUpperCase();
}

// renderAddContactPopUp
function renderAddContactPopUp() {
  document.getElementById("pop-up-inputs-container").innerHTML = returnAddContactPopUpFormHTML();

  document.getElementById("pop-up-headline-container").innerHTML =
    returnAddContactPopUpHeadlineHTML();

  document.getElementById("pop-up-contact-logo").innerHTML = returnAddContactPopUpContactLogoHTML();
}

// returnAddContactPopUpHeadlineHTML
function returnAddContactPopUpHeadlineHTML() {
  return /*html*/ `
      <h1 id="pop-up-headline">Add contact</h1>
      <p id="pop-up-comment">Tasks are better with a team!</p>
  `;
}

// returnAddContactPopUpContactLogoHTML
function returnAddContactPopUpContactLogoHTML() {
  return /*html*/ `
        <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.0001 22.0001C19.0667 22.0001 16.5556 20.9556 14.4667 18.8667C12.3779 16.7779 
          11.3334 14.2667 11.3334 11.3334C11.3334 8.40008 12.3779 5.88897 14.4667 3.80008C16.5556 
          1.71119 19.0667 0.666748 22.0001 0.666748C24.9334 0.666748 27.4445 1.71119 29.5334 
          3.80008C31.6223 5.88897 32.6667 8.40008 32.6667 11.3334C32.6667 14.2667 31.6223 16.7779 
          29.5334 18.8667C27.4445 20.9556 24.9334 22.0001 22.0001 22.0001ZM38.0001 
          43.3334H6.00008C4.53341 43.3334 3.27786 42.8112 2.23341 41.7668C1.18897 40.7223 
          0.666748 39.4668 0.666748 38.0001V35.8667C0.666748 34.3556 1.05564 32.9667 1.83341 
          31.7001C2.61119 30.4334 3.64453 29.4667 4.93341 28.8001C7.68897 27.4223 10.489 26.389 
          13.3334 25.7001C16.1779 25.0112 19.0667 24.6667 22.0001 24.6667C24.9334 24.6667 
          27.8223 25.0112 30.6667 25.7001C33.5112 26.389 36.3112 27.4223 39.0667 28.8001C40.3556 
          29.4667 41.389 30.4334 42.1667 31.7001C42.9445 32.9667 43.3334 34.3556 43.3334 
          35.8667V38.0001C43.3334 39.4668 42.8112 40.7223 41.7668 41.7668C40.7223 42.8112 39.4668 
          43.3334 38.0001 43.3334ZM6.00008 38.0001H38.0001V35.8667C38.0001 35.3779 37.8779 
          34.9334 37.6334 34.5334C37.389 34.1334 37.0667 33.8223 36.6667 33.6001C34.2668 
          32.4001 31.8445 31.5001 29.4001 30.9001C26.9556 30.3001 24.489 30.0001 22.0001 
          30.0001C19.5112 30.0001 17.0445 30.3001 14.6001 30.9001C12.1556 31.5001 9.73341 32.4001 
          7.33342 33.6001C6.93341 33.8223 6.61119 34.1334 6.36675 34.5334C6.1223 34.9334 
          6.00008 35.3779 6.00008 35.8667V38.0001ZM22.0001 16.6667C23.4667 16.6667 24.7223 16.1445 
          25.7668 15.1001C26.8112 14.0556 27.3334 12.8001 27.3334 11.3334C27.3334 9.86675 
          26.8112 8.61119 25.7668 7.56675C24.7223 6.5223 23.4667 6.00008 22.0001 6.00008C20.5334 
          6.00008 19.2779 6.5223 18.2334 7.56675C17.189 8.61119 16.6667 9.86675 16.6667 
          11.3334C16.6667 12.8001 17.189 14.0556 18.2334 15.1001C19.2779 16.1445 20.5334 
          16.6667 22.0001 16.6667Z"
          fill="white"
        />
      </svg>
  `;
}

// returnAddContactPopUpFormHTML
function returnAddContactPopUpFormHTML() {
  return /*html*/ `
      <form onsubmit='addNewContact(); return false;'>
        <div class="pop-up-input-container">
          <input 
          minlength = 2
            id="pop-up-name-input" 
            class="pop-up-input" 
            type="text" 
            placeholder="Name" 
            required />

          <svg
            class="pop-up-input-svg"
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.0001 22.0001C19.0667 22.0001 16.5556 20.9556 14.4667 18.8667C12.3779 16.7779 
              11.3334 14.2667 11.3334 11.3334C11.3334 8.40008 12.3779 5.88897 14.4667 3.80008C16.5556 
              1.71119 19.0667 0.666748 22.0001 0.666748C24.9334 0.666748 27.4445 1.71119 29.5334 
              3.80008C31.6223 5.88897 32.6667 8.40008 32.6667 11.3334C32.6667 14.2667 31.6223 16.7779 
              29.5334 18.8667C27.4445 20.9556 24.9334 22.0001 22.0001 22.0001ZM38.0001 
              43.3334H6.00008C4.53341 43.3334 3.27786 42.8112 2.23341 41.7668C1.18897 40.7223 0.666748 
              39.4668 0.666748 38.0001V35.8667C0.666748 34.3556 1.05564 32.9667 1.83341 31.7001C2.61119 
              30.4334 3.64453 29.4667 4.93341 28.8001C7.68897 27.4223 10.489 26.389 13.3334 
              25.7001C16.1779 25.0112 19.0667 24.6667 22.0001 24.6667C24.9334 24.6667 27.8223 25.0112 
              30.6667 25.7001C33.5112 26.389 36.3112 27.4223 39.0667 28.8001C40.3556 29.4667 41.389 
              30.4334 42.1667 31.7001C42.9445 32.9667 43.3334 34.3556 43.3334 35.8667V38.0001C43.3334 
              39.4668 42.8112 40.7223 41.7668 41.7668C40.7223 42.8112 39.4668 43.3334 38.0001 
              43.3334ZM6.00008 38.0001H38.0001V35.8667C38.0001 35.3779 37.8779 34.9334 37.6334 
              34.5334C37.389 34.1334 37.0667 33.8223 36.6667 33.6001C34.2668 32.4001 31.8445 31.5001 
              29.4001 30.9001C26.9556 30.3001 24.489 30.0001 22.0001 30.0001C19.5112 30.0001 17.0445 
              30.3001 14.6001 30.9001C12.1556 31.5001 9.73341 32.4001 7.33342 33.6001C6.93341 33.8223 
              6.61119 34.1334 6.36675 34.5334C6.1223 34.9334 6.00008 35.3779 6.00008 
              35.8667V38.0001ZM22.0001 16.6667C23.4667 16.6667 24.7223 16.1445 25.7668 15.1001C26.8112 
              14.0556 27.3334 12.8001 27.3334 11.3334C27.3334 9.86675 26.8112 8.61119 
              25.7668 7.56675C24.7223 6.5223 23.4667 6.00008 22.0001 6.00008C20.5334 6.00008 19.2779 
              6.5223 18.2334 7.56675C17.189 8.61119 16.6667 9.86675 16.6667 11.3334C16.6667 12.8001 
              17.189 14.0556 18.2334 15.1001C19.2779 16.1445 20.5334 16.6667 22.0001 16.6667Z"
              fill="white"
            />
          </svg>
        </div>

        <div class="pop-up-input-container">
          <input
            required
            id="pop-up-email-input"
            class="pop-up-input"
            type="email"
            placeholder="Email"
          />

          <svg
            class="pop-up-input-svg"
            width="20"
            height="17"
            viewBox="0 0 20 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 16.5C1.45 16.5 0.979167 16.3042 0.5875 15.9125C0.195833 15.5208 0 15.05 0 14.5V2.5C0 
              1.95 0.195833 1.47917 0.5875 1.0875C0.979167 0.695833 1.45 0.5 2 0.5H18C18.55 0.5 19.0208 
              0.695833 19.4125 1.0875C19.8042 1.47917 20 1.95 20 2.5V14.5C20 15.05 19.8042 15.5208 
              19.4125 15.9125C19.0208 16.3042 18.55 16.5 18 16.5H2ZM18 4.5L10.525 9.175C10.4417 9.225 
              10.3542 9.2625 10.2625 9.2875C10.1708 9.3125 10.0833 9.325 10 9.325C9.91667 9.325 9.82917 
              9.3125 9.7375 9.2875C9.64583 9.2625 9.55833 9.225 9.475 9.175L2 4.5V14.5H18V4.5ZM10 7.5L18 
              2.5H2L10 7.5ZM2 4.75V3.275V3.3V3.2875V4.75Z"
              fill="#A8A8A8"
            />
          </svg>
        </div>

        <div class="pop-up-input-container">
          <input
            required
            id="pop-up-phone-input"
            class="pop-up-input"
            type="number"
            placeholder="Phone"
          />

          <svg
            class="pop-up-input-svg"
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.95 18.5C14.8667 18.5 12.8083 18.0458 10.775 17.1375C8.74167 16.2292 6.89167 14.9417 
              5.225 13.275C3.55833 11.6083 2.27083 9.75833 1.3625 7.725C0.454167 5.69167 0 3.63333 0 
              1.55C0 1.25 0.1 1 0.3 0.8C0.5 0.6 0.75 0.5 1.05 0.5H5.1C5.33333 0.5 5.54167 0.579167 5.725 
              0.7375C5.90833 0.895833 6.01667 1.08333 6.05 1.3L6.7 4.8C6.73333 5.06667 6.725 5.29167 
              6.675 5.475C6.625 5.65833 6.53333 5.81667 6.4 5.95L3.975 8.4C4.30833 9.01667 4.70417 
              9.6125 5.1625 10.1875C5.62083 10.7625 6.125 11.3167 6.675 11.85C7.19167 12.3667 7.73333 
              12.8458 8.3 13.2875C8.86667 13.7292 9.46667 14.1333 10.1 14.5L12.45 12.15C12.6 12 12.7958 
              11.8875 13.0375 11.8125C13.2792 11.7375 13.5167 11.7167 13.75 11.75L17.2 12.45C17.4333 
              12.5167 17.625 12.6375 17.775 12.8125C17.925 12.9875 18 13.1833 18 13.4V17.45C18 17.75 
              17.9 18 17.7 18.2C17.5 18.4 17.25 18.5 16.95 18.5ZM3.025 6.5L4.675 4.85L4.25 
              2.5H2.025C2.10833 3.18333 2.225 3.85833 2.375 4.525C2.525 5.19167 2.74167 5.85 3.025 
              6.5ZM11.975 15.45C12.625 15.7333 13.2875 15.9583 13.9625 16.125C14.6375 16.2917 15.3167 
              16.4 16 16.45V14.25L13.65 13.775L11.975 15.45Z"
              fill="#A8A8A8"
            />
          </svg>
        </div>

        <div id="pop-up-buttons-container">
          <button id="pop-up-cancel-button" onclick="hideAddContactPopUp()">
            Cancel
            <svg
              class="pop-up-cancel-button-svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.9998 8.36587L2.0998 13.2659C1.91647 13.4492 1.68314 13.5409 1.3998 13.5409C1.11647 
                13.5409 0.883138 13.4492 0.699805 13.2659C0.516471 13.0825 0.424805 12.8492 0.424805 
                12.5659C0.424805 12.2825 0.516471 12.0492 0.699805 11.8659L5.5998 6.96587L0.699805 
                2.06587C0.516471 1.88254 0.424805 1.6492 0.424805 1.36587C0.424805 1.08254 0.516471 
                0.849202 0.699805 0.665869C0.883138 0.482536 1.11647 0.390869 1.3998 0.390869C1.68314 
                0.390869 1.91647 0.482536 2.0998 0.665869L6.9998 5.56587L11.8998 0.665869C12.0831 0.482536 
                12.3165 0.390869 12.5998 0.390869C12.8831 0.390869 13.1165 0.482536 13.2998 
                0.665869C13.4831 0.849202 13.5748 1.08254 13.5748 1.36587C13.5748 1.6492 13.4831 1.88254 
                13.2998 2.06587L8.3998 6.96587L13.2998 11.8659C13.4831 12.0492 13.5748 12.2825 13.5748 
                12.5659C13.5748 12.8492 13.4831 13.0825 13.2998 13.2659C13.1165 13.4492 12.8831 13.5409 
                12.5998 13.5409C12.3165 13.5409 12.0831 13.4492 11.8998 13.2659L6.9998 8.36587Z"
                fill="#2A3647"
              />
            </svg>
          </button>

          <button id="pop-up-create-contact-button" type='submit'>
            Create contact
            <svg
              width="16"
              height="13"
              viewBox="0 0 16 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.55057 9.65L14.0256 1.175C14.2256 0.975 14.4631 0.875 14.7381 0.875C15.0131 0.875 
                15.2506 0.975 15.4506 1.175C15.6506 1.375 15.7506 1.6125 15.7506 1.8875C15.7506 2.1625 
                15.6506 2.4 15.4506 2.6L6.25057 11.8C6.05057 12 5.81724 12.1 5.55057 12.1C5.28391 12.1 
                5.05057 12 4.85057 11.8L0.550573 7.5C0.350573 7.3 0.25474 7.0625 0.263073 6.7875C0.271407 
                6.5125 0.375573 6.275 0.575573 6.075C0.775573 5.875 1.01307 5.775 1.28807 5.775C1.56307 
                5.775 1.80057 5.875 2.00057 6.075L5.55057 9.65Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </form>
  `;
}

// hideAddContactPopUp
function hideAddContactPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

// stopEvent
function stopEvent(event) {
  event.stopPropagation();
}

// addNewContact
async function addNewContact() {
  await hideAddContactPopUp();

  let nameInputValue = document.getElementById("pop-up-name-input").value;
  let emailInputValue = document.getElementById("pop-up-email-input").value;
  let phoneInputValue = document.getElementById("pop-up-phone-input").value;

  await postNewContact("/users", {
    name: nameInputValue,
    email: emailInputValue,
    number: phoneInputValue,
  });

  await initContact();

  let index = allUsers.findIndex((user) => user.name === nameInputValue);
  let userName = allUsers[index]["name"];
  let userEmail = allUsers[index]["email"];
  let userNumber = allUsers[index]["phone"];
  let userID = allUsers[index]["id"];

  console.log(index);
  console.log(userID);

  toggleBigContact(index, userName, userEmail, userNumber, userID);
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

// await postNewContact("/users", {
//   name: "ben",
//   email: "ben@gmail.com",
//   number: "123456789",
// });

// deleteData
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}
