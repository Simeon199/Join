<template>
<div class="task" id=task${taskIndex}
            draggable="true" 
            ondragstart="startDragging(${element["tasksIdentity"]}); rotateFunction(${taskIndex})" 
            ondragend="checkIfEmpty('${element["container"]}', '${oppositeCategory}')" 
            ondragover="allowDrop(event)"
            ondrop="moveTo('${element["container"]}')"
            onclick="showBigTaskPopUp('${jsonTextElement}')"
        > 
    <div class="task-category-and-dropdown">
        <div class='task-category' style='background-color: ${checkCategoryColor(element["category"])}'>
            ${element["category"]}
        </div>
        <div class="dropdownSVG" onclick="stopEvent(event); openMobileDropdown(${taskIndex})">
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.29998 4.3L0.699975 1.7C0.383309 1.38333 0.312475 1.02083 0.487475 0.6125C0.662475 0.204167 0.974975 0 1.42498 0H6.57498C7.02498 0 7.33747 0.204167 7.51248 0.6125C7.68748 1.02083 7.61664 1.38333 7.29997 1.7L4.69998 4.3C4.59998 4.4 4.49164 4.475 4.37498 4.525C4.25831 4.575 4.13331 4.6 3.99998 4.6C3.86664 4.6 3.74164 4.575 3.62498 4.525C3.50831 4.475 3.39998 4.4 3.29998 4.3Z" fill="#2A3647"/>
            </svg>
        </div>
    </div>
    <div id="mobileDropdown${taskIndex}" class="mobileDropdown mobileDropdown-translate-100">
        <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'to-do-container')">To Do</a>
        <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'in-progress-container')">In Progress</a>
        <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'await-feedback-container')">Await Feedback</a>
        <a onclick="stopEvent(event); moveTasksToCategory(${taskIndex},'done-container')">Done</a>
    </div>
    <h3 class="task-title">${element["title"]}</h3>
    <p class="task-description">${taskDescription}</p>
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
</div>
</template>