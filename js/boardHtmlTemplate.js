function generateTaskHTMLForSearch(
  id,
  variableClass,
  storyCategory,
  title,
  taskDescription,
  contactsHTML,
  category,
  oppositeCategory,
  rightIcon,
  jsonElement
) {
  let jsonTextElement = encodeURIComponent(jsonElement);

  return /*html*/ `
      <div class="task" 
          draggable="true" 
          ondragstart="startDragging(${id})" 
          ondragend="checkIfEmpty('${category}', '${oppositeCategory}')" 
          ondragover="allowDrop(event)"
          ondrop="moveTo('${category}')"
          onclick="showBigTaskPopUp('${jsonTextElement}')"
      >
        <div class='task-category' style='background-color: ${checkCategoryColor(storyCategory)}'>${storyCategory}</div>
        <h3 class="task-title">${title}</h3>
        <p class="task-description">${taskDescription}</p>
        <div class="task-bar-container">
          <div class="task-bar">
            <div class="task-bar-content"></div>
          </div>
          <p class="task-bar-text">1/2 Subtasks</p>
        </div>
        <div class="task-contacts-container">
          <div class="task-contacts">
            ${contactsHTML}
          </div>
          ${rightIcon}
        </div>
      </div>
      
      <div id="${oppositeCategory}" class="no-task d-none">
        <p>No tasks in ${category}</p>
      </div>
    `;
}

function generateTaskHTML(element, contactsHTML, oppositeCategory, rightIcon, jsonElement) {
  let jsonTextElement = encodeURIComponent(jsonElement);
  if (element["subtask"] && element["subtask"].length > 0) {
    // console.log(element["subtask"]);
    let numberOfTasksChecked = 0;
    for (index = 0; index < element["subtask"].length; index++) {
      if (element["subtask"][index]["is-tasked-checked"] == true) {
        numberOfTasksChecked += 1;
      }
    }
    // console.log(numberOfTasksChecked);
    let taskbarWidth = Math.round((numberOfTasksChecked / element["subtask"].length) * 100);
    // console.log(taskbarWidth);
    return returnTaskHtmlWithSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskbarWidth, numberOfTasksChecked);
  } else if (element["subtask"] && element["subtask"].length == 0) {
    return returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement);
  } else {
    return returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement);
  }
}

function returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement) {
  let taskIndex = element.tasksIdentity;

  return `
  <div class="task"
      draggable="true"
      ondragstart="startDragging(${element["tasksIdentity"]})"
      ondragend="checkIfEmpty('${element["container"]}', '${oppositeCategory}')"
      ondragover="allowDrop(event)"
      ondrop="moveTo('${element["container"]}')"
      onclick="showBigTaskPopUp('${jsonTextElement}')"
  > <div class="task-category-and-dropdown">
      <div class='task-category' style='background-color: ${checkCategoryColor(element["category"])}'>
        ${element["category"]}
      </div>
      <button onclick="stopEvent(event); openMobileDropdown(${taskIndex})">Dropdown</button>
    </div>
    <div id="mobileDropdown${taskIndex}" class="mobileDropdown mobileDropdown-translate-100">
      <a onclick="stopEvent(event);">To Do</a>
      <a onclick="stopEvent(event);">In Progress</a>
      <a onclick="stopEvent(event);">Await Feedback</a>
      <a onclick="stopEvent(event);">Done</a>
    </div>
    <h3 class="task-title">${element["title"]}</h3>
    <p class="task-description">${element["description"]}</p>
    <div class="task-contacts-container">
      <div class="task-contacts">
        ${contactsHTML}
      </div>
      ${rightIcon}
    </div>
  </div>
  <div id="${oppositeCategory}" class="no-task d-none">
    <p>No tasks in ${element["container"]}</p>
  </div>
`;
}

function returnTaskHtmlWithSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskbarWidth, numberOfTasksChecked) {
  let taskIndex = element.tasksIdentity;

  return `
      <div class="task" 
          draggable="true" 
          ondragstart="startDragging(${element["tasksIdentity"]})" 
          ondragend="checkIfEmpty('${element["container"]}', '${oppositeCategory}')" 
          ondragover="allowDrop(event)"
          ondrop="moveTo('${element["container"]}')"
          onclick="showBigTaskPopUp('${jsonTextElement}')"
      > <div class="task-category-and-dropdown">
          <div class='task-category' style='background-color: ${checkCategoryColor(element["category"])}'>
            ${element["category"]}
          </div>
          <button onclick="stopEvent(event); openMobileDropdown(${taskIndex})">Dropdown</button>
        </div>
        <div id="mobileDropdown${taskIndex}" class="mobileDropdown mobileDropdown-translate-100">
          <a onclick="stopEvent(event);">To Do</a>
          <a onclick="stopEvent(event);">In Progress</a>
          <a onclick="stopEvent(event);">Await Feedback</a>
          <a onclick="stopEvent(event);">Done</a>
        </div>
        <h3 class="task-title">${element["title"]}</h3>
        <p class="task-description">${element["description"]}</p>
        <div class="task-bar-container">
          <div class="task-bar">
            <div class="task-bar-content" style="width: ${taskbarWidth}%"></div>
          </div>
          <p class="task-bar-text">${numberOfTasksChecked}/${element["subtask"].length} Subtasks</p>
        </div>
        <div class="task-contacts-container">
          <div class="task-contacts">
            ${contactsHTML}
          </div>
          ${rightIcon}
        </div>
      </div>
      
      <div id="${oppositeCategory}" class="no-task d-none">
        <p>No tasks in ${element["container"]}</p>
      </div>`;
}

// onclick="showBigTaskPopUp()"
function generateHTMLUrgencyLow() {
  return /*html*/ `
      <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" fill="#7AE229"/>
          <path d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" fill="#7AE229"/>
      </svg>
      `;
}

function generateHTMLUrgencyMedium() {
  return /*html*/ `
      <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5685 7.16658L1.43151 7.16658C1.18446 7.16658 0.947523 7.06773 0.772832 6.89177C0.598141 6.71581 0.5 6.47716 0.5 6.22831C0.5 5.97947 0.598141 5.74081 0.772832 5.56485C0.947523 5.38889 1.18446 5.29004 1.43151 5.29004L16.5685 5.29004C16.8155 5.29004 17.0525 5.38889 17.2272 5.56485C17.4019 5.74081 17.5 5.97947 17.5 6.22831C17.5 6.47716 17.4019 6.71581 17.2272 6.89177C17.0525 7.06773 16.8155 7.16658 16.5685 7.16658Z" fill="#FFA800"/>
          <path d="M16.5685 2.7098L1.43151 2.7098C1.18446 2.7098 0.947523 2.61094 0.772832 2.43498C0.598141 2.25902 0.5 2.02037 0.5 1.77152C0.5 1.52268 0.598141 1.28403 0.772832 1.10807C0.947523 0.932105 1.18446 0.833252 1.43151 0.833252L16.5685 0.833252C16.8155 0.833252 17.0525 0.932105 17.2272 1.10807C17.4019 1.28403 17.5 1.52268 17.5 1.77152C17.5 2.02037 17.4019 2.25902 17.2272 2.43498C17.0525 2.61094 16.8155 2.7098 16.5685 2.7098Z" fill="#FFA800"/>
      </svg>
      `;
}

function generateHTMLUrgencyUrgent() {
  return /*html*/ `
      <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_185713_5531)">
              <path d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z" fill="#FF3D00"/>
              <path d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z" fill="#FF3D00"/>
          </g>
          <defs>
              <clipPath id="clip0_185713_5531">
                  <rect width="20" height="14.5098" fill="white" transform="translate(0.748535 0.745117)"/>
              </clipPath>
          </defs>
      </svg>
      `;
}

function returnHtmlNoFeedbackContainer() {
  return /*html*/ `
    <div id="no-await-feedback-container" class="no-task">
        <p>No tasks await feedback</p>
    </div>`;
}

function returnHtmlNoProgressContainer() {
  return /*html*/ `
    <div id="no-in-progress-container" class="no-task">
        <p>No tasks in progress</p>
    </div>`;
}

function returnHtmlNoToDoContainer() {
  return /*html*/ `
    <div id="no-to-do-container" class="no-task">
        <p>No tasks to do</p>
    </div>`;
}

function returnHtmlNoDoneContainer() {
  return /*html*/ `
    <div id="no-done-container" class="no-task">
        <p>No tasks done</p>
    </div>`;
}

function returnAssignedContactHTML(contact) {
  return /*html*/ `
      <div class="big-task-pop-up-contact">
        <div class="big-task-pop-up-profile-badge" style="background: ${contact.color}">${firstLetterFirstTwoWords(contact.name)}</div>
        <p class="big-task-pop-up-profile-name">${contact.name}</p>
      </div>
      `;
}

