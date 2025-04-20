// let username = getUserNickname();
// let currentSide;


// document.addEventListener('DOMContentLoaded', () => {
//   bundleLoadingHTMLTemplates();
// });

export async function bundleLoadingHTMLTemplates(){
  await initHTMLContent('/shared/templates/header.template.html', 'headerForm');
  await initHTMLContent('/shared/templates/sidebar.template.html', 'sidebar');
  // initHTMLContent('/shared/templates/dropdown_menu.template.html');
}

export async function initHTMLContent(path, parentId){
  debugger;
  let response = await fetch(path);
  let html = await response.text();

  // HTML-String in echtes DOM kovertieren

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const template = doc.querySelector('template');

  if(!template){
    return;
  }

  const clone = template.content.cloneNode(true);
  document.getElementById(parentId).appendChild(clone);

  // let parentElement = document.getElementById(`${parentId}`);
  // if(parentElement && parentElement.innerHTML !== ''){
  //   parentElement.innerHTML = '';
  // }
  // parentElement.innerHTML += html;
}

/**
 * Initializes the sidebar by loading HTML and user letters, and checking login status
 *
 */

// async function initSidebar() {
//   await sidebarHTML();
//   await headerHTML();
//   sowUserLetters("userLetters", username);
//   isNotLoggedIn();
// }

/**
 * Appends HTML content to the sidebar element and calls the taskMarker function
 *
 */

// async function sidebarHTML() {
//   document.getElementById("sidebar").innerHTML += /*html*/ `
//     <link rel="stylesheet" href="../../css/remaining/desktop_template.css">
//     <section class="sidebar">
//         <img id='sidebar-logo' src="../../assets/img/Capa 1.svg" alt="">
//         <div id="menuBar" class="menuBarDesktop">
//             <a href="summary.html" class="linkTo" id="summary">
//                 <img src="../../assets/img/Vector1.svg" alt=""><p>Summary</p>
//             </a>
//             <a href="add_task.html" class="linkTo" id="addTask">
//                 <img src="../../assets/img/edit_square.svg" alt=""><p>Add Task</p>
//             </a>
//             <a href="board.html" class="linkTo" id="board">
//                 <img src="../../assets/img/board.svg" alt=""><p>Board</p>
//             </a>
//             <a href="contacts.html" class="linkTo" id="contacts">
//                 <img src="../../assets/img/perm_contact_calendar.svg" alt=""><p>Contacts</p>
//             </a>
//         </div>
//         <footer>
//             <div>
//                 <a href="privacy_policy_en.html" id="privatePolicy">Privacy Policy</a>
//                 <a href="legal_notice.html" id ="legalNotice">Legal notice</a>
//             </div>
//         </footer>
//     </section>
//     `;
//   taskMarker();
// }

function taskMarker() {
  document.getElementById("contacts").classList.add("currentSection");
}

/**
 *  Updates the HTML content of the header with SVG logos and additional elements
 *
 */

// async function headerHTML() {
//   document.getElementById("headerForm").innerHTML += /*html*/ `

