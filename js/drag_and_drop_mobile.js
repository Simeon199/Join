function openMobileDropdown() {
    let mobileDropdown = document.getElementById("mobileDropdown");
    if (mobileDropdown.classList.contains("d-none")) {
        mobileDropdown.classList.remove("d-none");
    } else {
        mobileDropdown.classList.add("d-none");
    }
}
