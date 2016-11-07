import { generate } from '../lib/componentUtil';
import counterTemplate from '../templates/yesno.j2';
import { yesNoResponse, responseBuffer } from '../actions';
import { debounce } from 'lodash';
import { mDomMaintainInputVals } from '../lib/renderUtil';

export function init(store = {}, overrides = {}) {
    const config = {
        name: 'yesnoComponent',
        attachEvents: attachEvents,
        template: counterTemplate,
        templateLocation: '.dom-yesno',
        watch: 'yesNo.response',
        renderOptions: mDomMaintainInputVals
    };

    generate(config, store, overrides);
}

export function attachEvents(store) {
    document.getElementsByClassName('yes-no-input')[0].addEventListener('keyup', debounce((e) => {
        if(!e.target.value.includes('?')) {
            store.dispatch(responseBuffer('Gonna need a question mark...'));
            return;
        }
        store.dispatch(responseBuffer('Alright, here we go...'));
        fetch('https://yesno.wtf/api')
            .then((response) => response.json())
            .then((response) => store.dispatch(yesNoResponse(response)));
    }), 500);
}

export function onStateChange(store) {
    this.render(store.getState, this, {}, store);
}