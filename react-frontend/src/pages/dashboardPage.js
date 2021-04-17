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
import InterviewPrep from "../components/interviewPrep/interviewPrepComponent";

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
      selectedTab: "applications",
    };
  }

  componentDidMount() {
    // this.props.clearAllErrors();
    this.props.getApplications(userId);
    this.props.getProfile(userId);
  }

  changeTab(tabName) {
    this.setState({
      selectedTab: tabName,
    });
  }

  render() {
    const { applications } = this.props.applications;
    const { profile } = this.props.profile;

    return (
      <div className="container">
        <div className="profile-header">
          <h1 className="profile-name">{profile.name}</h1>
        </div>
        <nav className="nav-bar">
          <div
            className={
              "nav-tab " + (this.state.selectedTab === "applications" && "selected-nav-tab")
            }
            onClick={() => this.changeTab("applications")}
          >
            Applications
          </div>
          <div
            className={
              "nav-tab " + (this.state.selectedTab === "interviewPrep" && "selected-nav-tab")
            }
            onClick={() => this.changeTab("interviewPrep")}
          >
            Interview Prep
          </div>
        </nav>
        {this.state.selectedTab === "applications" && <Applications applications={applications} />}
        {this.state.selectedTab === "interviewPrep" && <InterviewPrep />}
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
