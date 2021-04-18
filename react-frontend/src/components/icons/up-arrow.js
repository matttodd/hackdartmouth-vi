import React, { Component } from "react";

// redux
import { connect } from "react-redux";

class UpArrow extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5.38891 0.611091C5.17412 0.396303 4.82588 0.396303 4.61109 0.611091L1.11091 4.11127C0.896124 4.32606 0.896124 4.6743 1.11091 4.88909C1.3257 5.10388 1.67394 5.10388 1.88873 4.88909L5 1.77782L8.11127 4.88909C8.32606 5.10388 8.6743 5.10388 8.88909 4.88909C9.10388 4.6743 9.10388 4.32606 8.88909 4.11127L5.38891 0.611091ZM5.55 1.5V1H4.45V1.5H5.55Z"
          fill="#767675"
        />
      </svg>
    );
  }
}

UpArrow.propTypes = {};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(UpArrow);
