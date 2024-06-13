let username = "marcel zalec"

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
        <div class="headerIcons">
            <img onclick="help()" src="Assets/img/help.svg" alt="Help">
            <div onclick="openDropDownMenu()" class="circle"><span onload="firstLetterFirstTwoWords(username)"></span></div>
            <div id="dropDown-bg" class="dropDown-bg d-none" onclick="closeDropDownMenu()">
                <div id="dropDown"></div>
            </div>
        </div>
    `;
}

function openDropDownMenu() {
    document.getElementById('dropDown-bg').classList.remove('d-none');
    dt = document.getElementById("dropDown");
    dt.innerHTML = /*html*/`
      <div onclick="goToLN()">Legal Notice</div>
      <div onclick="goToPP()">Privacy Policy</div>
      <div onclick="logout()">Log out</div>  
    `;
}

function closeDropDownMenu() {
    document.getElementById('dropDown-bg').classList.add('d-none');
}

function logout() {
    window.location.href="login.html"
}

function goToPP() {
    window.location.href="privacy_policy.html"
}

function goToLN() {
    window.location.href="legal_notice.html"
}

function firstLetterFirstTwoWords(text) {
    // Split the string into words
    const words = text.split(" ");
  
    // Extract the first letter of each word
    const firstLetters = words.map((word) => word.charAt(0));
  
    // Concatenate the first two letters into a string
    const result = firstLetters.slice(0, 2).join("");
  
    return result.toUpperCase();
  }