export function bundleLoadingHTMLTemplates(){
  initHTMLContent('/shared/templates/header.tpl', 'headerForm');
  initHTMLContent('/shared/templates/sidebar.tpl', 'sidebar');
}

export async function initHTMLContent(path, parentId){
  let response = await fetch(path);
  if(!response.ok){
    console.error(`Fehler beim Laden der Datei ${path}: ${response.statusText}`);
    return null;
  }
  let html = await response.text();
  if(!html.trim()){
    console.error(`Die geladene HTML-Datei ist leer:`, path);
    return null;
  }
  // HTML-String in echtes DOM kovertieren

  let parser = new DOMParser();
  let doc = parser.parseFromString(html, 'text/html');
  let template = doc.querySelector('template');

  if(!template){
    console.error(`Kein <template>-Element in Datei: ${path}`);
    return null;
  }
  let clone = template.content.cloneNode(true);
  let parent = document.getElementById(parentId);
  parent.appendChild(clone);
  return parent.lastElementChild;

  // taskMarker() --> Bei Sidebar;
}

export function taskMarker() {
  document.getElementById("contacts").classList.add("currentSection");
}

 /**
  * Stops the propagation of an event through the DOM.
  * 
  * @param {Event} event - The event object to stop propagation for.
  */
 
 export function stopEvent(event) {
  event.stopPropagation();
}

/**
 *  Toggles the dropdown menu and updates its content
 *
 */

export function openDropDownMenu() {
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
 * Redirects the user to the privacy policy page
 *
 */

export function goToPrivacyPolicy() {
  window.location.href = "privacy_policy_en.html";
}

/**
 * Redirects the user to the legal notice page
 *
 */

export function goToLegalNotice() {
  window.location.href = "legal_notice.html";
}

/**
 * Redirects the user to the help page
 *
 */

export function goToHelpPage() {
  window.location.href = "help.html";
}

/**
 * Updates a span element with the first letters of the username
 *
 * @param {string} id - The ID of the span element
 * @param {string} username - The username to process
 */

export function showUserLetters(id, username) {
  let span = document.getElementById(id);
  let un = firstLetterFirstTwoWords(username);
  span.innerHTML = /*html*/ `
    <span>${un}</span>
  `;
}

/**
 * Extracts and returns the first letter of the first two words of a string
 *
 * @param {string} text - The input text to process
 */

export function firstLetterFirstTwoWords(text) {
  const words = text.split(" ");
  const firstLetters = words.map((word) => word.charAt(0));
  const result = firstLetters.slice(0, 2).join("");
  return result.toUpperCase();
}

/**
 * Hides dropdown items based on current page
 *
 */

export function hideCurrentPageFormDropdown() {
  if (window.location.pathname.includes("privacy_policy_en.html")) {
    document.getElementById("dropDown-privacy-policy").classList.add("d-none");
  } else if (window.location.pathname.includes("legal_notice.html")) {
    document.getElementById("dropDown-legal-notice").classList.add("d-none");
  }
}