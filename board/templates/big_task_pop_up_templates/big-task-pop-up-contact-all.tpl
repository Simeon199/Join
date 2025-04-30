<template>
    <div id='big-edit-task-assigned-to-top-container'>
        <p class='big-edit-task-section-headline'>Assigned to</p>
        <div onclick='stopEvent(event);' id='big-edit-task-assigned-to-input-container'>
            <input  onclick=' toggleEditTaskAssignedToPopUp()' type='text' id='big-edit-task-assigned-to-input' onkeyup='editPopUpSearchContacts("${id}")' placeholder='Select contacts to assign'>
              <svg onclick=' toggleEditTaskAssignedToPopUp()' id='big-edit-task-assigned-to-input-arrow' class='big-edit-task-assigned-to-input-arrow' width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.44451 4.3L0.844506 1.7C0.52784 1.38333 0.457006 1.02083 0.632006 0.6125C0.807006 0.204167 1.11951 0 1.56951 0H6.71951C7.16951 0 7.48201 0.204167 7.65701 0.6125C7.83201 1.02083 7.76117 1.38333 7.44451 1.7L4.84451 4.3C4.74451 4.4 4.63617 4.475 4.51951 4.525C4.40284 4.575 4.27784 4.6 4.14451 4.6C4.01117 4.6 3.88617 4.575 3.76951 4.525C3.65284 4.475 3.54451 4.4 3.44451 4.3Z" fill="#2A3647"/>
              </svg>
          </div>
        </div>
        <div id='big-edit-task-assigned-to-contact-container'></div>
        <div id='big-edit-task-assigned-to-pop-up-container' class='big-edit-task-assigned-to-pop-up-container height-0'>
          <div id='big-edit-task-assigned-to-pop-up' onclick='stopEvent(event);' class='big-edit-task-assigned-to-pop-up box-shadow-none'>
        </div>
    </div>
</template>