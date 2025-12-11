/**
 * Clears the task marker.
 *
 */
function taskMarker() {}

/**
 * Navigates to the previous page in the browser history.
 *
 */
function previousPage() {
  window.history.back();
}

/**
 * Initializes the legal notice page icons.
 */
function initLegalNoticeIcons() {
  document.getElementById('arrow-icon').innerHTML = legalNoticeArrowSVG;
}

/**
 * Initializes the privacy policy page icons.
 */
function initPrivacyPolicyIcons() {
  document.getElementById('arrow-icon').innerHTML = privacyPolicyArrowSVG;
}
