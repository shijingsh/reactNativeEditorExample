
const initialState = {
    isToasting: false,
};

let commonReducer = (state=initialState, action) => {
    switch (action.type) {
        case "types.kCommonIsToasting":
            return {
                ...state,
                isToasting: action.isToasting,
            };
        case "types.kActionError":
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default commonReducer;
