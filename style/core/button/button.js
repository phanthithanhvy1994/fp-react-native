import { defaultColors, borderStyles } from '../../const/style-const';

// eslint-disable-next-line
const useStyles = (theme) => ({
  fpbBtn: {
    height: '36px',
    borderRadius: borderStyles.borderRadius,
    color: defaultColors.neutral,
    '&:hover': {
      cursor: 'pointer',
    },
    '&:disabled': {
      opacity: '0.3',
      color: '#ffffff',
    },
    '& span': {
      lineHeight: '15px',
      alignItems: 'center',
      textAlign: 'center',
      fontSize: '13px',
      fontWeight: 'normal',
      textTransform: 'none',
    },
    '& svg': {
      lineHeight: '15px',
      alignItems: 'center',
      textAlign: 'center',
      fontSize: '16px'
    },
  },
  btnPrimary: {
    background: defaultColors.primary,
    '&:focus': {
      background: defaultColors.primaryFocused,
      opacity: '0.75',
    },
    '&:hover': {
      background: defaultColors.primaryFocused,
      opacity: '0.75',
    },
    textTransform: 'none',
  },
  btnSecondary: {
    background: defaultColors.secondary,
    '&:focus': {
      background: defaultColors.secondaryFocused,
      opacity: '0.75',
    },
    '&:hover': {
      background: defaultColors.secondaryFocused,
      opacity: '0.75',
    },
    textTransform: 'none',
  },
  btnSuccess: {
    background: defaultColors.success,
    '&:focus': {
      background: defaultColors.successFocused,
      opacity: '0.75',
    },
    '&:hover': {
      background: defaultColors.successFocused,
      opacity: '0.75',
    },
    textTransform: 'none',
  },
  btnWarning: {
    background: defaultColors.warning,
    '&:focus': {
      background: defaultColors.warningFocused,
      opacity: '0.75',
    },
    '&:hover': {
      background: defaultColors.warningFocused,
      opacity: '0.75',
    },
    textTransform: 'none',
  },
  btnDanger: {
    background: defaultColors.danger,
    '&:focus': {
      background: defaultColors.dangerFocused,
      opacity: '0.75',
    },
    '&:hover': {
      background: defaultColors.dangerFocused,
      opacity: '0.75',
    },
    textTransform: 'none',
  },
  btnNeutral: {
    background: defaultColors.neutral,
    border: `${borderStyles.borderWidth} ${borderStyles.borderStyle} ${defaultColors.gray}`,
    boxSizing: 'border-box',
    borderRadius: borderStyles.borderRadius,
    '&:focus': {
      background: defaultColors.neutralHover,
    },
    '&:hover': {
      background: defaultColors.neutralHover,
    },
    '& > span': {
      color: defaultColors.neutralContent,
    },
    textTransform: 'none',
  },
  btnDisable: {
    background: '#D6D6D6',
    opacity: 'unset !important',
    textTransform: 'none',
  },
  BtnIcon: {
    marginRight: 8,
  },
  btnCancel: {
    color: 'rgba(0, 0, 0, 0.87)',
    border: 'unset',
    height: '36px',
    width: '94px',
    outline: 'unset !important',
    textTransform: 'none',
    '&:focus': {
      border: 'unset',
    },
  },
  btnFullWidth: {
    width: 'auto !important',
    background: defaultColors.secondary,
    '&:focus': {
      background: defaultColors.secondaryFocused,
      opacity: '0.75',
    },
    '&:hover': {
      background: defaultColors.secondaryFocused,
      opacity: '0.75',
    },
    textTransform: 'none',
  },
});

export default useStyles;
