let userCredicals;
let isSelect;
let searchResults = [];

function showDropDownAssignedTo() {
  contact = document.getElementById("assignedToDropDown");
    
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
  document.getElementById("userCircles").innerHTML = ""
  for (let i = 0; i < assignedContacts.length; i++) {
    renderAssignedToCircle(i, assignedContacts[i].name, assignedContacts[i].color)
  }
}

function renderAssignedToCircle(i, user, color) {
  document.getElementById("userCircles").innerHTML += /*html*/`
    <div class="assignetToDiv circle" id="showCircle${i}"></div>
  `;
   circle = document.getElementById(`showCircle${i}`).style;
   circle.backgroundColor = color;
   circle.border= "2px solid rgba(255, 255, 255, 1)";
  sowUserLetters(`showCircle${i}` , user)
}

function clearAssignedTo() {
  let div = document.getElementById("userCircles");
  assignedContacts.splice(0)
  div.innerHTML = "";
}

function addUserToTask(u , isSelect) {
    userCredicals = {
        name: u.name,
        color: u.color,
        isSelected: isSelect,
    }
    assignedContacts.push(userCredicals);
    assignetToContects()
}

function checkAssignedContacts(name, color, i) {
  x = {name: name, color: color, selected: isSelect = false};
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
    y = x.isSelect = true;
    addUserToTask(x, y)
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
    
    for (let i = 0; i < searchResults.length; i++) {
      user = searchResults[i];
      renderAssignedToHTML(user,contact, i);
    }
    contact.classList.remove("d-none");
    document.getElementById('arrowa').classList.add("rotate");
}