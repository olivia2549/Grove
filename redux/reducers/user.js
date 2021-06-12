// param1: state is null by default
// param2: reducer needs to take in an action
export const userReducer = (state = null, action) => {
    // changes the state (aka the user) based on which action was called
    switch (action.type) {
        case 'USER_STATE_CHANGE':   // this one of the actions
            return {
                ...state,
                currentUser: action.currentUser
            }
        default:
            return null;
    }
}

export default userReducer;
