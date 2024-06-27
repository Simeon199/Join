let userCredicals;

function showDropDownAssignedTo() {
  contact = document.getElementById("assignedToDropDown");
    
    for (let i = 0; i < allUsers.length; i++) {
      user = allUsers[i];
      renderAssignedToHTML(user,contact, i);
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
    <div id="user${i}" class=assignedDropDownField onclick="addUserToTask('${user[`name`]}', '${user[`color`]}'); checkAssignedContacts(userCredicals); assignedToActive(${i})">
      <div class="circle" id="assignetToLetters${i}"></div>
      <div class="DropDownUser"><span>${user['name']}</span>
        <div class="checkboxesSVG">
          <img src="Assets/img/Checkbox_black.svg" alt="">
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
  //div.classList.add('d-none');
}

function addUserToTask(name, bgColor) {
    userCredicals = {
        name: name,
        color: bgColor,
        isSelected: true,
    }
    assignedContacts.push(userCredicals);
    assignetToContects()
}

function checkAssignedContacts(uc) {
    console.log(uc);
    if (uc.isSelected == true) {
        for (let i = 0; i < assignedContacts.length; i++) {
            if (assignedContacts[i].name.includes(uc.name) && assignedContacts[i].name==uc.name == true) {
                console.log("remove", i);
                uc.isSelected = false;
                removeAssignetToContects(i) // entfernen des Benutzers!! neue funktion benötigt
            }
        }
    } else {
        console.log("added", uc.name);
        uc.isSelected = true;
        assignedContacts.push(uc);
        assignetToContects()
    }
    console.log(assignedContacts);
}

function removeAssignetToContects(x) {
    assignedContacts.splice(x, 1)
    assignetToContects()
}

function assignedToActive(i) {

}