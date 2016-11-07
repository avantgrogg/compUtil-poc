import { demoApp } from './reducers';
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();

const initialState = {
    page: { 
        currentPage: 'counter'
    },
    counter: {
        count: 0
    },
    yesNo: {
        response: '',
        image: ''
    }
};

export function generateStore() {
    return createStore(demoApp, initialState, applyMiddleware(logger));
}