import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// redux
import { connect } from "react-redux";
import {
  // departments
  getApplications,
  // patchApplication,
  // postApplication,
  // deleteApplication,
} from "../redux/actions/applicationActions";
import { clearError, clearAllErrors } from "../redux/actions/uiActions";

// Components
// import ContactEditorModal from "../components/contacts/contactEditorModal";

// css styles
// import "../css/page.css";

class DashboardPage extends Component {
  constructor() {
    super();
    this.state = {
      applications: [],
    };
  }

  componentDidMount() {
    // this.props.clearAllErrors();
    this.props.getApplications();
  }

  render() {
    // const { isAdmin } = this.props.user;
    // const { errors, loadingActions } = this.props.ui;
    const { applications } = this.props.applications;
    // const floatAddButtonOptions = {
    //   Department: this.handleAddorEditDepartment,
    //   Contact: this.handleAddorEditContact,
    // };
    console.log(applications);

    return (
      <div>
        {applications.map((application, i) => (
          <div
            // className="navpath-list navpath-list-enabled"
            key={application.id}
            // onClick={() => this.props.getNavRoute(x.id)}
          >
            <h1>{application.company_name}</h1>
            {application.application_link}
            {application.office_address}
          </div>
        ))}
      </div>
    );
  }
}

DashboardPage.propTypes = {
  applications: PropTypes.object.isRequired,
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
    user: state.user,
    ui: state.ui,
  };
};

export default connect(mapStateToProps, {
  // applications
  getApplications,
  // patchApplication,
  // postApplication,
  // deleteApplication,
  // search
  // getSearchedApplications,
  // ui
  clearAllErrors,
  clearError,
})(DashboardPage);
