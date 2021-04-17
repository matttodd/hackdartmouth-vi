import { SET_PROFILE } from "../types";

import { setError, setLoadingAction, stopLoadingAction } from "./uiActions";

import axios from "axios";

export const getProfile = (userId) => (dispatch) => {
  dispatch(setLoadingAction(SET_PROFILE));
  return axios
    .get(`/profiles/${userId}`)
    .then((res) => {
      dispatch({
        type: SET_PROFILE,
        payload: res.data,
      });
      console.log(res.data);
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(SET_PROFILE));
    })
    .catch((err) => {
      dispatch(setError(SET_PROFILE, err));
    });
};
