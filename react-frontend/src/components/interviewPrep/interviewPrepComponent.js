import React, { Component } from "react";

// redux
import { connect } from "react-redux";

// css styles
import "./interviewPrep.css";

class InterviewPrep extends Component {
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
    return <div>Fuck you</div>;
  }
}

InterviewPrep.propTypes = {};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(InterviewPrep);