// function renderSubtaskInPopUpContainer(i, subtask) {
//   return /*html*/ `
//     <div ondblclick="editSubtask(${i})" id="subtaskNumber${i}" class="subtasks" onmouseover="sowSubaskEdditButtons(${i})" onmouseout="hideSubaskEdditButtons(${i})">
//       <li >${subtask}</li>
//       <div id="popUpSubBTN${i}" class="subBtn1 d-none">
//         <svg onclick="editSubtaskPopUpInput(${i}), stopEvent(event)" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
//         </svg>
//         <svg onclick="deleteSubtaskPopUp(${i}), stopEvent(event)" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
//         </svg>
//       </div>
//     </div>
//   `;
// }

function returnSubtaskHTML(correctTaskId, subtask, i) {
  // console.log(subtask["is-tasked-checked"]);
  return /*html*/ `
  <div class="big-task-pop-up-subtasks" id="bigSubtaskNo${i}">
    <svg
      id="checkBoxIconUnchecked${i}"
      onclick="addCheckedStatus(${i}, ${correctTaskId})"
      class="big-task-pop-up-subtask-checkbox-icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >   
      <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2" />
    </svg>

    <svg 
      id="checkBoxIconChecked${i}"
      onclick="addCheckedStatus(${i}, ${correctTaskId})"
      class="big-task-pop-up-subtask-checkbox-icon d-none" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 8.96582V14.9658C17 16.6227 15.6569 17.9658 14 17.9658H4C2.34315 17.9658 1 16.6227 1 14.9658V4.96582C1 3.30897 2.34315 1.96582 4 1.96582H12" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
        <path d="M5 9.96582L9 13.9658L17 2.46582" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>


    <!-- <svg 
      id="checkBoxIconChecked${i}"
      onclick="addCheckedStatus(${i}, ${correctTaskId})"
      class="big-task-pop-up-subtask-checkbox-icon d-none"
      width="22" 
      height="22" 
      viewBox="0 0 22 22" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg">
       <path d="M20 11V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H15" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
       <path d="M8 12L12 16L20 4.5" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg> -->


    <p>${subtask["task-description"]}</p>
  </div>
`;
}

function returnSubtaskHTMLWithBolean(correctTaskId, subtask, i) {
  return /*html*/ `
  <div class="big-task-pop-up-subtasks" id="bigSubtaskNo${i}">
    <svg
      id="checkBoxIconUnchecked${i}"
      onclick="addCheckedStatus(${i}, ${correctTaskId})"
      class="big-task-pop-up-subtask-checkbox-icon d-none"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >   
      <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2" />
    </svg>

    <svg 
      id="checkBoxIconChecked${i}"
      onclick="addCheckedStatus(${i}, ${correctTaskId})"
      class="big-task-pop-up-subtask-checkbox-icon" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 8.96582V14.9658C17 16.6227 15.6569 17.9658 14 17.9658H4C2.34315 17.9658 1 16.6227 1 14.9658V4.96582C1 3.30897 2.34315 1.96582 4 1.96582H12" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
        <path d="M5 9.96582L9 13.9658L17 2.46582" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>




    <p>${subtask["task-description"]}</p>
  </div>
`;
}

function returnDeleteEditHTML(id, jsonTextElement) {
  return /*html*/ `
  <div id="big-task-pop-up-delete-button" onclick='hideBigTaskPopUp(); deleteTask(${id})'>
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
        d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z"
        fill="#2A3647"
        />
      </svg>
      
      Delete
  </div>
    
  <div class="big-task-pop-up-stroke"></div>

  <div id="big-task-pop-up-edit-button" onclick='renderEditTask("${jsonTextElement}", ${id})'>
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
      d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z"
      fill="#2A3647"
      />
    </svg>
  
    Edit
</div>`;
}

