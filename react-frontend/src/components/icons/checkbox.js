import React, { Component } from "react";

// redux
import { connect } from "react-redux";

class Checkbox extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="1" y="1" width="12" height="12" rx="1" stroke="#D7D7D7" stroke-width="2" />
      </svg>
    );
  }
}

Checkbox.propTypes = {};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(Checkbox);
