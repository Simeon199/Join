function taskMarker() {
  document.getElementById("contacts").classList.add("currentSection");
}

function toggleBigContact(i) {
  // Big Contact render

  document.querySelectorAll(".contact")[i].classList.toggle("contact-aktiv");
  document.getElementById("big-contact").classList.toggle("hide-big-contact");
}
