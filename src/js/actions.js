export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

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