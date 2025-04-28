<template>
  <input id="subtaskEdited" type="text" value="${subArray[i]["task-description"]}">
  <div class="inputButtons">
    <img onclick="deleteSubtask(${i}), stopEvent(event)" src="../../assets/img/deletetrash.svg" alt="">
    <div class="subtaskBorder"></div>
    <img onclick="saveEditedSubtask(${i}), stopEvent(event)" src="../../assets/img/checksubmit.svg" alt="">
  </div>
</template>