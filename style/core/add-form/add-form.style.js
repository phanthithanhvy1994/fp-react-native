import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  fpbForm: {
    padding: '6px 20px',
    '& > div': {
      margin: '10px 0px',
    },
  },
  formAction: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'flex-end !important',
  },
  btnClear: {
    border: 'unset',
    height: '36px',
    width: '94px',
    outline: 'unset !important',
    '&:focus': {
      border: 'unset',
    },
  },
  btnSearch: {
    height: '36px',
    width: '94px',
  },
  hiddenButtons: {
    display: 'none',
  },
});

export default useStyles;
