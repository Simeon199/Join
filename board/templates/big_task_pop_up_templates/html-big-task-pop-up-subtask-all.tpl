<template>
<h2 class="big-task-pop-up-label-text">Subtasks</h2>
<div id="big-task-pop-up-subtasks-container">
    <div class="big-task-pop-up-subtasks" id="bigSubtaskNo${i}">
        <svg id="checkBoxIconUnchecked${i}" onclick="addCheckedStatus(i, correctTaskId)" class="big-task-pop-up-subtask-checkbox-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">   
            <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2" />
        </svg>
        <svg id="checkBoxIconChecked${i}" onclick="addCheckedStatus(i, correctTaskId)" class="big-task-pop-up-subtask-checkbox-icon d-none" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8.96582V14.9658C17 16.6227 15.6569 17.9658 14 17.9658H4C2.34315 17.9658 1 16.6227 1 14.9658V4.96582C1 3.30897 2.34315 1.96582 4 1.96582H12" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
            <path d="M5 9.96582L9 13.9658L17 2.46582" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>${subtask["task-description"]}</p>
    </div>
</div>
</template>