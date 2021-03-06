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
    raw_duration: 0,
    raw_wpm: 0,
  },
};

// export functions
export const interviewReducer = (state = initialState, action) => {
  switch (action.type) {
    // applications
    case POST_INTERVIEW_RESPONSE:
      console.log(action.payload);
      let test_analysis = action.payload;
      if (typeof test_analysis.text !== "undefined") {
        return {
          ...state,
          analysis: action.payload,
        };
      } else {
        return state;
      }
    case SET_INTERVIEW_ANALYSIS:
      return {
        ...state,
        analysis: action.payload,
      };
    default:
      return state;
  }
};
