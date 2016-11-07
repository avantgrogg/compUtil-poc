import { generate } from '../lib/componentUtil';
import { headerTemplate } from '../templates/headerTemplate.j2';

export function init(store = {}, overrides = {}) {
    const config = {
        name: 'formComponent',
        attachEvents: attachEvents,
        template: headerTemplate,
        afterConstruction: afterConstruction,
        templateLocation: 'dom-header'
    };
    generate(config, store, overrides);
}

export function afterConstruction(store) {
    this.render(store.getState, this);
}

export function attachEvents(store) {

}