let userCredicals;
let isSelect;
let searchResults = [];

function showDropDownAssignedTo() {
  contact = document.getElementById("assignedToDropDown");
    
    for (let i = 0; i < allUsers.length; i++) {
      user = allUsers[i];
      renderAssignedToHTML(user,contact, i);
    }
    contact.classList.remove("d-none");
    document.getElementById('arrowa').classList.add("rotate");
    // console.log(assignedContacts);
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
  checkAssignedContactsStatus(user['name'], i)
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
  //div.classList.add('d-none');
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
    document.getElementById(`none_checked${i}`).classList.remove("d-none")
    document.getElementById(`checked${i}`).classList.add("d-none")
    selUser.classList.remove('contactIsSelect');
    removeAssignetToContects(x.name)
  } else {
    document.getElementById(`none_checked${i}`).classList.add("d-none")
    document.getElementById(`checked${i}`).classList.remove("d-none")
    selUser.classList.add('contactIsSelect');
    y = x.isSelect = true;
    addUserToTask(x, y)
  }
}

function checkAssignedContactsStatus(un, index) {
  let name = un;
  // console.log(un);
  for (name in allUsers) {
    for (let i = 0; i < allUsers.length; i++) {
      if (name == allUsers[i].name == true) {
        if (assignedContacts[i].isSelected == true) {
          document.getElementById(`user${index}`).classList.add('contactIsSelect');
        }
      }
    }
    // if (Object.hasOwnProperty.call(object, name)) {
    //   const element = object[name];
    //   
    // }
  }
  // if (i.isSelected === true) {
  //   iu = allUsers.includes(i.name)
  //   console.log(i);
  //   document.getElementById(iu).classList.add('contactIsSelect');
  // }
}

function removeAssignetToContects(name) {
  console.log(name);
    for (let i = 0; i < assignedContacts.length; i++) {
      indexOfName = assignedContacts[i].includes(name);
      if (indexOfName == true) {
        assignedContacts.splice(indexOfName, 1)
      }
    }
    
    assignetToContects()
}

function changeToInputfield() {
let visibilitycheck = document.getElementById("searchArea").classList.contains("d-none")
  if (visibilitycheck == true) {
    document.getElementById("searchArea").classList.remove("d-none");
    document.getElementById("standartValue").classList.add("d-none");
  } else {
    document.getElementById("searchArea").classList.add("d-none");
    document.getElementById("standartValue").classList.remove("d-none");
  }
}

function searchContacts() {
  search = document.getElementById("searchField");
  text = search.value.toLowerCase();
  console.log(text);
  if (text.length <=2) {
  } else {
    for (let i = 0; i < allUsers.length; i++) {
      aU = allUsers[i].name.toLowerCase();
      console.log(aU);
      if (aU.includes(text)) {
        searchResults.push(allUsers[i]);
        showDropDownAssignedToOnlyResult();
      }
    }
  }
  searchResults = [];
  if (text.length = 0) {
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
    console.log(searchResults);
}