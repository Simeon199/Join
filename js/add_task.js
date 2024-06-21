let inputTitle = document.getElementById("inputTitle");
let inputDescription = document.getElementById("inputDescription");
let assignetTo = document.getElementById("assignetTo");
let date = document.getElementById("date");
let category = document.getElementById("category");

// let contact = document.getElementById("assignedToDropDown");

let subArray = ["Test1", "Test2", "Test3"];
let contacts = [];

function init() {
  changePriority(medium);
  getAllContacts();
}

function taskMarker() {
  document.getElementById("addTask").classList.add("currentSection");
}

function changePriority(id) {
  removeBackground(id);
  if (id == urgent) {
    urgent.classList.add("backgroundUrgent");
  }
  if (id == medium) {
    medium.classList.add("backgroundMedium");
  }
  if (id == low) {
    low.classList.add("backgroundLow");
  }
  changeImg(id);
}

function removeBackground(id) {
  if (id == urgent) {
    medium.classList.remove("backgroundMedium");
    low.classList.remove("backgroundLow");
  }
  if (id == medium) {
    urgent.classList.remove("backgroundUrgent");
    low.classList.remove("backgroundLow");
  }
  if (id == low) {
    urgent.classList.remove("backgroundUrgent");
    medium.classList.remove("backgroundMedium");
  }
}

function changeImg(condition) {
  let urgentImg = document.getElementById("imgUrgent");
  let mediumImg = document.getElementById("imgMedium");
  let lowImg = document.getElementById("imgLow");
  if (condition == urgent) {
    urgentImg.setAttribute("src", "Assets/img/Prio altaurgent_white.svg");
  } else {
    urgentImg.setAttribute("src", "Assets/img/Prio altaUrgent_symbole.svg");
  }
  if (condition == medium) {
    mediumImg.setAttribute("src", "Assets/img/Prio mediameduim_white.svg");
  } else {
    mediumImg.setAttribute("src", "Assets/img/Capa 1medium_color.svg");
  }
  if (condition == low) {
    lowImg.setAttribute("src", "Assets/img/Prio bajalow_white.svg");
  } else {
    lowImg.setAttribute("src", "Assets/img/Prio bajaLow_symbole.svg");
  }
}

function createTask() {
  console.log("create...");
  showrequiredText1()
  debugger
}

function clearTask() {
    console.error("Clearing...")
    // console.log(inputTitle.value);
    // inputTitle.value= "";
    // inputDescription.value='';
    clearAssignedTo();
    // date.value = '';
    category = changeCategory('Select task category');
    clearSubtask();
    changePriority(medium);
}

function showDropDownAssignedTo() {
  contact = document.getElementById("assignedToDropDown");
    // console.log(allUsers);
    
    for (let i = 0; i < allUsers.length; i++) {
      user = allUsers[i];
      renderAssignedToHTML(user,contact, i);
    }
    contact.classList.remove("d-none");
}

function showDropDownCategory() {
    document.getElementById('categoryDropDown').classList.remove('d-none');
    document.getElementById('categoryDropDown').innerHTML = /*html*/`
            <div onclick="hideDropDownCategory(); changeCategory('Technical Task')"><span>Technical Task</span></div>
            <div onclick="hideDropDownCategory(); changeCategory('User Story')"><span>User Story</span></div>
    `;
}

function hideDropDownAssignedTo() {
  contact=document.getElementById("assignedToDropDown");
  contact.classList.add("d-none");
  contact.innerHTML = "";
}

function hideDropDownCategory() {
  document.getElementById("categoryDropDown").classList.add("d-none");
}

function changeCategory(text) {
    document.getElementById('categoryText').innerHTML = `${text}`;
}

function addSubtask() {
  let text = document.getElementById(`subtask`);
  if (text.value.length <= 0) {
    alert("Leeres Feld kann nicht gespeichert werden")
  } else {
    subArray.push(text.value);
    text.value='';
    rendersubtask();
  }
}

function rendersubtask() {
  document.getElementById("sowSubtasks").innerHTML = "";
  for (let i = 0; i < subArray.length; i++) {
    let content = subArray[i]
    renderSubtaskHTML(i, content)
  }
}

function renderSubtaskHTML(i , content) {
  aS = document.getElementById("sowSubtasks");
  // aS = subtask;
  aS.classList.remove('d-none');
  // subtask.classList.remove('d-none');
  aS.innerHTML += /*html*/`
    <div class="subtasks" onmouseover="showEditButtons(${i})" onmouseout="hiddeEditButtons(${i})">
      <span id="changeTo${i}">${content}</span>
      <div id="subBTN${i}" class="subBtn1"></div>
    </div>
  `;
}

function showEditButtons(i) {
  tt = document.getElementById(`subBTN${i}`);
  tt.classList.remove("d-none")
  tt.innerHTML = /*html*/`
    <svg onclick="editSubtask(${i})" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
    </svg>
    <svg onclick="deleteSubtask(${i})" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
    </svg>
  `;
}

function hiddeEditButtons(i) {
  document.getElementById(`subBTN${i}`).classList.add("d-none")
}

function clearSubtask() {
  let subtask = document.getElementById("sowSubtasks");
  subtask.innerHTML= '';
  i = 0;
  subtask.classList.add('d-none');
}

function editSubtask(i) {
  document.getElementById(`changeTo${i}`).element;
}

function deleteSubtask(i) {
  console.log("del-test");
  subArray.splice(i ,1);
}

function showrequiredText() {
  let ids = ["requiredTitle", "requiredDate", "requiredCatergory"];
  ids.forEach(function(id) {
    let element = document.getElementById(id);
    if (element) {
      element.classList.remove('d-none');
    }
  }); 
}

function renderAssignedToHTML(user, contact, i) {
  contact.innerHTML += /*html*/`
    <div class=assignedDropDownField onclick="hideDropDownAssignedTo(); renderAssignedToCircle(${i}, '${user[`name`]}', '${user[`color`]}')">
      <div class="circle" id="assignetToLetters${i}"></div>
      <div><span>${user['name']}</span></div>
    </div>
  `;
  document.getElementById(`assignetToLetters${i}`).style.backgroundColor = user['color'];
  sowUserLetters(`assignetToLetters${i}` , user['name'])
}

function renderAssignedToCircle(i, user, color) {
  console.log(i, user);
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
  i = 0
  div.classList.add('d-none');
}

function typeaendern() {
  const inputField = document.getElementById("date");
  inputField.type = "date";
}

function typeaendernback() {
  const inputField = document.getElementById("date");
  inputField.type = "text";
}