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
    console.log(value);
    this.props.setApplicationSearch(value);
  };

  render() {
    const { applications, searchTerm } = this.props.applications;
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
            <li className="application-progress-stat offers-stat">
              <p className="progress-stat-num">2</p>
              <p className="progress-stat-label">offers received</p>
            </li>
            <li className="application-progress-stat interviews-stat">
              <p className="progress-stat-num">9</p>
              <p className="progress-stat-label">interviews completed</p>
            </li>
            <li className="application-progress-stat applications-stat">
              <p className="progress-stat-num">69</p>
              <p className="progress-stat-label">applications submitted</p>
            </li>
          </ul>
          <input
            type="text"
            value={searchTerm}
            placeholder="Search Applications"
            onChange={this.handleChange}
          />
        </div>
        <div className="applications-list">
          <SectionList sectionApplications={offers} sectionLabels={["Offers", "Deadline"]} />
        </div>
        <div className="applications-list">
          <SectionList sectionApplications={interviews} sectionLabels={["Interviews", "Date"]} />
        </div>
        <div className="applications-list">
          <SectionList sectionApplications={applied} sectionLabels={["Submitted", "Applied"]} />
        </div>
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
