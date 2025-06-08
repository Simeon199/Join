import * as shared from '../../shared/javascript/shared.js';

export async function generateHTMLUrgencyLow() {
    let template = await shared.initHTMLContent('../../board/templates/feedback_templates/html_urgency_low.tpl', 'section-await-feedback');
    return template;
}

export async function generateHTMLUrgencyMedium() {
    let template = await shared.initHTMLContent('../../board/templates/feedback_templates/html_urgency_medium.tpl', 'section-await-feedback');
    return template;
}

export async function generateHTMLUrgencyUrgent() {
    let template = await shared.initHTMLContent('../../board/templates/feedback_templates/html_urgency_urgent.tpl', 'section-await-feedback');
    return template;
}

export async function returnHtmlNoFeedbackContainer() {
    let template = await shared.initHTMLContent('../../board/templates/board_container_templates/no_feedback_container.tpl', 'section-await-feedback');
    return template;
}

export async function returnHtmlNoProgressContainer() {
    let template = await shared.initHTMLContent('../../board/templates/board_container_templates/no_progress_container.tpl', 'section-in-progress');
    return template;
}

export async function returnHtmlNoToDoContainer() {
    let template = await shared.initHTMLContent('../../board/templates/board_container_templates/no_to_do_container.tpl', 'section-to-do');
    return template;
}
    
export async function returnHtmlNoDoneContainer() {
    let template = await shared.initHTMLContent('../../board/templates/board_container_templates/no_done_container.tpl', 'section-done');
    return template;
}

export function getRightOppositeElement(oppositeElementName) {
  if (oppositeElementName === "no-await-feedback-container") {
    returnHtmlNoFeedbackContainer();
  } else if (oppositeElementName === "no-in-progress-container") {
    returnHtmlNoProgressContainer();
  } else if (oppositeElementName === "no-to-do-container") {
    returnHtmlNoToDoContainer();
  } else if (oppositeElementName === "no-done-container") {
    returnHtmlNoDoneContainer();
  }
}