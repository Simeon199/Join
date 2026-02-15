let userCredicals;
let isSelect;
let searchResults = [];

/**
 * show Dropdown from AssignetTo field
 */
function showDropDownAssignedTo() {
  contact = document.getElementById("assignedToDropDown");
  contact.innerHTML = "";
  renderAllUsers(contact);
  contact.classList.remove("d-none");
  document.getElementById("arrowa").classList.add("rotate");
}

/**
 * Renders all users in the dropdown.
 * @param {Element} contact - The dropdown container
 */
function renderAllUsers(contact) {
  for (let i = 0; i < allUsers.length; i++) {
    user = allUsers[i];
    renderUser(user, contact, i);
    updateUserSelection(i, user);
  }
}

/**
 * Renders a single user in the dropdown.
 * @param {Object} user - The user object
 * @param {Element} contact - The dropdown container
 * @param {number} i - The index
 */
function renderUser(user, contact, i) {
  renderAssignedToHTML(user, contact, i);
}

/**
 * Updates the selection status for a user.
 * @param {number} i - The index
 * @param {Object} user - The user object
 */
function updateUserSelection(i, user) {
  if (assignedContacts != 0) {
    if (checkAssignedContactsStatus(user.name) === true) {
      document.getElementById(`user${i}`).classList.add("contactIsSelect");
      document.getElementById(`checked${i}`).classList.remove("d-none");
    } else {
      document.getElementById(`user${i}`).classList.remove("contactIsSelect");
      document.getElementById(`checked${i}`).classList.add("d-none");
    }
  }
}

/**
 * hide Drop down
 */
function hideDropDownAssignedTo() {
  document.getElementById("arrowa").classList.remove("rotate");
  contact = document.getElementById("assignedToDropDown");
  contact.classList.add("d-none");
  contact.innerHTML = "";
}

/**
 * render contacts HTML
 * 
 * @param {json} user 
 * @param {string} contact 
 * @param {number} i 
 */
function renderAssignedToHTML(user, contact, i) {
  contact.innerHTML += /*html*/ `
    <div id="user${i}" class=assignedDropDownField onclick="checkAssignedContacts('${user[`name`]}', '${user[`color`]}', ${i})">
      <div class="circle" id="assignetToLetters${i}"></div>
      <div class="DropDownUser"><span>${user["name"]}</span>
        <div class="checkboxesSVG">
          <img id="none_checked${i}" src="../../assets/img/Checkbox_black.svg" alt="">
          <img id="checked${i}" class="checked d-none" src="../../assets/img/Checkbox_checked.svg" alt="">
        </div>
      </div>
    </div>
  `;
  document.getElementById(`assignetToLetters${i}`).style.backgroundColor = user["color"];
  sowUserLetters(`assignetToLetters${i}`, user["name"]);
}

/**
 * show circles on Screen
 */
function assignetToContects() {
  circleCont = document.getElementById("userCircles");
  circleCont.innerHTML = "";
  for (let i = 0; i < assignedContacts.length; i++) {
    renderAssignedToCircle(i, assignedContacts[i].name, assignedContacts[i].color, circleCont);
  }
}

/**
 * render HTML code
 * 
 * @param {number} i 
 * @param {string} user 
 * @param {string} color 
 * @param {number} circleCont 
 */
function renderAssignedToCircle(i, user, color, circleCont) {
  if (i <= 3) {
    renderCircle(i, user, color, circleCont);
  } else {
    handleExtraContacts(i, circleCont);
  }
}

/**
 * Renders a circle for a contact.
 * @param {number} i - The index
 * @param {string} user - The user name
 * @param {string} color - The color
 * @param {Element} circleCont - The container
 */
function renderCircle(i, user, color, circleCont) {
  circleCont.innerHTML += /*html*/ `
    <div class="assignetToDiv circle" id="showCircle${i}"></div>
  `;
  circle = document.getElementById(`showCircle${i}`).style;
  circle.backgroundColor = color;
  circle.border = "2px solid rgba(255, 255, 255, 1)";
  if (assignedContacts.length >= 1) {
    if (assignedContacts[0].name != user) {
      circle.marginLeft = "-24px";
    }
  }
  sowUserLetters(`showCircle${i}`, user);
}

/**
 * Handles extra contacts beyond the first 4.
 * @param {number} i - The index
 * @param {Element} circleCont - The container
 */
function handleExtraContacts(i, circleCont) {
  if (i == 4) {
    circleCont.innerHTML += showplusSVG();
  } else {
    showplusSVG();
  }
}

/**
 * set to empty Array
 */
function clearAssignedTo() {
  let div = document.getElementById("userCircles");
  assignedContacts = [];
  div.innerHTML = "";
}

/**
 * added User to Task
 * @param {json} u 
 */
function addUserToTask(u) {
  userCredicals = {
    name: u.name,
    color: u.color,
    isSelected: u.selected,
  };
  assignedContacts.push(userCredicals);
  assignetToContects();
}

/**
 * check if a User is selected or not
 * 
 * @param {*} name 
 * @param {*} color 
 * @param {*} i 
 */
