import React from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

class DatePickerNew extends React.Component {
  render() {
    const { ...otherProps } = this.props;
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          openTo="date"
          views={['year', 'month', 'date']}
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          fullWidth
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          {...otherProps}
        />
      </MuiPickersUtilsProvider>
    );
  }
}

export default DatePickerNew;
