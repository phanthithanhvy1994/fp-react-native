import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import moment from 'moment';

import { Stepper, Step, StepLabel, StepButton } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import useStyle from './scan-timeline.style';

class ScanTimeLine extends React.Component {
  constructor(props) {
    super(props);

    this.stepperRef = React.createRef();

    this.state = {
      hiddenNextBtn: false,
      hiddenPreviousBtn: true,
    };
  }

  handleNavigation = (direction) => {
    const { oneTimeScrolledWidth } = this.props;
    const oneScrolledWidth = oneTimeScrolledWidth || 180;

    if (this.stepperRef) {
      if (direction === 'previous') {
        this.stepperRef.current.scrollLeft -= oneScrolledWidth;
      } else {
        this.stepperRef.current.scrollLeft += oneScrolledWidth;
      }

      // Hide Previous button when scroll to top
      if (this.stepperRef.current.scrollLeft === 0) {
        this.setState({
          hiddenPreviousBtn: true,
          hiddenNextBtn: false,
        });
      } else {
        this.setState({
          hiddenPreviousBtn: false,
          hiddenNextBtn: false,
        });
      }
    }
  };

  handleScrolling = (e) => {
    // Detect end of scroll
    const isTheEndOfScroll =
      e.target.scrollWidth - e.target.scrollLeft === e.target.clientWidth;
    if (isTheEndOfScroll) {
      // Hide Next button when scroll to end
      this.setState({
        hiddenNextBtn: true,
      });
    }
  };

  componentDidMount = () => {
    if (this.stepperRef && this.stepperRef.current) {
      const { scrollWidth, clientWidth } = this.stepperRef.current;
      // Hide Next and Previous button if content do not exceed the screen width
      if (scrollWidth === clientWidth) {
        this.setState({
          hiddenPreviousBtn: true,
          hiddenNextBtn: true,
        });
      }
      // Add event listener scroll
      this.stepperRef.current.addEventListener('scroll', this.handleScrolling);
    }
  };

  render() {
    const { scanningTimeData, classes } = this.props;
    const { hiddenNextBtn, hiddenPreviousBtn } = this.state;
    const hasNoScanningTimeData =
      !scanningTimeData || (scanningTimeData && scanningTimeData.length === 0);
    return (
      <div className={classes.scanTimeLine}>
        {!hasNoScanningTimeData ? (
          <div className="scan-time-line-container">
            <div className="previous-time-line">
              <ChevronLeftIcon
                onClick={() => this.handleNavigation('previous')}
                hidden={hiddenPreviousBtn}
              />
            </div>
            <div className="scan-time-line-wrapper" ref={this.stepperRef}>
              <Stepper
                alternativeLabel
                orientation="horizontal"
                className="scan-time-line"
              >
                {!hasNoScanningTimeData &&
                  scanningTimeData.map((item, index) => (
                    <Step active key={index}>
                      <StepButton completed>
                        <StepLabel className="time-label">
                          {moment(item.time).format('HH:mm')}
                        </StepLabel>
                        <StepLabel className="content-label">
                          {item.userCode} + {item.name}
                        </StepLabel>
                      </StepButton>
                    </Step>
                  ))}
              </Stepper>
            </div>
            <div className="next-time-line">
              <ChevronRightIcon
                onClick={() => this.handleNavigation('next')}
                hidden={hiddenNextBtn}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

ScanTimeLine.propTypes = {
  classes: PropTypes.object,
  t: PropTypes.any,
  i18n: PropTypes.any,
  scanningTimeData: PropTypes.array,
  oneTimeScrolledWidth: PropTypes.number,
};

export default withTranslation()(withStyles(useStyle)(ScanTimeLine));
