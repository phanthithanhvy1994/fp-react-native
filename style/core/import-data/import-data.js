import { makeStyles } from '@material-ui/core';
import { defaultColors } from '../../const/style-const';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    '& .MuiInputBase-root.Mui-disabled': {
      cursor: 'pointer',
    },
    '& input': {
      cursor: 'pointer',
    },
  },
  form: {
    marginRight: '15px',
  },
  fileSelection: {
    width: '320px',
    height: '28px',
    '& svg': {
      fill: defaultColors.primary,
      cursor: 'pointer',
    },
  },
}));

export default useStyles;
