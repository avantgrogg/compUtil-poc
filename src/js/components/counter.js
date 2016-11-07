import { generate } from '../lib/componentUtil';
import counterTemplate from '../templates/counter.j2';
import { increment, decrement } from '../actions';

export function init(store = {}, overrides = {}) {
    const config = {
        name: 'counterComponent',
        attachEvents: attachEvents,
        template: counterTemplate,
        templateLocation: '.dom-counter',
        watch: 'counter.count',
        afterRebind: afterRebind
    };

    generate(config, store, overrides);
}

export function attachEvents(store) {
    document.getElementsByClassName('decrement')[0].addEventListener(
        'click', (e) => {
            store.dispatch(decrement());
        }
    );
    document.getElementsByClassName('increment')[0].addEventListener(
        'click', (e) => {
            store.dispatch(increment());
        }
    );
}

export function onStateChange(store) {
    this.render(store.getState, this, {}, store);
}

export function afterRebind(store) {
    debugger;
    this.attachEvents(store);
}