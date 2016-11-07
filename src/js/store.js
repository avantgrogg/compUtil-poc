/**
 * This is used to build the redux store with the logger middleware and an initialState
 */

//demoApp is a function containing the reducers
import { demoApp } from './reducers';
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
//generates a logger middleware
const logger = createLogger();
//the initialState used to hydrate the redux store
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
/**
 * Called by the index file, returns a redux store with the initialState, demoApp, and logger middleware
 * @returns {object} A redux store object
 */
export function generateStore() {
    return createStore(demoApp, initialState, applyMiddleware(logger));
}