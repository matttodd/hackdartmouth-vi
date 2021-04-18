import { POST_INTERVIEW_RESPONSE } from "../types";

const initialState = {
  response_string: "",
};

// export functions
export const interviewReducer = (state = initialState, action) => {
  switch (action.type) {
    // applications
    case POST_INTERVIEW_RESPONSE:
      return {
        ...state,
        response_string: action.payload,
      };
    default:
      return state;
  }
};