function returnBigTaskPopUpPriorityContainer() {
  document.getElementById("big-task-pop-up-priority-container").innerHTML = /*html*/ `
    <p id='big-edit-task-priority-section-headline'>Priority</p>
    <div id='big-edit-task-priority-container'>
      <div class='big-edit-task-priority-item' id='big-edit-task-urgent-priority' onclick='checkBigEditTaskPriority("urgent")'>
        Urgent
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.6527 15.2547C19.418 15.2551 19.1895 15.1803 19.0006 15.0412L10.7486 8.958L2.4965 15.0412C2.38065 15.1267 2.24907 15.1887 2.10927 15.2234C1.96947 15.2582 1.82419 15.2651 1.68172 15.2437C1.53925 15.2223 1.40239 15.1732 1.27894 15.099C1.1555 15.0247 1.04789 14.927 0.962258 14.8112C0.876629 14.6954 0.814657 14.5639 0.77988 14.4243C0.745104 14.2846 0.738203 14.1394 0.759574 13.997C0.802733 13.7095 0.958423 13.4509 1.19239 13.2781L10.0965 6.70761C10.2852 6.56802 10.5138 6.49268 10.7486 6.49268C10.9833 6.49268 11.2119 6.56802 11.4006 6.70761L20.3047 13.2781C20.4906 13.415 20.6285 13.6071 20.6987 13.827C20.7688 14.0469 20.7677 14.2833 20.6954 14.5025C20.6231 14.7216 20.4833 14.9124 20.296 15.0475C20.1088 15.1826 19.8836 15.2551 19.6527 15.2547Z" fill="#FF3D00"/>
        <path d="M19.6527 9.50568C19.4181 9.50609 19.1895 9.43124 19.0006 9.29214L10.7486 3.20898L2.49654 9.29214C2.26257 9.46495 1.96948 9.5378 1.68175 9.49468C1.39403 9.45155 1.13523 9.29597 0.962293 9.06218C0.789357 8.82838 0.71645 8.53551 0.759609 8.24799C0.802768 7.96048 0.958458 7.70187 1.19243 7.52906L10.0965 0.958588C10.2852 0.818997 10.5138 0.743652 10.7486 0.743652C10.9834 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4907 7.66598 20.6286 7.85809 20.6987 8.07797C20.7689 8.29785 20.7677 8.53426 20.6954 8.75344C20.6231 8.97262 20.4833 9.16338 20.2961 9.29847C20.1088 9.43356 19.8837 9.50608 19.6527 9.50568Z" fill="#FF3D00"/>
      </svg>
    </div>
    <div class='big-edit-task-priority-item' id='big-edit-task-medium-priority' onclick='checkBigEditTaskPriority("medium")'>
      Medium
      <svg width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.7596 7.91693H1.95136C1.66071 7.91693 1.38197 7.80063 1.17645 7.59362C0.970928 7.3866 0.855469 7.10584 0.855469 6.81308C0.855469 6.52032 0.970928 6.23955 1.17645 6.03254C1.38197 5.82553 1.66071 5.70923 1.95136 5.70923H19.7596C20.0502 5.70923 20.329 5.82553 20.5345 6.03254C20.74 6.23955 20.8555 6.52032 20.8555 6.81308C20.8555 7.10584 20.74 7.3866 20.5345 7.59362C20.329 7.80063 20.0502 7.91693 19.7596 7.91693Z" fill="#FFA800"/>
        <path d="M19.7596 2.67376H1.95136C1.66071 2.67376 1.38197 2.55746 1.17645 2.35045C0.970928 2.14344 0.855469 1.86267 0.855469 1.56991C0.855469 1.27715 0.970928 0.996386 1.17645 0.789374C1.38197 0.582363 1.66071 0.466064 1.95136 0.466064L19.7596 0.466064C20.0502 0.466064 20.329 0.582363 20.5345 0.789374C20.74 0.996386 20.8555 1.27715 20.8555 1.56991C20.8555 1.86267 20.74 2.14344 20.5345 2.35045C20.329 2.55746 20.0502 2.67376 19.7596 2.67376Z" fill="#FFA800"/>
      </svg>
    </div>
    <div class='big-edit-task-priority-item' id='big-edit-task-low-priority' onclick='checkBigEditTaskPriority("low")'>
      Low
      <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.8555 9.69779C10.6209 9.69819 10.3923 9.62335 10.2035 9.48427L1.30038 2.91453C1.18454 2.82898 1.0867 2.72146 1.01245 2.59812C0.938193 2.47478 0.888977 2.33803 0.867609 2.19569C0.824455 1.90821 0.897354 1.61537 1.07027 1.3816C1.24319 1.14782 1.50196 0.992265 1.78965 0.949143C2.07734 0.906021 2.3704 0.978866 2.60434 1.15165L10.8555 7.23414L19.1066 1.15165C19.2224 1.0661 19.354 1.00418 19.4938 0.969432C19.6336 0.934685 19.7788 0.927791 19.9213 0.949143C20.0637 0.970495 20.2006 1.01967 20.324 1.09388C20.4474 1.16808 20.555 1.26584 20.6407 1.3816C20.7263 1.49735 20.7883 1.62882 20.823 1.7685C20.8578 1.90818 20.8647 2.05334 20.8433 2.19569C20.822 2.33803 20.7727 2.47478 20.6985 2.59812C20.6242 2.72146 20.5264 2.82898 20.4106 2.91453L11.5075 9.48427C11.3186 9.62335 11.0901 9.69819 10.8555 9.69779Z" fill="#7AE229"/>
        <path d="M10.8555 15.4463C10.6209 15.4467 10.3923 15.3719 10.2035 15.2328L1.30038 8.66307C1.06644 8.49028 0.910763 8.2317 0.867609 7.94422C0.824455 7.65674 0.897354 7.3639 1.07027 7.13013C1.24319 6.89636 1.50196 6.7408 1.78965 6.69768C2.07734 6.65456 2.3704 6.7274 2.60434 6.90019L10.8555 12.9827L19.1066 6.90019C19.3405 6.7274 19.6336 6.65456 19.9213 6.69768C20.209 6.7408 20.4678 6.89636 20.6407 7.13013C20.8136 7.3639 20.8865 7.65674 20.8433 7.94422C20.8002 8.2317 20.6445 8.49028 20.4106 8.66307L11.5075 15.2328C11.3186 15.3719 11.0901 15.4467 10.8555 15.4463Z" fill="#7AE229"/>
      </svg>
    </div>
  </div>
  `;
}

