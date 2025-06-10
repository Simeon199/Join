import * as shared from '../../shared/javascript/shared.js';
import * as sharedBoard from './shared_board.js';
import * as feedback from './feedbackTemplates.js';
import * as eventlistener from './eventlistener.js';

let boardTemplatePrefix = '../../board/templates';
let allCategories = [
  "to-do-container", 
  "await-feedback-container", 
  "done-container", 
  "in-progress-container"
];

document.addEventListener('DOMContentLoaded', async () => {
  if(window.location.pathname.endsWith('/board/board.html')){
    await shared.bundleLoadingHTMLTemplates();
    await sharedBoard.getTasksData();
    sharedBoard.updateCategories();
    await updateHTML();
    eventlistener.handleEventListenersAfterDOMLoaded();
  }
});

// export async function updateHTML() { 
//   for (const container of allCategories) {
//     let element = document.getElementById(container);
//     if (element) { 
//       let filteredTasks = sharedBoard.tasks.filter((task) => task.container === container);
//       let remainingTasks = sharedBoard.tasks.filter((task) => task.container !== container);
//       element.innerHTML = "";
//       if (filteredTasks.length > 0) {
//         await iterateThroughSubArray(filteredTasks, container);
//       } else if(remainingTasks.length > 0){
//         let oppositeElementName = `no-${container}`;
//         element.appendChild(await feedback.getRightOppositeElement(oppositeElementName));
//       }
//     }
//   }
// }

export async function updateHTML() { // updateHTML wird innerhalb verschiedener Dateien aufgerufen! 
  for (const container of allCategories) {
    console.log('value of tasks: ', sharedBoard.tasks);
    let element = document.getElementById(container);
    if (element) { 
      let filteredTasks = sharedBoard.tasks.filter((task) => task.container === container);
      let remainingTasks = sharedBoard.tasks.filter((task) => task.container !== container);
      await testFunction(filteredTasks, remainingTasks, container);
    }
  }
}

async function testFunction(filteredTasks, remainingTasks, container){ // Hier Funktionenkette entkoppeln !
  let element = document.getElementById(container);
  element.innerHTML = "";
  if (filteredTasks.length > 0) {
    await iterateThroughSubArray(filteredTasks, container);
  } else if(remainingTasks.length > 0){
    let oppositeElementName = `no-${container}`;
    element.appendChild(await feedback.getRightOppositeElement(oppositeElementName));
  }
}

async function iterateThroughSubArray(taskArray, containerName) {
  let htmlElement = document.getElementById(containerName);
  if(taskArray){
    for (let i = 0; i < taskArray.length; i++) {
      let task = taskArray[i];
      let result = await createToDoHTML(task);
      htmlElement.appendChild(result);
    }
  }
  return null;
}

async function createToDoHTML(taskElement) {
  let oppositeCategory = `no-${taskElement.container}`;
  return await generateTaskHTML(taskElement, oppositeCategory); 
}

async function generateTaskHTML(taskElement, oppositeCategory) {
  if (doesSubtaskObjectExistWithPositiveLength(taskElement)) {
    return await prepareTaskWithSubtaskAndCreateIt(taskElement, oppositeCategory);
  } else if (doesSubtaskObjectExistWithLengthEqualsNull(taskElement)) {
    return await returnTaskHtmlWithoutSubtask(taskElement, oppositeCategory); 
  } else {
    return await returnTaskHtmlWithoutSubtask(taskElement, oppositeCategory); 
  }
}

function doesSubtaskObjectExistWithPositiveLength(taskElement){
  return taskElement["subtask"] && taskElement["subtask"].length > 0
}

async function prepareTaskWithSubtaskAndCreateIt(taskElement, oppositeCategory){
  let numberOfTasksChecked = 0;
  let taskObject = calculateNumberOfCheckedSubtasksAndCreateTaskObject(taskElement, oppositeCategory, numberOfTasksChecked); 
  return await returnTaskHtmlWithSubtask(taskObject);
}

function calculateNumberOfCheckedSubtasksAndCreateTaskObject(taskElement, oppositeCategory, numberOfTasksChecked){
  computeNumberOfSubtasksChecked(numberOfTasksChecked, taskElement);
  let taskbarWidth = Math.round((numberOfTasksChecked / taskElement["subtask"].length) * 100);
  let taskObject = {
    'taskElement': taskElement,
    'oppositeCategory': oppositeCategory,
    'taskbarWidth': taskbarWidth,
    'numberOfTasksChecked': numberOfTasksChecked
  };
  return taskObject;
}

function computeNumberOfSubtasksChecked(numberOfTasksChecked, taskElement){
  for (let index = 0; index < taskElement["subtask"].length; index++) {
    if (isSubtaskChecked(taskElement, index)) {
      numberOfTasksChecked += 1;
    }
  }
}

