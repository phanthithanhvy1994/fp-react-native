import { defaultColors } from '../../const/style-const';

// eslint-disable-next-line
const useStyles = (theme) => ({
  fpbContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
    '& > div': {
      margin: '12px 0px',
    },
    '& .MuiFormHelperText-contained': {
      marginLeft: 0,
      marginRight: 0,
    },
  },
  fpbField: {
    width: '208px',
    height: 'fit-content',
    color: defaultColors.neutral,
    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: defaultColors.errorLabel,
      borderWidth: 1,
    },
    '&:disabled': {
      opacity: '0.3',
    },
    '& > div': {
      height: '27px',
      '& > select': {
        paddingTop: '0px ',
        paddingBottom: '0px ',
        fontSize: '12px',
      },
      '& > input': {
        height: '19px',
        padding: '5px 10px',
        fontSize: '12px',
      },
      '& > fieldset': {
        padding: 'unset !important',
        borderRadius: '2px',
        height: '28px',
        marginTop: '5px',

        '& > legend': {
          display: 'none',
        },
      },
      '& > .MuiOutlinedInput-notchedOutline': {
        '&:hover': {
          background: defaultColors.primary,
        },
      },
    },
    '& > label': {
      position: 'unset',
      width: 'auto',
      height: '14px',
      marginBottom: '5px',
      fontSize: '12px',
      color: defaultColors.neutralContent,
      '& >span': {
        color: defaultColors.errorLabel,
      },
    },
    '& > .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(0px, 0px) scale(1)',
    },
    '& .Mui-error': {
      color: defaultColors.errorLabel,
    },
    '& .MuiInputBase-root.Mui-disabled': {
      background: defaultColors.disable,
    },
  },
  fldText: {},
  fldPicker: {
    '& > div': {
      paddingRight: '6px',
      '& > input': {
        padding: '5px',
      },
      '& > div': {
        marginLeft: '0px',
      },
      '& > div > button': {
        padding: 'unset',
        '&:focus': {
          outline: 'unset',
        },
        '& > span > .MuiSvgIcon-root': {
          height: '18px',
          width: '18px',
        },
      },
      '& > .MuiOutlinedInput-adornedEnd': {
        paddingRight: '5px',
      },
    },
  },
  customFldPicker: {
    '& > div': {
      top: '7px',
    },
  },
  customFldPicker2: {
    '& > label': {
      position: 'relative',
      top: '-8px',
    },
    '& > div': {
      top: '-8px',
    },
  },
  fldSelect: {
    '& > div': {
      width: 'auto',
      height: '28px',
      '& > select': {
        height: '28px',
        padding: '0px',
        paddingLeft: '7px',
        fontSize: '13px',
        alignItems: 'center',
      },
    },
  },
  fldRangeInput: {
    display: 'flex',
    '& > div[class*="Field-fldText"]': {
      width: '75%',
      paddingLeft: '10px',
      marginTop: '19px',
    },
    '& > div[class*="Field-fldSelect"]': {
      width: '25%',
      '& > label': {
        width: '400%',
      },
      '& > p': {
        width: '400%',
        marginLeft: '0px',
        marginRight: '0px',
        marginTop: '0px',
      },
    },
  },
  // Custom css for focus outlined and hover border
  root: {
    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
      borderColor: defaultColors.hover,
      borderWidth: 0.5,
    },
  },
  disabled: {},
  focused: {
    '&:not($disabled):not($error) $notchedOutline': {
      borderColor: defaultColors.secondaryFocused,
    },
  },
  error: {},
  notchedOutline: {},
  labelRoot: {
    '&$labelFocused': {
      color: 'rgba(0, 0, 0, 0.54)',
    },
  },
  labelFocused: {},
  loginField: {
    width: '100%',
    margin: '0 !important',
    '& .MuiOutlinedInput-adornedStart': {
      paddingLeft: 8,
    },
    '& > div ': {
      '& > input': {
        height: 36,
        paddingLeft: 0,
      },
      '& > fieldset': {
        height: 36,
        marginTop: 10,
        borderRadius: 0,
      },
    },
  },
  textLabelField: {
    display: 'inline-flex',
    minHeight: '28px',
    width: 'inherit',
  },
  textLabel: {
    width: '150px',
    backgroundColor: 'rgba(253, 121, 3, 0.08)',
    marginRight: '4px',
    display: 'flex',
    alignItems: 'center',
    '& p': {
      paddingLeft: '8px',
      fontSize: '12px',
    },
  },
  textLabelValue: {
    width: 'calc(100% - 150px)',
    backgroundColor: 'rgba(13, 148, 153, 0.16)',
    display: 'flex',
    alignItems: 'center',
    paddingRight: '24px',
    '& p': {
      paddingLeft: '8px',
      fontSize: '13px',
    },
  },
  quantityField: {
    display: 'inline-flex',
    width: '100%',
    margin: '4px 0px 8px 0px !important',
    '& > div > label > span': {
      color: defaultColors.danger,
    },
    '& .MuiInput-underline:before': {
      borderBottom: 'none',
    },
    '& .MuiInput-underline:after': {
      borderBottom: 'none',
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: 'none',
    },
    '& .MuiInput-underline:focus:not(.Mui-disabled):before': {
      borderBottom: 'none',
    },
    '& .MuiInputBase-input': {
      textAlign: 'center',
      fontSize: '12px',
    },
    '& .outlined': {
      '& input': {
        height: 28,
        padding: 0,
      },
    },
    '& .standard': {
      width: '100%',
      display: 'block',
      position: 'relative',
      '& div': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        '&:before': {
          borderBottom: 'unset',
        },
        '&:after': {
          borderBottom: 'unset',
        },
        '&.MuiInput-underline:hover:not(.Mui-disabled):before': {
          borderBottom: 'unset',
        },
      },
    },
    '& .MuiSvgIcon-root': {
      fill: defaultColors.neutral,
      width: 24,
      height: 24,
    },
    '& .MuiButtonBase-root': {
      minWidth: 'unset',
      height: 28,
      width: 28,
      borderRadius: 1,
      backgroundColor: defaultColors.primary,
      '& span': {
        margin: 'unset',
      },
    },
    '& input[type="number"]::-webkit-clear-button': {
      display: 'none',
    },
    '& input[type="number"]::-webkit-inner-spin-button': {
      display: 'none',
    },
    '& input[type="number"]::-webkit-outside-spin-button': {
      display: 'none',
    },
    '& span.disabled': {
      pointerEvents: 'none',
      opacity: 0.3,
    },
  },
  quantityFieldOnFormField: {
    margin: '12px 0 !important',
    '& .MuiTextField-root': {
      width: '100%',
      '& div.Mui-error': {
        marginLeft: '4px',
        marginRight: '4px',
      },
    },
    '& .decrease-qty-span': {
      display: 'flex',
      paddingTop: '19px',
    },
    '& .MuiInputBase-root.Mui-error': {
      borderColor: defaultColors.errorLabel,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    '& .Mui-error': {
      color: defaultColors.errorLabel,
    },
    '& label': {
      marginLeft: '-27px',
      color: defaultColors.neutralContent,
    },
    '& .MuiInputBase-input': {
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      paddingTop: '9px',
      paddingBottom: '4px',
    },
    '& label + .MuiInput-formControl': {
      marginTop: '18px',
    },
    '& .increase-qty-span': {
      display: 'flex',
      paddingTop: '19px',
    },
    '& p.Mui-error': {
      marginLeft: '-27px',
    },
  },
  unitLabel: {
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    paddingLeft: '8px',
    paddingTop: '6px',
  },
  dateRange: {
    '& span.range-label': {
      color: 'rgba(0, 0, 0, 0.54)',
      fontSize: '13px',
      padding: '0px 4px',
      marginTop: 22,
      position: 'relative',
    },
    '& > div': {
      width: '50%',
    },

    flexDirection: 'row',
  },
  doubleTextWidth: {},
  checkbox: {
    '&.checkbox-disabled': {
      pointerEvents: 'none',
      '& .checkbox-icon': {
        opacity: 0.3,
      },
      '& .checkbox-label': {
        color: defaultColors.borderColor,
      },
    },
  },
  labelCheckbox: {
    display: 'inline',
    fontSize: '13px',
  },
  txtAreaFld: {
    width: '100%',
    margin: 'auto',
    '& textarea': {
      width: '100%',
      borderRadius: 2,
      borderStyle: 'solid',
      border: '0.5px',
      borderColor: defaultColors.borderColor,
      color: defaultColors.neutralContent,
      padding: '5px 10px',
      fontSize: '12px',
      '&:focus': {
        outlineColor: defaultColors.focus,
      },
      '&:hover': {
        borderColor: defaultColors.hover,
      },
    },
    '& .MuiFormHelperText-root': {
      color: defaultColors.error,
    },
    '& .Mui-error': {
      color: defaultColors.error,
    },
    '& .MuiInputLabel-asterisk': {
      color: defaultColors.error,
    },
  },
  textAreaLabel: {
    color: defaultColors.neutralContent,
    height: '14px',
    position: 'unset',
    fontSize: '12px',
    marginBottom: '5px',
  },
  Radio: {
    fontSize: '12px',
    color: defaultColors.neutralContent,
    '&.Mui-focused': {
      color: 'rgba(0,0,0,0.54)',
    },
    '& span': {
      color: defaultColors.danger,
    },
  },
  btnRadio: {
    display: 'inline-block',
    '& .MuiFormControlLabel-label': {
      fontSize: '12px',
    },
    '& .Mui-checked': {
      color: defaultColors.secondary,
    },
  },
  btnEndAction: {
    '& .MuiSvgIcon-root': {
      fontSize: 'xx-large',
    },
  },
  fieldEndAdornment: {
    '& > button': {
      padding: '0px',
      '&:focus': {
        outline: 'unset',
      },
    },
    '& svg path': {
      fill: defaultColors.primary,
    },
  },
  endTextLabel: {
    color: defaultColors.neutralContent,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '22px',
    display: 'flex',
    alignItems: 'center',
  },
});

export default useStyles;
