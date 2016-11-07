import { generate } from '../lib/componentUtil';
import pageTemplate from '../templates/page.j2';
import { init as counterInit } from './counter';

export function init(store = {}, overrides = {}) {
    const config = {
        name: 'pageComponent',
        children: [counterInit],
        attachEvents: attachEvents,
        template: pageTemplate,
        afterConstruction: afterConstruction,
        templateLocation: '.dom-page'
    };

    generate(config, store, overrides);
}

export function afterConstruction(store) {
    this.render(store.getState, this);
}

export function attachEvents(store) {

}