function returnBigTaskPopUpContactAll(id) {
  document.getElementById("big-task-pop-up-contact-all").innerHTML = /*html*/ `
      <div id='big-edit-task-assigned-to-top-container'>
        <p class='big-edit-task-section-headline'>Assigned to</p>
        
        <div onclick='stopEvent(event);' id='big-edit-task-assigned-to-input-container'>
          <input  onclick=' showEditTaskAssignedToPopUp()' type='text' id='big-edit-task-assigned-to-input' onkeyup='editPopUpSearchContacts("${id}")' placeholder='Select contacts to assign'>
            <svg onclick=' toggleEditTaskAssignedToPopUp()' id='big-edit-task-assigned-to-input-arrow' class='big-edit-task-assigned-to-input-arrow' width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.44451 4.3L0.844506 1.7C0.52784 1.38333 0.457006 1.02083 0.632006 0.6125C0.807006 0.204167 1.11951 0 1.56951 0H6.71951C7.16951 0 7.48201 0.204167 7.65701 0.6125C7.83201 1.02083 7.76117 1.38333 7.44451 1.7L4.84451 4.3C4.74451 4.4 4.63617 4.475 4.51951 4.525C4.40284 4.575 4.27784 4.6 4.14451 4.6C4.01117 4.6 3.88617 4.575 3.76951 4.525C3.65284 4.475 3.54451 4.4 3.44451 4.3Z" fill="#2A3647"/>
            </svg>
        </div>
      </div>

      <div id='big-edit-task-assigned-to-contact-container'></div>

      <div id='big-edit-task-assigned-to-pop-up-container' class='big-edit-task-assigned-to-pop-up-container height-0'>
        <div id='big-edit-task-assigned-to-pop-up' onclick='stopEvent(event);' class='big-edit-task-assigned-to-pop-up box-shadow-none'></div>
      </div>
  `;
}

function returnBigTaskPopUpSubtasksAll() {
  document.getElementById("big-task-pop-up-subtask-all").innerHTML = /*html*/ `
    <p class='big-edit-task-section-headline'>Subtasks</p>

    <div id='big-edit-task-subtask-input-container' onkeyup='changeSubtaskInputIcons()' onclick='focusSubtaskInput()'>
      <input type="text" id='big-edit-task-subtask-input' placeholder='Add new Subtask'>
      
      <div id='big-edit-task-subtask-input-icon-container'>
        <svg id='big-edit-task-subtask-input-plus-icon' width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.14453 8H1.14453C0.861198 8 0.623698 7.90417 0.432031 7.7125C0.240365 7.52083 0.144531 7.28333 0.144531 7C0.144531 6.71667 0.240365 6.47917 0.432031 6.2875C0.623698 6.09583 0.861198 6 1.14453 6H6.14453V1C6.14453 0.716667 6.24036 0.479167 6.43203 0.2875C6.6237 0.0958333 6.8612 0 7.14453 0C7.42786 0 7.66536 0.0958333 7.85703 0.2875C8.0487 0.479167 8.14453 0.716667 8.14453 1V6H13.1445C13.4279 6 13.6654 6.09583 13.857 6.2875C14.0487 6.47917 14.1445 6.71667 14.1445 7C14.1445 7.28333 14.0487 7.52083 13.857 7.7125C13.6654 7.90417 13.4279 8 13.1445 8H8.14453V13C8.14453 13.2833 8.0487 13.5208 7.85703 13.7125C7.66536 13.9042 7.42786 14 7.14453 14C6.8612 14 6.6237 13.9042 6.43203 13.7125C6.24036 13.5208 6.14453 13.2833 6.14453 13V8Z" fill="#2A3647"/>
        </svg>
      </div>
    </div>

    <ul id='big-edit-task-subtask-container'></ul>
  `;
}

