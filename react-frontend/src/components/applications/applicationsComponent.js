import React, { Component } from "react";
import PropTypes from "prop-types";

// redux
import { setApplicationSearch } from "../../redux/actions/applicationActions";
import { connect } from "react-redux";

// Components
import SectionList from "./sectionListComponent";

// css styles
import "./applications.css";

class Applications extends Component {
  constructor() {
    super();
    this.state = {};
  }

  // search change
  handleChange = (event) => {
    const value = event.target.value.trim();
    this.props.setApplicationSearch(value);
  };

  render() {
    const { all_applications, applications, searchTerm } = this.props.applications;
    let all_offers = [];
    let all_interviews = [];
    let all_applied = [];
    all_applications.forEach((application) => {
      switch (application.application_status) {
        case "offer":
          all_offers.push(application);
          break;
        case "interview":
          all_interviews.push(application);
          break;
        case "applied":
        default:
          all_applied.push(application);
          break;
      }
    });

    let offers = [];
    let interviews = [];
    let applied = [];
    applications.forEach((application) => {
      switch (application.application_status) {
        case "offer":
          offers.push(application);
          break;
        case "interview":
          interviews.push(application);
          break;
        case "applied":
        default:
          applied.push(application);
          break;
      }
    });

    return (
      <div>
        <div className="applications-header">
          <h2 className="applications-name">Summer '21 Internships</h2>
          <ul className="applications-progress-list">
            {all_offers.length > 0 && (
              <li className="application-progress-stat offers-stat">
                <p className="progress-stat-num">{all_offers.length}</p>
                <p className="progress-stat-label">offers received</p>
              </li>
            )}
            {all_interviews.length > 0 && (
              <li className="application-progress-stat interviews-stat">
                <p className="progress-stat-num">{all_interviews.length}</p>
                <p className="progress-stat-label">interviews completed</p>
              </li>
            )}
            {all_applied.length > 0 && (
              <li className="application-progress-stat applications-stat">
                <p className="progress-stat-num">{all_applied.length}</p>
                <p className="progress-stat-label">applications submitted</p>
              </li>
            )}
          </ul>
          <input
            className="application-search"
            type="text"
            value={searchTerm}
            placeholder="Search Applications"
            onChange={this.handleChange}
          />
        </div>
        {offers.length === 0 && interviews.length === 0 && applied.length === 0 && (
          <div>Search better bitch</div>
        )}
        {offers.length > 0 && (
          <div className="applications-list">
            <SectionList sectionApplications={offers} sectionLabels={["Offers", "Deadline"]} />
          </div>
        )}
        {interviews.length > 0 && (
          <div className="applications-list">
            <SectionList sectionApplications={interviews} sectionLabels={["Interviews", "Date"]} />
          </div>
        )}
        {applied.length > 0 && (
          <div className="applications-list">
            <SectionList sectionApplications={applied} sectionLabels={["Submitted", "Applied"]} />
          </div>
        )}
      </div>
    );
  }
}

Applications.propTypes = {
  applications: PropTypes.object.isRequired,
  setApplicationSearch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    applications: state.applications,
  };
};

export default connect(mapStateToProps, { setApplicationSearch })(Applications);
