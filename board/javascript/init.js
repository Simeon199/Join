export * from './init.js';

export let searchedTasks = [];
export let isBigTaskPopUpOpen = false;

export let standardContainer = 'to-do-container';
export let elementDraggedOver;
export let priorityValue = "";
export let searchedInput = document.getElementById("search-input");
export let assignedToContactsBigContainer = [];
export let isSaveIconClicked = false;
export let subtaskArray = [];
export let checkBoxCheckedJson = {};
export let emptyList = [];
export let renderCurrentTaskId;
export let touchTime;
export let currentOpenDropdown = null;

export let boardTemplatePrefix = '../../board/templates';
export let categories = [];

export let allCategories = [
  "to-do-container", 
  "await-feedback-container", 
  "done-container", 
  "in-progress-container"
];