function renderOnlyAssignedToPopUp(contact, contactObject, i, taskIndex) {
  document.getElementById("big-edit-task-assigned-to-pop-up").innerHTML += /*html*/ `
      <div onclick='checkBigEditTaskContact(${i}, ${contactObject},${taskIndex})' class='big-edit-task-assigned-to-pop-up-contact-container'>
        <div class='big-edit-task-assigned-to-pop-up-contact' >
          <div class='big-edit-task-assigned-to-pop-up-contact-badge' style='background-color: ${contact.color}'>
            ${firstLetterFirstTwoWords(contact.name)}
          </div>
          <p class='big-edit-task-assigned-to-pop-up-contact-name'>${contact.name}</p>
        </div>

        <div class='big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container'>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
          </svg>
        </div>
      </div>
    `;
}

function renderOnlyActiveAssignedToPopUp(contact, contactObject, i, taskIndex) {
  document.getElementById("big-edit-task-assigned-to-pop-up").innerHTML += /*html*/ `
      <div onclick='checkBigEditTaskContact(${i}, ${contactObject},${taskIndex})' class='big-edit-task-assigned-to-pop-up-contact-container big-edit-task-assigned-to-pop-up-active-contact'>
        <div class='big-edit-task-assigned-to-pop-up-contact' >
          <div class='big-edit-task-assigned-to-pop-up-contact-badge' style='background-color: ${contact.color}'>
            ${firstLetterFirstTwoWords(contact.name)}
          </div>
          <p class='big-edit-task-assigned-to-pop-up-contact-name'>${contact.name}</p>
        </div>

        <div class='big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container'>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8V14C17 15.6569 15.6569 17 14 17H4C2.34315 17 1 15.6569 1 14V4C1 2.34315 2.34315 1 4 1H12" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M5 9L9 13L17 1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    `;
}

function renderSubtaskInPopUpContainer(i, subtask) {
  return /*html*/ `
    <div ondblclick=" editSubtaskPopUpInput(${i})" onclick='stopEvent(event);' id="subtaskNumber${i}" class="edit-popup-subtasks" >
      <li >${subtask["task-description"]}</li>
      <div id="popUpSubBTN${i}" class="edit-popup-subtask-icon-container">
        <svg onclick="editSubtaskPopUpInput(${i}), stopEvent(event)" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
        </svg>

        <div class='edit-popup-subtasks-line'></div>

        <svg onclick="deleteSubtaskPopUp(${i}), stopEvent(event)" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
        </svg>
      </div>
    </div>
  `;
}

function returnHTMLBigTaskPopUpDueDateContainerContent(date) {
  document.getElementById("big-task-pop-up-due-date-container").innerHTML = /*html*/ `
    <h2 class="big-task-pop-up-label-text">Due date:</h2>
    <p id="big-task-pop-up-date" class="big-task-pop-up-value-text">${date}</p>
  `;
}

function returnHTMLBigTaskPopUpPriorityContainer(priority) {
  document.getElementById("big-task-pop-up-priority-container").innerHTML = /*html*/ `
    <h2 class="big-task-pop-up-label-text">Priority:</h2>
    <div class="big-task-pop-up-value-text">
      <p id="big-task-pop-up-priority-text">${priority}</p>

      <div id="big-task-pop-up-priority-icon">
        <svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.0685 7.16658H0.931507C0.684456 7.16658 0.447523 7.06773 0.272832 6.89177C0.0981406 6.71581 0 6.47716 0 6.22831C0 5.97947 0.0981406 5.74081 0.272832 5.56485C0.447523 5.38889 0.684456 5.29004 0.931507 5.29004H16.0685C16.3155 5.29004 16.5525 5.38889 16.7272 5.56485C16.9019 5.74081 17 5.97947 17 6.22831C17 6.47716 16.9019 6.71581 16.7272 6.89177C16.5525 7.06773 16.3155 7.16658 16.0685 7.16658Z"
            fill="#FF7A00"
          />
          <path
            d="M16.0685 2.7098H0.931507C0.684456 2.7098 0.447523 2.61094 0.272832 2.43498C0.0981406 2.25902 0 2.02037 0 1.77152C0 1.52268 0.0981406 1.28403 0.272832 1.10807C0.447523 0.932105 0.684456 0.833252 0.931507 0.833252H16.0685C16.3155 0.833252 16.5525 0.932105 16.7272 1.10807C16.9019 1.28403 17 1.52268 17 1.77152C17 2.02037 16.9019 2.25902 16.7272 2.43498C16.5525 2.61094 16.3155 2.7098 16.0685 2.7098Z"
            fill="#FF7A00"
          />
        </svg>
      </div>
    </div>
  `;
}

