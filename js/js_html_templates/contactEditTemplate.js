/**
 * Returns the HTML for the edit contact pop-up headline.
 *
 */

function returnEditContactPopUpHeadlineHTML() {
    return /*html*/ `
      <h1 id="pop-up-headline">Edit contact</h1>
    `;
}
  
/**
* Returns HTML string for contact popup logo with user's initials.
*
* @param {string} userName - The name of the user.
*/

function returnEditContactPopUpLogoHTML(userName) {
    return /*html*/ `
    ${firstLetterFirstTwoWords(userName)}
      `;
}

/**
 * Returns the HTML form for editing a contact.
 *
 * @param {string} userID - The unique identifier of the user.
 * @param {number} i - Index of the contact in the list.
 * @param {string} userColor - The color associated with the user.
 */

function returnEditContactPopUpFormHTML(userID, i, userColor) {
    return /*html*/ `
      <form onsubmit='editContact("${userID}","${i}","${userColor}"); return false;'>
        <div class="pop-up-input-container">
          <input
            minlength="2"
            id="pop-up-name-input"
            class="pop-up-input"
            type="text"
            placeholder="Name"
            required />
          ${personIconSVG}
        </div>

        <div class="pop-up-input-container">
          <input
            required
            id="pop-up-email-input"
            class="pop-up-input"
            type="email"
            placeholder="Email"
          />
          ${envelopeIconSVG}
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
          ${phoneIconSVG}
        </div>

        <div id="pop-up-buttons-container">
          <button id="pop-up-cancel-button" type="button" onclick="deleteContact('${userID}'), hidePopUp()">
            Delete
          </button>

          <button id="pop-up-create-contact-button" type='submit'>
            Save
            ${checkmarkIconSVG}
          </button>
        </div>
      </form>
    `;
}