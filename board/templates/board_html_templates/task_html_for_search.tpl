<template>
<div class="task" 
          id="task${index}"
          draggable="true" 
          ondragstart="startDragging(${id}); rotateFunction(${taskIndex})" 
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
</template>