let userCredicals;
let isSelect;
let searchResults = [];

function showDropDownAssignedTo() {
  contact = document.getElementById("assignedToDropDown");
  contact.innerHTML = "";
    for (let i = 0; i < allUsers.length; i++) {
      user = allUsers[i];
      renderAssignedToHTML(user, contact, i)
      if (assignedContacts != 0 ) {
        if (checkAssignedContactsStatus(user.name) === true) {
          document.getElementById(`user${i}`).classList.add('contactIsSelect');
          document.getElementById(`checked${i}`).classList.remove("d-none")
        } else {
          document.getElementById(`user${i}`).classList.remove('contactIsSelect');
          document.getElementById(`checked${i}`).classList.add("d-none")
        }
      }
    }
    contact.classList.remove("d-none");
    document.getElementById('arrowa').classList.add("rotate");
}

function hideDropDownAssignedTo() {
  document.getElementById('arrowa').classList.remove("rotate");
  contact=document.getElementById("assignedToDropDown");
  contact.classList.add("d-none");
  contact.innerHTML = "";
}

function renderAssignedToHTML(user, contact, i) {
  contact.innerHTML += /*html*/`
    <div id="user${i}" class=assignedDropDownField onclick="checkAssignedContacts('${user[`name`]}', '${user[`color`]}', ${i})">
      <div class="circle" id="assignetToLetters${i}"></div>
      <div class="DropDownUser"><span>${user['name']}</span>
        <div class="checkboxesSVG">
          <img id="none_checked${i}" src="Assets/img/Checkbox_black.svg" alt="">
          <img id="checked${i}" class="checked d-none" src="Assets/img/Checkbox_checked.svg" alt="">
        </div>
      </div>
    </div>
  `;
  document.getElementById(`assignetToLetters${i}`).style.backgroundColor = user['color'];
  sowUserLetters(`assignetToLetters${i}` , user['name']);
}

function assignetToContects() {
  circleCont = document.getElementById("userCircles");
  circleCont.innerHTML = "";
  for (let i = 0; i < assignedContacts.length; i++) {
    // renderAssignedToCircle(i, assignedContacts[i].name, assignedContacts[i].color, circleCont)
    if (assignedContacts.length > 6) {
      circleCont += showplusSVG();
    } else {
      renderAssignedToCircle(i, assignedContacts[i].name, assignedContacts[i].color, circleCont)
    }
  }
}

function renderAssignedToCircle(i, user, color, circleCont) {
  circleCont.innerHTML += /*html*/`
    <div class="assignetToDiv circle" id="showCircle${i}"></div>
  `;
  circle = document.getElementById(`showCircle${i}`).style;
  circle.backgroundColor = color;
  circle.border= "2px solid rgba(255, 255, 255, 1)";
  if(assignedContacts.length > 2) {
    if (assignedContacts[0].name != user) {
      circle.marginLeft = "-24px";
      if (assignedContacts.length == 6) {showplusSVG()}
    }
  }
  sowUserLetters(`showCircle${i}` , user)
}

function clearAssignedTo() {
  let div = document.getElementById("userCircles");
  assignedContacts.splice(0)
  div.innerHTML = "";
}

function addUserToTask(u) {
    userCredicals = {
        name: u.name,
        color: u.color,
        isSelected: u.selected,
    }
    assignedContacts.push(userCredicals);
    assignetToContects()
}

function checkAssignedContacts(name, color, i) {
  x = {name: name, color: color, selected: false};
  selUser = document.getElementById(`user${i}`);
  if (selUser.classList.contains("contactIsSelect") == true) {
    document.getElementById(`none_checked${i}`).classList.remove("d-none");
    document.getElementById(`checked${i}`).classList.add("d-none");
    selUser.classList.remove('contactIsSelect');
    removeAssignedToContects(x.name, i)
  } else {
    document.getElementById(`none_checked${i}`).classList.add("d-none");
    document.getElementById(`checked${i}`).classList.remove("d-none");
    selUser.classList.add('contactIsSelect');
    x.selected = true;
    addUserToTask(x)
  }
}

function checkAssignedContactsStatus(un) {
  if (!assignedContacts == 0) {
    for (let i = 0; i < assignedContacts.length; i++) {
      if (assignedContacts[i].name == un) {
        if (assignedContacts[i].isSelected == true) {
          return true
        }
      }
    }
  } else {
    return false
  }
}

function removeAssignedToContects(name, index) {
  for (let i = 0; i < assignedContacts.length; i++) {
    indexOfName = assignedContacts[i].name.includes(name);
    if (indexOfName == true) {
      document.getElementById(`user${index}`).classList.remove("contactIsSelect");
      assignedContacts.splice(i, 1)
    }
  }
  
  assignetToContects()
}

function changeToInputfield() {
  changecont = document.getElementById("changeTo");
  search = document.getElementById("searchArea").classList;
  input = document.getElementById("searchField");
  stV = document.getElementById("standartValue").classList;

  window.addEventListener('click', function (e) {
    if (changecont.contains(e.target)) {
        search.remove("d-none");
        input.classList.remove("d-none");
        stV.add("d-none");
        input.focus();
        showDropDownAssignedTo();
      } else {
        search.add("d-none");
        input.classList.add("d-none");
        stV.remove("d-none");
        input.value = "";
      }
  })
}

function searchContacts() {
  document.getElementById("assignedToDropDown").innerHTML=""
  search = document.getElementById("searchField");
  text = search.value.toLowerCase();
  
  if (text.length >=1) {
    searchResults = [];
    for (let i = 0; i < allUsers.length; i++) {
      aU = allUsers[i].name.toLowerCase();
      if (aU.includes(text)) {
        searchResults.push(allUsers[i]);
      }
    }
    showDropDownAssignedToOnlyResult()
  } else {
    searchResults = [];
    showDropDownAssignedTo()
  }
}

function showDropDownAssignedToOnlyResult() {
  contact = document.getElementById("assignedToDropDown");
  contact.innerHTML = "";
    
    for (let i = 0; i < searchResults.length; i++) {
      user = searchResults[i];
      renderAssignedToHTML(user,contact, i);
    }
    contact.classList.remove("d-none");
    document.getElementById('arrowa').classList.add("rotate");
}

function showplusSVG() {
    return /*html*/`
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.24854 8H1.24854C0.965202 8 0.727702 7.90417 0.536035 7.7125C0.344368 7.52083 0.248535 7.28333 0.248535 7C0.248535 6.71667 0.344368 6.47917 0.536035 6.2875C0.727702 6.09583 0.965202 6 1.24854 6H6.24854V1C6.24854 0.716667 6.34437 0.479167 6.53604 0.2875C6.7277 0.0958333 6.9652 0 7.24854 0C7.53187 0 7.76937 0.0958333 7.96104 0.2875C8.1527 0.479167 8.24854 0.716667 8.24854 1V6H13.2485C13.5319 6 13.7694 6.09583 13.961 6.2875C14.1527 6.47917 14.2485 6.71667 14.2485 7C14.2485 7.28333 14.1527 7.52083 13.961 7.7125C13.7694 7.90417 13.5319 8 13.2485 8H8.24854V13C8.24854 13.2833 8.1527 13.5208 7.96104 13.7125C7.76937 13.9042 7.53187 14 7.24854 14C6.9652 14 6.7277 13.9042 6.53604 13.7125C6.34437 13.5208 6.24854 13.2833 6.24854 13V8Z" fill="#2A3647"></path>
    </svg>
  `;
}