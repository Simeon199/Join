<template>
    <div id="user${i}" class=assignedDropDownField>
      <div class="circle" id="assignetToLetters${i}"></div>
      <div class="DropDownUser"><span>${user.name}</span>
        <div class="checkboxesSVG">
          <img id="none_checked${i}" src="../../assets/img/Checkbox_black.svg" alt="">
          <img id="checked${i}" class="checked d-none" src="../../assets/img/Checkbox_checked.svg" alt="">
        </div>
      </div>
    </div>
</template>