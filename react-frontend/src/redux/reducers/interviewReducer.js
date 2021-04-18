import { POST_INTERVIEW_RESPONSE, SET_INTERVIEW_ANALYSIS } from "../types";

const initialState = {
  response_string: "",
  analysis: {
    duration_score: 0,
    overall_score: 0,
    sentiment_magnitude: 0,
    sentiment_score: 0,
    text: "",
    word_density_score: 0,
  },
};

// export functions
export const interviewReducer = (state = initialState, action) => {
  switch (action.type) {
    // applications
    case POST_INTERVIEW_RESPONSE:
      console.log(action.payload);
      return {
        ...state,
        // response_string: action.payload,
        analysis: action.payload,
      };
    case SET_INTERVIEW_ANALYSIS:
      return {
        ...state,
        analysis: action.payload,
      };
    default:
      return state;
  }
};
