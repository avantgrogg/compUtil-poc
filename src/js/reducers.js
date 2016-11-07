import { INCREMENT, DECREMENT } from './actions';

export function demoApp(state = {}, action) {
    return {
        counter: counter(state.counter, action)
    };
}

function counter(state = {}, action) {
    switch(action.type) {
    case DECREMENT:
        return Object.assign(
            {}, state, {
                count: state.count-1
            }
        );
    case INCREMENT:
        return Object.assign(
            {}, state, {
                count: state.count+1
            }
        );
    default:
        return state;
    }
}