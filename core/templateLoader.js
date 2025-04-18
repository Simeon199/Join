let templateCache = {};

export async function loadTemplates(templateList, basePath){
    if(!basePath){
        throw new Error('no basePath defined');
    }
    let loadPromises = templateList.map(filename => generatePromise(filename, basePath));
    await Promise.all(loadPromises);
    console.log('[TemplateLoader] All templates loaded: ', Object.keys(templateCache));
    return Object.keys(templateCache);
}

export function getTemplateClone(templateId){
    let template = templateCache[templateId];
    if(!template){
        throw new Error(`Template "${templateId}" not found in cache.`);
    }
    // console.log('Template Inhalt vor dem Klonen: ', template.content);
    console.log(template.content.cloneNode(true));
    return template.content.cloneNode(true);
}

export async function generatePromise(filename, basePath){
    try {
        let result = await fetch(`${basePath}${filename}`);
        if(!result.ok){
            throw new Error(`Failed to fetch ${filename}: ${result.status} ${result.statusText}`);
        }
        let htmlContent = await result.text();
        if(filename === 'add-contact-pop-up-form.template.html'){
            console.log('Geladener HTML-Inhalt für: ', filename, ':', htmlContent);
        }
        let container = document.createElement('div');
        container.innerHTML = htmlContent;
        let templates = container.querySelectorAll('template');
        if(templates.length === 0){
            console.warn(`[TemplateLoader] No <template> found in ${filename}`);
        }
        templates.forEach(template => {
            if(!template.id){
                console.warn(`[TemplateLoader] Skipped template without id in ${filename}`);
                return;
            }
            // console.log(`Template "${template.id}" Inhalt vor dem Speichern: `, template.content);
            templateCache[template.id] = template;
        });
    } catch(error) {
        console.error('[TemplateLoader] Error while loading template: ', error);
        throw error;
    }
}