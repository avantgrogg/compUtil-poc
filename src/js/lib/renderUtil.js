import $ from 'jquery';
import morphdom from 'morphdom';

export function mDom(config, templateString, store, renderOptions = {}) {
    let target;
    if(config.multiple) {
        target = document.querySelector(config.componentLocation);
    } else {
        target = document.querySelector(config.templateLocation);
    }

    if (!target) {
        return;
    }

    morphdom(target, templateString.trim(), renderOptions);
    config.afterRender(store);
}

export function dDom(config, templateString, store) {
    if(config.multiple) {
        $(config.componentLocation).replaceWith(templateString);
    } else {
        $(config.templateLocation).replaceWith(templateString);
    }
    config.afterRender(store);
}

export function rebind(config, el, store) {
    if(config.rootNode) {
        $(config.rootNode).attr('data-componentid', config.componentLocation);
        $(el).replaceWith(config.rootNode);
    }
    else {
        $(el).attr('data-componentid', config.componentLocation);
    }
    config.afterRebind(store);
    return config.rebindChildren(store);
}

export const mDomMaintainInputVals = {
    onBeforeElChildrenUpdated : (fromEl, toEl) => {
        if($(fromEl).is('input') || $(fromEl).is('textarea')) {
            $(toEl).val($(fromEl).val());
        }
        return true;
    }
}
