import { defaultColors } from '../../../style/const/style-const';

const useStyles = {
  exportCoupon: {
    '& [class*="Field-fpbContainer"]': {
      display: 'block',
    },
    '& .MuiFormControl-root': {
      display: 'block',
    },
    '& .MuiPaper-root': {
      padding: 16,
      minHeight: 'unset',
    },
    '& #customized-dialog-title > .MuiTypography-root': {
      fontSize: 24,
      fontWeight: 'normal',
    },
    '& svg': {
      fill: defaultColors.secondary,
    },
    '& .MuiSelect-icon': {
      fill: 'currentColor',
    },
    '& .MuiDialogContent-dividers': {
      padding: 'unset',
      border: 'unset',
    },
    '& .subtitle': {
      marginLeft: 0,
      width: '100%',
    },
    '& .MuiFormLabel-root': {
      width: '100%',
    },
  },
  coupon: {
    '& .searchCover': {
      marginTop: 114,
      paddingBottom: 5,
    },
    '& .search-form ': {
      '& .MuiButtonBase-root': {
        padding: 'unset',
      },
      '& .MuiInputBase-root': {
        paddingRight: 10,
      },
      '& .checkbox': {
        padding: 9,
        '& label': {
          color: defaultColors.neutralContent,
        },
      },
    },
    '& .MuiBox-root': {
      '& .MuiButton-label': {
        textDecoration: 'underline',
      },
      margin: 'unset',
      '& svg': { width: 16, height: 16 },
      '& img': {
        paddingRight: 5,
        paddingBottom: 2,
      },
      '& .MuiOutlinedInput-input': {
        paddingLeft: 8,
        fontSize: 13,
        color: defaultColors.disable,
      },
    },
    '& .table-grid': {
      '& .MuiIconButton-root.Mui-disabled': {
        opacity: 0.3,
      },
    },
  },
};

export default useStyles;