function isSubtaskChecked(taskElement, index){
  return taskElement["subtask"][index]["is-tasked-checked"] === true
}

async function returnTaskHtmlWithSubtask(taskObject){
  let taskIndex = taskObject.taskElement.id;
  let taskDescription = taskObject.taskElement.description;
  if (taskDescription.length > 40) {
    taskDescription = taskDescription.substring(0, 40) + "...";
  }
  let template = await loadTemplateForTaskOnBoardAndAssignIds(taskObject, taskIndex);
  return template;
}

async function loadTemplateForTaskOnBoardAndAssignIds(taskObject, taskIndex){
  let templateObject = await shared.initHTMLContent(`${boardTemplatePrefix}/board_subtask_templates/taskHtmlWithSubtask.tpl`, taskObject.taskElement.container);
  let templateIdentity = `task${taskIndex}`;
  templateObject.id = templateIdentity;
  let template = await assignIdsToTemplate(templateIdentity, taskObject, taskIndex);  
  eventlistener.manageEventListenersOnTaskDiv(taskObject, taskIndex);
  return template;
}

async function assignIdsToTemplate(templateIdentity, taskObject, taskIndex){ // Diese Funktion eventuell in zwei separate Funktionen aufteilen
  let template = document.getElementById(templateIdentity);
  template.setAttribute('draggable', 'true');
  template.querySelector('.task-category').style.backgroundColor = sharedBoard.checkCategoryColor(taskObject.taskElement.category);
  template.querySelector('.task-category').innerHTML =  taskObject.taskElement.category;
  template.querySelector('.dropdownSVG').id = `dropdown${taskIndex}`;
  template.querySelector('.mobileDropdown').id = `mobileDropdown${taskIndex}`;
  template.querySelector('.task-title').innerHTML = taskObject.taskElement.title;
  template.querySelector('.task-description').innerHTML = taskObject.taskElement.description;
  template.querySelector('.task-bar-content').style.width = `${taskObject.taskbarWidth}%`;
  template.querySelector('.task-bar-text').innerHTML = `${taskObject.numberOfTasksChecked}/${taskObject.taskElement.subtask.length} Subtasks`;
  template.querySelector('.task-contacts').innerHTML = generateContactsHTML(taskObject.taskElement);
  template.querySelector('.priority-icon').appendChild(await sharedBoard.insertCorrectUrgencyIcon(taskObject.taskElement));
  return template;
}

function generateContactsHTML(taskElement) {
  let contactsHTML = "";
  if (taskElement.assigned) {
    let lengthOfAssignedTo = taskElement.assigned.length;
    taskElement.assigned.forEach((assignee, index) => {
      if (index < 3) {
        let initials = getInitials(assignee.name);
        contactsHTML += `<div class="task-contact" style='background-color: ${assignee.color}'>${initials}</div>`;
      } else if (index === 3) {
        contactsHTML += `<div class='taskAssignedToNumberContainer'><span>+ ${lengthOfAssignedTo - 3}</span></div>`;
      }
    });
  }
  return contactsHTML;
}

function doesSubtaskObjectExistWithLengthEqualsNull(taskElement){
  return taskElement["subtask"] && taskElement["subtask"].length === 0;
}

async function returnTaskHtmlWithoutSubtask(taskElement, oppositeCategory){
  let id = `task${taskElement['id']}`;
  let templateObject = await shared.initHTMLContent(`${boardTemplatePrefix}/board_subtask_templates/taskHtmlWithoutSubtask.tpl`, taskElement['container']);
  templateObject.id = id;
  let template = await assignIdsAndContentToTaskWithoutSubtask(id, taskElement);
  eventlistener.handleTaskWithoutSubtaskEventlisteners(id, taskElement, oppositeCategory);
  eventlistener.handleMoveTasksEvents(taskElement.id);
  return template;
}

async function assignIdsAndContentToTaskWithoutSubtask(id, taskElement){ // Diese Funktion eventuell noch verkleinern!
  let taskRef = document.getElementById(id);
  taskRef.querySelector('.task-category').style = `background: ${sharedBoard.checkCategoryColor(taskElement.category)}`;
  taskRef.querySelector('.task-category').innerHTML = taskElement.category;
  taskRef.setAttribute('draggable', 'true');
  taskRef.querySelector('.mobileDropdown').id = `dropdown${taskElement.id}`;
  taskRef.querySelector('.task-title').innerHTML = `${taskElement.title}`;
  taskRef.querySelector('.task-description').innerHTML = `${taskElement.description}`;
  taskRef.querySelector('.task-contacts').innerHTML = generateContactsHTML(taskElement);
  taskRef.querySelector('.priority-icon').appendChild(await sharedBoard.insertCorrectUrgencyIcon(taskElement));
  return taskRef;
}

function getInitials(name) {
  let nameArray = name.trim().split(" ");
  let initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
  return initials;
}