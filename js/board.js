let realTasks = [
  {
    "category": "to-do-container",
    "story-category": "User Story",
    "id": 0,
    "title": "Kochwelt Page & Recipe Recommender",
    "task": "Build start page with recipe recommendation"
  },
  {
    "category": "await-feedback-container",
    "story-category": "Technical Task",
    "id": 1,
    "title": "HTML Base Template Creation",
    "task": "Create reusable HTML base templates"
  },
  {
    "category": "await-feedback-container",
    "story-category": "User Story",
    "id": 2,
    "title": "Daily Kochwelt Recipe",
    "task": "Implement daily recipe and portion calculator"
  },
  {
    "category": "done-container",
    "story-category": "Technical Task",
    "id": 3,
    "title": "CSS Architecture Planning",
    "task": "Define CSS naming conventions and structure"
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
  returnCategoryArray();
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

// postData("tasks", realTasks).then(response => {
//   console.log('Response from Firebase:', response);
// });

async function loadTasksFromDatabase(){
  let response = await loadData();
  for(key in response){
    if(key == "tasks"){
      let result = response[key]["-O05H016uL_VT-vaNnYE"];
      console.log(result);
      return result;
    }
  }
}

function iterateThroughSubArray(taskArray, htmlElement){
  for(let index = 0; index < taskArray.length; index++){
    htmlElement.innerHTML += createToDoHTML(taskArray[index]);
  }
}

function returnCategoryArray(){
  for(let index = 0; index < tasks.length; index++){
    let category = tasks[index]["category"];
    if(!categories.includes(category)){
      categories.push(category);
    }
  }
  return categories;
}

function updateHTML() {
  for (let i = 0; i < categories.length; i++) {
    let element = document.getElementById(categories[i]);
    let filteredTasks = tasks.filter(task => task.category == categories[i]);
    element.innerHTML = '';
    iterateThroughSubArray(filteredTasks, element);
  }
}

function createToDoHTML(element){
  let variableClass;
  if(element['story-category'] == 'User Story'){
    variableClass = 'task-category';
  } else if(element['story-category'] == 'Technical Task'){
    variableClass = 'technical-task-category';
  }
  return `<div class="task" draggable="true" ondragstart="startDragging(${element['id']})">
            <button class=${variableClass}>${element['story-category']}</button>
            <h3>${element['title']}</h2>
            <p>${element['task']}</p>
          </div>`;
}

function startDragging(element){
  elementDraggedOver = element;
}

function moveTo(category){
  tasks[elementDraggedOver]["category"] = category;
  updateHTML();
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
