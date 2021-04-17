import { SET_PROFILE } from "../types";

import axios from "axios";

export const getProfile = (userId) => (dispatch) => {
  return axios
    .get(`/profiles/${userId}`)
    .then((res) => {
      dispatch({
        type: SET_PROFILE,
        payload: res.data,
      });
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};
