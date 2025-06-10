// This file displays all Eventlistener functions with all methods related to them

export * from './eventlistener.js';
import * as calledFunctions from './eventList_called_functions.js'; 

export function handleEventListenersAfterDOMLoaded(){ // EventListeners in mehrere separate Funktionen aufteilen!
  document.getElementById('add-task-button-mobile').addEventListener('click', () => {
    calledFunctions.showAddTaskPopUp('to-do-container');
  });
  document.getElementById('add-task-button').addEventListener('click', () => {
    calledFunctions.showAddTaskPopUp('to-do-container');
  })
  document.getElementById('search-input').addEventListener('input', () => {
    calledFunctions.searchForTasks();
  });
  document.querySelectorAll('.plus-icon-container')[0].addEventListener('click', () => {
    calledFunctions.showAddTaskPopUp('to-do-container');
  });
  document.querySelectorAll('.plus-icon-container')[1].addEventListener('click', () => {
    calledFunctions.showAddTaskPopUp('in-progress-container');  
  });
  document.querySelectorAll('.plus-icon-container')[2].addEventListener('click', () => {
    calledFunctions.showAddTaskPopUp('await-feedback-container');
  });
  document.getElementById('to-do-container').addEventListener('dragover', (event) => {
    calledFunctions.allowDrop(event);
  });
  document.getElementById('to-do-container').addEventListener('drop', (event) => {
    calledFunctions.allowDrop(event);
  });
  document.getElementById('in-progress-container').addEventListener('drop', () => {
    calledFunctions.moveTo('in-progress-container');
  });
  document.getElementById('in-progress-container').addEventListener('dragover', (event) => {
    calledFunctions.allowDrop(event);
  });
  document.getElementById('await-feedback-container').addEventListener('dragover', (event) => {
    calledFunctions.allowDrop(event);
  });
  document.getElementById('await-feedback-container').addEventListener('drop', () => {
    calledFunctions.moveTo('await-feedback-container');
  });
  document.getElementById('done-container').addEventListener('dragover', (event) => {
    calledFunctions.allowDrop(event);
  });
  document.getElementById('done-container').addEventListener('drop', () => {
    calledFunctions.moveTo('done-container');
  });
  document.getElementById('close-add-task-pop-up').addEventListener('click', () => {
    calledFunctions.hideAddTaskPopUp();
  });
  document.getElementById('section99').addEventListener('submit', () => {
    calledFunctions.checkRequiredFields('board');
    return false;
  });
  document.getElementById('changeTo').addEventListener('click', () => {
    calledFunctions.changeToInputfield();
  });
  document.getElementById('searchField').addEventListener('input', () => {
    calledFunctions.searchContacts();
  });
  document.getElementById('urgent').addEventListener('click', () => {
    calledFunctions.changePriority(urgent);
  });
  document.getElementById('medium').addEventListener('click', () => {
    calledFunctions.changePriority(medium);
  });
  document.getElementById('low').addEventListener('click', () => {
    calledFunctions.changePriority(low);
  });
  document.getElementById('clear-subtask-svg').addEventListener('click', () => {
    calledFunctions.clearSubtaskInput();
  });
  document.getElementById('add-subtask-svg').addEventListener('click', () => {
    calledFunctions.addSubtask();
  });
  document.getElementById('cleartask-div').addEventListener('click', () => {
    calledFunctions.clearTask();
  });
}

export function handleTaskWithoutSubtaskEventlisteners(id, taskElement, oppositeCategory){
  let taskRef = document.getElementById(id);
  taskRef.addEventListener('dragstart', () => {
    calledFunctions.startDragging(taskElement.id);
    calledFunctions.rotateFunction(taskElement.id);
  });
  taskRef.addEventListener('dragend', () => {
    calledFunctions.checkIfEmpty(taskElement.container, oppositeCategory);
  });
  taskRef.addEventListener('dragover', (event) => {
    event.preventDefault();
    calledFunctions.allowDrop(event);
  });
  taskRef.addEventListener('drop', () => {
    calledFunctions.moveTo(taskElement.container);
  });
  taskRef.addEventListener('click', () => {
    calledFunctions.showBigTaskPopUp(taskElement);
  });
  taskRef.querySelector('.dropdownSVG').addEventListener('click', (event) => {
    calledFunctions.openMobileDropdown(taskElement.id);
    shared.stopEvent(event);
  });
}

export function manageEventListenersOnTaskDiv(taskObject, taskIndex){
  handleMoveTasksEvents(taskIndex);
  handleDropEventsForMobileVersion(taskObject, taskIndex);
}

export function handleDropEventsForMobileVersion(taskObject, taskIndex){
  let task = document.getElementById(`task${taskIndex}`);
  task.querySelector('.dropdownSVG').addEventListener('click', (event) => {
    shared.stopEvent(event);
    calledFunctions.openMobileDropdown(taskIndex);
  });
  task.addEventListener('click', () => {
    calledFunctions.showBigTaskPopUp(taskObject.taskElement);
  });
  task.addEventListener('dragstart', () => {
    calledFunctions.startDragging(taskIndex);
    calledFunctions.rotateFunction(taskIndex);
  });
  task.addEventListener('dragend', () => {
    calledFunctions.checkIfEmpty(taskObject.taskElement.container, taskObject.oppositeCategory);
  });
  task.addEventListener('dragover', (event) => {
    event.preventDefault();
    calledFunctions.allowDrop(event);
  });
  task.addEventListener('drop', () => {
    calledFunctions.moveTo(taskObject.taskElement.container);
  });
}

export function assignEventListenersToBigTask(taskElement){
  document.getElementById('big-task-pop-up-delete-button').addEventListener('click', () => {
    calledFunctions.hideBigTaskPopUp();
    calledFunctions.deleteTask('big-task-pop-up');
  });
  document.getElementById('big-task-pop-up-edit-button').addEventListener('click', () => {
    calledFunctions.renderEditTask(taskElement); // id
  });  
  // document.getElementById('big-task-pop-up-bg').addEventListener('mousedown', () => {
  //   hideBigTaskPopUp();
  // });
  // document.getElementById('big-task-pop-up').addEventListener('mousedown', (event) => {
  //   shared.stopEvent(event);
  // });
  // document.getElementById('big-task-pop-up').addEventListener('click', () => {
  //   closeAllSmallPopUpPopUps();
  // });
  // document.getElementById('big-task-pop-up-close-icon').addEventListener('click', () => {
  //   hideBigTaskPopUp();
  // });
}

export function handleMoveTasksEvents(taskIndex){
  let rightMobileDrowdown = document.getElementById(`dropdown${taskIndex}`); 
  rightMobileDrowdown.addEventListener('click', (event) => {
    if(event.target.tagName === 'To Do'){
      shared.stopEvent(event);
      calledFunctions.moveTasksToCategory(taskIndex, 'to-do-container');
    } else if(event.target.tagName === 'In Progress'){
      shared.stopEvent(event);
      calledFunctions.moveTasksToCategory(taskIndex, 'in-progress-container');
    } else if(event.target.tagName === 'Await Feedback'){
      shared.stopEvent(event);
      calledFunctions.moveTasksToCategory(taskIndex, 'await-feedback-container');
    } else if(event.target.tagName === 'Done'){
      shared.stopEvent(event);
      calledFunctions.moveTasksToCategory(taskIndex, 'done-container');
    }
  });
}