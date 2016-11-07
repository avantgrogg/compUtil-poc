/**
 * This component is used to bind events for the yesno form and update the page when yesno events are registered.
 */
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
    //keyup events on the yes-no-input are debounced every 500ms
    document.getElementsByClassName('yes-no-input')[0].addEventListener('keyup', debounce((e) => {
        //if after a keyup the input has an empty value then reset the response back to empty
        if(e.target.value.length < 1) {
            store.dispatch(responseBuffer(''));
            return;
        } 
        //if the input value length is greater than 0 but does not contain a question mark, update the response to tell
        //the user to add one
        else if(!e.target.value.includes('?')) {
            store.dispatch(responseBuffer('Gonna need a question mark...'));
            return;
        } 
        //if the input value length is greater than 0 and has a question mark, update the response to say that it is processing
        store.dispatch(responseBuffer('Alright, here we go...'));
        //use the fetch api to make a request to the yesno api
        fetch('https://yesno.wtf/api')
            //fetch responses come back as array buffers so convert to json
            .then((response) => response.json())
            //dispatch the yesno api response into the store
            .then((response) => store.dispatch(yesNoResponse(response)));
    }), 500);
}

/**
 * Note that this onStateChange fn is not set as an override in the component config, so it is not used,
 * instead the default onStateChange in compUtil is used.
 */
export function onStateChange(store) {
    this.render(store.getState, this, {}, store);
}