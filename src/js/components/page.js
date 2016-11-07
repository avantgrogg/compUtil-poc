/**
 * This component is used as a router between the counter and yesno pages. It does the initial render for both pages
 * and inits the necessary components.
 */
import { generate } from '../lib/componentUtil';
import pageTemplate from '../templates/page.j2';
import { init as counterInit } from './counter';
import { init as headerInit } from './header';
import { init as yesNoInit } from './yesno';

/**
 * A simple object literal is used to determine the pages components based on the currentPage.
 */
const router = {
    counter: counterInit,
    yesno: yesNoInit
};

export function init(store = {}, overrides = {}) {
    const config = {
        name: 'pageComponent',
        children: [
            headerInit
        ],
        template: pageTemplate,
        afterConstruction: afterConstruction,
        templateLocation: '.dom-page',
        watch: 'page.currentPage',
        rebind: true,
        afterRender: afterRender,
        onStateChange: onStateChange
    };

    generate(config, store, overrides);
}
/**
 * afterConstruction is a lifecycle fn provided by compUtil, it is called once, 
 * after the component has been built, watchers attached, and events bound.
 * @param {object} store - The redux store
 */
export function afterConstruction(store) {
    this.render(store.getState, this, {}, store);
}

export function onStateChange(store, watch, oldVal, newVal) {
    this.render(store.getState, this, {}, store);
}
/**
 * afterRender is a lifecycle fn provided by the compUtil, it is called after every this.render call.
 * @param {object} store - The redux store
 */
export function afterRender(store) {
    const currentPage = store.getState().page.currentPage;
    this.addChild(router[currentPage], store);
}