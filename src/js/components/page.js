import { generate } from '../lib/componentUtil';
import pageTemplate from '../templates/page.j2';
import { init as counterInit } from './counter';
import { init as headerInit } from './header';
import { init as yesNoInit } from './yesno';

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
        watch: 'page',
        rebind: true,
        afterRender: afterRender,
        onStateChange: onStateChange
    };

    generate(config, store, overrides);
}

export function afterConstruction(store) {
    this.render(store.getState, this, {}, store);
}

export function onStateChange(store) {
    this.render(store.getState, this, {}, store);
}

export function afterRender(store) {
    const currentPage = store.getState().page;
    this.addChild(router[currentPage], store);
}