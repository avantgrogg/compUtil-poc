import { demoApp } from './reducers';
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();

const initialState = {
    header: {
        name: 'Counter'
    },
    counter: {
        count: 0
    }
};

export function generateStore() {
    return createStore(demoApp, initialState, applyMiddleware(logger));
}