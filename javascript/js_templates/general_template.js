let username = getUserNickname();
let currentSide;

/**
 * Initializes the sidebar by loading HTML and user letters, and checking login status
 *
 */
async function initSidebar() {
  await sidebarHTML();
  await headerHTML();
  sowUserLetters("userLetters", username);
  isNotLoggedIn();
}

/**
 * Appends HTML content to the sidebar element and calls the taskMarker function
 *
 */
async function sidebarHTML() {
  const menuItems = [
    { href: "summary.html", img: "../../assets/img/Vector1.svg", alt: "", text: "Summary", id: "summary" },
    { href: "add_task.html", img: "../../assets/img/edit_square.svg", alt: "", text: "Add Task", id: "addTask" },
    { href: "board.html", img: "../../assets/img/board.svg", alt: "", text: "Board", id: "board" },
    { href: "contacts.html", img: "../../assets/img/perm_contact_calendar.svg", alt: "", text: "Contacts", id: "contacts" }
  ];

  const footerLinks = [
    { href: "privacy_policy.html", text: "Privacy Policy", id: "privatePolicy" },
    { href: "legal_notice.html", text: "Legal notice", id: "legalNotice" }
  ];

  const menuHTML = menuItems.map(item => /*html*/ `
    <a href="${item.href}" class="linkTo" id="${item.id}">
      <img src="${item.img}" alt="${item.alt}"><p>${item.text}</p>
    </a>
  `).join('');

  const footerHTML = footerLinks.map(link => `
    <a href="${link.href}" id="${link.id}">${link.text}</a>
  `).join('');

  document.getElementById("sidebar").innerHTML += /*html*/ `
    <link rel="stylesheet" href="../../css/remaining/desktop_template.css">
    <section class="sidebar">
      <img id='sidebar-logo' src="../../assets/img/Capa 1.svg" alt="">
      <div id="menuBar" class="menuBarDesktop">
        ${menuHTML}
      </div>
      <footer>
        <div>
          ${footerHTML}
        </div>
      </footer>
    </section>
  `;
  taskMarker();
}

/**
 *  Updates the HTML content of the header with SVG logos and additional elements
 *
 */
async function headerHTML() {
  document.getElementById("headerForm").innerHTML += /*html*/ `
  ${headerLogoSVG}
  <h1>Kanban Project Management Tool</h1>
  <div id="headerIcons" class="headerIcons">
    <a href="help.html">
      ${helpIconSVG}
    </a>
    <div onclick="stopEvent(event);openDropDownMenu()" class="circlehead" id="userLetters"></div>
    <div id="dropDown" class='translate-100-header'></div>
  </div>
    `;
}

/**
 *  Toggles the dropdown menu and updates its content
 *
 */
function openDropDownMenu() {
  document.getElementById("dropDown").classList.toggle("translate-100-header");
  dt = document.getElementById("dropDown");
  dt.innerHTML = /*html*/ `
      <div onclick="goToH()" id='dropDown-help-link'>Help</div>
      <div onclick="goToLN()" id ="dropDown-legal-notice">Legal Notice</div>
      <div onclick="goToPP()" id ="dropDown-privacy-policy">Privacy Policy</div>
      <div onclick="logout()">Log out</div>  
    `;
  if (window.location.pathname.includes("privacy_policy.html") || window.location.pathname.includes("legal_notice.html")) {
    hideCurrentPageFormDropdown();
    document.getElementById("arrow-icon").classList.toggle("d-none");
  }
}

/**
 * Clears session and local storage, then redirects to login page
 *
 */
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userNickname");
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("userNickname");
  sessionStorage.removeItem("guestLoginStatus");
  window.location.href = "login.html";
  localStorage.setItem("firstTime", "true");
}

/**
 * Redirects the user to the privacy policy page
 *
 */
function goToPP() {
  window.location.href = "privacy_policy.html";
}

/**
 * Redirects the user to the legal notice page
 *
 */
function goToLN() {
  window.location.href = "legal_notice.html";
}

/**
 * Redirects the user to the help page
 *
 */
function goToH() {
  window.location.href = "help.html";
}

/**
 * Updates a span element with the first letters of the username
 *
 * @param {string} id - The ID of the span element
 * @param {string} username - The username to process
 */
function sowUserLetters(id, username) {
  span = document.getElementById(id);
  un = firstLetterFirstTwoWords(username);
  span.innerHTML = /*html*/ `
    <span>${un}</span>
  `;
}

/**
 * Extracts and returns the first letter of the first two words of a string
 *
 * @param {string} text - The input text to process
 */
