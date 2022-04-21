import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Calendar from 'react-calendar';

import EventIcon from '@material-ui/icons/Event';
import FormLabel from '@material-ui/core/FormLabel';
import Popover from '@material-ui/core/Popover';

import { FormHelperText } from '@material-ui/core';
import { formatDateString } from '../../../../util/date-util';
import { dateFormat } from '../../../../constants/constants';

import useStyles from '../../../../style/core/field/calendar.style';
import 'react-calendar/dist/Calendar.css';

export default function CalendarComponent(props) {
  const classes = useStyles();
  var localizedFormat = require('dayjs/plugin/localizedFormat');
  dayjs.extend(localizedFormat);
  const { onChange, item, value, minDate, maxDate, classCustom, errors, errorFieldName } = props;
  const { disabled, hidden } = item;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [date, setDate] = React.useState(
    value ? dayjs(value).format(dateFormat.mainDate) : dateFormat.mainDate
  );

  let formatRange = '';
  let defaultValue = '';

  React.useEffect(() => {
    setDate(date);
  }, [date]);

  const handleClick = (event) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (date) => {
    return new Date(
      dayjs(formatDateString(date, dateFormat.yyyymmdd, true)).format(
        dateFormat.dateTime
      )
    );
  };
  const onChangeDate = (dateTime) => {
    const formatDate = dayjs(dateTime[0]).format(dateFormat.mainDate);
    setDate(formatDate);
    onChange({
      target: {
        value: dateTime[0],
        name: item.fieldName,
        firstInRange: item.firstInRange,
        secondInRange: item.secondInRange,
        customOnChange: item.customOnChange,
      },
    });
    handleClose();
  };

  if (value) {
    formatRange = formatDate(value);
    defaultValue = dayjs(value).format(dateFormat.mainDate);
  }
  const formatMinDate = formatDate(minDate);
  const formatMaxDate = formatDate(maxDate);
  return (
    <>
      {!hidden &&
        <div className={`${classes.container} field-wrapper ${classCustom} ${errors && errors[errorFieldName] && classes.errors}`}>
          <div className={classes.divFld}>
            {!item.noLabel && <FormLabel
              className={`${classes.label} ${!disabled && classes.titleDisabled}`}
              required={item.required}
            >
              {item.label}
            </FormLabel>}
            <div
              className={`${classes.datePicker} ${disabled && classes.disabled}`}
              onClick={handleClick}
            >
              <span
                className={`${classes.title} ${
                  !defaultValue && classes.placeHolder
                }`}
              >
                {defaultValue || dateFormat.mainDate}
              </span>
              <EventIcon className={classes.icon} />
            </div>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              className={classes.popup}
            >
              <Calendar
                onChange={(date) => onChangeDate(date)}
                returnValue={'range'}
                value={formatRange || null}
                minDate={formatMinDate}
                maxDate={formatMaxDate}
              />
            </Popover>
            {/* Set error message */}
            {errors && errors[errorFieldName] && (
              <FormHelperText>
                {errors[errorFieldName] && errors[errorFieldName].message}
              </FormHelperText>
            )}
          </div>
        </div>
      }
    </>
  );
}

CalendarComponent.propTypes = {
  t: PropTypes.any,
  item: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.any,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
  classCustom: PropTypes.any,
  errors: PropTypes.any,
  errorFieldName: PropTypes.any,
};
