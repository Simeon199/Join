function openMobileDropdown(taskIndex) {
  //   let mobileDropdown = document.getElementById("mobileDropdown");
  // if (mobileDropdown.classList.contains("d-none")) {
  //     mobileDropdown.classList.remove("d-none");
  // } else {
  //     mobileDropdown.classList.add("d-none");
  // }

  // document.querySelectorAll(".mobileDropdown")[taskIndex].classList.toggle("mobileDropdown-translate-100");
  let dropdown = document.getElementById(`mobileDropdown${taskIndex}`);
  dropdown.classList.toggle('mobileDropdown-translate-100');
  // dropdown.classList.toggle('mobileDropdown-translate-0');
}

async function moveTasksToCategory(taskIndex, newCategory) {
  let task = tasks.find((task) => task.tasksIdentity == taskIndex);
  if (task) {
    task.container = newCategory;
    saveTasksToLocalStorage();
    updateHTML();
    try {
      await saveTaskToFirebase(task);
    } catch (error) {
      console.error("Fehler beim Speichern der tasks in der Firebase-Datenbank:", error);
    }
  }
}