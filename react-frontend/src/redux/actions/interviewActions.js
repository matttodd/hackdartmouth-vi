import { POST_INTERVIEW_RESPONSE } from "../types";

import axios from "axios";

export const postInterviewResponse = (audioFile) => (dispatch) => {
  // format audioFile
  console.log("FUCK");
  console.log(audioFile);
  let formData = new FormData();
  // formData.append("image", imagefile.files[0]);
  formData.append("audio", audioFile);
  return axios
    .post(`/interviews/speech2txt`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch({
        type: POST_INTERVIEW_RESPONSE,
        payload: res.data,
      });
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};

// export const postApplication = (newApplication) => (dispatch) => {
//   dispatch(setLoadingAction(POST_APPLICATION));
//   axios
//     .post("/applications", newApplication)
//     .then((res) => {
//       dispatch({
//         type: POST_APPLICATION,
//         payload: res.data,
//       });
//       return res;
//     })
//     .then(() => {
//       dispatch(stopLoadingAction(POST_APPLICATION));
//     })
//     .catch((err) => {
//       dispatch(setError(POST_APPLICATION, err));
//     });
// };

// export const putApplication = (updatedApplicationId, updatedApplication) => (dispatch) => {
//   dispatch(setLoadingAction(PATCH_APPLICATION));
//   axios
//     .put(`/applications/${updatedApplicationId}`, updatedApplication)
//     .then((res) => {
//       updatedApplication.id = updatedApplicationId;
//       dispatch({
//         type: PATCH_APPLICATION,
//         payload: updatedApplication,
//       });
//     })
//     .then(() => {
//       dispatch(stopLoadingAction(PATCH_APPLICATION));
//     })
//     .catch((err) => {
//       dispatch(setError(PATCH_APPLICATION, err));
//     });
// };

// export const deleteApplication = (applicationId) => (dispatch) => {
//   dispatch(setLoadingAction(DELETE_APPLICATION));
//   axios
//     .delete(`/applications/${applicationId}`)
//     .then((res) => {
//       dispatch({
//         type: DELETE_APPLICATION,
//         payload: applicationId,
//       });
//     })
//     .then(() => {
//       dispatch(stopLoadingAction(DELETE_APPLICATION));
//     })
//     .catch((err) => {
//       dispatch(setError(DELETE_APPLICATION, err));
//     });
// };

// export const getSearchedContacts = (searchTerm) => (dispatch) => {
//   dispatch({
//     type: SEARCH_CONTACTS,
//     payload: searchTerm,
//   });
// };
