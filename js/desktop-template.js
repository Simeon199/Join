function initSidebar() {
    sidebarHTML();
    headerHTML();
}

function sidebarHTML() {
    document.getElementById("sidebar").innerHTML += /*html*/`
        <link rel="stylesheet" href="css/desktop_template.css">

    <section class="sidebar" onload="">
        <img src="Assets/img/Capa 1.svg" alt="">
        <div class="menuBarDesktop">
            <a href="summary.html" class="linkTo" id="summary">
                <img src="Assets/img/Vector1.svg" alt=""><p>Summary</p>
            </a>
            <a href="add_task.html" class="linkTo" id="addTask">
                <img src="Assets/img/edit_square.svg" alt=""><p>Add Task</p>
            </a>
            <a href="board.html" class="linkTo" id="board">
                <img src="Assets/img/board.svg" alt=""><p>Board</p>
            </a>
            <a href="contacts.html" class="linkTo" id="contacts">
                <img src="Assets/img/perm_contact_calendar.svg" alt=""><p>Contacts</p>
            </a>
        </div>
        <footer>
            <div>
                <a href="privacy_policy.html" id="privatePolicy">Privacy Policy</a>
                <a href="legal_notice.html" id = "legalNotice">Legal notice</a>
            </div>
        </footer>
    </section>
    `;
    taskMarker();
}

function headerHTML() {
    document.getElementById("headerForm").innerHTML += /*html*/`
        <h1>Kanban Project Managemant Tool</h1>
        <img onclick="help()" src="Assets/img/help.svg" alt="Help">
    `;
}