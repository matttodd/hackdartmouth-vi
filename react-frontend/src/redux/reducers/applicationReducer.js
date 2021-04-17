import { SET_APPLICATIONS, POST_APPLICATION, PUT_APPLICATION, DELETE_APPLICATION } from "../types";

const initialState = {
  applications: [],
  // matchingSearchApplications: [],
};

// export functions
export const applicationReducer = (state = initialState, action) => {
  switch (action.type) {
    // applications
    case SET_APPLICATIONS:
      return {
        ...state,
        applications: action.payload,
        loading: false,
      };
    // case POST_APPLICATION:
    //   return {
    //     ...state,
    //     applications: [...state.applications, action.payload],
    //     loading: false,
    //   };
    // case PATCH_APPLICATION:
    //   const updatedApplication = action.payload;
    //   return {
    //     ...state,
    //     applications: state.applications.map((application) =>
    //       application.id === updatedApplication.id ? updatedApplication : application
    //     ),
    //     loading: false,
    //   };
    // case DELETE_APPLICATION:
    //   const deletedApplicationId = action.payload;
    //   return {
    //     ...state,
    //     applications: state.applications.filter(
    //       (application) => application.id !== deletedApplicationId
    //     ),
    //     loading: false,
    //   };
    // case SEARCH_CONTACTS:
    //   const searchTerm = action.payload;
    //   return {
    //     ...state,
    //     matchingSearchContacts: state.contacts.filter((contact) =>
    //       contact.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    //     ),
    //     loading: false,
    //   };
    default:
      return state;
  }
};
