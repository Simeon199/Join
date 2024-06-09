function taskMarker() {
    document.getElementById('addTask').classList.add('currentSection');
}

function changePriority(id) {
    removeBackground(id)
    if (id == urgent) {
        urgent.classList.add("backgroundUrgent")
    } if (id == medium) {
        medium.classList.add("backgroundMedium")
    } if (id == low) {
        low.classList.add("backgroundLow")
    }
}

function removeBackground(id) {
    if (id == urgent) {
        medium.classList.remove("backgroundMedium")
        low.classList.remove("backgroundLow")
    } if (id == medium) {
        urgent.classList.remove("backgroundUrgent")
        low.classList.remove("backgroundLow")
    } if (id == low) {
        urgent.classList.remove("backgroundUrgent")
        medium.classList.remove("backgroundMedium")
    }
}

function createTask() {
    
}