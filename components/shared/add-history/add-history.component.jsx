import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  IconButton,
  InputAdornment,
} from '@material-ui/core';

import AddCircleIcon from '@material-ui/icons/AddCircle';

import Fieldset from '../fieldset/fieldset.component';
import { formatDateString } from '../../../util/date-util';
import { getUserInfo } from '../../../actions/auth-action';
import moment from 'moment';
import { dateFormat } from '../../../constants/constants';

import useStyles from './add-history-style';

class AddHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      historyData: '',
      inputValue: '',
    };
  }

  componentDidMount = () => {
    // temp data for test, will get current logged user by API later
    this.loggedUser = getUserInfo();
  };

  componentWillUnmount = () => {
    // Cancel updating state on promise function in componentDidMount
    this.mounted = false;
  };

  onInputChange = (event) => {
    // Handle for input change
    const { value } = event.target;
    const currentDate = moment(Date.now()).format(dateFormat.savingDateTime);
    const historyData = {
      time: currentDate,
      userName: this.loggedUser.userName,
      note: value,
      newHistory: true,
    };
    this.setState({
      historyData,
      inputValue: value,
    });
  };

  onInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.onHandleAddHistory();
      event.preventDefault();
    }
  };

  onHandleAddHistory = () => {
    // Handle for add button
    const { historyData, inputValue } = this.state;
    const { onAdd } = this.props;

    if (historyData && inputValue) {
      onAdd(historyData);

      // Clear value of input field after added
      this.setState({
        historyData: '',
        inputValue: '',
      });
    }
  };

  // Sort history data on Add History section ascending by date time
  sortHistoryByDateTime = (historyArray) =>
    historyArray.sort((a, b) => b.time - a.time);

  render() {
    const { t, historyListData, isViewMode, classes } = this.props;
    const { inputValue } = this.state;
    const hideAddHistorySection =
      (!historyListData || (historyListData && historyListData.length === 0)) &&
      isViewMode;

    return (
      <div className={classes.addHistory}>
        {!hideAddHistorySection ? (
          <Fieldset title={t('History')}>
            {!isViewMode && (
              <TextField
                id="addNewNote"
                name="addNewNote"
                type="text"
                variant="outlined"
                placeholder="Add new notes"
                className="add-new-note-field"
                value={inputValue}
                onChange={this.onInputChange}
                onKeyPress={this.onInputKeyPress}
                InputProps={{
                  inputProps: { maxLength: 256, autoComplete: 'off' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={this.onHandleAddHistory}
                        className="add-new-note-button"
                      >
                        <AddCircleIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            <Stepper orientation="vertical" className="add-history-time-line">
              {historyListData &&
                this.sortHistoryByDateTime(historyListData).map(
                  (item, index) => (
                    <Step active key={index}>
                      <StepLabel>
                        {formatDateString(item.time, null, true)}
                      </StepLabel>
                      <StepContent>
                        <label>{`<${item.userName}> ${item.note}`}</label>
                        {item.comment && <p>{item.comment}</p>}
                      </StepContent>
                    </Step>
                  )
                )}
            </Stepper>
          </Fieldset>
        ) : null}
      </div>
    );
  }
}

AddHistory.propTypes = {
  t: PropTypes.any,
  i18n: PropTypes.any,
  onAdd: PropTypes.func,
  historyListData: PropTypes.array,
  isViewMode: PropTypes.bool,
  classes: PropTypes.any,
};

export default withTranslation()(withStyles(useStyles)(AddHistory));
