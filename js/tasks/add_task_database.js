/**
 * Uploading to the Database
 * 
 * @param {string} path 
 * @param {json} data 
 * @returns
 */
async function upload(path = "", data) {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return (responseToJson = await response.json());
}

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
 * retuns the task json
 * 
 * @returns json
 */
function createNewTask() {
    return {
      title: getInputValue("inputTitle"),
      description: getInputValue("inputDescription"),
      assigned: assignedContacts,
      date: getInputValue("date"),
      priority: priority,
      category: document.getElementById("categoryText").textContent,
      subtask: subArray,
      container: standardContainer,
      tasksIdentity: tasksId,
    };
}

/**
 * push task to array all tasks
 * 
 * @param {json} task 
 */
async function uploadToAllTasks(task) {
    try {
      let response = await loadRelevantData();
      let allTasks = response["testRealTasks"];
      if (!Array.isArray(allTasks)) {
        allTasks = [];
      }
      allTasks.push(task);
      await upload("testRealTasks", allTasks);
    } catch (error) {
      console.error("Fehler in uploadToAllTasks:", error);
    }
}

/**
 * fetch all data from firebase
 * 
 * @param {string} path 
 * @returns 
 */
async function loadRelevantData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseAsJson = await response.json();
    return responseAsJson;
}

/**
 * delete task from firebase
 * 
 * @param {number} taskId 
 */
async function deleteTask(taskId) {
    showBoardLoadScreen();
    tasks = tasks.filter((task) => task.tasksIdentity !== taskId);
    for (let i = taskId; i < tasks.length; i++) {
      tasks[i].tasksIdentity = i;
    }
    await upload("testRealTasks", tasks);
    tasksId = tasks.length;
    await saveTaskIdToFirebase(tasksId);
    updateCategories();
    updateHTML();
    hideBoardLoadScreen();
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
async function loadTaskIdFromFirebase() {
    let response = await loadRelevantData("taskId");
    if (response !== null && response !== undefined) {
      return response;
    }
    return 0;
}

/**
 * Initializes add-task variables and functions when the website loads.
 */
async function init() {
    changePriority(medium);
    getAllContacts();
    tasksId = await loadTaskIdFromFirebase();
}
  
  /**
   * Upload TasksID to Database
   * 
   * @param {number} taskId 
   */
  async function saveTaskIdToFirebase(taskId) {
    await upload("taskId", taskId);
}