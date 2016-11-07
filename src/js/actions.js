export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const YES_NO_RESPONSE = 'YES_NO_RESPONSE';
export const RESPONSE_BUFFER = 'RESPONSE_BUFFER';

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