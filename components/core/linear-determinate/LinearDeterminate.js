import { makeStyles } from '@material-ui/core';
import { defaultColors } from '../../../style/const/style-const';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    position: 'fixed',
    top: 0,
    zIndex: 1230,
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  linearProgress: {
    zIndex: 1050,
  },
  colorSecondary: {
    backgroundColor: defaultColors.neutral,
  },
  barColorSecondary: {
    backgroundColor: defaultColors.primary,
  },
}));

export default useStyles;
