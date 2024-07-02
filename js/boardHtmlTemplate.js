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

function generateTaskHTML(
  element,
  // variableClass,
  contactsHTML,
  oppositeCategory,
  rightIcon,
  jsonElement
) {
  let jsonTextElement = encodeURIComponent(jsonElement);
  if(element["subtask"]){
    let numberOfTasksChecked = 0;
    for(index = 0; index < element["subtask"]; index++){
      if(element["subtask"][index]["is-tasked-checked"] == true){
        numberOfTasksChecked += 1; 
      }
    }
    // let taskbarWidth = Math.round(numberOfTasksChecked/element["subtask"].length*100);
  //   returnTaskHtmlWithSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskbarWidth, numberOfTasksChecked);
  // } else {
  //   returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement);
  // }
    let taskbarWidth = Math.round(numberOfTasksChecked/element["subtask"].length*100);
    // returnTaskHtmlWithSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskbarWidth, numberOfTasksChecked);
      return /*html*/ `
        <div class="task" 
            draggable="true" 
            ondragstart="startDragging(${element["tasksIdentity"]})" 
            ondragend="checkIfEmpty('${element["container"]}', '${oppositeCategory}')" 
            ondragover="allowDrop(event)"
            ondrop="moveTo('${element["container"]}')"
            onclick="showBigTaskPopUp('${jsonTextElement}')"
        >
          <div class='task-category' style='background-color: ${checkCategoryColor(element["category"])}'>${element["category"]}</div>
          <h3 class="task-title">${element["title"]}</h3>
          <p class="task-description">${element["description"]}</p>
          <div class="task-bar-container">
            <div class="task-bar">
              <div class="task-bar-content" style="width: ${taskbarWidth}"></div>
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
        </div>
      `;
    } else {
      // returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement);
      return /*html*/ `
        <div class="task" 
            draggable="true" 
            ondragstart="startDragging(${element["tasksIdentity"]})" 
            ondragend="checkIfEmpty('${element["container"]}', '${oppositeCategory}')" 
            ondragover="allowDrop(event)"
            ondrop="moveTo('${element["container"]}')"
            onclick="showBigTaskPopUp('${jsonTextElement}')"
        >
          <div class='task-category' style='background-color: ${checkCategoryColor(element["category"])}'>${element["category"]}</div>
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
  }

function returnTaskHtmlWithoutSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement){
  return `<div class="task" 
            draggable="true" 
            ondragstart="startDragging(${element["tasksIdentity"]})" 
            ondragend="checkIfEmpty('${element["container"]}', '${oppositeCategory}')" 
            ondragover="allowDrop(event)"
            ondrop="moveTo('${element["container"]}')"
            onclick="showBigTaskPopUp('${jsonTextElement}')"
          >
          <div class='task-category' style='background-color: ${checkCategoryColor(element["category"])}'>${element["category"]}</div>
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

function returnTaskHtmlWithSubtask(element, contactsHTML, oppositeCategory, rightIcon, jsonTextElement, taskbarWidth, numberOfTasksChecked){
  return /*html*/ `
      <div class="task" 
          draggable="true" 
          ondragstart="startDragging(${element["tasksIdentity"]})" 
          ondragend="checkIfEmpty('${element["container"]}', '${oppositeCategory}')" 
          ondragover="allowDrop(event)"
          ondrop="moveTo('${element["container"]}')"
          onclick="showBigTaskPopUp('${jsonTextElement}')"
      >
        <div class='task-category' style='background-color: ${checkCategoryColor(element["category"])}'>${element["category"]}</div>
        <h3 class="task-title">${element["title"]}</h3>
        <p class="task-description">${element["description"]}</p>
        <div class="task-bar-container">
          <div class="task-bar">
            <div class="task-bar-content" style="width: ${taskbarWidth}"></div>
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

function returnSubtaskHTML(subtask) {
  return /*html*/ `
  <div class="big-task-pop-up-subtasks">
    <svg
      class="big-task-pop-up-subtask-checkbox-icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >   
      <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2" />
    </svg>

    <p>${subtask}</p>
  </div>
`;
}

function returnDeleteEditHTML(id) {
  return /*html*/ `
  <div id="big-task-pop-up-delete-button" onclick='deleteTask(${id})'>
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
        d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z"
        fill="#2A3647"
        />
      </svg>
      
      Delete
  </div>
    
  <div class="big-task-pop-up-stroke"></div>

  <div id="big-task-pop-up-edit-button" onclick='renderEditTask()'>
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
      d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z"
      fill="#2A3647"
      />
    </svg>
  
    Edit
</div>`;
}
