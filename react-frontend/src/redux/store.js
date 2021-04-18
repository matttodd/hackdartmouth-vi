import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { userReducer } from "./reducers/userReducer";
import { applicationReducer } from "./reducers/applicationReducer";
import { interviewReducer } from "./reducers/interviewReducer";
import { profileReducer } from "./reducers/profileReducer";
import { uiReducer } from "./reducers/uiReducer";

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  user: userReducer,
  // contacts: contactReducer,
  applications: applicationReducer,
  interviews: interviewReducer,
  profile: profileReducer,
  ui: uiReducer,
});

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));
const store = createStore(reducers, initialState, enhancer);

export default store;
