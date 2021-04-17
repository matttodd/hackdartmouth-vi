import React, { Component } from "react";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import { clearError, clearAllErrors } from "../redux/actions/uiActions";
import {
  // departments
  getApplications,
  // patchApplication,
  // postApplication,
  // deleteApplication,
} from "../redux/actions/applicationActions";
import { getProfile } from "../redux/actions/profileActions";

// Components
import Applications from "../components/applications/applicationsComponent";

// css styles
import "../css/page.css";
const userId = "XYrpS0dU2ATb44u15KWy9qNfP9q1";

class DashboardPage extends Component {
  constructor() {
    super();
    this.state = {
      applications: [],
      profile: {
        name: "",
      },
    };
  }

  componentDidMount() {
    // this.props.clearAllErrors();
    this.props.getApplications(userId);
    this.props.getProfile(userId);
  }

  render() {
    // const { isAdmin } = this.props.user;
    // const { errors, loadingActions } = this.props.ui;
    const { applications } = this.props.applications;
    const { profile } = this.props.profile;
    // const floatAddButtonOptions = {
    //   Department: this.handleAddorEditDepartment,
    //   Contact: this.handleAddorEditContact,
    // };
    // console.log(applications);
    // console.log(profile);

    return (
      <div className="container">
        <div className="profile-header">
          <h1 className="profile-name">{profile.name}</h1>
        </div>
        <nav className="nav-bar">
          <div className="selected-nav-tab nav-tab">Applications</div>
          <div className="nav-tab">Interview Prep</div>
        </nav>
        <Applications applications={applications} />
      </div>
    );
  }
}

DashboardPage.propTypes = {
  applications: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  // applications
  getApplications: PropTypes.func.isRequired,
  // patchApplication: PropTypes.func.isRequired,
  // postApplication: PropTypes.func.isRequired,
  // deleteApplication: PropTypes.func.isRequired,
  // getSearchedContacts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    applications: state.applications,
    profile: state.profile,
    user: state.user,
    ui: state.ui,
  };
};

export default connect(mapStateToProps, {
  // applications
  getApplications,
  getProfile,
  // patchApplication,
  // postApplication,
  // deleteApplication,
  // search
  // getSearchedApplications,
  // ui
  clearAllErrors,
  clearError,
})(DashboardPage);
