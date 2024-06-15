// taskMarker
function taskMarker() {}

function headerHTML() {
  document.getElementById("headerForm").innerHTML += /*html*/ `
          <h1>Kanban Project Management Tool</h1>
          <div class="headerIcons">

              <div onclick="openDropDownMenu()" class="circle"><span onload="firstLetterFirstTwoWords(username)"></span></div>
              <div id="dropDown-bg" class="dropDown-bg d-none" onclick="closeDropDownMenu()">
                  <div id="dropDown"></div>
              </div>
          </div>
      `;
}

function previousPage() {
  window.history.back();
}
