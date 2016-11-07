/**
 * Components files always import generate from the componentUtil, and have an init function, 
 * everything else is optional overrides for the default component behavior.
 * This component is used to bind events for the counter and update the page if counter events occur.
 */
import { generate } from '../lib/componentUtil';
import counterTemplate from '../templates/counter.j2';
import { increment, decrement } from '../actions';

/**
 * The init function is used the setup the components configuration and then generate the component.
 * @param {object} store - The redux store
 * @param {object} overrides - An object with overrides for the components config passed down from a parent component
 */
export function init(store = {}, overrides = {}) {
    const config = {
        name: 'counterComponent',
        attachEvents: attachEvents,
        template: counterTemplate,
        templateLocation: '.dom-counter',
        watch: 'counter.count',
        onStateChange: onStateChange
    };

    generate(config, store, overrides);
}

/**
 * This components attachEvents fn is used to override the default compUtil attachEvents which is just a noop.
 * The events bind to elements on the current spa page.
 * @param {object} store - the redux store
 */
export function attachEvents(store) {
    document.getElementsByClassName('decrement')[0].addEventListener(
        'click', (e) => {
            e.preventDefault();
            store.dispatch(decrement());
        }
    );
    document.getElementsByClassName('increment')[0].addEventListener(
        'click', (e) => {
            e.preventDefault();
            store.dispatch(increment());
        }
    );
}
/**
 * This components onStateChange fn is used to override the default compUtil onStateChange 
 * which is also a render call with store.getState.
 * @param {object} store - the redux store
 */
export function onStateChange(store) {
    this.render(store.getState, this, {}, store);
}