import { makeStyles } from '@material-ui/core';
import { defaultColors } from '../../../style/const/style-const';

const useStyles = makeStyles({
  container: {
    width: '100%',
  },
  divFld: {
    width: '100%',
    marginTop: -6,
  },
  datePicker: {
    border: `0.5px solid ${defaultColors.borderColor}`,
    borderColor: 'rgba(0,0,0,0.23)',
    position: 'relative',
    borderRadius: 2,
    height: 29,
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    '&:focus': {
      borderColor: defaultColors.focus,
    },
    '&:hover': {
      borderColor: defaultColors.hover,
    },
  },
  title: {
    fontSize: 12,
    color: defaultColors.neutralContent,
    marginLeft: 5,
    pointerEvents: 'none',
  },
  icon: {
    width: 18,
    height: 18,
    color: defaultColors.primary,
    position: 'absolute',
    right: 10,
    top: 4,
  },
  popup: {
    '& abbr': {
      textDecoration: 'unset',
    },
    '& .react-calendar__tile--active, .react-calendar__tile--active:hover': {
      background: defaultColors.primary,
    },
  },
  label: {
    width: 'auto',
    height: 14,
    position: 'unset',
    fontSize: 12,
    marginBottom: 5,
    '&.Mui-focused': {
      color: 'rgba(0,0,0,0.54)',
    },
    '& span': {
      color: defaultColors.danger,
    },
  },
  placeHolder: {
    color: defaultColors.disable,
  },
  disabled: {
    backgroundColor: defaultColors.disable,
  },
  titleDisabled: {
    color: defaultColors.neutralContent,
  },
  errors: {
    '& .makeStyles-datePicker-99':{
      borderColor: defaultColors.error,
    },
    '& .MuiFormLabel-root':{
      color: defaultColors.error
    },
    '& .MuiFormHelperText-root':{
      color: defaultColors.error
    }
  }
});

export default useStyles;
