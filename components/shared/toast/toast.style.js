import { defaultColors } from '../../../style/const/style-const';

const useStyles = {
  toastContainer: {
    width: '298px !important',
    height: '55px',
    marginTop: '72px',
    '& .react-toast-notifications__toast__icon-wrapper': {
      display: 'none'
    },
    '& .react-toast-notifications__toast__content': {
      padding: '0px !important'
    },
    '& .react-toast-notifications__toast__dismiss-button': {
      display: 'none'
    }
  },
  toast: {
    width: '298px',
    height: '55px',
    display: 'flex',
    position: 'relative',
    backgroundColor: defaultColors.toastBackground,
    justifyContent: 'flex-start',
    '& .toast-icon': {
      color: defaultColors.success,
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      left: '24px',
      width: '20px',
      height: '20px'
    },
    '& .toast-content': {
      color: defaultColors.primary,
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      left: '60px',
      fontSize: '18px',
      lineHeight: '21px'
    }
  }
};

export default useStyles;