// <svg id='header-logo' width="101" height="122" viewBox="0 0 101 122" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M71.6721 0H49.5143V25.4923H71.6721V0Z" fill="#2A3647"/>
// <path d="M49.5142 46.2251H71.6721V82.1779C71.7733 90.8292 69.3112 99.3153 64.5986 106.557C59.9455 113.594 50.963 121.966 34.3446 121.966C16.2434 121.966 5.69286 113.406 0 108.715L13.9765 91.4743C19.533 96.0112 24.885 99.7435 34.4299 99.7435C41.6567 99.7435 44.5372 96.7988 46.2247 94.2307C48.5186 90.6637 49.7052 86.4923 49.6335 82.2464L49.5142 46.2251Z" fill="#2A3647"/>
// <path d="M38.2137 30.1318H16.0559V52.3884H38.2137V30.1318Z" fill="#29ABE2"/>
// <path d="M83.2793 111.522C83.2793 116.265 80.8761 118.815 77.5183 118.815C74.1605 118.815 71.9618 115.785 71.9618 111.762C71.9618 107.739 74.2287 104.554 77.7058 104.554C81.1829 104.554 83.2793 107.687 83.2793 111.522ZM74.5355 111.711C74.5355 114.57 75.6775 116.675 77.6376 116.675C79.5977 116.675 80.7056 114.45 80.7056 111.539C80.7056 108.988 79.6829 106.592 77.6376 106.592C75.5923 106.592 74.5355 108.903 74.5355 111.711Z" fill="#2A3647"/>
// <path d="M87.6768 104.76V118.593H85.2224V104.76H87.6768Z" fill="#2A3647"/>
// <path d="M90.3358 118.593V104.76H93.0629L95.9946 110.461C96.7493 111.952 97.4207 113.483 98.0058 115.049C97.8524 113.337 97.7843 111.368 97.7843 109.177V104.76H100.034V118.593H97.4945L94.5288 112.772C93.7436 111.243 93.0437 109.671 92.4323 108.064C92.4323 109.776 92.5516 111.711 92.5516 114.09V118.576L90.3358 118.593Z" fill="#2A3647"/>
// </svg>
//   <h1>Kanban Project Management Tool</h1>
//   <div id="headerIcons" class="headerIcons">
//     <a href="help.html">
//       <svg class='header-help-icon' alt="Help" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M9.95 16.9658C10.3 16.9658 10.5958 16.845 10.8375 16.6033C11.0792 16.3617 
//         11.2 16.0658 11.2 15.7158C11.2 15.3658 11.0792 15.07 10.8375 14.8283C10.5958 14.5867 
//         10.3 14.4658 9.95 14.4658C9.6 14.4658 9.30417 14.5867 9.0625 14.8283C8.82083 15.07 
//         8.7 15.3658 8.7 15.7158C8.7 16.0658 8.82083 16.3617 9.0625 16.6033C9.30417 16.845 
//         9.6 16.9658 9.95 16.9658ZM10 20.9658C8.61667 20.9658 7.31667 20.7033 6.1 
//         20.1783C4.88333 19.6533 3.825 18.9408 2.925 18.0408C2.025 17.1408 1.3125 
//         16.0825 0.7875 14.8658C0.2625 13.6492 0 12.3492 0 10.9658C0 9.58249 0.2625 
//         8.28249 0.7875 7.06582C1.3125 5.84915 2.025 4.79082 2.925 3.89082C3.825 
//         2.99082 4.88333 2.27832 6.1 1.75332C7.31667 1.22832 8.61667 0.96582 10 
//         0.96582C11.3833 0.96582 12.6833 1.22832 13.9 1.75332C15.1167 2.27832 16.175 
//         2.99082 17.075 3.89082C17.975 4.79082 18.6875 5.84915 19.2125 7.06582C19.7375 8.28249 
//         20 9.58249 20 10.9658C20 12.3492 19.7375 13.6492 19.2125 14.8658C18.6875 16.0825 
//         17.975 17.1408 17.075 18.0408C16.175 18.9408 15.1167 19.6533 13.9 20.1783C12.6833 
//         20.7033 11.3833 20.9658 10 20.9658ZM10 18.9658C12.2333 18.9658 14.125 18.1908 15.675 
//         16.6408C17.225 15.0908 18 13.1992 18 10.9658C18 8.73249 17.225 6.84082 15.675 
//         5.29082C14.125 3.74082 12.2333 2.96582 10 2.96582C7.76667 2.96582 5.875 3.74082 
//         4.325 5.29082C2.775 6.84082 2 8.73249 2 10.9658C2 13.1992 2.775 15.0908 4.325 
//         16.6408C5.875 18.1908 7.76667 18.9658 10 18.9658ZM10.1 6.66582C10.5167 6.66582 
//         10.8792 6.79915 11.1875 7.06582C11.4958 7.33249 11.65 7.66582 11.65 8.06582C11.65 
//         8.43249 11.5375 8.75749 11.3125 9.04082C11.0875 9.32415 10.8333 9.59082 10.55 
//         9.84082C10.1667 10.1742 9.82917 10.5408 9.5375 10.9408C9.24583 11.3408 9.1 11.7908 
//         9.1 12.2908C9.1 12.5242 9.1875 12.72 9.3625 12.8783C9.5375 13.0367 9.74167 13.1158 
//         9.975 13.1158C10.225 13.1158 10.4375 13.0325 10.6125 12.8658C10.7875 12.6992 10.9 
//         12.4908 10.95 12.2408C11.0167 11.8908 11.1667 11.5783 11.4 11.3033C11.6333 11.0283 
//         11.8833 10.7658 12.15 10.5158C12.5333 10.1492 12.8625 9.74915 13.1375 9.31582C13.4125 
//         8.88249 13.55 8.39915 13.55 7.86582C13.55 7.01582 13.2042 6.31999 12.5125 
//         5.77832C11.8208 5.23665 11.0167 4.96582 10.1 4.96582C9.46667 4.96582 8.8625 5.09915 
//         8.2875 5.36582C7.7125 5.63249 7.275 6.04082 6.975 6.59082C6.85833 6.79082 6.82083 
//         7.00332 6.8625 7.22832C6.90417 7.45332 7.01667 7.62415 7.2 7.74082C7.43333 7.87415 7.675 
//         7.91582 7.925 7.86582C8.175 7.81582 8.38333 7.67415 8.55 7.44082C8.73333 7.19082 8.9625 
//         6.99915 9.2375 6.86582C9.5125 6.73249 9.8 6.66582 10.1 6.66582Z" fill="#A8A8A8"/>
//       </svg>
//     </a>
//     <div onclick="stopEvent(event);openDropDownMenu()" class="circlehead" id="userLetters"></div>
//     <div id="dropDown" class='translate-100-header'></div>
//   </div>
//     `;
// }

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
  if (window.location.pathname.includes("privacy_policy_en.html") || window.location.pathname.includes("legal_notice.html")) {
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
function goToPrivacyPolicy() {
  window.location.href = "privacy_policy_en.html";
}

/**
 * Redirects the user to the legal notice page
 *
 */
function goToLegalNotice() {
  window.location.href = "legal_notice.html";
}

/**
 * Redirects the user to the help page
 *
 */
function goToHelpPage() {
  window.location.href = "help.html";
}

/**
 * Updates a span element with the first letters of the username
 *
 * @param {string} id - The ID of the span element
 * @param {string} username - The username to process
 */
function showUserLetters(id, username) {
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

// function getUserNickname() {
//   let storage = localStorage.getItem("userNickname") || sessionStorage.getItem("userNickname");
//   if (!storage) {
//     storage = "Guest";
//   }
//   return storage;
// }

/**
 * Hides dropdown items based on current page
 *
 */
function hideCurrentPageFormDropdown() {
  if (window.location.pathname.includes("privacy_policy_en.html")) {
    document.getElementById("dropDown-privacy-policy").classList.add("d-none");
  } else if (window.location.pathname.includes("legal_notice.html")) {
    document.getElementById("dropDown-legal-notice").classList.add("d-none");
  }
}