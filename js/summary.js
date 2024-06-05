let userName = "Test";

function init() {
    greet();
}

function greet() {
    cont =document.getElementById('greetingCont');
    cont.innerHTML = /*html*/`
        <p>Good morning,</p><h3>${userName}</h3>
    `
}

function goToSummary() {
    window.location.href= 'summary.html';
}

function goToAddTask() {
    window.location.href= '';
}

function goToBoard() {
    window.location.href= 'board.html';
}

function goToContacts() {
    window.location.href= 'contacts.html';
}

function taskMarker() {
    document.getElementById('summary').classList.add('currentSection');
}