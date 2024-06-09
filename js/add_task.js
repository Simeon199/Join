let inputTitle = document.getElementById("inputTitle");
let inputDescription = document.getElementById("inputDescription");
let assignetTo = document.getElementById("assignetTo");
let date = document.getElementById("date");
let category = document.getElementById("category");
let subtask = document.getElementById("subtask");
 
function init() {
    changePriority(medium)
}

function taskMarker() {
    document.getElementById('addTask').classList.add('currentSection');
}

function changePriority(id) {
    removeBackground(id)
    if (id == urgent) {
        urgent.classList.add("backgroundUrgent")
    } if (id == medium) {
        medium.classList.add("backgroundMedium")
    } if (id == low) {
        low.classList.add("backgroundLow")
    }
    changeImg(id)
}

function removeBackground(id) {
    if (id == urgent) {
        medium.classList.remove("backgroundMedium")
        low.classList.remove("backgroundLow")
    } if (id == medium) {
        urgent.classList.remove("backgroundUrgent")
        low.classList.remove("backgroundLow")
    } if (id == low) {
        urgent.classList.remove("backgroundUrgent")
        medium.classList.remove("backgroundMedium")
    }
}

function changeImg(condition) {
    let urgentImg = document.getElementById('imgUrgent');
    let mediumImg = document.getElementById('imgMedium');
    let lowImg = document.getElementById('imgLow');
    if (condition == urgent) {
        urgentImg.setAttribute('src', 'Assets/img/Prio altaurgent_white.svg')
    } else {
        urgentImg.setAttribute('src', 'Assets/img/Prio altaUrgent_symbole.svg')
    } if (condition == medium) {
        mediumImg.setAttribute('src', 'Assets/img/Prio mediameduim_white.svg')
    } else {
        mediumImg.setAttribute('src', 'Assets/img/Capa 1medium_color.svg')
    } if (condition == low) {
        lowImg.setAttribute('src', 'Assets/img/Prio bajalow_white.svg')
    } else {
        lowImg.setAttribute('src', 'Assets/img/Prio bajaLow_symbole.svg')
    }
}

function createTask() {
    
}

function clearTask() {
    inputTitle.value= '';
    inputDescription.value='';
    assignetTo.value='';
    date.value = '';
    category.value = '';
    subtask.value='';
}