let userName = "Marcel Zalec";

function init() {
    greet();
}

function greet() {
    cont =document.getElementById('greetingCont');
    cont.innerHTML = /*html*/`
        <p>Good morning,</p><h3>${userName}</h3>
    `
}