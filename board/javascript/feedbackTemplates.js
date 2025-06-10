import * as shared from '../../shared/javascript/shared.js';

let feedbackTemplatesPath = '../../board/templates/feedback_templates'
let containerTemplatesPath = '../../board/templates/board_container_templates';

export async function generateHTMLUrgencyLow() {
    let template = await shared.initHTMLContent(`${feedbackTemplatesPath}/html_urgency_low.tpl`, 'section-await-feedback');
    return template;
}

export async function generateHTMLUrgencyMedium() {
    let template = await shared.initHTMLContent(`${feedbackTemplatesPath}/html_urgency_medium.tpl`, 'section-await-feedback');
    return template;
}

export async function generateHTMLUrgencyUrgent() {
    let template = await shared.initHTMLContent(`${feedbackTemplatesPath}/html_urgency_urgent.tpl`, 'section-await-feedback');
    return template;
}

export async function returnHtmlNoFeedbackContainer() {
    let template = await shared.initHTMLContent(`${containerTemplatesPath}/no_feedback_container.tpl`, 'section-await-feedback');
    return template;
}

export async function returnHtmlNoProgressContainer() {
    let template = await shared.initHTMLContent(`${containerTemplatesPath}/no_progress_container.tpl`, 'section-in-progress');
    return template;
}

export async function returnHtmlNoToDoContainer() {
    let template = await shared.initHTMLContent(`${containerTemplatesPath}/no_to_do_container.tpl`, 'section-to-do');
    return template;
}
    
export async function returnHtmlNoDoneContainer() {
    let template = await shared.initHTMLContent(`${containerTemplatesPath}/no_done_container.tpl`, 'section-done');
    return template;
}

export async function getRightOppositeElement(oppositeElementName) {
  if (oppositeElementName === "no-await-feedback-container") {
    return await returnHtmlNoFeedbackContainer();
  } else if (oppositeElementName === "no-in-progress-container") {
    return await returnHtmlNoProgressContainer();
  } else if (oppositeElementName === "no-to-do-container") {
    return await returnHtmlNoToDoContainer();
  } else if (oppositeElementName === "no-done-container") {
    return await returnHtmlNoDoneContainer();
  }
}