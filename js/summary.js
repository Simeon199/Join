let userName = getUserNickname();

function init() {
    greet();
}

function greet() {
    cont =document.getElementById('greetingCont');
    if (userName = "Guest") {
        cont.innerHTML = /*html*/`
        <p>Good morning</p>
    `;
    } else {
        cont.innerHTML = /*html*/`
        <p>Good morning,</p><h3>${userName}</h3>
    `;
    }
}

function goToBoard() {
    window.location.href= 'board.html';
}

function taskMarker() {
    document.getElementById('summary').classList.add('currentSection');
}

function hover(element) {
    todo = document.getElementById("todo");
    if (element == todo) {
        element.setAttribute('src', 'Assets/img/edit_white.svg');
    } else {
        element.setAttribute('src', 'Assets/img/Done_white.svg');
    }
}

function unhover(element) {
    todo = document.getElementById("todo");
    if (element == todo) {
        element.setAttribute('src', 'Assets/img/edit.svg');
    } else {
        element.setAttribute('src', 'Assets/img/Done.svg');
    }
}