import { makeStyles } from '@material-ui/core/styles';
import { defaultColors } from '../../const/style-const';

const useStyles = makeStyles(() => ({
  loginPage: {
    marginLeft: -15,
    marginRight: -15,
    display: 'flex',
    minHeight: 'calc(100vh - 88px)',
    '& .MuiSvgIcon-root': {
      fill: defaultColors.primary,
    },
    '& fieldset': {
      backgroundColor: defaultColors.neutralHover,
      zIndex: -1,
      borderWidth: 0,
    },
    '& .MuiOutlinedInput-adornedStart': {
      height: 'unset',
    },
    '& .field-wrapper': {
      margin: 'unset',
      width: '100%',
    },
  },
  col: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divLogo: {
    paddingRight: 36,
  },
  divForm: {
    textAlign: 'center',
    paddingBottom: 16,
    '& .MuiTypography-root': {
      fontWeight: 300,
      fontSize: 52,
      lineHeight: '61px',
    },
  },
  divError: {
    backgroundColor: defaultColors.error,
    position: 'absolute',
    top: '6px',
    right: '0px',
    margin: 24,
    minWidth: 300,
    minHeight: 55,
    display: 'inherit',
    alignItems: 'center',
    '& .MuiSvgIcon-root': {
      fill: defaultColors.errorLabel,
      marginLeft: 24,
    },
    '& .MuiTypography-root': {
      color: defaultColors.errorLabel,
      fontSize: '18px',
      lineHeight: ' 21px',
      padding: 16,
    },
  },
  loginForm: {
    padding: 20,
    maxWidth: 340,
  },
  singInBtn: {
    textAlign: 'center',
    marginTop: 18,
    '& .MuiButton-root': {
      width: '100%',
    },
    '& .MuiButton-label': {
      fontWeight: 'normal',
      '& img': {
        position: 'absolute',
        left: '8px',
      },
    },
  },
}));

export default useStyles;
