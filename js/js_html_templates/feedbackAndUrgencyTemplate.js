/**
 * This function returns an HTML string containing an SVG icon. The icon is composed of two green arrows, signifying low urgency.
 *
 * @returns {string} - The HTML string containing the SVG icon for low urgency.
 */

function generateHTMLUrgencyLow() {
    return /*html*/ `${lowUrgencySVG}`;
}

/**
 * This function returns an HTML string containing an SVG icon. The icon is composed of two orange bars,
 * signifying medium urgency.
 *
 * @returns {string} - The HTML string containing the SVG icon for medium urgency.
 */

function generateHTMLUrgencyMedium() {
    return /*html*/ `${mediumUrgencySVG}`;
}

/**
 * This function returns an HTML string containing an SVG icon. The icon is composed of two red arrows
 * pointing upwards, signifying urgent urgency.
 *
 * @returns {string} - The HTML string containing the SVG icon for urgent urgency.
 */

function generateHTMLUrgencyUrgent() {
    return /*html*/ `${urgentUrgencySVG}`;
}

/**
 * This function returns an HTML string for a container indicating that there are no tasks awaiting feedback.
 *
 * @returns {string} - The HTML string for the "No Tasks Await Feedback" container.
 */

function returnHtmlNoFeedbackContainer() {
    return /*html*/ `
      <div id="no-await-feedback-container" class="no-task">
          <p>No tasks await feedback</p>
      </div>`;
}

/**
 * This function returns an HTML string for a container indicating that the In-Progress-Section is empty so that no tasks can't be found there (for the moment).
 *
 * @returns {string} - The HTML string for the "No Tasks In Progress" container.
 */

function returnHtmlNoProgressContainer() {
    return /*html*/ `
      <div id="no-in-progress-container" class="no-task">
          <p>No tasks in progress</p>
      </div>`;
}

/**
 * This function returns an HTML string for a container indicating that the To-Do-Section is empty so that no tasks can't be found there (for the moment).
 *
 * @returns {string} - The HTML string for the "No Tasks To Do" container.
 */

function returnHtmlNoToDoContainer() {
    return /*html*/ `
      <div id="no-to-do-container" class="no-task">
          <p>No tasks to do</p>
      </div>`;
}

/**
 * This function returns an HTML string for a container indicating that the Done-Section is empty so that no tasks can't be found there (for the moment).
 *
 * @returns {string} - The HTML string for the "No Tasks Done" container.
 */

function returnHtmlNoDoneContainer() {
    return /*html*/ `
      <div id="no-done-container" class="no-task">
          <p>No tasks done</p>
      </div>`;
}