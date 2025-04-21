import * as shared from '../javascript/shared.js';

document.addEventListener('DOMContentLoaded', () => {
  shared.bundleLoadingHTMLTemplates();
})

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
