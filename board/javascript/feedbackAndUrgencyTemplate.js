import * as shared from '../../shared/javascript/shared.js';

/**
 * This function returns an HTML string containing an SVG icon. The icon is composed of two green arrows, signifying low urgency.
 *
 * @returns {string} - The HTML string containing the SVG icon for low urgency.
 */

export async function generateHTMLUrgencyLow() {
    let template = await shared.initHTMLContent('../../board/templates/feedback_templates/html_urgency_low.tpl', 'section-await-feedback');
    return template;
}

/**
 * This function returns an HTML string containing an SVG icon. The icon is composed of two orange bars,
 * signifying medium urgency.
 *
 * @returns {string} - The HTML string containing the SVG icon for medium urgency.
 */

export async function generateHTMLUrgencyMedium() {
    let template = await shared.initHTMLContent('../../board/templates/feedback_templates/html_urgency_medium.tpl', 'section-await-feedback');
    return template;
}

/**
 * This function returns an HTML string containing an SVG icon. The icon is composed of two red arrows
 * pointing upwards, signifying urgent urgency.
 *
 * @returns {string} - The HTML string containing the SVG icon for urgent urgency.
 */

export async function generateHTMLUrgencyUrgent() {
    let template = await shared.initHTMLContent('../../board/templates/feedback_templates/html_urgency_urgent.tpl', 'section-await-feedback');
    return template;
}

/**
 * This function returns an HTML string for a container indicating that there are no tasks awaiting feedback.
 *
 * @returns {string} - The HTML string for the "No Tasks Await Feedback" container.
 */

export async function returnHtmlNoFeedbackContainer() {
    let template = await shared.initHTMLContent('../../board/templates/board_container_templates/no_feedback_container.tpl', 'section-await-feedback');
    return template;
}

/**
 * This function returns an HTML string for a container indicating that the In-Progress-Section is empty so that no tasks can't be found there (for the moment).
 *
 * @returns {string} - The HTML string for the "No Tasks In Progress" container.
 */

export async function returnHtmlNoProgressContainer() {
    let template = await shared.initHTMLContent('../../board/templates/board_container_templates/no_progress_container.tpl', 'section-in-progress');
    return template;
}

/**
 * This function returns an HTML string for a container indicating that the To-Do-Section is empty so that no tasks can't be found there (for the moment).
 *
 * @returns {string} - The HTML string for the "No Tasks To Do" container.
 */

export async function returnHtmlNoToDoContainer() {
    let template = await shared.initHTMLContent('../../board/templates/board_container_templates/no_to_do_container.tpl', 'section-to-do');
    return template;
}
    

/**
 * This function returns an HTML string for a container indicating that the Done-Section is empty so that no tasks can't be found there (for the moment).
 *
 * @returns {string} - The HTML string for the "No Tasks Done" container.
 */

export async function returnHtmlNoDoneContainer() {
    let template = await shared.initHTMLContent('../../board/templates/board_container_templates/no_done_container.tpl', 'section-done');
    return template;
}