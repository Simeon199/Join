// Optional kann man das auch alles in board.js zurückbringen

import * as feedback from './feedbackTemplates.js';
import * as data from '../../core/downloadData.js';
export * from './shared_board.js';

export let searchedTasks = [];
export let standardContainer = 'to-do-container';
export let categories = [];

// export let elementDraggedOver;
// export let priorityValue = "";
// export let searchedInput = document.getElementById("search-input");
// export let assignedToContactsBigContainer = [];
// export let isSaveIconClicked = false;
// export let subtaskArray = [];
// export let checkBoxCheckedJson = {};
// export let emptyList = [];
// export let renderCurrentTaskId;
// export let touchTime;
// export let currentOpenDropdown = null;

export let boardTemplatePrefix = '../../board/templates';
export let tasks = [];
export let allCategories = [
  "to-do-container", 
  "await-feedback-container", 
  "done-container", 
  "in-progress-container"
];

export function checkCategoryColor(category) {
  if (category === "User Story") {
    return "#0038FF";
  } else if (category === "Technical Task") {
    return "#1FD7C1";
  } else {
    return "#42526e";
  }
}

export async function insertCorrectUrgencyIcon(element) {
  let svgElement;
  if (element["priority"] === "urgent") {
    svgElement = await feedback.generateHTMLUrgencyUrgent();
  } else if (element["priority"] === "low") {
    svgElement = await feedback.generateHTMLUrgencyLow();
  } else if (element["priority"] === "medium") {
    svgElement = await feedback.generateHTMLUrgencyMedium();
  }
  return svgElement;
}

export async function getTasksData(){
  data.allTask.onChange((taskObject) => {
    tasks = Object.values(taskObject || {});
    console.log('Tasks reaktiv geladen: ', tasks);
  });
}

export function updateCategories() {
  categories = [...new Set(tasks.map((task) => task.container))];
}