function firstLetterFirstTwoWords(text) {
  const words = text.split(" ");
  const firstLetters = words.map((word) => word.charAt(0));
  const result = firstLetters.slice(0, 2).join("");
  return result.toUpperCase();
}

/**
 *  Retrieves the user nickname from storage, defaults to "Guest" if not found
 *
 */
function getUserNickname() {
  let storage = localStorage.getItem("userNickname") || sessionStorage.getItem("userNickname");
  if (!storage) {
    storage = "Guest";
  }
  return storage;
}

/**
 *  Hides menu elements if the user is not logged in
 *
 */
function isNotLoggedIn() {
  if (sessionStorage.getItem("isLoggedIn") === "false") {
    setTimeout(function () {
      if (document.getElementById("menuBar")) {
        document.getElementById("menuBar").classList.add("d-none");
        document.getElementById("sidebar").classList.add("sidebarEmpty");
      }
    }, 50);
  } else {
    return false;
  }
}

/**
 * Checks if the user is logged in and displays elements accordingly
 *
 */
function isLoggedIn() {
  if (
    (sessionStorage.getItem("isLoggedIn") === "true" || localStorage.getItem("isLoggedIn") === "true") &&
    document.getElementById("headerIcons").classList.contains("d-none") &&
    document.getElementById("menuBar").classList.contains("d-none")
  ) {
    document.getElementById("headerIcons").classList.remove("d-none");
    document.getElementById("menuBar").classList.remove("d-none");
    document.getElementById("sidebar").classList.remove("d-none");
  } else {
    return false;
  }
}

/**
 * Hides dropdown items based on current page
 *
 */
function hideCurrentPageFormDropdown() {
  if (window.location.pathname.includes("privacy_policy.html")) {
    document.getElementById("dropDown-privacy-policy").classList.add("d-none");
  } else if (window.location.pathname.includes("legal_notice.html")) {
    document.getElementById("dropDown-legal-notice").classList.add("d-none");
  }
}

/**
 * This function returns an HTML string containing an SVG icon. The icon is composed of two green arrows, signifying low urgency.
 *
 * @returns {string} - The HTML string containing the SVG icon for low urgency.
 */

function generateHTMLUrgencyLow() {
    return /*html*/ `${lowUrgencySVG}`;
}

/**
 * This function returns an HTML string containing an SVG icon. The icon is composed of two orange bars,
 * signifying medium urgency.
 *
 * @returns {string} - The HTML string containing the SVG icon for medium urgency.
 */

function generateHTMLUrgencyMedium() {
    return /*html*/ `${mediumUrgencySVG}`;
}

/**
 * This function returns an HTML string containing an SVG icon. The icon is composed of two red arrows
 * pointing upwards, signifying urgent urgency.
 *
 * @returns {string} - The HTML string containing the SVG icon for urgent urgency.
 */

function generateHTMLUrgencyUrgent() {
    return /*html*/ `${urgentUrgencySVG}`;
}

/**
 * This function returns an HTML string for a container indicating that there are no tasks awaiting feedback.
 *
 * @returns {string} - The HTML string for the "No Tasks Await Feedback" container.
 */

function returnHtmlNoFeedbackContainer() {
    return /*html*/ `
      <div id="no-await-feedback-container" class="no-task">
          <p>No tasks await feedback</p>
      </div>`;
}

/**
 * This function returns an HTML string for a container indicating that the In-Progress-Section is empty so that no tasks can't be found there (for the moment).
 *
 * @returns {string} - The HTML string for the "No Tasks In Progress" container.
 */

function returnHtmlNoProgressContainer() {
    return /*html*/ `
      <div id="no-in-progress-container" class="no-task">
          <p>No tasks in progress</p>
      </div>`;
}

/**
 * This function returns an HTML string for a container indicating that the To-Do-Section is empty so that no tasks can't be found there (for the moment).
 *
 * @returns {string} - The HTML string for the "No Tasks To Do" container.
 */

function returnHtmlNoToDoContainer() {
    return /*html*/ `
      <div id="no-to-do-container" class="no-task">
          <p>No tasks to do</p>
      </div>`;
}

/**
 * This function returns an HTML string for a container indicating that the Done-Section is empty so that no tasks can't be found there (for the moment).
 *
 * @returns {string} - The HTML string for the "No Tasks Done" container.
 */

function returnHtmlNoDoneContainer() {
    return /*html*/ `
      <div id="no-done-container" class="no-task">
          <p>No tasks done</p>
      </div>`;
}