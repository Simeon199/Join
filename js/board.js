let testingTasks2 = [
  {
    "category": "to-do-container",
    "story-category": "User Story",
    "id": 0,
    "title": "Contact Form and Imprint",
    "task": "Create a contact form and imprint page",
    "people-in-charge": ['AS', 'DE', 'EF']
  },
  {
    "category": "await-feedback-container",
    "story-category": "Technical Task",
    "id": 1,
    "title": "HTML Base Template Creation",
    "task": "Create reusable HTML base templates",
    "people-in-charge": ['AM', 'EM', 'MB']
  },
  {
    "category": "await-feedback-container",
    "story-category": "User Story",
    "id": 2,
    "title": "Daily Kochwelt Recipe",
    "task": "Implement daily recipe and portion calculator",
    "people-in-charge": ['EF', 'AS', 'TW']
  },
  {
    "category": "done-container",
    "story-category": "Technical Task",
    "id": 3,
    "title": "CSS Architecture Planning",
    "task": "Define CSS naming conventions and structure",
    "people-in-charge": ['SM', 'BZ', 'TW']
  },
  {
    "category": "in-progress-container",
    "story-category": "User Story",
    "id": 4,
    "title": "Kochwelt Page & Recipe Recommender",
    "task": "Build start page with recipe recommendation",
    "people-in-charge": ['AM', 'EM', 'MB']
  }
]

let tasks =[];
const BASE_URL = 'https://join-privat-default-rtdb.europe-west1.firebasedatabase.app/';
let categories = [];
let elementDraggedOver;

/* Bemerkung: Die Ausführung von deleteCertainElements(), deren Aufgabe es wäre ausgewählte Datenbankeinträge wieder zu entfernen
funktioniert noch nicht, da die Firebase-Datenbank in diesem Fall den Zugriff verweigert ('Probleme mit der CORS policy') */

document.addEventListener("DOMContentLoaded", async function(){
  await getTasksFromDatabase();
  updateHTML();
})

async function deleteDataFromDatabase(path=""){
  try{
    let response = await fetch(BASE_URL + path + ".json()", {
    method: "DELETE",
  }); 
  if(!response.ok){
    throw new Error('HTTP error! status: ${response.status}');
  }
  let responseToJson = await response.json();
  return responseToJson;
} catch(error){
  console.log('Error deleting data: ', error);
}
}

async function deleteCertainElements(){
  let keyToDelete = '-O04CXUQam1YkaDlyItw';
  let path = keyToDelete;
  let result = await deleteDataFromDatabase(path);
  console.log('Ergebnis des Löschvorgangs: ', result);
}

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

async function getTasksFromDatabase(){
  tasks = await loadTasksFromDatabase();
  updateCategories();
}

function updateCategories(){
  categories = [...new Set(tasks.map(task => task.category))];
}

