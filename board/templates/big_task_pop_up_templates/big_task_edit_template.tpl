<template>
<p class='big-edit-task-section-headline'>Title</p>
<input type="text" id='big-edit-task-title-input' value='${oldTitle}' placeholder='Enter a title'>


<div onclick='checkBigEditTaskContact(i, contactObject, taskIndex)' class='big-edit-task-assigned-to-pop-up-contact-container big-edit-task-assigned-to-pop-up-active-contact'>
    <div class='big-edit-task-assigned-to-pop-up-contact' >
        <div class='big-edit-task-assigned-to-pop-up-contact-badge' style='background-color: blue'>
            ${firstLetterFirstTwoWords(contact.name)}
        </div>
        <p class='big-edit-task-assigned-to-pop-up-contact-name'>${contact.name}</p>
    </div> 
    <div class='big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container'>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8V14C17 15.6569 15.6569 17 14 17H4C2.34315 17 1 15.6569 1 14V4C1 2.34315 2.34315 1 4 1H12" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M5 9L9 13L17 1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
</div>

<div onclick='checkBigEditTaskContact(i, contactObject, taskIndex)' class='big-edit-task-assigned-to-pop-up-contact-container'>
    <div class='big-edit-task-assigned-to-pop-up-contact' >
        <div class='big-edit-task-assigned-to-pop-up-contact-badge' style='background-color: blue'>
            ${firstLetterFirstTwoWords(contact.name)}
        </div>
        <div>
            <p class='big-edit-task-assigned-to-pop-up-contact-name'>${contact.name}</p>
        </div>
        <div class='big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container'>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
            </svg>
        </div>
    </div>
</div>

<div>
<p class='big-edit-task-section-headline'>Subtasks</p>  
    <div id='big-edit-task-subtask-input-container' onkeyup='changeSubtaskInputIcons()' onclick='focusSubtaskInput()'>
        <input onkeyup='bigEditTaskSubtaskInputCheckEnter(event)' type="text" id='big-edit-task-subtask-input' placeholder='Add new Subtask'>
        
        <div id='big-edit-task-subtask-input-icon-container'>
            <svg id='big-edit-task-subtask-input-plus-icon' width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.14453 8H1.14453C0.861198 8 0.623698 7.90417 0.432031 7.7125C0.240365 7.52083 0.144531 7.28333 0.144531 7C0.144531 6.71667 0.240365 6.47917 0.432031 6.2875C0.623698 6.09583 0.861198 6 1.14453 6H6.14453V1C6.14453 0.716667 6.24036 0.479167 6.43203 0.2875C6.6237 0.0958333 6.8612 0 7.14453 0C7.42786 0 7.66536 0.0958333 7.85703 0.2875C8.0487 0.479167 8.14453 0.716667 8.14453 1V6H13.1445C13.4279 6 13.6654 6.09583 13.857 6.2875C14.0487 6.47917 14.1445 6.71667 14.1445 7C14.1445 7.28333 14.0487 7.52083 13.857 7.7125C13.6654 7.90417 13.4279 8 13.1445 8H8.14453V13C8.14453 13.2833 8.0487 13.5208 7.85703 13.7125C7.66536 13.9042 7.42786 14 7.14453 14C6.8612 14 6.6237 13.9042 6.43203 13.7125C6.24036 13.5208 6.14453 13.2833 6.14453 13V8Z" fill="#2A3647"/>
            </svg>
        </div>
    </div>
    <ul id='big-edit-task-subtask-container'></ul>
</div>

</template>