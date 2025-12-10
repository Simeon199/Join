/**
 * Returns the HTML for a contact letter container.
 *
 * @param {string} letter - The letter to be displayed.
 */
function returnContactLetterContainerHTML(letter) {
  return /*html*/ `
    <div class="contact-container">
          <h2 class="letter">${letter.toUpperCase()}</h2>
          <div class='letter-list-contact-container'></div>
     </div>
  `;
}

/**
 * Generates HTML for a contact card with user details.
 *
 * @param {number} j - Index of the contact.
 * @param {Object} user - The user object containing details.
 */
function returnContactHTML(j, user) {
  let userName = user["name"];
  let userEmail = user["email"];
  let userNumber = user["phone"];
  let userID = user["id"];
  let userColor = user["color"];

  return /*html*/ `
        <div class="contact" onclick="toggleBigContact(${j},'${userName}','${userEmail}','${userNumber}','${userID}','${userColor}')">
            <div class="profile-badge" style='background-color: ${userColor}'>
              <p>${firstLetterFirstTwoWords(userName)}</p>
            </div>
            
            <div class="name-and-email-container">
              <p class="name">${userName}</p>
              <p class="email">${user["email"]}</p>
            </div>
        </div>
      `;
}

/**
 * Generates HTML for big contact icon containers.
 *
 * @param {string} userName - The name of the user.
 * @param {string} userEmail - The email of the user.
 * @param {string} userNumber - The contact number of the user.
 * @param {string} userID - The unique ID of the user.
 * @param {number} i - An index or identifier for the user.
 * @param {string} userColor - The color associated with the user.
 */
function returnBigContactIconContainerHTML(userName, userEmail, userNumber, userID, i, userColor) {
  return /*html*/ `
    <div id="edit-contact" onclick='showPopUp(),renderEditContactPopUp("${userID}","${userName}","${userEmail}","${userNumber}","${i}","${userColor}")'>
      ${editIconSVG}
      <p>Edit</p>
    </div>

    <div id="delete-contact" onclick='deleteContact("${userID}")'>
      ${deleteIconSVG}
      <p>Delete</p>
    </div>
  `;
}

/**
 * Returns HTML for the add contact popup headline.
 *
 */
function returnAddContactPopUpHeadlineHTML() {
  return /*html*/ `
        <h1 id="pop-up-headline">Add contact</h1>
        <p id="pop-up-comment">Tasks are better with a team!</p>
    `;
}

/**
 * Returns HTML string for an SVG logo in the contact popup.
 *
 */
function returnAddContactPopUpContactLogoHTML() {
  return /*html*/ `
    ${contactPersonIconSVG}
  `;
}

/**
 * Generates HTML for a contact addition pop-up form.
 *
 */
function returnAddContactPopUpFormHTML() {
  return /*html*/ `
    <form onsubmit='addNewContact("${randomColor()}", "created"); return false;'>
      <div class="pop-up-input-container">
        <input
          minlength="2"
          maxlength="20"
          id="pop-up-name-input"
          class="pop-up-input"
          type="text"
          placeholder="Name"
          required />
        ${contactPersonIconSVG}
      </div>

      <div class="pop-up-input-container">
        <input
          required
          id="pop-up-email-input"
          class="pop-up-input"
          type="email"
          placeholder="Email"
        />
        ${contactEnvelopeIconSVG}
      </div>

      <div class="pop-up-input-container">
        <input
          required
          id="pop-up-phone-input"
          class="pop-up-input"
          type="tel"
          placeholder="Phone"
          pattern="[\+]{0,1}[0-9]{0,}"
          minlength="12"
          maxlength="14"
        />
        ${contactPhoneIconSVG}
      </div>

      <div id="pop-up-buttons-container">
        <button id="pop-up-cancel-button" onclick="hidePopUp()">
          Cancel
          ${cancelIconSVG}
        </button>

        <button id="pop-up-create-contact-button" type='submit'>
          Create contact
          ${contactCheckmarkIconSVG}
        </button>
      </div>
    </form>
  `;
}