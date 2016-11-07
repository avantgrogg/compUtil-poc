import { generate } from '../lib/componentUtil';
import { headerTemplate } from '../templates/header.j2';
import { changePage } from '../actions';
import { forEach, get } from 'lodash';

export function init(store = {}, overrides = {}) {
    const config = {
        name: 'headerComponent',
        attachEvents: attachEvents,
        template: headerTemplate,
        templateLocation: 'dom-header'
    };
    generate(config, store, overrides);
}

export function attachEvents(store) {
    const pageValues = document.getElementsByClassName('page-value');
    forEach(pageValues, (pageLink) => { 
        pageLink.addEventListener(
            'click', (e) => {
                const pageName = get(e, 'currentTarget.dataset.pageName', 'counter');
                store.dispatch(changePage(pageName));
            }
        );
    });
}