function checkAssignedContacts(name, color, i) {
  x = { name: name, color: color, selected: false };
  selUser = document.getElementById(`user${i}`);
  let isSelected = selUser.classList.contains("contactIsSelect");
  toggleSelection(i, isSelected);
  handleSelection(isSelected, i, x);
}

/**
 * Toggles the selection UI.
 * @param {number} i - The index
 * @param {boolean} isSelected - Current selection state
 */
function toggleSelection(i, isSelected) {
  if (isSelected) {
    document.getElementById(`none_checked${i}`).classList.remove("d-none");
    document.getElementById(`checked${i}`).classList.add("d-none");
    selUser.classList.remove("contactIsSelect");
  } else {
    document.getElementById(`none_checked${i}`).classList.add("d-none");
    document.getElementById(`checked${i}`).classList.remove("d-none");
    selUser.classList.add("contactIsSelect");
  }
}

/**
 * Handles the selection logic.
 * @param {boolean} isSelected - Selection state
 * @param {number} i - The index
 * @param {Object} x - The user object
 */
function handleSelection(isSelected, i, x) {
  if (isSelected) {
    removeAssignedToContects(x.name, i);
  } else {
    x.selected = true;
    addUserToTask(x);
  }
}

/**
 * check if contacts are selected if the popup is opening
 * 
 * @param {*} un 
 * @returns 
 */
function checkAssignedContactsStatus(un) {
  if (!assignedContacts == 0) {
    for (let i = 0; i < assignedContacts.length; i++) {
      if (assignedContacts[i].name == un) {
        if (assignedContacts[i].isSelected == true) {
          return true;
        }
      }
    }
  } else {
    return false;
  }
}

/**
 * remove added contact
 * 
 * @param {string} name 
 * @param {number} index 
 */
function removeAssignedToContects(name, index) {
  for (let i = 0; i < assignedContacts.length; i++) {
    indexOfName = assignedContacts[i].name.includes(name);
    if (indexOfName == true) {
      document.getElementById(`user${index}`).classList.remove("contactIsSelect");
      assignedContacts.splice(i, 1);
    }
  }
  assignetToContects();
}

/**
 * chage field to inputfield
 */
function changeToInputfield() {
  changecont = document.getElementById("changeTo");
  search = document.getElementById("searchArea").classList;
  input = document.getElementById("searchField");
  stV = document.getElementById("standartValue").classList;
  window.addEventListener("click", (e) => handleClick(e, changecont, search, input, stV));
}

/**
 * Handles the click event for input field toggle.
 * @param {Event} e - The event
 * @param {Element} changecont - The container
 * @param {DOMTokenList} search - Search class list
 * @param {Element} input - Input element
 * @param {DOMTokenList} stV - Standard value class list
 */
function handleClick(e, changecont, search, input, stV) {
  if (changecont.contains(e.target)) {
    showInput(search, input, stV);
  } else {
    hideInput(search, input, stV);
  }
}

/**
 * Shows the input field.
 * @param {DOMTokenList} search - Search class list
 * @param {Element} input - Input element
 * @param {DOMTokenList} stV - Standard value class list
 */
function showInput(search, input, stV) {
  search.remove("d-none");
  input.classList.remove("d-none");
  stV.add("d-none");
  input.focus();
  showDropDownAssignedTo();
}

/**
 * Hides the input field.
 * @param {DOMTokenList} search - Search class list
 * @param {Element} input - Input element
 * @param {DOMTokenList} stV - Standard value class list
 */
function hideInput(search, input, stV) {
  search.add("d-none");
  input.classList.add("d-none");
  stV.remove("d-none");
  input.value = "";
}

/**
 * show if the Letter macth with letters in user.names
 */
function searchContacts() {
  document.getElementById("assignedToDropDown").innerHTML = "";
  search = document.getElementById("searchField");
  text = search.value.toLowerCase();
  if (text.length >= 1) {
    performSearch(text);
    showDropDownAssignedToOnlyResult();
  } else {
    searchResults = [];
    showDropDownAssignedTo();
  }
}

/**
 * Performs the search for matching contacts.
 * @param {string} text - The search text
 */
function performSearch(text) {
  searchResults = [];
  for (let i = 0; i < allUsers.length; i++) {
    aU = allUsers[i].name.toLowerCase();
    if (aU.includes(text)) {
      searchResults.push(allUsers[i]);
    }
  }
}

/**
 * show only contacts with the Letter(s) in the inputfield
 */

function showDropDownAssignedToOnlyResult() {
  contact = document.getElementById("assignedToDropDown");
  contact.innerHTML = "";
  for (let i = 0; i < searchResults.length; i++) {
    user = searchResults[i];
    renderAssignedToHTML(user, contact, i);
  }
  contact.classList.remove("d-none");
  document.getElementById("arrowa").classList.add("rotate");
}

/**
 *  show + symbole and nuber off added contacts
 * @returns 
 */
function showplusSVG() {
  let moreNumber = assignedContacts.length - 4;
  return /*html*/ `
    <span class="contactsMoreNumber">+ ${moreNumber}</span>
  `;
}