/**
 * These are the actions which when disptched, a method on the store, update the stores current state/
 */
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const YES_NO_RESPONSE = 'YES_NO_RESPONSE';
export const RESPONSE_BUFFER = 'RESPONSE_BUFFER';

/**
 * Actions are just functions which return an object with a particular signature. They always have a type property
 * which is the name of the action. And they optionally have a payload property, which is data being sent to the reducer,
 * used for the state update.
 */
export function changePage(pageValue = 'counter') {
    return {
        type: CHANGE_PAGE,
        payload: {
            pageValue
        }
    };
}

export function yesNoResponse(response = {}) {
    return {
        type: YES_NO_RESPONSE,
        payload: {
            response
        }
    };
}

export function responseBuffer(response = '...') {
    return {
        type: RESPONSE_BUFFER,
        payload: {
            response
        }
    };
}

export function decrement() {
    return {
        type: DECREMENT
    };
}

export function increment() {
    return {
        type: INCREMENT
    };
}