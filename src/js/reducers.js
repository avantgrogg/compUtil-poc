/**
 * The reducer file imports action names, then checks for actions flowing through the redux store after 
 * a dispatch. If an action type matches a case in one of the reducers, then the state is updated accordingly.
 */
import { INCREMENT, DECREMENT, CHANGE_PAGE, YES_NO_RESPONSE, RESPONSE_BUFFER } from './actions';

/**
 * @param {object} state - the current state of the redux store
 * @param {object} action - the current action dispatched through the redux store
 * @returns {object}
 */
export function demoApp(state = {}, action) {
    return {
        page: page(state.page, action),
        counter: counter(state.counter, action),
        yesNo: yesNo(state.yesNo, action)
    };
}
/**
 * @param {object} state - a slice of the state, state.page
 * @param {action} action - the current action dispatched through the redux store
 * @returns {object} An updated state representing state.page
 */
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
/**
 * @param {object} state - a slice of the state, state.counter 
 * @param {any} action - the current action dispatched through the redux store
 * @returns {object}
 */
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
/**
 * @param {object} state - a slice of the state, state.yesNo
 * @param {any} action - the current action dispatched through the redux store
 * @returns {object}
 */
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