import {ref, get, push, remove } from "../../config/database.js";
import db from "../../config/database.js";

const database = db.database;


/**
 * check if the folder exists if not it would be added
 */

async function ensureAllTasksExists() {
    let response = await loadRelevantData();
    if (!response || !response.hasOwnProperty("testRealTasks")) {
      await upload("testRealTasks", []);
    }
}

/**
 * save Task to Database and Localstorage
 */
async function saveTask() {
    let newTask = createNewTask();
    tasksId++;
    tasks.push(newTask);
    await saveTaskIdToFirebase(tasksId);
    await uploadToAllTasks(newTask);
    updateCategories();
}

/**
 * fetch all data from firebase
 * 
 * @param {string} path 
 * @returns 
 */

async function loadRelevantData(path=""){
  let databaseRef = ref(database, `kanban/sharedBoard/${path}`);
  let snapshot = await get(databaseRef);
  return snapshot.exists() ? snapshot.val() : null;
}

/**
 * delete task from firebase
 * 
 * @param {number} taskId 
 */

async function deleteTaskById(taskFirebaseKey){
  let taskRef = ref(database, `kanban/sharedBoard/tasks/${taskFirebaseKey}`);
  await remove(taskRef);
}

/**
 * initializes functions to create and save Task
 * 
 * @param {string} side is used to initializes some funktion for special sides
 */

async function createTask(side) {
    await ensureAllTasksExists();
    await saveTask();
    if (side == "addTask") {
      startAnimation();
    }
    if (side != "addTask") {
      hideAddTaskPopUp();
      updateHTML();
    }
    clearTask();
}

/**
 * Load the Task id from firebase 
 * 
 * @returns 
 */

async function loadTaskIdFromFirebase(){
  const idRef = ref(database, 'kanban/sharedBoard/taskId');
  const snapshot = await get(idRef);
  return snapshot.exists() ? snapshot.val() : 0;
}
  
/**
 * Upload TasksID to Database
 * 
 * @param {number} taskId 
 */

async function saveTaskIdToFirebase(taskId){
  const idRef = ref(database, 'kanban/sharedBoard/taskId');
  await set(idRef, taskId);
}