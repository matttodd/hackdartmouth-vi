import React, { Component } from "react";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";

// css styles
import "./applications.css";

class SectionList extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const sectionApplications = this.props.sectionApplications;

    return (
      <section className="application-section">
        <div className="application-section-header">
          <h3 className="application-section-title">{this.props.sectionLabels[0]}</h3>
          <h3 className="application-section-date-label">{this.props.sectionLabels[1]}</h3>
        </div>
        <ul className="application-section-list">
          {sectionApplications.map((application, i) => (
            <li
              className="application-row"
              key={application.id}
              // onClick={() => this.props.getNavRoute(x.id)}
            >
              <div className="application-company-location-position">
                <p className="application-company-location">
                  {`${application.company_name} @ ${application.office_address}`}
                </p>
                <p className="application-position">{application.job_role}</p>
              </div>
              <p>{application.last_update_date}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

SectionList.propTypes = {
  sectionApplications: PropTypes.array.isRequired,
  sectionLabels: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    // sectionApplications: state.sectionApplications,
    // sectionLabels: state.sectionLabels,
  };
};

export default connect(mapStateToProps, {})(SectionList);