function returnHTMLBigTaskPopUpContactAll(contactsHTML) {
  document.getElementById("big-task-pop-up-contact-all").innerHTML = /*html*/ `
    <h2 class="big-task-pop-up-label-text">Assigned To:</h2>
    <div id="big-task-pop-up-contact-container">${contactsHTML}</div>
  `;
}

function returnHTMLBigTaskPopUpSubtaskAll() {
  document.getElementById("big-task-pop-up-subtask-all").innerHTML = /*html*/ `
    <h2 class="big-task-pop-up-label-text">Subtasks</h2>
    <div id="big-task-pop-up-subtasks-container"></div>
  `;
}

function returnSubtaskInputHTMLPlusIconSVG() {
  return /*html*/ `
      <svg id='big-edit-task-subtask-input-plus-icon' width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.14453 8H1.14453C0.861198 8 0.623698 7.90417 0.432031 7.7125C0.240365 7.52083 0.144531 7.28333 0.144531 7C0.144531 6.71667 0.240365 6.47917 0.432031 6.2875C0.623698 6.09583 0.861198 6 1.14453 6H6.14453V1C6.14453 0.716667 6.24036 0.479167 6.43203 0.2875C6.6237 0.0958333 6.8612 0 7.14453 0C7.42786 0 7.66536 0.0958333 7.85703 0.2875C8.0487 0.479167 8.14453 0.716667 8.14453 1V6H13.1445C13.4279 6 13.6654 6.09583 13.857 6.2875C14.0487 6.47917 14.1445 6.71667 14.1445 7C14.1445 7.28333 14.0487 7.52083 13.857 7.7125C13.6654 7.90417 13.4279 8 13.1445 8H8.14453V13C8.14453 13.2833 8.0487 13.5208 7.85703 13.7125C7.66536 13.9042 7.42786 14 7.14453 14C6.8612 14 6.6237 13.9042 6.43203 13.7125C6.24036 13.5208 6.14453 13.2833 6.14453 13V8Z" fill="#2A3647"/>
      </svg>
    `;
}

function returnSubtaskInputHTMLCloseIcon() {
  return /*html*/ `
    <svg id='big-edit-task-subtask-input-close-icon' onclick='resetSubtaskInput()' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.14434 8.40005L2.24434 13.3C2.061 13.4834 1.82767 13.575 1.54434 13.575C1.261 13.575 1.02767 13.4834 0.844336 13.3C0.661003 13.1167 0.569336 12.8834 0.569336 12.6C0.569336 12.3167 0.661003 12.0834 0.844336 11.9L5.74434 7.00005L0.844336 2.10005C0.661003 1.91672 0.569336 1.68338 0.569336 1.40005C0.569336 1.11672 0.661003 0.883382 0.844336 0.700049C1.02767 0.516715 1.261 0.425049 1.54434 0.425049C1.82767 0.425049 2.061 0.516715 2.24434 0.700049L7.14434 5.60005L12.0443 0.700049C12.2277 0.516715 12.461 0.425049 12.7443 0.425049C13.0277 0.425049 13.261 0.516715 13.4443 0.700049C13.6277 0.883382 13.7193 1.11672 13.7193 1.40005C13.7193 1.68338 13.6277 1.91672 13.4443 2.10005L8.54434 7.00005L13.4443 11.9C13.6277 12.0834 13.7193 12.3167 13.7193 12.6C13.7193 12.8834 13.6277 13.1167 13.4443 13.3C13.261 13.4834 13.0277 13.575 12.7443 13.575C12.461 13.575 12.2277 13.4834 12.0443 13.3L7.14434 8.40005Z" fill="#2A3647"/>
    </svg>
    <div class='big-edit-task-subtask-icon-line'></div>
    <svg id='big-edit-task-subtask-input-save-icon' onclick='buildSubtaskArrayForUpload()' width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.69474 9.15L14.1697 0.675C14.3697 0.475 14.6072 0.375 14.8822 0.375C15.1572 0.375 15.3947 0.475 15.5947 0.675C15.7947 0.875 15.8947 1.1125 15.8947 1.3875C15.8947 1.6625 15.7947 1.9 15.5947 2.1L6.39474 11.3C6.19474 11.5 5.96141 11.6 5.69474 11.6C5.42807 11.6 5.19474 11.5 4.99474 11.3L0.694738 7C0.494738 6.8 0.398905 6.5625 0.407238 6.2875C0.415572 6.0125 0.519738 5.775 0.719738 5.575C0.919738 5.375 1.15724 5.275 1.43224 5.275C1.70724 5.275 1.94474 5.375 2.14474 5.575L5.69474 9.15Z" fill="#2A3647"/>
    </svg> 
    `;
}

