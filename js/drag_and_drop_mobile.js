function openMobileDropdown(taskIndex) {
  //   let mobileDropdown = document.getElementById("mobileDropdown");
  // if (mobileDropdown.classList.contains("d-none")) {
  //     mobileDropdown.classList.remove("d-none");
  // } else {
  //     mobileDropdown.classList.add("d-none");
  // }

  document.getElementById(`mobileDropdown${taskIndex}`).classList.toggle("mobileDropdown-translate-100");
}
