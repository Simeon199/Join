/**
 * add subtask to task
 */
function addSubtask() {
  let text = document.getElementById(`subtask`);
  if (text.value.length <= 0) {
    showsubtaskIsEmptyError();
  } else {
    let subtaskJson = createSubtaskJson(text.value);
    subArray.push(subtaskJson);
    text.value = "";
    rendersubtask();
    hideOrShowEditButtons();
  }
}

/**
 * generate subtaks json for board popup
 * 
 * @param {string} value 
 * @returns 
 */
function createSubtaskJson(value) {
  return { "task-description": value, "is-tasked-checked": false };
}

/**
 * go through the subArray and render the subtasks
 */
function rendersubtask() {
  subtask = document.getElementById("sowSubtasks");
  subtask.innerHTML = "";

  if (subArray.length >= 1) {
    for (let i = 0; i < subArray.length; i++) {
      let content = subArray[i]["task-description"];
      subtask.innerHTML += renderSubtaskHTML(i, content);
    }
    subtask.classList.remove("d-none");
  } else {
    subtask.classList.add("d-none");
  }
}

/**
 * return the HTML code for the subtasks
 * 
 * @param {number} i 
 * @param {string} content 
 * @returns 
 */
function renderSubtaskHTML(i, content) {
  return /*html*/ `
      <div onmouseover="toggleDNone(${i})" onmouseout="toggleDNone(${i})" ondblclick="editSubtask(${i})" id="yyy${i}" class="subtasks">
        <li >${content}</li>
        <div id="subBTN${i}" class="subBtn1 d-none">
          <svg onclick="editSubtask(${i}), stopEvent(event)" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
          </svg>
          <svg onclick="deleteSubtask(${i}), stopEvent(event)" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
          </svg>
        </div>
      </div>
    `;
}

/**
 * clearing subArray
 */
function clearSubtask() {
  let subtask = document.getElementById("sowSubtasks");
  subArray = [];
  subtask.innerHTML = "";
  i = 0;
  subtask.classList.add("d-none");
  hideOrShowEditButtons();
}

/**
 * clear the subtask Inputfield
 */
function clearSubtaskInput() {
  document.getElementById("subtask").value = "";
}

/**
 * eddeding the Subtask
 * 
 * @param {number} i 
 */
function editSubtask(i) {
  editSubtaskInput(i);
}

/**
 * call the edit function
 * 
 * @param {number} i 
 */
function editSubtaskInput(i) {
  container = document.getElementById(`yyy${i}`);
  container.onmouseover = null;
  container.onmouseout = null;
  container.ondblclick = null;
  container.innerHTML = returnEditSubtaskInputHTML(i);
  edit = document.getElementById(`subtaskEdited`);
  subtask[i] = edit.value;
}
 /**
  * render the Inputfield
  * 
  * @param {number} i 
  * @returns 
  */
function returnEditSubtaskInputHTML(i) {
  return `<input id="subtaskEdited" type="text" value="${subArray[i]["task-description"]}">
  <div class="inputButtons">
    <img onclick="deleteSubtask(${i}), stopEvent(event)" src="Assets/img/deletetrash.svg" alt="">
    <div class="subtaskBorder"></div>
    <img onclick="saveEditedSubtask(${i}), stopEvent(event)" src="Assets/img/checksubmit.svg" alt="">
  </div>
`;
}

/**
 * hide edit Buttons
 */
function hideOrShowEditButtons() {
  cont = document.getElementById("testForFunction");
  plus = document.getElementById("plusSymbole");
  subtask = document.getElementById("subtaskInputButtons");

  plus.classList.add("d-none");
  subtask.classList.remove("d-none");
}

/**
 * delete Subtask from array subArray
 * 
 * @param {number} i 
 */
function deleteSubtask(i) {
  subArray.splice(i, 1);
  rendersubtask();
}

/**
 * override curret subtask value
 * @param {number} i 
 */
function saveEditedSubtask(i) {
  let text = document.getElementById(`subtaskEdited`).value;
  if (text.length > 0) {
    subArray[i]["task-description"] = text;
    rendersubtask();
  } else {
    showsubtaskIsEmptyError();
  }
}

/**
 * hide or show buttons
 * 
 * @param {string} id 
 */
function toggleDNone(id) {
  document.getElementById(`subBTN${id}`).classList.toggle("d-none");
}

/**
 * show error massage
 */
function showsubtaskIsEmptyError() {
  emptySub = document.getElementById("emptySubtask");
  emptySub.classList.remove("d-none");
  setTimeout(function () {
    document.getElementById("emptySubtask").classList.add("d-none");
  }, 5000);
}

/**
 * set focus on inputfield
 */
function focusInput() {
  hideOrShowEditButtons();
  let activSubtask = document.getElementById("subtask");
  activSubtask.focus();
}

/**
 * add subtask with push on Enter
 */
function addSubtaskByEnterClick() {
  let text = document.getElementById(`testForFunction`);
  suby = document.getElementById("subtask");
  text.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && document.hasFocus()) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("enterClick").click();
    }
  });
}
