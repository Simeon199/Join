<template>
<input id="subtaskEditedPopUp" type="text" value="${subtaskArray[i]['task-description']}">
<div class="inputButtons">
    <img onclick="deleteSubtaskPopUp(i), stopEvent(event)" src="../../assets/img/deletetrash.svg" alt="">
<div class="subtaskBorder"></div>
    <img onclick="saveEditedSubtaskPopUp(i), stopEvent(event)" src="../../assets/img/checksubmit.svg" alt="">
</div>
</template>