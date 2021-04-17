import { SET_PROFILE } from "../types";

const initialState = {
  profile: {},
};

// export functions
export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    // applications
    case SET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