function returnBigTaskPopUpDescription(oldDescription) {
  document.getElementById("big-task-pop-up-description").innerHTML = /*html*/ `
    <p class='big-edit-task-section-headline'>Description</p>
    <textarea id="big-edit-task-description-input" placeholder='Enter a Description'>${oldDescription}</textarea>
  `;
}

function returnBigTaskPopUpTitle(oldTitle) {
  document.getElementById("big-task-pop-up-title").innerHTML = /*html*/ `
    <p class='big-edit-task-section-headline'>Title</p>
    <input type="text" id='big-edit-task-title-input' value='${oldTitle}' placeholder='Enter a title'>
  `;
}

function returnBigTaskPopUpDueDateContainer(oldDate) {
  document.getElementById("big-task-pop-up-due-date-container").innerHTML = /*html*/ `
    <p class='big-edit-task-section-headline'>Due date</p>
    <input type="text" value='${oldDate}' maxlength='10' placeholder='dd/mm/yyyy' id='big-edit-task-due-date-input'>
  `;
}

function returnEditSubtaskPopUpInputHTML(i) {
  return /*html*/ `
    <input id="subtaskEditedPopUp" type="text" value="${subtaskArray[i]["task-description"]}">
    <div class="inputButtons">
      <img onclick="deleteSubtaskPopUp(${i}), stopEvent(event)" src="Assets/img/deletetrash.svg" alt="">
      <div class="subtaskBorder"></div>
      <img onclick="saveEditedSubtaskPopUp(${i}), stopEvent(event), closeSubtaskContainer()" src="Assets/img/checksubmit.svg" alt="">
    </div>
`;
}

function returnColorAndAssignedToContacts(contact) {
  document.getElementById("big-edit-task-assigned-to-contact-container").innerHTML += /*html*/ `
    <div class='big-edit-task-assigned-to-contact' style='background-color:${contact.color}'>
      ${firstLetterFirstTwoWords(contact.name)}
    </div>
  `;
}

function returnNoOneIsAssignedHTML() {
  document.getElementById("big-edit-task-assigned-to-contact-container").innerHTML = /*html*/ `
  <p class='big-task-pop-up-value-text'>No one is assigned</p>
  `;
}

function returnBigPopUpEditButtons(id) {
  document.getElementById("big-task-pop-up-bottom-buttons-container").innerHTML = /*html*/ `
  <button id='big-edit-task-pop-up-save-button' onclick='saveTaskChanges(${id})'>
    Ok
    <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.55021 9.65L14.0252 1.175C14.2252 0.975 14.4627 0.875 14.7377 0.875C15.0127 0.875 15.2502 0.975 15.4502 1.175C15.6502 1.375 15.7502 1.6125 15.7502 1.8875C15.7502 2.1625 15.6502 2.4 15.4502 2.6L6.25021 11.8C6.05021 12 5.81687 12.1 5.55021 12.1C5.28354 12.1 5.05021 12 4.85021 11.8L0.550207 7.5C0.350207 7.3 0.254374 7.0625 0.262707 6.7875C0.27104 6.5125 0.375207 6.275 0.575207 6.075C0.775207 5.875 1.01271 5.775 1.28771 5.775C1.56271 5.775 1.80021 5.875 2.00021 6.075L5.55021 9.65Z" fill="white"/>
    </svg>

  </button>`;
}

function returnBigEditTaskAssignedToPopUpContactCheckboxIconHTML(i) {
  document.querySelectorAll(".big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container")[i].innerHTML = /*html*/ `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 8V14C17 15.6569 15.6569 17 14 17H4C2.34315 17 1 15.6569 1 14V4C1 2.34315 2.34315 1 4 1H12" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M5 9L9 13L17 1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;
}

function returnBigEditTaskAssignedToPopUpContactCheckboxSecondIconHTML(i) {
  document.querySelectorAll(".big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container")[i].innerHTML = /*html*/ `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2" />
    </svg>
  `;
}
