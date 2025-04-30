<template>
    <div onclick='checkBigEditTaskContact(${i}, ${contactObject},${taskIndex})' class='big-edit-task-assigned-to-pop-up-contact-container'>
        <div class='big-edit-task-assigned-to-pop-up-contact' >
            <div class='big-edit-task-assigned-to-pop-up-contact-badge' style='background-color: ${contact.color}'>
              ${firstLetterFirstTwoWords(contact.name)}
            </div>
            <p class='big-edit-task-assigned-to-pop-up-contact-name'>${contact.name}</p>
        </div>
        <div class='big-edit-task-assigned-to-pop-up-contact-checkbox-icon-container'>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
            </svg>
        </div>
    </div>
</template>