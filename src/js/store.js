import { demoApp } from './reducers';
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();

const initialState = {
    page: 'counter',
    counter: {
        count: 0
    },
    yesNo: {
        response: 'Ask me a question',
        image: ''
    }
};

export function generateStore() {
    return createStore(demoApp, initialState, applyMiddleware(logger));
}