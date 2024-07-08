
// zum Testen

function toggleFocusAssignedToInputAddTask() {
    if (document.getElementById("standartValue").classList.contains("height-0")) {
      document.getElementById("standartValue").blur();
    } else {
      document.getElementById("standartValue").focus();
    }
}

function changeToInputfieldOnBoard() {
    changecont = document.getElementById("changeTo");
    search = document.getElementById("searchArea").classList;
    input = document.getElementById("searchField");
    stV = document.getElementById("standartValue").classList;
  
    if (search.contains("d-none")) {
      search.remove("d-none");
      input.classList.remove("d-none");
      stV.add("d-none");
      input.focus();
      showDropDownAssignedTo();
    } else {
      search.add("d-none");
      input.classList.add("d-none");
      stV.remove("d-none");
      input.value = "";
    }
}