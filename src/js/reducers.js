import { INCREMENT, DECREMENT, CHANGE_PAGE, YES_NO_RESPONSE, RESPONSE_BUFFER } from './actions';

export function demoApp(state = {}, action) {
    return {
        page: page(state.page, action),
        counter: counter(state.counter, action),
        yesNo: yesNo(state.yesNo, action)
    };
}

function page(state = {}, action) {
    switch(action.type) {
        case CHANGE_PAGE:
            return Object.assign(
                {}, state, {
                    currentPage: action.payload.pageValue
                }
            )
        default:
            return state;
    }
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

function yesNo(state = {}, action) {
    switch(action.type) {
    case YES_NO_RESPONSE:
        return Object.assign(
            {}, state, {
                response: action.payload.response.answer
            }
        );
    case RESPONSE_BUFFER:
        return Object.assign(
            {}, state, {
                response: action.payload.response
            }
        );
    default:
        return state;
    }
}