async function postData(path = "", data = tasksObject) {
  try {
      let response = await fetch(BASE_URL + path + ".json", {
          method: "POST",
          headers: {  
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      let responseToJson = await response.json();
      return responseToJson;
  } catch (error) {
      console.error('Error posting data:', error);
  }
}

// postData("tasks", testingTasks2).then(response => {
//   console.log('Response from Firebase:', response);
// });

async function loadTasksFromDatabase(){ 
  let response = await loadData();
  if(response && response.tasks){
    return Object.values(response.tasks['-O0AGVcxRQsqaBAqvjFf']);
  }
  return [];
}

function iterateThroughSubArray(taskArray, htmlElement){
  taskArray.forEach(task => {
    htmlElement.innerHTML += createToDoHTML(task);
  });
}

// function checkIfEmpty(category, oppositeCategory) {
//   let categoryDiv = document.getElementById(category);
//   let oppositeCategoryDiv = document.getElementById(oppositeCategory);

//   if (!categoryDiv.hasChildNodes()) {
//     oppositeCategoryDiv.classList.remove('d-none');
//   } else {
//     oppositeCategoryDiv.classList.add('d-none');
//   }
// }

function checkIfEmpty(tasksDiv, divWithoutTasks){
  let tasksDivContainer = document.getElementById(tasksDiv);
  let divWithoutTasksContainer = document.getElementById(divWithoutTasks);
  console.log(tasksDiv, divWithoutTasks);
  if(tasksDivContainer.innerHTML == ""){
    divWithoutTasksContainer.classList.remove('d-none');
  // } else {
  //   console.log(divWithoutTasks);
  //   divWithoutTasksContainer.classList.add('d-none');
  }
}

function updateHTML() {
  categories.forEach(category => {
    let element = document.getElementById(category);
    if(element){
      let filteredTasks = tasks.filter(task => task.category === category);
      element.innerHTML = '';
      iterateThroughSubArray(filteredTasks, element);
    }
  })
}

function setVariableClass(element){
  let variableClass = '';
  if(element['story-category'] == 'User Story'){
    variableClass = 'task-category';
  } else if(element['story-category'] == 'Technical Task'){
    variableClass = 'technical-task-category';
  }
  return variableClass;
}

function checkIfEmptyOnOndrop(category){
  console.log(category);
}

function createToDoHTML(element){
  let variableClass = setVariableClass(element);
  let oppositeCategory = 'no-' + element['category'];
  // console.log(element['category'], oppositeCategory);
  let contactsHTML = '';
  for(let i = 0; i < element['people-in-charge'].length; i++){
    contactsHTML += `<div class="task-contact">${element['people-in-charge'][i]}</div>`
  }
  return `<div class="task" 
              draggable="true" 
              ondragstart="startDragging(${element['id']})" 
              ondragend="checkIfEmpty('${element['category']}', '${oppositeCategory}')" 
              ondragover="allowDrop(event)"
              ondrop="moveTo('${element['category']}')"
            >
            <div class='${variableClass}'>${element['story-category']}</div>

            <h3 class="task-title">${element['title']}</h3>
            <p class="task-description">${element['task']}</p>

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

              <svg
                width="18"
                height="8"
                viewBox="0 0 18 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5685 7.16658L1.43151 7.16658C1.18446 7.16658 0.947523 7.06773 0.772832 6.89177C0.598141 6.71581 0.5 6.47716 0.5 6.22831C0.5 5.97947 0.598141 5.74081 0.772832 5.56485C0.947523 5.38889 1.18446 5.29004 1.43151 5.29004L16.5685 5.29004C16.8155 5.29004 17.0525 5.38889 17.2272 5.56485C17.4019 5.74081 17.5 5.97947 17.5 6.22831C17.5 6.47716 17.4019 6.71581 17.2272 6.89177C17.0525 7.06773 16.8155 7.16658 16.5685 7.16658Z"
                  fill="#FFA800"
                />
                <path
                  d="M16.5685 2.7098L1.43151 2.7098C1.18446 2.7098 0.947523 2.61094 0.772832 2.43498C0.598141 2.25902 0.5 2.02037 0.5 1.77152C0.5 1.52268 0.598141 1.28403 0.772832 1.10807C0.947523 0.932105 1.18446 0.833252 1.43151 0.833252L16.5685 0.833252C16.8155 0.833252 17.0525 0.932105 17.2272 1.10807C17.4019 1.28403 17.5 1.52268 17.5 1.77152C17.5 2.02037 17.4019 2.25902 17.2272 2.43498C17.0525 2.61094 16.8155 2.7098 16.5685 2.7098Z"
                  fill="#FFA800"
                />
              </svg>
            </div>
          </div>`
}

function startDragging(elementId){
  elementDraggedOver = elementId;
}

function moveTo(category){
  let categoryContainer = document.getElementById(category);
  let oppositeCategory = 'no-' + category;
  // console.log(category, oppositeCategory);
  let oppositeCategoryContainer = document.getElementById(oppositeCategory);
  if(categoryContainer.innerHTML == ""){
    oppositeCategoryContainer.classList.add('d-none');
  }
  let task = tasks.find(task => task.id == elementDraggedOver);
  if(task){
    task.category = category;
    updateHTML();
  }
}

function allowDrop(event){
  event.preventDefault();
}

function showAddTaskPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.remove("bg-op-0");
  document.getElementById("add-task-pop-up").classList.remove("translate-100");
}

function hideAddTaskPopUp() {
  document.getElementById("add-task-pop-up-bg").classList.add("bg-op-0");
  document.getElementById("add-task-pop-up").classList.add("translate-100");
}

function taskMarker() {
  document.getElementById("board").classList.add("currentSection");
}
