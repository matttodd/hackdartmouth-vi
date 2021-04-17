import {
  SET_APPLICATIONS,
  SET_APPLICATION_SEARCH,
  POST_APPLICATION,
  PUT_APPLICATION,
  DELETE_APPLICATION,
} from "../types";

const initialState = {
  all_applications: [],
  applications: [],
  searchTerm: "",
  // matchingSearchApplications: [],
};

// export functions
export const applicationReducer = (state = initialState, action) => {
  switch (action.type) {
    // applications
    case SET_APPLICATIONS:
      console.log(state.applications);
      console.log(state.searchTerm);
      return {
        ...state,
        applications: action.payload,
        all_applications: action.payload,
      };
    case SET_APPLICATION_SEARCH:
      let searchTerm = action.payload.trim().toLowerCase();
      return {
        ...state,
        searchTerm: searchTerm,
        applications: state.all_applications.filter((application) =>
          application.company_name.toLowerCase().includes(searchTerm)
        ),
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
